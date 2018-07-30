<?php
/**
 * @link https://craftcms.com/
 * @copyright Copyright (c) Pixel & Tonic, Inc.
 * @license MIT
 */

namespace craft\redactor;

use Craft;
use craft\base\Element;
use craft\base\ElementInterface;
use craft\base\Volume;
use craft\elements\Category;
use craft\elements\Entry;
use craft\helpers\FileHelper;
use craft\helpers\Html;
use craft\helpers\HtmlPurifier;
use craft\helpers\Json;
use craft\helpers\StringHelper;
use craft\models\Section;
use craft\redactor\assets\field\FieldAsset;
use craft\redactor\assets\redactor\RedactorAsset;
use craft\redactor\events\RegisterLinkOptionsEvent;
use craft\redactor\events\RegisterPluginPathsEvent;
use craft\validators\HandleValidator;
use yii\base\Event;
use yii\base\InvalidConfigException;
use yii\db\Schema;

/**
 * Redactor field type
 *
 * @author Pixel & Tonic, Inc. <support@pixelandtonic.com>
 * @since 3.0
 */
class Field extends \craft\base\Field
{
    // Constants
    // =========================================================================

    /**
     * @event RegisterPluginPathsEvent The event that is triggered when registering paths that contain Redactor plugins.
     */
    const EVENT_REGISTER_PLUGIN_PATHS = 'registerPluginPaths';

    /**
     * @event RegisterLinkOptionsEvent The event that is triggered when registering the link options for the field.
     */
    const EVENT_REGISTER_LINK_OPTIONS = 'registerLinkOptions';

    // Static
    // =========================================================================

    /**
     * @var array List of the Redactor plugins that have already been registered for this request
     */
    private static $_registeredPlugins = [];

