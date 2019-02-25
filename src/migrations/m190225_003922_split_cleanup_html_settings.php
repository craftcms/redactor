<?php

namespace craft\redactor\migrations;

use Craft;
use craft\db\Migration;
use craft\db\Query;
use craft\db\Table;
use craft\helpers\Json;
use craft\helpers\ArrayHelper;

/**
 * m190225_003922_split_cleanup_html_settings migration.
 */
class m190225_003922_split_cleanup_html_settings extends Migration
{
    /**
     * @inheritdoc
     */
    public function safeUp()
    {
        $fields = (new Query())
            ->select(['id', 'settings'])
            ->from([Table::FIELDS])
            ->where(['type' => 'craft\\redactor\\Field'])
            ->all($this->db);

        $fieldsService = Craft::$app->getFields();

        foreach ($fields as $field) {
            $settings = Json::decode($field['settings']);
            if (is_array($settings) && array_key_exists('cleanupHtml', $settings)) {
                $cleanupHtml = ArrayHelper::remove($settings, 'cleanupHtml');
                $settings['removeInlineStyles'] = $cleanupHtml;
                $settings['removeEmptyTags'] = $cleanupHtml;
                $settings['removeNbsp'] = $cleanupHtml;
                $this->update(Table::FIELDS, ['settings' => Json::encode($settings)], ['id' => $field['id']]);
                $fieldsService->saveField($fieldsService->getFieldById($field['id']));
            }
        }
    }

    /**
     * @inheritdoc
     */
    public function safeDown()
    {
        echo "m190225_003922_split_cleanup_html_settings cannot be reverted.\n";
        return false;
    }
}
