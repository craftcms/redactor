<?php
/**
 * @link https://craftcms.com/
 * @copyright Copyright (c) Pixel & Tonic, Inc.
 * @license MIT
 */

namespace craft\redactor\events;

use yii\base\Event;

/**
 * RegisterLinkOptionsEvent class.
 *
 * @author Pixel & Tonic, Inc. <support@pixelandtonic.com>
 * @since 3.0
 */
class RegisterLinkOptionsEvent extends Event
{
    /**
     * @var array The registered link options
     */
    public array $linkOptions = [];
}
