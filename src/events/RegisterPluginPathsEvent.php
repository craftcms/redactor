<?php
/**
 * @link https://craftcms.com/
 * @copyright Copyright (c) Pixel & Tonic, Inc.
 * @license MIT
 */

namespace craft\redactor\events;

use yii\base\Event;

/**
 * RegisterPluginPathsEvent class.
 *
 * @author Pixel & Tonic, Inc. <support@pixelandtonic.com>
 * @since 3.0
 */
class RegisterPluginPathsEvent extends Event
{
    /**
     * @var string[] The registered Redactor plugin paths
     */
    public array $paths = [];
}
