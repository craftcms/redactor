<?php

namespace craft\redactor\migrations;

use Craft;
use craft\db\Migration;
use craft\helpers\FileHelper;
use craft\helpers\Json;
use yii\base\ErrorException;

/**
 * m180430_204710_remove_old_plugins migration.
 */
class m180430_204710_remove_old_plugins extends Migration
{
    /**
     * @inheritdoc
     */
    public function safeUp(): bool
    {
        $path = Craft::$app->getPath()->getConfigPath() . DIRECTORY_SEPARATOR . 'redactor';

        if (is_dir($path)) {
            echo "    > updating Redactor configs in $path\n";

            $files = FileHelper::findFiles($path, [
                'only' => ['*.json'],
            ]);

            foreach ($files as $file) {
                $name = basename($file);
                echo "      > processing $name ... ";
                $config = Json::decodeIfJson(file_get_contents($file));
                if (!is_array($config)) {
                    echo "skipped (not valid JSON)\n";
                    continue;
                }
                $changed = false;
                if (isset($config['plugins'])) {
                    foreach (['source', 'codemirror'] as $plugin) {
                        if (($key = array_search($plugin, $config['plugins'])) !== false) {
                            array_splice($config['plugins'], $key, 1);
                            $changed = true;
                        }
                    }
                }
                if ($changed) {
                    try {
                        FileHelper::writeToFile($file, Json::encode($config, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
                        echo "done\n";
                    } catch (ErrorException $e) {
                        echo "failed ({$e->getMessage()})\n";
                    }
                } else {
                    echo "skipped (nothing to change)\n";
                }
            }
        }

        return true;
    }

    /**
     * @inheritdoc
     */
    public function safeDown(): bool
    {
        echo "m180430_204710_remove_old_plugins cannot be reverted.\n";
        return false;
    }
}
