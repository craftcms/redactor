<?php
/**
 * @link https://craftcms.com/
 * @copyright Copyright (c) Pixel & Tonic, Inc.
 * @license MIT
 */

namespace craft\redactor;

use Craft;
use Twig\Markup;

/**
 * Stores the data for Redactor fields.
 *
 * @author Pixel & Tonic, Inc. <support@pixelandtonic.com>
 * @since 3.0
 */
class FieldData extends Markup
{
    /**
     * @var Markup[]
     */
    private array $_pages;

    /**
     * @var string
     */
    private string $_rawContent;

    /**
     * Constructor
     *
     * @param string $content
     * @param int|null $siteId
     */
    public function __construct(string $content, int $siteId = null)
    {
        // Save the raw content in case we need it later
        $this->_rawContent = $content;

        // Parse the ref tags
        $content = Craft::$app->getElements()->parseRefs($content, $siteId);

        parent::__construct($content, Craft::$app->charset);
    }

    /**
     * Returns the raw content, with reference tags still in-tact.
     *
     * @return string
     */
    public function getRawContent(): string
    {
        return $this->_rawContent;
    }

    /**
     * Returns the parsed content, with reference tags returned as HTML links.
     *
     * @return string
     */
    public function getParsedContent(): string
    {
        return (string)$this;
    }

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
        $pages = explode('<!--pagebreak-->', (string)$this);

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
