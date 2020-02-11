// Adjust the positioning of image resizer
// =============================================================================

var imageResizeClass = $R['classes']['image.resize'];

// Position the image resizer correctly
imageResizeClass.prototype._setResizerPosition = function () {
    if (this.$resizer)
    {
        var isTarget = this.toolbar.isTarget();
        var targetOffset = this.$target.offset();
        var offsetFix = 7;
        var topOffset = offsetFix;
        var leftOffset = offsetFix;
        var pos = this.$resizableImage.offset();
        var width = this.$resizableImage.width();
        var height = this.$resizableImage.height();
        var resizerWidth =  this.$resizer.width();
        var resizerHeight =  this.$resizer.height();

        this.$resizer.css({ top: (pos.top + height - resizerHeight + topOffset) + 'px', left: (pos.left + width - resizerWidth + leftOffset) + 'px' });
    }
};

// When scrolling, reposition the resizer
imageResizeClass.prototype._build = function (e) {
    this.$target.find('#redactor-image-resizer').remove();

    var data = this.inspector.parse(e.target);
    var $editor = this.editor.getElement();

    if (data.isComponentType('image'))
    {
        this.$resizableBox = $editor;
        this.$resizableImage = $R.dom(data.getImageElement());

        this.$resizer = $R.dom('<span>');
        this.$resizer.attr('id', 'redactor-image-resizer');
        this.$resizer.css({'z-index': 100});

        this.$target.append(this.$resizer);

        this._setResizerPosition();
        this.$resizer.on('mousedown touchstart', this._set.bind(this));

        if (this.toolbar.isTarget()) {
            // this.$target.on('scroll.resizer', this.rebuild.bind(this));
        } else {
            // $R.dom('#content-container').on('scroll.resizer', this.rebuild.bind(this));
        }
    }
};
// Stop listening to scroll
imageResizeClass.prototype.hide = function () {
    this.$target.find('#redactor-image-resizer').remove();
    if (this.toolbar.isTarget()) {
        this.$target.off('scroll.resizer', this.rebuild.bind(this));
    } else {
        $R.dom('#content-container').off('scroll.resizer', this.rebuild.bind(this));
    }
};

// Adjust the positioning of fixed toolbar
// =============================================================================

var toolbarFixedClass = $R['classes']['toolbar.fixed'];

toolbarFixedClass.prototype.livePreview = false;
toolbarFixedClass.prototype.$previousFixedTarget = false;

toolbarFixedClass.prototype._init = function() {
    this.$fixedTarget = (this.toolbar.isTarget()) ? this.toolbar.getTargetElement() : this.$win;
    this._doFixed();

    if (this.toolbar.isTarget())
    {
        this.$win.on('scroll.redactor-toolbar-' + this.uuid, this._doFixed.bind(this));
        this.$win.on('resize.redactor-toolbar-' + this.uuid, this._doFixed.bind(this));
    }

    this.$fixedTarget.on('scroll.redactor-toolbar-' + this.uuid, this._doFixed.bind(this));
    this.$fixedTarget.on('resize.redactor-toolbar-' + this.uuid, this._doFixed.bind(this));

    var attachLivePreview = () => {
        var $editor = $('.lp-editor');
        if ($editor.length) {
            this.livePreview = true;
            this.$previousFixedTarget = this.$fixedTarget;
            $editor = $R.dom($editor[0]);
            $editor.on('scroll.redactor-toolbar-' + this.uuid, this._doFixed.bind(this));
            this.$fixedTarget = $editor;
        }
    };

    var detachLivePreview = () => {
        this.livePreview = false;
        this.$fixedTarget = this.$previousFixedTarget;
        this.$previousFixedTarget = null;
    }

    Garnish.on(Craft.Preview, 'open', attachLivePreview);
    Garnish.on(Craft.LivePreview, 'enter', attachLivePreview);

    Garnish.on(Craft.Preview, 'close', detachLivePreview);
    Garnish.on(Craft.LivePreview, 'exit', detachLivePreview);
};

