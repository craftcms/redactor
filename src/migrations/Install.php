<?php

namespace craft\redactor\migrations;

use craft\db\Migration;
use craft\redactor\Field;

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
    }

    /**
     * @inheritdoc
     */
    public function safeDown()
    {
        // Place uninstallation code here...
    }
}
