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
            this.$target.on('scroll.resizer', this.rebuild.bind(this));
        } else {
            $R.dom('#content-container').on('scroll.resizer', this.rebuild.bind(this));
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

toolbarFixedClass.prototype._doFixed = function() {
    var $editor = this.editor.getElement();
    var $container = this.container.getElement();
    var $toolbar = this.toolbar.getElement();
    var $wrapper = this.toolbar.getWrapper();
    var $targets = $container.parents().filter(function(node)
    {
        return (getComputedStyle(node, null).display === 'none') ? node : false;
    });

    // has hidden parent
    if ($targets.length !== 0) return;

    var isHeight = ($editor.height() < 100);
    var isEmpty = this.editor.isEmpty();

    if (isHeight || isEmpty || this.editor.isSourceMode()) return;

    // Fix figuring out when to pin the toolbar and when not.
    var toolbarHeight = $toolbar.height();
    var toleranceEnd = 100;
    var containerOffset = $container.offset();
    var boxOffset = containerOffset.top;
    var scrollOffset = this.$fixedTarget.scrollTop();
    var top = (!this.toolbar.isTarget()) ? 0 : this.$fixedTarget.offset().top - this.$win.scrollTop();
    var relativeTopPoint = boxOffset - toleranceEnd;

    if (relativeTopPoint < 0 && Math.abs(relativeTopPoint) < $container.height() - toleranceEnd)
    {
        var position = (this.detector.isDesktop()) ? 'fixed' : 'absolute';
        top = (this.detector.isDesktop()) ? top : (scrollOffset - boxOffset + this.opts.toolbarFixedTopOffset);

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
            top: (top + this.opts.toolbarFixedTopOffset) + 'px',
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