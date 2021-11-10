<?php
/**
 * @link https://craftcms.com/
 * @copyright Copyright (c) Pixel & Tonic, Inc.
 * @license MIT
 */

namespace craft\redactor\events;

use craft\redactor\Field;
use yii\base\Event;

/**
 * ModifyRedactorConfigEvent class.
 *
 * @author Pixel & Tonic, Inc. <support@pixelandtonic.com>
 * @since 2.7
 */
class ModifyRedactorConfigEvent extends Event
{
    /**
     * @var array $config The loaded redactor config
     */
    public array $config;

    /**
     * @var Field $field The redactor field being configured
     */
    public Field $field;
}
