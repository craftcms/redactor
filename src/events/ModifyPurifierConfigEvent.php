<?php
/**
 * @link https://craftcms.com/
 * @copyright Copyright (c) Pixel & Tonic, Inc.
 * @license MIT
 */

namespace craft\redactor\events;

/** @phpstan-ignore-next-line */
if (false) {
    /**
     * @deprecated in 2.10.0. Use `craft\htmlfield\events\ModifyPurifierConfigEvent` instead.
     */
    class ModifyPurifierConfigEvent
    {
    }
}

class_exists(\craft\htmlfield\events\ModifyPurifierConfigEvent::class);
