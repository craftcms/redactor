<?php
/**
 * @link https://craftcms.com/
 * @copyright Copyright (c) Pixel & Tonic, Inc.
 * @license MIT
 */

namespace craft\redactor;

use Craft;
use craft\base\ElementInterface;
use craft\elements\Asset;
use craft\elements\Category;
use craft\elements\Entry;
use craft\helpers\ArrayHelper;
use craft\helpers\Db;
use craft\helpers\Html;
use craft\helpers\Json;
use craft\htmlfield\events\ModifyPurifierConfigEvent;
use craft\htmlfield\HtmlField;
use craft\htmlfield\HtmlFieldData;
use craft\models\Section;
use craft\redactor\assets\field\FieldAsset;
use craft\redactor\assets\redactor\RedactorAsset;
use craft\redactor\events\ModifyRedactorConfigEvent;
use craft\redactor\events\RegisterLinkOptionsEvent;
use craft\redactor\events\RegisterPluginPathsEvent;
use HTMLPurifier_Config;
use yii\base\Event;
use yii\base\InvalidArgumentException;
use yii\base\InvalidConfigException;

/**
 * Redactor field type
 *
 * @author Pixel & Tonic, Inc. <support@pixelandtonic.com>
 * @since 3.0
 */
class Field extends HtmlField
{
    /**
     * @event RegisterPluginPathsEvent The event that is triggered when registering paths that contain Redactor plugins.
     */
    public const EVENT_REGISTER_PLUGIN_PATHS = 'registerPluginPaths';

    /**
     * @event RegisterLinkOptionsEvent The event that is triggered when registering the link options for the field.
     */
    public const EVENT_REGISTER_LINK_OPTIONS = 'registerLinkOptions';

    /**
     * @event ModifyPurifierConfigEvent The event that is triggered when creating HTML Purifier config
     *
     * Plugins can get notified when HTML Purifier config is being constructed.
     *
     * ```php
     * use craft\redactor\Field;
     * use craft\htmlfield\ModifyPurifierConfigEvent;
     * use HTMLPurifier_AttrDef_Text;
     * use yii\base\Event;
     *
     * Event::on(
     *     Field::class,
     *     Field::EVENT_MODIFY_PURIFIER_CONFIG,
     *     function(ModifyPurifierConfigEvent $event) {
     *          // ...
     *     }
     * );
     * ```
     */
    public const EVENT_MODIFY_PURIFIER_CONFIG = 'modifyPurifierConfig';

    /**
     * @event ModifyRedactorConfigEvent The event that is triggered when loading redactor config.
     *
     * Plugins can get notified when redactor config is loaded
     *
     * ```php
     * use craft\redactor\events\ModifyRedactorConfigEvent;
     * use craft\redactor\Field;
     * use yii\base\Event;
     *
     * Event::on(Field::class, Field::EVENT_DEFINE_REDACTOR_CONFIG, function(ModifyRedactorConfigEvent $e) {
     *      // Never allow the bold button for reasons.
     *     $e->config['buttonsHide'] = empty($e->config['buttonsHide']) ? ['bold'] : array_merge($e->config['buttonsHide'], ['bold']);
     * });
     * ```
     */
    public const EVENT_DEFINE_REDACTOR_CONFIG = 'defineRedactorConfig';

    /**
     * @var array List of the Redactor plugins that have already been registered for this request
     */
    private static array $_registeredPlugins = [];

    /**
     * @var array|null List of the paths that may contain Redactor plugins
     */
    private static ?array $_pluginPaths = null;

    /**
     * @var string The UI mode of the field.
     * @since 2.7.0
     */
    public string $uiMode = 'enlarged';

    /**
     * @var string|null The Redactor config file to use
     */
    public ?string $redactorConfig = null;

    /**
     * @var string|array|null The volumes that should be available for Image selection.
     */
    public $availableVolumes = '*';

    /**
     * @var string|array|null The transforms available when selecting an image
     */
    public $availableTransforms = '*';

    /**
     * @var bool Whether to show input sources for volumes the user doesn’t have permission to view.
     * @since 2.6.0
     */
    public bool $showUnpermittedVolumes = false;

    /**
     * @var bool Whether to show files the user doesn’t have permission to view, per the
     * “View files uploaded by other users” permission.
     * @since 2.6.0
     */
    public bool $showUnpermittedFiles = false;

    /**
     * @var bool Whether "view source" button should only be displayed to admins.
     * @since 2.7.0
     */
    public bool $showHtmlButtonForNonAdmins = false;

