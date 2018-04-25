<?php

namespace craft\redactor\controllers;

use Craft;
use craft\elements\Asset;
use craft\web\Controller as BaseController;
use yii\web\ForbiddenHttpException;
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
    public function init()
    {
        parent::init();
        $this->defaultAction = 'can-edit';
    }

    /**
     * Check if user allowed to edit an Asset
     *
     * @return Response
     */
    public function actionCanEdit()
    {
        $this->requireAcceptsJson();
        $this->requirePostRequest();

        $assetId = Craft::$app->getRequest()->getRequiredBodyParam('assetId');

        $asset = Asset::find()->id($assetId)->one();

        if (!$asset) {
            return $this->asJson(['success' => false]);
        }
        try {
            $volumeId = $asset->volumeId;

            if ($volumeId) {
                $this->requirePermission('saveAssetInVolume:'.$volumeId);
                $this->requirePermission('deleteFilesAndFoldersInVolume:'.$volumeId);
            }
        } catch (ForbiddenHttpException $e) {
            return $this->asJson(['success' => false]);
        }

        return $this->asJson(['success' => true]);
    }
}
