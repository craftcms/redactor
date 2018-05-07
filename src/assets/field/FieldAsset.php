<?php
/**
 * @link https://craftcms.com/
 * @copyright Copyright (c) Pixel & Tonic, Inc.
 * @license MIT
 */

namespace craft\redactor\assets\field;

use craft\redactor\assets\redactor\RedactorAsset;
use craft\web\AssetBundle;
use craft\web\assets\cp\CpAsset;
use craft\web\View;

/**
 * Redactor field asset bundle
 */
class FieldAsset extends AssetBundle
{
    /**
     * @inheritdoc
     */
    public function init()
    {
        $this->sourcePath = __DIR__.'/dist';

        $this->depends = [
            CpAsset::class,
            RedactorAsset::class,
        ];

        $this->js = [
            'js/PluginBase'.$this->dotJs(),
            'js/CraftAssetImageEditor'.$this->dotJs(),
            'js/CraftAssetImages'.$this->dotJs(),
            'js/CraftAssetFiles'.$this->dotJs(),
            'js/CraftEntryLinks'.$this->dotJs(),
            'js/RedactorInput'.$this->dotJs(),
            'js/RedactorOverrides'.$this->dotJs(),
        ];

        $this->css = [
            'css/RedactorInput.min.css',
        ];

        parent::init();
    }

    /**
     * @inheritdoc
     */
    public function registerAssetFiles($view)
    {
        parent::registerAssetFiles($view);

        if ($view instanceof View) {
            $view->registerTranslations('app', [
                'Insert image',
                'Insert URL',
                'Choose image',
                'Link',
                'Link to an entry',
                'Insert link',
                'Unlink',
                'Link to an asset',
                'Link to a category',
            ]);
        }
    }
}