    /**
     * @var string Config selection mode ('choose' or 'manual')
     * @since 2.7.0
     */
    public string $configSelectionMode = 'choose';

    /**
     * @var string Manual config to use
     * @since 2.7.0
     */
    public string $manualConfig = '';

    /**
     * @var string The default transform to use.
     */
    public string $defaultTransform = '';

    /**
     * @inheritdoc
     */
    public function __construct(array $config = [])
    {
        // Default showHtmlButtonForNonAdmins to true for existing Assets fields
        if (isset($config['id']) && !isset($config['showHtmlButtonForNonAdmins'])) {
            $config['showHtmlButtonForNonAdmins'] = true;
        }

        // normalize a mix/match of ids and uids to a list of uids.
        if (isset($config['availableVolumes']) && is_array($config['availableVolumes'])) {
            $ids = [];
            $uids = [];

            foreach ($config['availableVolumes'] as $availableVolume) {
                if (is_int($availableVolume)) {
                    $ids[] = $availableVolume;
                } else {
                    $uids[] = $availableVolume;
                }
            }

            if (!empty($ids)) {
                $uids = array_merge($uids, Db::uidsByIds('{{%volumes}}', $ids));
            }

            $config['availableVolumes'] = $uids;
        }

        // normalize a mix/match of ids and uids to a list of uids.
        if (isset($config['availableTransforms']) && is_array($config['availableTransforms'])) {
            $ids = [];
            $uids = [];

            foreach ($config['availableTransforms'] as $availableTransform) {
                if (is_int($availableTransform)) {
                    $ids[] = $availableTransform;
                } else {
                    $uids[] = $availableTransform;
                }
            }

            if (!empty($ids)) {
                $uids = array_merge($uids, Db::uidsByIds('{{%assettransforms}}', $ids));
            }

            $config['availableTransforms'] = $uids;
        }

        // configFile => redactorConfig
        if (isset($config['configFile'])) {
            $config['redactorConfig'] = ArrayHelper::remove($config, 'configFile');
        }

        // Default showUnpermittedVolumes to true for existing Redactor fields
        if (isset($config['id']) && !isset($config['showUnpermittedVolumes'])) {
            $config['showUnpermittedVolumes'] = true;
        }

        unset($config['cleanupHtml']);

        parent::__construct($config);
    }

    /**
     * @inheritdoc
     */
    public static function displayName(): string
    {
        return Craft::t('redactor', 'Redactor');
    }

    /**
     * Registers a Redactor plugin's JS & CSS files.
     *
     * @param string $plugin
     * @return void
     * @throws InvalidConfigException if the plugin can't be found
     */
    public static function registerRedactorPlugin(string $plugin): void
    {
        if (isset(self::$_registeredPlugins[$plugin])) {
            return;
        }

        $paths = self::redactorPluginPaths();
        $view = Craft::$app->getView();

        foreach ($paths as $registeredPath) {
            foreach (["$registeredPath/$plugin", $registeredPath] as $path) {
                if (file_exists("$path/$plugin.js")) {
                    $baseUrl = Craft::$app->getAssetManager()->getPublishedUrl($path, true);
                    $view->registerJsFile("$baseUrl/$plugin.js", [
                        'depends' => RedactorAsset::class,
                    ]);
                    // CSS file too?
                    if (file_exists("$path/$plugin.css")) {
                        $view->registerCssFile("$baseUrl/$plugin.css");
                    }
                    // Don't do this twice
                    self::$_registeredPlugins[$plugin] = true;
                    return;
                }
            }
        }

        throw new InvalidConfigException('Redactor plugin not found: ' . $plugin);
    }

    /**
     * Returns the registered Redactor plugin paths.
     *
     * @return string[]
     */
    public static function redactorPluginPaths(): array
    {
        if (self::$_pluginPaths !== null) {
            return self::$_pluginPaths;
        }

        $event = new RegisterPluginPathsEvent([
            'paths' => [
                Craft::getAlias('@config/redactor/plugins'),
                __DIR__ . '/assets/redactor/dist/redactor-plugins',
            ],
        ]);
        Event::trigger(self::class, self::EVENT_REGISTER_PLUGIN_PATHS, $event);

        return self::$_pluginPaths = $event->paths;
    }

