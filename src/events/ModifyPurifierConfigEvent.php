<?php
/**
 * @link https://craftcms.com/
 * @copyright Copyright (c) Pixel & Tonic, Inc.
 * @license MIT
 */

namespace craft\redactor\events;

use HTMLPurifier_Config;
use yii\base\Event;

/**
 * ModifyPurifierConfig class.
 *
 * @author Pixel & Tonic, Inc. <support@pixelandtonic.com>
 * @since 2.6
 */
class ModifyPurifierConfigEvent extends Event
{
    /**
     * @var HTMLPurifier_Config $config the HTML Purifier config
     */
    public HTMLPurifier_Config $config;
}