    /**
     * @var array|null List of the paths that may contain Redactor plugins
     */
    private static $_pluginPaths;

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
    public static function registerRedactorPlugin(string $plugin)
    {
        if (isset(self::$_registeredPlugins[$plugin])) {
            return;
        }

        $paths = self::redactorPluginPaths();

        foreach ($paths as $registeredPath) {
            foreach (["{$registeredPath}/{$plugin}", $registeredPath] as $path) {
                if (file_exists("{$path}/{$plugin}.js")) {
                    $view = Craft::$app->getView();
                    $baseUrl = Craft::$app->getAssetManager()->getPublishedUrl($path, true);
                    $view->registerJsFile("{$baseUrl}/{$plugin}.js", [
                        'depends' => RedactorAsset::class
                    ]);
                    // CSS file too?
                    if (file_exists("{$path}/{$plugin}.css")) {
                        $view->registerCssFile("{$baseUrl}/{$plugin}.css");
                    }
                    // Don't do this twice
                    self::$_registeredPlugins[$plugin] = true;
                    return;
                }
            }
        }

        throw new InvalidConfigException('Redactor plugin not found: '.$plugin);
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
                dirname(__DIR__).'/lib/redactor-plugins',
            ]
        ]);
        Event::trigger(self::class, self::EVENT_REGISTER_PLUGIN_PATHS, $event);

        return self::$_pluginPaths = $event->paths;
    }

    // Properties
    // =========================================================================

    /**
     * @var string|null The Redactor config file to use
     */
    public $redactorConfig;

    /**
     * @var string|null The HTML Purifier config file to use
     */
    public $purifierConfig;

    /**
     * @var bool Whether the HTML should be cleaned up on save
     */
    public $cleanupHtml = true;

    /**
     * @var bool Whether the HTML should be purified on save
     */
    public $purifyHtml = true;

    /**
     * @var string The type of database column the field should have in the content table
     */
    public $columnType = Schema::TYPE_TEXT;

    /**
     * @var string|array|null The volumes that should be available for Image selection.
     */
    public $availableVolumes = '*';

    /**
     * @var string|array|null The transforms available when selecting an image
     */
    public $availableTransforms = '*';

    // Public Methods
    // =========================================================================

    /**
     * @inheritdoc
     */
    public function getSettingsHtml()
    {
        $volumeOptions = [];
        /** @var $volume Volume */
        foreach (Craft::$app->getVolumes()->getPublicVolumes() as $volume) {
            if ($volume->hasUrls) {
                $volumeOptions[] = [
                    'label' => Html::encode($volume->name),
                    'value' => $volume->id
                ];
            }
        }

        $transformOptions = [];
        foreach (Craft::$app->getAssetTransforms()->getAllTransforms() as $transform) {
            $transformOptions[] = [
                'label' => Html::encode($transform->name),
                'value' => $transform->id
            ];
        }

        return Craft::$app->getView()->renderTemplate('redactor/_field_settings', [
            'field' => $this,
            'redactorConfigOptions' => $this->_getCustomConfigOptions('redactor'),
            'purifierConfigOptions' => $this->_getCustomConfigOptions('htmlpurifier'),
            'volumeOptions' => $volumeOptions,
            'transformOptions' => $transformOptions,
        ]);
    }

    /**
     * @inheritdoc
     */
    public function getContentColumnType(): string
    {
        return $this->columnType;
    }

    /**
     * @inheritdoc
     */
    public function normalizeValue($value, ElementInterface $element = null)
    {
        if ($value instanceof FieldData) {
            return $value;
        }

        if (!$value) {
            return null;
        }

        // Prevent everyone from having to use the |raw filter when outputting RTE content
        return new FieldData($value);
    }

    /**
     * @inheritdoc
     */
    public function getInputHtml($value, ElementInterface $element = null): string
    {
        /** @var FieldData|null $value */
        /** @var Element $element */

        // register the asset/redactor bundles
        Craft::$app->getView()->registerAssetBundle(FieldAsset::class);

        // figure out which language we ended up with
        $view = Craft::$app->getView();
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

        $id = $view->formatInputId($this->handle);
        $site = ($element ? $element->getSite() : Craft::$app->getSites()->getCurrentSite());

        $settings = [
            'id' => $view->namespaceInputId($id),
            'linkOptions' => $this->_getLinkOptions($element),
            'volumes' => $this->_getVolumeKeys(),
            'transforms' => $this->_getTransforms(),
            'elementSiteId' => $site->id,
            'redactorConfig' => $redactorConfig,
            'redactorLang' => $redactorLang,
        ];

        if ($this->translationMethod != self::TRANSLATION_METHOD_NONE) {
            // Explicitly set the text direction
            $locale = Craft::$app->getI18n()->getLocaleById($site->language);
            $settings['direction'] = $locale->getOrientation();
        }

        RedactorAsset::registerTranslations($view);
        $view->registerJs('new Craft.RedactorInput('.Json::encode($settings).');');

        if ($value instanceof FieldData) {
            $value = $value->getRawContent();
        }

        if ($value !== null) {
            // Parse reference tags
            $value = $this->_parseRefs($value, $element);

            // Swap any <!--pagebreak-->'s with <hr>'s
            $value = str_replace('<!--pagebreak-->', '<hr class="redactor_pagebreak" style="display:none" unselectable="on" contenteditable="false" />', $value);
        }

        return '<textarea id="'.$id.'" name="'.$this->handle.'" style="display: none">'.htmlentities($value, ENT_NOQUOTES, 'UTF-8').'</textarea>';
    }

    /**
     * @inheritdoc
     */
    public function getStaticHtml($value, ElementInterface $element): string
    {
        /** @var FieldData|null $value */
        return '<div class="text">'.($value ?: '&nbsp;').'</div>';
    }

    /**
     * @inheritdoc
     */
    public function getSearchKeywords($value, ElementInterface $element): string
    {
        $keywords = parent::getSearchKeywords($value, $element);

        if (Craft::$app->getDb()->getIsMysql()) {
            $keywords = StringHelper::encodeMb4($keywords);
        }

        return $keywords;
    }

    /**
     * @inheritdoc
     */
    public function isValueEmpty($value, ElementInterface $element): bool
    {
        if ($value === null) {
            return true;
        }

        /** @var FieldData $value */
        return parent::isValueEmpty($value->getRawContent(), $element);
    }

    /**
     * @inheritdoc
     */
    public function serializeValue($value, ElementInterface $element = null)
    {
        /** @var FieldData|null $value */
        if (!$value) {
            return null;
        }

        // Get the raw value
        $value = $value->getRawContent();

        // Temporary fix (hopefully) for a Redactor bug where some HTML will get submitted when the field is blank,
        // if any text was typed into the field, and then deleted
        if ($value === '<p><br></p>') {
            $value = '';
        }

        if ($value) {
            // Swap any pagebreak <hr>'s with <!--pagebreak-->'s
            $value = preg_replace('/<hr class="redactor_pagebreak".*?>/', '<!--pagebreak-->', $value);

            if ($this->purifyHtml) {
                // Parse reference tags so HTMLPurifier doesn't encode the curly braces
                $value = $this->_parseRefs($value, $element);

                $value = HtmlPurifier::process($value, $this->_getPurifierConfig());
            }

            if ($this->cleanupHtml) {
                // Swap no-break whitespaces for regular space
                $value = preg_replace('/(&nbsp;|&#160;|\x{00A0})/u', ' ', $value);
                $value = preg_replace('/  +/', ' ', $value);

                // Remove <font> tags
                $value = preg_replace('/<(?:\/)?font\b[^>]*>/', '', $value);

                // Remove disallowed inline styles
                $allowedStyles = $this->_allowedStyles();
                $value = preg_replace_callback(
                    '/(<(?:h1|h2|h3|h4|h5|h6|p|div|blockquote|pre|strong|em|b|i|u|a|span)\b[^>]*)\s+style="([^"]*)"/',
                    function(array $matches) use ($allowedStyles) {
                        // Only allow certain styles through
                        $allowed = [];
                        $styles = explode(';', $matches[2]);
                        foreach ($styles as $style) {
                            list($name, $value) = array_map('trim', array_pad(explode(':', $style, 2), 2, ''));
                            if (isset($allowedStyles[$name])) {
                                $allowed[] = "{$name}: {$value}";
                            }
                        }
                        return $matches[1].(!empty($allowed) ? ' style="'.implode('; ', $allowed).'"' : '');
                    },
                    $value
                );

                // Remove empty tags
                $value = preg_replace('/<(h1|h2|h3|h4|h5|h6|p|div|blockquote|pre|strong|em|a|b|i|u|span)\s*><\/\1>/', '', $value);
            }
        }

        // Find any element URLs and swap them with ref tags
        $value = preg_replace_callback(
            '/(href=|src=)([\'"])[^\'"#]+?(#[^\'"#]+)?(?:#|%23)([\w\\\\]+)\:(\d+)(\:(?:transform\:)?'.HandleValidator::$handlePattern.')?\2/',
            function($matches) {
                // Create the ref tag, and make sure :url is in there
                $refTag = '{'.$matches[4].':'.$matches[5].(!empty($matches[6]) ? $matches[6] : ':url').'}';
                $hash = (!empty($matches[3]) ? $matches[3] : '');

                if ($hash) {
                    // Make sure that the hash isn't actually part of the parsed URL
                    // (someone's Entry URL Format could be "#{slug}", etc.)
                    $url = Craft::$app->getElements()->parseRefs($refTag);

                    if (mb_strpos($url, $hash) !== false) {
                        $hash = '';
                    }
                }

                return $matches[1].$matches[2].$refTag.$hash.$matches[2];
            },
            $value);

        if (Craft::$app->getDb()->getIsMysql()) {
            // Encode any 4-byte UTF-8 characters.
            $value = StringHelper::encodeMb4($value);
        }

        return $value;
    }

    // Private Methods
    // =========================================================================

    /**
     * Parse ref tags in URLs, while preserving the original tag values in the URL fragments
     * (e.g. `href="{entry:id:url}"` => `href="[entry-url]#entry:id:url"`)
     *
     * @param string $value
     * @param ElementInterface|null $element
     * @return string
     */
    private function _parseRefs(string $value, ElementInterface $element = null): string
    {
        if (!StringHelper::contains($value, '{')) {
            return $value;
        }

        return preg_replace_callback('/(href=|src=)([\'"])(\{([\w\\\\]+\:\d+\:(?:transform\:)?'.HandleValidator::$handlePattern.')\})(#[^\'"#]+)?\2/', function($matches) use ($element) {
            /** @var Element|null $element */
            list (, $attr, $q, $refTag, $ref) = $matches;
            $fragment = $matches[5] ?? '';

            return $attr.$q.Craft::$app->getElements()->parseRefs($refTag, $element->siteId ?? null).$fragment.'#'.$ref.$q;
        }, $value);
    }

    /**
     * Returns the link options available to the field.
     * Each link option is represented by an array with the following keys:
     * - `optionTitle` (required) – the user-facing option title that appears in the Link dropdown menu
     * - `elementType` (required) – the element type class that the option should be linking to
     * - `sources` (optional) – the sources that the user should be able to select elements from
     * - `criteria` (optional) – any specific element criteria parameters that should limit which elements the user can select
     * - `storageKey` (optional) – the localStorage key that should be used to store the element selector modal state (defaults to RedactorInput.LinkTo[ElementType])
     *
     * @param Element|null $element The element the field is associated with, if there is one
     * @return array
     */
    private function _getLinkOptions(Element $element = null): array
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
            'linkOptions' => $linkOptions
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
     * @param Element|null $element The element the field is associated with, if there is one
     * @return array
     */
    private function _getSectionSources(Element $element = null): array
    {
        $sources = [];
        $sections = Craft::$app->getSections()->getAllSections();
        $showSingles = false;

        foreach ($sections as $section) {
            if ($section->type === Section::TYPE_SINGLE) {
                $showSingles = true;
            } else if ($element) {
                // Does the section have URLs in the same site as the element we're editing?
                $sectionSiteSettings = $section->getSiteSettings();
                if (isset($sectionSiteSettings[$element->siteId]) && $sectionSiteSettings[$element->siteId]->hasUrls) {
                    $sources[] = 'section:'.$section->id;
                }
            }
        }

        if ($showSingles) {
            array_unshift($sources, 'singles');
        }

        return $sources;
    }

    /**
     * Returns the available category sources.
     *
     * @param Element|null $element The element the field is associated with, if there is one
     * @return array
     */
    private function _getCategorySources(Element $element = null): array
    {
        $sources = [];

        if ($element) {
            $categoryGroups = Craft::$app->getCategories()->getAllGroups();

            foreach ($categoryGroups as $categoryGroup) {
                // Does the category group have URLs in the same site as the element we're editing?
                $categoryGroupSiteSettings = $categoryGroup->getSiteSettings();
                if (isset($categoryGroupSiteSettings[$element->siteId]) && $categoryGroupSiteSettings[$element->siteId]->hasUrls) {
                    $sources[] = 'group:'.$categoryGroup->id;
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

        if ($this->availableVolumes !== '*') {
            $criteria['volumeId'] = $this->availableVolumes;
        }

        $folders = Craft::$app->getAssets()->findFolders($criteria);

        // Sort volumes in the same order as they are sorted in the CP
        $sortedVolumeIds = Craft::$app->getVolumes()->getAllVolumeIds();
        $sortedVolumeIds = array_flip($sortedVolumeIds);

        $volumeKeys = [];

        usort($folders, function($a, $b) use ($sortedVolumeIds) {
            // In case Temporary volumes ever make an appearance in RTF modals, sort them to the end of the list.
            $aOrder = $sortedVolumeIds[$a->volumeId] ?? PHP_INT_MAX;
            $bOrder = $sortedVolumeIds[$b->volumeId] ?? PHP_INT_MAX;

            return $aOrder - $bOrder;
        });

        foreach ($folders as $folder) {
            $volumeKeys[] = 'folder:'.$folder->id;
        }

        return $volumeKeys;
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

        $allTransforms = Craft::$app->getAssetTransforms()->getAllTransforms();
        $transformList = [];

        foreach ($allTransforms as $transform) {
            if (!is_array($this->availableTransforms) || in_array($transform->id, $this->availableTransforms, false)) {
                $transformList[] = [
                    'handle' => Html::encode($transform->handle),
                    'name' => Html::encode($transform->name)
                ];
            }
        }

        return $transformList;
    }

    /**
     * Returns the available Redactor config options.
     *
     * @param string $dir The directory name within the config/ folder to look for config files
     * @return array
     */
    private function _getCustomConfigOptions(string $dir): array
    {
        $options = ['' => Craft::t('redactor', 'Default')];
        $path = Craft::$app->getPath()->getConfigPath().DIRECTORY_SEPARATOR.$dir;

        if (is_dir($path)) {
            $files = FileHelper::findFiles($path, [
                'only' => ['*.json'],
                'recursive' => false
            ]);

            foreach ($files as $file) {
                $options[pathinfo($file, PATHINFO_BASENAME)] = pathinfo($file, PATHINFO_FILENAME);
            }
        }

        return $options;
    }

    /**
     * Returns a JSON-decoded config, if it exists.
     *
     * @param string $dir The directory name within the config/ folder to look for the config file
     * @param string|null $file The filename to load
     * @return array|false The config, or false if the file doesn't exist
     */
    private function _getConfig(string $dir, string $file = null)
    {
        if (!$file) {
            return false;
        }

        $path = Craft::$app->getPath()->getConfigPath().DIRECTORY_SEPARATOR.$dir.DIRECTORY_SEPARATOR.$file;

        if (!is_file($path)) {
            return false;
        }

        return Json::decode(file_get_contents($path));
    }

    /**
     * Returns the Redactor config used by this field.
     *
     * @return array
     */
    private function _getRedactorConfig(): array
    {
        return $this->_getConfig('redactor', $this->redactorConfig) ?: [];
    }

    /**
     * Returns the HTML Purifier config used by this field.
     *
     * @return array
     */
    private function _getPurifierConfig(): array
    {
        if ($config = $this->_getConfig('htmlpurifier', $this->purifierConfig)) {
            return $config;
        }

        // Default config
        return [
            'Attr.AllowedFrameTargets' => ['_blank'],
            'HTML.AllowedComments' => ['pagebreak'],
        ];
    }

    /**
     * Returns the allowed inline CSS styles, based on the plugins that are enabled.
     *
     * @return string[]
     */
    private function _allowedStyles(): array
    {
        $styles = [];
        $plugins = array_flip($this->_getRedactorConfig()['plugins'] ?? []);
        if (isset($plugins['alignment'])) {
            $styles['text-align'] = true;
        }
        if (isset($plugins['fontcolor'])) {
            $styles['color'] = true;
        }
        if (isset($plugins['fontfamily'])) {
            $styles['font-family'] = true;
        }
        if (isset($plugins['fontsize'])) {
            $styles['font-size'] = true;
        }
        return $styles;
    }
}