    /**
     * @inheritdoc
     */
    public function getSettingsHtml(): ?string
    {
        $volumeOptions = [];
        foreach (Craft::$app->getVolumes()->getAllVolumes() as $volume) {
            if ($volume->getFs()->hasUrls) {
                $volumeOptions[] = [
                    'label' => $volume->name,
                    'value' => $volume->uid,
                ];
            }
        }

        $transformOptions = [];
        foreach (Craft::$app->getImageTransforms()->getAllTransforms() as $transform) {
            $transformOptions[] = [
                'label' => $transform->name,
                'value' => $transform->uid,
            ];
        }

        return Craft::$app->getView()->renderTemplate('redactor/_field_settings', [
            'field' => $this,
            'redactorConfigOptions' => $this->configOptions('redactor'),
            'purifierConfigOptions' => $this->configOptions('htmlpurifier'),
            'volumeOptions' => $volumeOptions,
            'transformOptions' => $transformOptions,
            'defaultTransformOptions' => array_merge([
                [
                    'label' => Craft::t('redactor', 'No transform'),
                    'value' => null,
                ],
            ], $transformOptions),
        ]);
    }

    /**
     * @inheritdoc
     */
    protected function defineRules(): array
    {
        $rules = parent::defineRules();
        $rules[] = [['manualConfig'], 'trim'];
        $rules[] = [
            ['manualConfig'],
            function() {
                if (!Json::isJsonObject($this->manualConfig)) {
                    $this->addError('manualConfig', Craft::t('redactor', 'This must be a valid JSON object.'));
                    return;
                }
                try {
                    Json::decode($this->manualConfig);
                } catch (InvalidArgumentException $e) {
                    $this->addError('manualConfig', Craft::t('redactor', 'This must be a valid JSON object.'));
                }
            },
        ];
        return $rules;
    }

    /**
     * @inheritdoc
     */
    protected function createFieldData(string $content, ?int $siteId): HtmlFieldData
    {
        return new FieldData($content, $siteId);
    }

    /**
     * @inheritdoc
     */
    protected function inputHtml(mixed $value, ElementInterface $element = null): string
    {
        // register the asset/redactor bundles
        $view = Craft::$app->getView();
        $view->registerAssetBundle(FieldAsset::class);

        // figure out which language we ended up with
        /** @var RedactorAsset $bundle */
        $bundle = $view->getAssetManager()->getBundle(RedactorAsset::class);
        $redactorLang = $bundle::$redactorLanguage ?? 'en';

        // register plugins
        $redactorConfig = $this->_getRedactorConfig();

        if (isset($redactorConfig['plugins'])) {
            foreach ($redactorConfig['plugins'] as $plugin) {
                static::registerRedactorPlugin($plugin);
            }
        }

        if (!$this->showHtmlButtonForNonAdmins && !Craft::$app->getUser()->getIsAdmin()) {
            $redactorConfig['buttonsHide'] = array_merge($redactorConfig['buttonsHide'] ?? [], ['html']);
        }

        $id = Html::id($this->handle);
        $sitesService = Craft::$app->getSites();
        $elementSite = ($element ? $element->getSite() : $sitesService->getCurrentSite());

        $defaultTransform = '';

        if (!empty($this->defaultTransform) && $transform = Craft::$app->getImageTransforms()->getTransformByUid($this->defaultTransform)) {
            $defaultTransform = $transform->handle;
        }

        $allSites = [];
        foreach ($sitesService->getAllSites(false) as $site) {
            $allSites[$site->id] = $site->name;
        }

        $settings = [
            'id' => $view->namespaceInputId($id),
            'linkOptions' => $this->_getLinkOptions($element),
            'volumes' => $this->_getVolumeKeys(),
            'transforms' => $this->_getTransforms(),
            'defaultTransform' => $defaultTransform,
            'elementSiteId' => $elementSite->id,
            'allSites' => $allSites,
            'redactorConfig' => $redactorConfig,
            'redactorLang' => $redactorLang,
            'showAllUploaders' => $this->showUnpermittedFiles,
        ];

        if ($this->translationMethod != self::TRANSLATION_METHOD_NONE) {
            // Explicitly set the text direction
            $locale = Craft::$app->getI18n()->getLocaleById($elementSite->language);
            $settings['direction'] = $locale->getOrientation();
        }

        RedactorAsset::registerTranslations($view);
        $view->registerJs('new Craft.RedactorInput(' . Json::encode($settings) . ');');

        $value = $this->prepValueForInput($value, $element);

        if ($value !== '') {
            // Swap any <!--pagebreak-->'s with <hr>'s
            $value = str_replace('<!--pagebreak-->', Html::tag('hr', '', [
                'class' => 'redactor_pagebreak',
                'style' => ['display' => 'none'],
                'unselectable' => 'on',
                'contenteditable' => 'false',
            ]), $value);
        }

        $textarea = Html::textarea($this->handle, $value, [
            'id' => $id,
            'style' => ['display' => 'none'],
        ]);

        return Html::tag('div', $textarea, [
            'class' => [
                'redactor',
                $this->uiMode,
            ],
        ]);
    }