toolbarFixedClass.prototype._doFixed = function() {
    var $editor = this.editor.getElement();
    var $container = this.container.getElement();
    var $toolbar = this.toolbar.getElement();
    var $wrapper = this.toolbar.getWrapper();

    if (this.editor.isSourceMode())
    {
        return;
    }

    var $targets = $container.parents().filter(function(node)
    {
        return (getComputedStyle(node, null).display === 'none') ? node : false;
    });

    // has hidden parent
    if ($targets.length !== 0) return;

    var isHeight = ($editor.height() < 100);
    var isEmpty = this.editor.isEmpty();

    if (isHeight || isEmpty) {
        this.reset();
        return;
    }

    var toolbarHeight = $toolbar.height();

    var pinIt = false;
    var pinDistance = 0;
    var tolerance = 20;

    if (this.livePreview) {
        var headerBuffer = $('.lp-editor-container header.flex').length ? $('.lp-editor-container header.flex').height() : 0;
        var distanceFromScreenTop = $editor.offset().top - headerBuffer;//$('.lp-editor').scrollTop() + headerBuffer + ($editor.parent().offset().top - $editor.offset().top);
        var bottomFromScreenTop = distanceFromScreenTop + $editor.height() - toolbarHeight;
    } else {
        var headerBuffer = $('body.fixed-header #header').length ? $('body.fixed-header #header').height() : 0;
        var distanceFromScreenTop = $editor.offset().top - this.$win.scrollTop() - headerBuffer;
        var bottomFromScreenTop = distanceFromScreenTop + $editor.height() - toolbarHeight;
    }

    pinIt = distanceFromScreenTop  + tolerance < 0 && bottomFromScreenTop > 0;
    pinDistance = $editor.scrollTop() + headerBuffer + tolerance;

    // Figure out when to pin the toolbar

    if (pinIt)
    {
        var position = (this.detector.isDesktop()) ? 'fixed' : 'absolute';
        pinDistance = (this.detector.isDesktop()) ? pinDistance : (scrollOffset - boxOffset + this.opts.toolbarFixedTopOffset);

        if (this.detector.isMobile())
        {
            if (this.fixedScrollTimeout)
            {
                clearTimeout(this.fixedScrollTimeout);
            }

            $toolbar.hide();
            this.fixedScrollTimeout = setTimeout(function()
            {
                $toolbar.show();
            }, 250);
        }

        $wrapper.height(toolbarHeight);
        $toolbar.addClass('redactor-toolbar-fixed');
        $toolbar.css({
            position: position,
            top: (pinDistance + this.opts.toolbarFixedTopOffset) + 'px',
            width: $container.width() + 'px'
        });

        var dropdown = this.toolbar.getDropdown();
        if (dropdown) dropdown.updatePosition();

        this.app.broadcast('toolbar.fixed');
    }
    else
    {
        this.reset();
        this.app.broadcast('toolbar.unfixed');
    }
};

var inputCleanerService = $R['services']['cleaner'];

inputCleanerService.prototype.input = function(html, paragraphize, started)
{
    // pre/code
    html = this.encodePreCode(html);

    // converting entity
    html = html.replace(/\$/g, '&#36;');
    html = html.replace(/&amp;/g, '&');

    // convert to figure
    var converter = $R.create('cleaner.figure', this.app);
    html = converter.convert(html, this.convertRules);

    // store components
    html = this.storeComponents(html);

    // clean
    html = this.replaceTags(html, this.opts.replaceTags);
    html = this._setSpanAttr(html);
    html = this._setStyleCache(html);
    html = this.removeTags(html, this.deniedTags);
    html = (this.opts.removeScript) ? this._removeScriptTag(html) : this._replaceScriptTag(html);
    //html = (this.opts.removeScript) ? this._removeScriptTag(html) : html;
    html = (this.opts.removeComments) ? this.removeComments(html) : html;
    html = (this._isSpacedEmpty(html)) ? this.opts.emptyHtml : html;

    // restore components
    html = this.restoreComponents(html);

    // clear wrapped components
    html = this._cleanWrapped(html);

    // remove image attributes
    var $wrapper = this.utils.buildWrapper(html);
    var imageattrs = ['alt', 'title', 'src', 'class', 'width', 'height', 'srcset', 'style'];
    $wrapper.find('img').each(function(node) {
        if (node.attributes.length > 0) {
            var attrs = node.attributes;
            for (var i = attrs.length - 1; i >= 0; i--) {
                if (attrs[i].name.search(/^data\-/) === -1 && imageattrs.indexOf(attrs[i].name) === -1) {
                    node.removeAttribute(attrs[i].name);
                }
            }
        }
    });

    // get wrapper html
    html = this.utils.getWrapperHtml($wrapper);

    // paragraphize
    html = (paragraphize) ? this.paragraphize(html) : html;

    return html;
}
