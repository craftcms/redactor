<?php
/**
 * @link https://craftcms.com/
 * @copyright Copyright (c) Pixel & Tonic, Inc.
 * @license MIT
 */

namespace craft\redactor\events;

use craft\redactor\Field;
use HTMLPurifier_Config;
use yii\base\Event;

/**
 * ModifyRedactorConfigEvent class.
 *
 * @author Pixel & Tonic, Inc. <support@pixelandtonic.com>
 * @since 2.7
 */
class ModifyRedactorConfigEvent extends Event
{
    // Properties
    // =========================================================================

    /**
     * @var array $config The loaded redactor config
     */
    public $config;

    /**
     * @var Field $field The redactor field being configured
     */
    public $field;
}
