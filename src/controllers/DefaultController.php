<?php

namespace craft\redactor\controllers;

use Craft;
use craft\base\Volume;
use craft\elements\Asset;
use craft\web\Controller as BaseController;
use yii\web\Response;

/**
 * This controller provides functionality to check Asset permissions
 *
 * @author Pixel & Tonic, Inc. <support@pixelandtonic.com>
 * @since  2.0
 */
class DefaultController extends BaseController
{
    /**
     * @inheritdoc
     */
    public $defaultAction = 'can-edit';

    /**
     * Check if user allowed to edit an Asset
     *
     * @return Response
     * @throws \yii\base\InvalidConfigException
     * @throws \yii\web\BadRequestHttpException
     */
    public function actionCanEdit(): Response
    {
        $this->requireAcceptsJson();
        $this->requirePostRequest();

        $assetId = Craft::$app->getRequest()->getRequiredBodyParam('assetId');
        $asset = Asset::find()->id($assetId)->one();

        if (!$asset) {
            return $this->asJson([
                'success' => false
            ]);
        }

        /** @var Volume $volume */
        $volume = $asset->getVolume();
        $user = Craft::$app->getUser()->getIdentity();

        return $this->asJson([
            'success' => (
                $user->can('saveAssetInVolume:' . $volume->uid) &&
                $user->can('deleteFilesAndFoldersInVolume:' . $volume->uid)
            ),
        ]);
    }
}
