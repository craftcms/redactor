<?php
/**
 * @link      https://craftcms.com/
 * @copyright Copyright (c) Pixel & Tonic, Inc.
 * @license   https://craftcms.com/license
 */

namespace craft\redactor\assets\field;

use craft\redactor\assets\redactor\RedactorAsset;
use craft\web\AssetBundle;
use craft\web\assets\cp\CpAsset;

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
            'js/RedactorInput'.$this->dotJs(),
        ];

        $this->css = [
            'css/RedactorInput.min.css',
        ];

        parent::init();
    }
}