    /**
     * @inheritdoc
     */
    public function getStaticHtml(mixed $value, ElementInterface $element): string
    {
        return
            Html::beginTag('div', [
                'class' => array_filter([
                    'text',
                    $this->uiMode === 'enlarged' ? 'readable' : null,
                ]),
            ]) .
            ($this->prepValueForInput($value, $element) ?: '&nbsp;') .
            Html::endTag('div');
    }

    /**
     * @inheritdoc
     */
    public function serializeValue(mixed $value, ?\craft\base\ElementInterface $element = null): mixed
    {
        if ($value instanceof HtmlFieldData) {
            $value = $value->getRawContent();
        }

        if (is_string($value)) {
            // Swap any pagebreak <hr>'s with <!--pagebreak-->'s
            $value = preg_replace('/<hr class="redactor_pagebreak".*?>/', '<!--pagebreak-->', $value);
        }

        return parent::serializeValue($value, $element);
    }

    /**
     * Returns the link options available to the field.
     * Each link option is represented by an array with the following keys:
     * - `optionTitle` (required) – the user-facing option title that appears in the Link dropdown menu
     * - `elementType` (required) – the element type class that the option should be linking to
     * - `sources` (optional) – the sources that the user should be able to select elements from
     * - `criteria` (optional) – any specific element criteria parameters that should limit which elements the user can select
     * - `storageKey` (optional) – the localStorage key that should be used to store the element selector modal state (defaults to RedactorInput.LinkTo[ElementType])
     *
     * @param ElementInterface|null $element The element the field is associated with, if there is one
     * @return array
     */
    private function _getLinkOptions(ElementInterface $element = null): array
    {
        $linkOptions = [];

        $sectionSources = $this->_getSectionSources($element);
        $categorySources = $this->_getCategorySources($element);

        if (!empty($sectionSources)) {
            $linkOptions[] = [
                'optionTitle' => Craft::t('redactor', 'Link to an entry'),
                'elementType' => Entry::class,
                'refHandle' => Entry::refHandle(),
                'sources' => $sectionSources,
                'criteria' => ['uri' => ':notempty:'],
            ];
        }

        if (!empty($this->_getVolumeKeys())) {
            $linkOptions[] = [
                'optionTitle' => Craft::t('redactor', 'Link to an asset'),
                'elementType' => Asset::class,
                'refHandle' => Asset::refHandle(),
                'sources' => $this->_getVolumeKeys(),
            ];
        }

        if (!empty($categorySources)) {
            $linkOptions[] = [
                'optionTitle' => Craft::t('redactor', 'Link to a category'),
                'elementType' => Category::class,
                'refHandle' => Category::refHandle(),
                'sources' => $categorySources,
            ];
        }

        // Give plugins a chance to add their own
        $event = new RegisterLinkOptionsEvent([
            'linkOptions' => $linkOptions,
        ]);
        $this->trigger(self::EVENT_REGISTER_LINK_OPTIONS, $event);
        $linkOptions = $event->linkOptions;

        // Fill in any missing ref handles
        foreach ($linkOptions as &$linkOption) {
            if (!isset($linkOption['refHandle'])) {
                /** @var ElementInterface|string $class */
                $class = $linkOption['elementType'];
                $linkOption['refHandle'] = $class::refHandle() ?? $class;
            }
        }

        return $linkOptions;
    }

    /**
     * Returns the available section sources.
     *
     * @param ElementInterface|null $element The element the field is associated with, if there is one
     * @return array
     */
    private function _getSectionSources(ElementInterface $element = null): array
    {
        $sources = [];
        $sections = Craft::$app->getSections()->getAllSections();
        $showSingles = false;

        // Get all sites
        $sites = Craft::$app->getSites()->getAllSites();

        foreach ($sections as $section) {
            if ($section->type === Section::TYPE_SINGLE) {
                $showSingles = true;
            } elseif ($element) {
                $sectionSiteSettings = $section->getSiteSettings();
                foreach ($sites as $site) {
                    if (isset($sectionSiteSettings[$site->id]) && $sectionSiteSettings[$site->id]->hasUrls) {
                        $sources[] = 'section:' . $section->uid;
                    }
                }
            }
        }

        if ($showSingles) {
            array_unshift($sources, 'singles');
        }

        if (!empty($sources)) {
            array_unshift($sources, '*');
        }

        return $sources;
    }

