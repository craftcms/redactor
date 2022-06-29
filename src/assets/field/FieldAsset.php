<?php
/**
 * @link https://craftcms.com/
 * @copyright Copyright (c) Pixel & Tonic, Inc.
 * @license MIT
 */

namespace craft\redactor\assets\field;

use Craft;
use craft\base\ElementInterface;
use craft\helpers\Json;
use craft\redactor\assets\redactor\RedactorAsset;
use craft\web\assets\cp\CpAsset;
use craft\web\View;
use yii\web\AssetBundle;

/**
 * Redactor field asset bundle
 */
class FieldAsset extends AssetBundle
{
    /**
     * @inheritdoc
     */
    public $depends = [
        CpAsset::class,
        RedactorAsset::class,
    ];

    /**
     * @inheritdoc
     */
    public $sourcePath = __DIR__ . '/dist';

    /**
     * @inheritdoc
     */
    public $css = [
        'css/RedactorInput.css',
    ];

    /**
     * @inheritdoc
     */
    public $js = [
        'PluginBase.js',
        'CraftAssetImageEditor.js',
        'CraftAssetImages.js',
        'CraftAssetFiles.js',
        'CraftElementLinks.js',
        'RedactorInput.js',
        'RedactorOverrides.js',
    ];

    /**
     * @inheritdoc
     */
    public function registerAssetFiles($view)
    {
        parent::registerAssetFiles($view);

        if ($view instanceof View) {
            $view->registerTranslations('redactor', [
                'Link to the current site',
            ]);
        }

        $refHandles = [];
        foreach (Craft::$app->getElements()->getAllElementTypes() as $elementType) {
            /** @var string|ElementInterface $elementType */
            if ($elementType::isLocalized() && ($refHandle = $elementType::refHandle()) !== null) {
                $refHandles[] = $refHandle;
            }
        }
        $refHandlesJson = Json::encode($refHandles);

        $js = <<<JS
window.Craft.Redactor = {
  localizedRefHandles: $refHandlesJson,
};
JS;
        $view->registerJs($js, View::POS_HEAD);
    }
}
