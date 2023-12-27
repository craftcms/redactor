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
    public function safeUp(): bool
    {
        // Auto-convert old Rich Text fields
        $this->update('{{%fields}}', [
            'type' => Field::class,
        ], [
            'type' => 'craft\\fields\\RichText',
        ], [], false);

        return true;
    }

    /**
     * @inheritdoc
     */
    public function safeDown(): bool
    {
        return true;
    }
}
