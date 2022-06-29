<?php
/**
 * @link https://craftcms.com/
 * @copyright Copyright (c) Pixel & Tonic, Inc.
 * @license MIT
 */

namespace craft\redactor\assets\redactor;

use Craft;
use craft\helpers\Json;
use craft\web\View;
use yii\web\AssetBundle;
use yii\web\JqueryAsset;

/**
 * Redactor editor asset bundle
 */
class RedactorAsset extends AssetBundle
{
    /**
     * @var string|null the language Redactor should use
     */
    public static ?string $redactorLanguage = null;

    /**
     * @inheritdoc
     */
    public $depends = [
        JqueryAsset::class,
    ];

    /**
     * @inheritdoc
     */
    public $sourcePath = __DIR__ . '/dist';

    /**
     * @inheritdoc
     */
    public $css = [
        'redactor/redactor.css',
    ];

    /**
     * @inheritdoc
     */
    public $js = [
        'redactor/redactor.js',
    ];

    /**
     * @inheritdoc
     */
    public function init(): void
    {
        // set the Redactor language
        self::$redactorLanguage = 'en';

        $languages = array_unique([Craft::$app->language, Craft::$app->getLocale()->getLanguageID()]);

        if (!empty(array_intersect($languages, ['nb', 'nn']))) {
            $languages[] = 'no';
        }

        foreach ($languages as $lang) {
            $subPath = 'redactor' . DIRECTORY_SEPARATOR . '_langs' . DIRECTORY_SEPARATOR . "$lang.js";
            if (is_file($this->sourcePath . DIRECTORY_SEPARATOR . $subPath)) {
                $this->js[] = $subPath;
                self::$redactorLanguage = $lang;
                break;
            }
        }

        parent::init();
    }

    /**
     * Register the custom translations for the Redactor field.
     *
     * @param View $view
     */
    public static function registerTranslations(View $view): void
    {
        $customTranslations = [
            'image-editor' => Craft::t('redactor', 'Image editor'),
            'align' => Craft::t('redactor', 'Align'),
            'align-left' => Craft::t('redactor', 'Align left'),
            'align-center' => Craft::t('redactor', 'Align center'),
            'align-right' => Craft::t('redactor', 'Align right'),
            'align-justify' => Craft::t('redactor', 'Justify'),
            'clips' => Craft::t('redactor', 'Clips'),
            'clips-select' => Craft::t('redactor', 'Select a clip'),
            'words' => Craft::t('redactor', 'words'),
            'chars' => Craft::t('redactor', 'chars'),
            'choose' => Craft::t('redactor', 'Choose'),
            'fontcolor' => Craft::t('redactor', 'Font Color'),
            'text' => Craft::t('redactor', 'Text'),
            'highlight' => Craft::t('redactor', 'Highlight'),
            'fontfamily' => Craft::t('redactor', 'Font Family'),
            'remove-font-family' => Craft::t('redactor', 'Remove font family'),
            'size' => Craft::t('redactor', 'Font Size'),
            'remove-size' => Craft::t('redactor', 'Remove font size'),
            'fullscreen' => Craft::t('redactor', 'Fullscreen'),
            'style' => Craft::t('redactor', 'Style'),
            'insert-page-break' => Craft::t('redactor', 'Insert Page Break'),
            'properties' => Craft::t('redactor', 'Properties'),
            'specialchars' => Craft::t('redactor', 'Special Characters'),
            'table' => Craft::t('redactor', 'Table'),
            'insert-table' => Craft::t('redactor', 'Insert table'),
            'insert-row-above' => Craft::t('redactor', 'Insert row above'),
            'insert-row-below' => Craft::t('redactor', 'Insert row below'),
            'insert-column-left' => Craft::t('redactor', 'Insert column left'),
            'insert-column-right' => Craft::t('redactor', 'Insert column right'),
            'add-head' => Craft::t('redactor', 'Add head'),
            'delete-head' => Craft::t('redactor', 'Delete head'),
            'delete-column' => Craft::t('redactor', 'Delete column'),
            'delete-row' => Craft::t('redactor', 'Delete row'),
            'delete-table' => Craft::t('redactor', 'Delete table'),
            'change-text-direction' => Craft::t('redactor', 'Text Direction'),
            'left-to-right' => Craft::t('redactor', 'Left to right'),
            'right-to-left' => Craft::t('redactor', 'Right to left'),
            'change' => Craft::t('redactor', 'Change'),
            'variable' => Craft::t('redactor', 'Variable'),
            'variable-select' => Craft::t('redactor', 'Select a variable'),
            'video' => Craft::t('redactor', 'Video'),
            'video-html-code' => Craft::t('redactor', 'Video Embed Code or Youtube/Vimeo Link'),
            'widget' => Craft::t('redactor', 'Widget'),
            'widget-html-code' => Craft::t('redactor', 'Widget HTML Code'),
        ];

        $view->registerJs(
            "\$.extend(\$R.lang['" . self::$redactorLanguage . "'], " .
            Json::encode($customTranslations) .
            ');');
    }
}
