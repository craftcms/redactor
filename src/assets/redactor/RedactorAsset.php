<?php
/**
 * @link      https://craftcms.com/
 * @copyright Copyright (c) Pixel & Tonic, Inc.
 * @license   MIT
 */

namespace craft\redactor\assets\redactor;

use craft\web\AssetBundle;
use yii\web\JqueryAsset;

/**
 * Redactor editor asset bundle
 */
class RedactorAsset extends AssetBundle
{
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
            'redactor.min.css',
        ];

        $this->js = [
            'redactor'.$this->dotJs(),
        ];

        parent::init();
    }
}
