<?php

namespace craft\redactor\migrations;

use craft\db\Migration;
use craft\redactor\Field;
use craft\redactor\Plugin;

/**
 * Install migration.
 */
class Install extends Migration
{
    /**
     * @inheritdoc
     */
    public function safeUp()
    {
        // Auto-convert old Rich Text fields
        $this->update('{{%fields}}', [
            'type' => Field::class
        ], [
            'type' => 'craft\\fields\\RichText'
        ], [], false);

        // Update any Redactor configs
        Plugin::getInstance()->getMigrator()->migrateUp('m180430_204710_remove_old_plugins');
    }

    /**
     * @inheritdoc
     */
    public function safeDown()
    {
        // Place uninstallation code here...
    }
}
