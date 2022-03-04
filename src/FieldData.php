<?php
/**
 * @link https://craftcms.com/
 * @copyright Copyright (c) Pixel & Tonic, Inc.
 * @license MIT
 */

namespace craft\redactor;

use Craft;
use craft\htmlfield\HtmlFieldData;
use Twig\Markup;

/**
 * Stores the data for Redactor fields.
 *
 * @author Pixel & Tonic, Inc. <support@pixelandtonic.com>
 * @since 3.0
 */
class FieldData extends HtmlFieldData
{
    /**
     * @var Markup[]|null
     */
    private ?array $_pages;

    /**
     * Returns an array of the individual page contents.
     *
     * @return Markup[]
     */
    public function getPages(): array
    {
        if (isset($this->_pages)) {
            return $this->_pages;
        }

        $this->_pages = [];
        $pages = explode('<!--pagebreak-->', $this->getParsedContent());

        foreach ($pages as $page) {
            $this->_pages[] = new Markup($page, Craft::$app->charset);
        }

        return $this->_pages;
    }

    /**
     * Returns a specific page.
     *
     * @param int $pageNumber
     * @return Markup|null
     */
    public function getPage(int $pageNumber): ?Markup
    {
        $pages = $this->getPages();

        if (isset($pages[$pageNumber - 1])) {
            return $pages[$pageNumber - 1];
        }

        return null;
    }

    /**
     * Returns the total number of pages.
     *
     * @return int
     */
    public function getTotalPages(): int
    {
        return count($this->getPages());
    }
}
