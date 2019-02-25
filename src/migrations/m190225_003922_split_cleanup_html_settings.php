<?php

namespace craft\redactor\migrations;

use Craft;
use craft\db\Migration;
use craft\helpers\Json;
use craft\services\Fields;
use craft\services\Matrix;
use craft\redactor\Field;

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
        $projectConfig = Craft::$app->getProjectConfig();

        // Don't make the same config changes twice
        $schemaVersion = $projectConfig->get('plugins.redactor.schemaVersion', true);
        if (version_compare($schemaVersion, '2.3.0', '>=')) {
            return true;
        }

        $projectConfig->muteEvents = true;

        $fields = $projectConfig->get(Fields::CONFIG_FIELDS_KEY) ?? [];
        foreach ($fields as $uid => &$field) {
            if ($field['type'] === Field::class && isset($field['settings']) && is_array($field['settings'])) {
                $cleanupHtml = $field['settings']['cleanupHtml'];
                unset($field['settings']['cleanupHtml']);
                $field['settings']['removeInlineStyles'] = $cleanupHtml;
                $field['settings']['removeEmptyTags'] = $cleanupHtml;
                $field['settings']['removeNbsp'] = $cleanupHtml;
                $this->update('{{%fields}}', [
                    'settings' => Json::encode($field['settings']),
                ], ['uid' => $uid]);
                $projectConfig->set(Fields::CONFIG_FIELDS_KEY . '.' . $uid, $field);
            }
        }

        $matrixBlockTypes = $projectConfig->get(Matrix::CONFIG_BLOCKTYPE_KEY) ?? [];
        foreach ($matrixBlockTypes as $matrixBlockTypeUid => &$matrixBlockType) {
            $fields = $projectConfig->get(Matrix::CONFIG_BLOCKTYPE_KEY . '.' . $matrixBlockTypeUid . '.fields') ?? [];
            foreach ($fields as $uid => &$field) {
                if ($field['type'] === Field::class && isset($field['settings']) && is_array($field['settings'])) {
                    $cleanupHtml = $field['settings']['cleanupHtml'];
                    unset($field['settings']['cleanupHtml']);
                    $field['settings']['removeInlineStyles'] = $cleanupHtml;
                    $field['settings']['removeEmptyTags'] = $cleanupHtml;
                    $field['settings']['removeNbsp'] = $cleanupHtml;
                    $this->update('{{%fields}}', [
                        'settings' => Json::encode($field['settings']),
                    ], ['uid' => $uid]);
                    $projectConfig->set(Matrix::CONFIG_BLOCKTYPE_KEY . '.' . $matrixBlockTypeUid . '.fields.' . $uid, $field);
                }
            }
        }

        $projectConfig->muteEvents = false;
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