    /**
     * Returns the available category sources.
     *
     * @param ElementInterface|null $element The element the field is associated with, if there is one
     * @return array
     */
    private function _getCategorySources(ElementInterface $element = null): array
    {
        $sources = [];

        if ($element) {
            $categoryGroups = Craft::$app->getCategories()->getAllGroups();

            foreach ($categoryGroups as $categoryGroup) {
                // Does the category group have URLs in the same site as the element we're editing?
                $categoryGroupSiteSettings = $categoryGroup->getSiteSettings();
                if (isset($categoryGroupSiteSettings[$element->siteId]) && $categoryGroupSiteSettings[$element->siteId]->hasUrls) {
                    $sources[] = 'group:' . $categoryGroup->uid;
                }
            }
        }

        return $sources;
    }

    /**
     * Returns the available volumes.
     *
     * @return string[]
     */
    private function _getVolumeKeys(): array
    {
        if (!$this->availableVolumes) {
            return [];
        }

        $criteria = ['parentId' => ':empty:'];

        $allVolumes = Craft::$app->getVolumes()->getAllVolumes();
        $allowedVolumes = [];
        $userService = Craft::$app->getUser();

        foreach ($allVolumes as $volume) {
            $allowedBySettings = $this->availableVolumes === '*' || (is_array($this->availableVolumes) && in_array($volume->uid, $this->availableVolumes));
            if ($allowedBySettings && ($this->showUnpermittedVolumes || $userService->checkPermission("viewAssets:$volume->uid"))) {
                $allowedVolumes[] = 'volume:' . $volume->uid;
            }
        }

        return $allowedVolumes;
    }

    /**
     * Get available transforms.
     *
     * @return array
     */
    private function _getTransforms(): array
    {
        if (!$this->availableTransforms) {
            return [];
        }

        $allTransforms = Craft::$app->getImageTransforms()->getAllTransforms();
        $transformList = [];

        foreach ($allTransforms as $transform) {
            if (!is_array($this->availableTransforms) || in_array($transform->uid, $this->availableTransforms, false)) {
                $transformList[] = [
                    'handle' => $transform->handle,
                    'name' => $transform->name,
                ];
            }
        }

        return $transformList;
    }

    /**
     * Returns the Redactor config used by this field.
     *
     * @return array
     */
    private function _getRedactorConfig(): array
    {
        if ($this->configSelectionMode === 'manual') {
            $config = Json::decode($this->manualConfig);
        } else {
            $config = $this->config('redactor', $this->redactorConfig) ?: [];
        }

        // Give plugins a chance to modify the Redactor config
        $event = new ModifyRedactorConfigEvent([
            'config' => $config,
            'field' => $this,
        ]);

        $this->trigger(self::EVENT_DEFINE_REDACTOR_CONFIG, $event);

        return $event->config;
    }

    /**
     * @inheritdoc
     */
    protected function defaultPurifierOptions(): array
    {
        $options = parent::defaultPurifierOptions();
        $options['HTML.AllowedComments'] = ['pagebreak'];
        return $options;
    }

    /**
     * @inheritdoc
     */
    protected function allowedStyles(): array
    {
        $styles = [];
        $plugins = array_flip($this->_getRedactorConfig()['plugins'] ?? []);
        if (isset($plugins['alignment'])) {
            $styles['text-align'] = true;
        }
        if (isset($plugins['fontcolor'])) {
            $styles['color'] = true;
            $styles['background-color'] = true;
        }
        if (isset($plugins['fontfamily'])) {
            $styles['font-family'] = true;
        }
        if (isset($plugins['fontsize'])) {
            $styles['font-size'] = true;
        }
        return $styles;
    }

    /**
     * @inheritdoc
     */
    protected function purifierConfig(): HTMLPurifier_Config
    {
        $purifierConfig = parent::purifierConfig();

        // Give plugins a chance to modify the HTML Purifier config, or add new ones
        $event = new ModifyPurifierConfigEvent([
            'config' => $purifierConfig,
        ]);

        $this->trigger(self::EVENT_MODIFY_PURIFIER_CONFIG, $event);

        return $event->config;
    }
}
