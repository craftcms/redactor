<?php

namespace craft\redactor\migrations;

use Craft;
use craft\db\Migration;
use craft\db\Query;
use craft\helpers\ArrayHelper;
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
        $fieldsToMigrate = [];

        // Migrate regular fields
        $fields = $projectConfig->get(Fields::CONFIG_FIELDS_KEY) ?? [];
        foreach ($fields as $fieldUid => $field) {
            if (isset($field['type']) && $field['type'] === Field::class) {
                $fieldsToMigrate[$fieldUid] = [
                    'configPath' => Fields::CONFIG_FIELDS_KEY . '.' . $fieldUid,
                    'config' => $field,
                ];
            }
        }

        // Migrate fields found in Matrix blocks
        $matrixBlockTypes = $projectConfig->get(Matrix::CONFIG_BLOCKTYPE_KEY) ?? [];
        foreach ($matrixBlockTypes as $matrixBlockTypeUid => $matrixBlockType) {
            $fields = $matrixBlockType['fields'] ?? [];
            foreach ($fields as $fieldUid => $field) {
                if (isset($field['type']) && $field['type'] === Field::class) {
                    $fieldsToMigrate[$fieldUid] = [
                        'configPath' => Matrix::CONFIG_BLOCKTYPE_KEY . '.' . $matrixBlockTypeUid . '.fields.' . $fieldUid,
                        'config' => $field,
                    ];
                }
            }
        }

        // Migrate fields found in Super Table
        $superTableBlockTypes = $projectConfig->get('superTableBlockTypes') ?? [];
        if ($superTableBlockTypes) {
            foreach ($superTableBlockTypes as $superTableBlockTypeUid => $superTableBlockType) {
                $fields = $superTableBlockType['fields'] ?? [];
                foreach ($fields as $fieldUid => $field) {
                    if (isset($field['type']) && $field['type'] === Field::class) {
                        $fieldsToMigrate[$fieldUid] = [
                            'configPath' => 'superTableBlockTypes.' . $superTableBlockTypeUid . '.fields.' . $fieldUid,
                            'config' => $field,
                        ];
                    }
                }
            }
        }
        else {
            // If Super Table is not yet installed but we can find fields that need updating in the DB
            $superTableRedactorFields = (new Query())
                ->select(['uid', 'settings'])
                ->from(['{{%fields}}'])
                ->where([
                    'and',
                    ['like', 'context', 'superTableBlockType'],
                    ['in', 'type', ['Redactor']],
                ])
                ->all();
            foreach ($superTableRedactorFields as $superTableRedactorField) {
                $fieldsToMigrate[$superTableRedactorField['uid']] = [
                    'configPath' => false,
                    'config' => [
                        'settings' => Json::decode($superTableRedactorField['settings']),
                    ],
                ];
            }
        }

        // Go ahead and migrate them
        foreach ($fieldsToMigrate as $fieldUid => $field)
        {
            $fieldConfigPath = $field['configPath'];
            $fieldConfig = $field['config'];
            if (isset($fieldConfig['settings']) && is_array($fieldConfig['settings'])) {
                $fieldSettings = $fieldConfig['settings'];
                $cleanupHtml = ArrayHelper::remove($fieldSettings, 'cleanupHtml', false);
                $fieldSettings['removeInlineStyles'] = $cleanupHtml;
                $fieldSettings['removeEmptyTags'] = $cleanupHtml;
                $fieldSettings['removeNbsp'] = $cleanupHtml;
                $this->update('{{%fields}}', [
                    'settings' => Json::encode($fieldSettings),
                ], ['uid' => $fieldUid]);
                if ($fieldConfigPath) {
                    $fieldConfig['settings'] = $fieldSettings;
                    $projectConfig->set($fieldConfigPath, $fieldConfig);
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
