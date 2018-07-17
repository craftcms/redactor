<?php
/**
 * @link https://craftcms.com/
 * @copyright Copyright (c) Pixel & Tonic, Inc.
 * @license MIT
 */

namespace craft\redactor\assets\redactor;

use Craft;
use craft\helpers\Json;
use craft\web\AssetBundle;
use yii\web\JqueryAsset;

/**
 * Redactor editor asset bundle
 */
class RedactorAsset extends AssetBundle
{
    /**
     * @var string the language Redactor should use
     */
    public static $redactorLanguage;

    /**
     * @inheritdoc
     */
    public function init()
    {
        $this->sourcePath = dirname(__DIR__, 3).'/lib/redactor';

        $this->depends = [
            JqueryAsset::class,
        ];

        $this->css = [
            'redactor.css',
        ];

        $this->js = [
            'redactor'.$this->dotJs(),
        ];

        // set the Redactor language
        self::$redactorLanguage = 'en';

        $languages = array_unique([Craft::$app->language, Craft::$app->getLocale()->getLanguageID()]);

        foreach ($languages as $lang) {
            $subPath = 'lang'.DIRECTORY_SEPARATOR."{$lang}.js";
            if (is_file($this->sourcePath.DIRECTORY_SEPARATOR.$subPath)) {
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
     * @param $view
     */
    public static function registerTranslations($view)
    {
        $customTranslations = [
            'fullscreen' => Craft::t('redactor', 'Fullscreen'),
            'insert-page-break' => Craft::t('redactor', 'Insert Page Break'),
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
            'video' => Craft::t('redactor', 'Video'),
            'video-html-code' => Craft::t('redactor', 'Video Embed Code or Youtube/Vimeo Link'),
        ];

        $view->registerJs(
            "\$.extend(\$R.lang['".self::$redactorLanguage."'], ".
            Json::encode($customTranslations).
            ');');
    }
}
