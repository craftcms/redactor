<?php

namespace craft\redactor\controllers;

use Craft;
use craft\elements\Asset;
use craft\elements\User;
use craft\web\Controller as BaseController;
use yii\base\InvalidConfigException;
use yii\web\BadRequestHttpException;
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
     * @throws InvalidConfigException
     * @throws BadRequestHttpException
     */
    public function actionCanEdit(): Response
    {
        $this->requireAcceptsJson();
        $this->requirePostRequest();

        $assetId = Craft::$app->getRequest()->getRequiredBodyParam('assetId');
        /** @var Asset|null $asset */
        $asset = Asset::find()->id($assetId)->one();

        if (!$asset) {
            return $this->asFailure();
        }

        $volume = $asset->getVolume();
        /** @var User $user */
        $user = Craft::$app->getUser()->getIdentity();

        $success =
            $user->can("saveAssets:$volume->uid") &&
            $user->can("deleteAssets:$volume->uid");

        return $success ? $this->asSuccess() : $this->asFailure();
    }
}
