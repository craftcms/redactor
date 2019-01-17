<?php

namespace craft\redactor\migrations;

use Craft;
use craft\db\Migration;
use craft\db\Query;
use craft\helpers\Db;
use craft\helpers\FileHelper;
use craft\helpers\Json;
use craft\redactor\Field;
use yii\base\ErrorException;

/**
 * m181101_110000_ids_in_settings_to_uids migration.
 */
class m181101_110000_ids_in_settings_to_uids extends Migration
{
    /**
     * @inheritdoc
     */
    public function safeUp()
    {
        $fields = (new Query())
            ->select(['id', 'settings'])
            ->from(['{{%fields}}'])
            ->where(['type' => Field::class])
            ->all();

        foreach ($fields as $fieldRow) {
            $settings = Json::decodeIfJson($fieldRow['settings']);

            if (is_array($settings)) {
                if (isset($settings['availableVolumes']) && is_array($settings['availableVolumes'])) {
                    foreach ($settings['availableVolumes'] as &$id) {
                        if (is_numeric($id)) {
                            $id = Db::uidById('{{%volumes}}', $id);
                        }
                    }
                }

                if (isset($settings['availableTransforms']) && is_array($settings['availableTransforms'])) {
                    foreach ($settings['availableTransforms'] as &$id) {
                        if (is_numeric($id)) {
                            $id = Db::uidById('{{%assettransforms}}', $id);
                        }
                    }
                }

                $this->update('{{%fields}}', ['settings' => Json::encode($settings)], ['id' => $fieldRow['id']]);
            }
        }
    }

    /**
     * @inheritdoc
     */
    public function safeDown()
    {
        echo "m181101_110000_ids_in_settings_to_uids cannot be reverted.\n";
        return false;
    }
}
