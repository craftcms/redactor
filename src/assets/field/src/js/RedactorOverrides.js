// Adjust the positioning of image resizer
// =============================================================================

var imageResizeClass = $R['classes']['image.resize'];

imageResizeClass.prototype.init = function (app) {
  this.app = app;
  this.$doc = app.$doc;
  this.$win = app.$win;
  this.$body = app.$body;
  this.editor = app.editor;
  this.toolbar = app.toolbar;
  this.inspector = app.inspector;

  // init
  this.$target = this.toolbar.isTarget()
    ? this.toolbar.getTargetElement()
    : this.$body;

  // Change the target according to LP
  var attachLivePreview = () => {
    this.hide();
    var $editor = $('.lp-editor');
    if ($editor.length) {
      this.$target = $R.dom($editor[0]);
    }
  };

  var detachLivePreview = () => {
    this.hide();
    this.$target = this.toolbar.isTarget()
      ? this.toolbar.getTargetElement()
      : this.$body;
  };

  attachPreviewListeners(attachLivePreview, detachLivePreview);

  this._init();
};
// Position the image resizer correctly
imageResizeClass.prototype._setResizerPosition = function () {
  if (this.$resizer) {
    var isTarget = this.toolbar.isTarget();
    var targetOffset = this.$target.offset();
    var offsetFix = 7;
    var topOffset = isTarget
      ? offsetFix - targetOffset.top + this.$target.scrollTop()
      : offsetFix;
    var leftOffset = isTarget ? offsetFix - targetOffset.left : offsetFix;
    var pos = this.$resizableImage.offset();
    var width = this.$resizableImage.width();
    var height = this.$resizableImage.height();
    var resizerWidth = this.$resizer.width();
    var resizerHeight = this.$resizer.height();

    this.$resizer.css({
      top: Math.round(pos.top + height - resizerHeight + topOffset) + 'px',
      left: Math.round(pos.left + width - resizerWidth + leftOffset) + 'px',
    });
  }
};

// When scrolling, reposition the resizer
imageResizeClass.prototype._build = function (e) {
  this.$target.find('#redactor-image-resizer').remove();

  var data = this.inspector.parse(e.target);
  var $editor = this.editor.getElement();

  if (data.isComponentType('image')) {
    this.$resizableBox = $editor;
    this.$resizableImage = $R.dom(data.getImageElement());

    this.$resizer = $R.dom('<span>');
    this.$resizer.attr('id', 'redactor-image-resizer');
    this.$resizer.css({'z-index': 100});

    this.$target.append(this.$resizer);

    this._setResizerPosition();
    this.$resizer.on('mousedown touchstart', this._set.bind(this));
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

toolbarFixedClass.prototype._init = function () {
  this.$fixedTarget = this.toolbar.isTarget()
    ? this.toolbar.getTargetElement()
    : this.$win;
  this._doFixed();

  if (this.toolbar.isTarget()) {
    this.$win.on(
      'scroll.redactor-toolbar-' + this.uuid,
      this._doFixed.bind(this)
    );
    this.$win.on(
      'resize.redactor-toolbar-' + this.uuid,
      this._doFixed.bind(this)
    );
  }

  this.$fixedTarget.on(
    'scroll.redactor-toolbar-' + this.uuid,
    this._doFixed.bind(this)
  );
  this.$fixedTarget.on(
    'resize.redactor-toolbar-' + this.uuid,
    this._doFixed.bind(this)
  );

  var attachLivePreview = () => {
    var $editor = $('.lp-editor');
    if ($editor.length) {
      this.livePreview = true;
      this.$previousFixedTarget = this.$fixedTarget;
      $editor = $R.dom($editor[0]);
      $editor.on(
        'scroll.redactor-toolbar-' + this.uuid,
        this._doFixed.bind(this)
      );
      this.$fixedTarget = $editor;
    }
  };

  var detachLivePreview = () => {
    this.livePreview = false;
    this.$fixedTarget = this.$previousFixedTarget;
    this.$previousFixedTarget = null;
  };

  attachPreviewListeners(attachLivePreview, detachLivePreview);
};

toolbarFixedClass.prototype._doFixed = function () {
  var $editor = this.editor.getElement();
  var $container = this.container.getElement();
  var $toolbar = this.toolbar.getElement();
  var $wrapper = this.toolbar.getWrapper();

  if (this.editor.isSourceMode()) {
    return;
  }

  var $targets = $container.parents().filter(function (node) {
    return getComputedStyle(node, null).display === 'none' ? node : false;
  });

  // has hidden parent
  if ($targets.length !== 0) return;

  var isHeight = $editor.height() < 100;
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
    var headerBuffer = $('.lp-editor-container header.flex').length
      ? $('.lp-editor-container header.flex').outerHeight()
      : 0;
    var distanceFromScreenTop = $editor.offset().top - headerBuffer;
    var bottomFromScreenTop =
      distanceFromScreenTop + $editor.height() - toolbarHeight;
  } else {
    var headerBuffer = $('body.fixed-header #header').length
      ? $('body.fixed-header #header').outerHeight()
      : 0;
    var distanceFromScreenTop =
      $editor.offset().top - this.$win.scrollTop() - headerBuffer;
    var bottomFromScreenTop =
      distanceFromScreenTop + $editor.height() - toolbarHeight;
  }

  pinIt = distanceFromScreenTop + tolerance < 0 && bottomFromScreenTop > 0;
  pinDistance = $editor.scrollTop() + headerBuffer;

  // Figure out when to pin the toolbar

  if (pinIt) {
    var position = this.detector.isDesktop() ? 'fixed' : 'absolute';
    pinDistance = this.detector.isDesktop()
      ? pinDistance
      : scrollOffset - boxOffset + this.opts.toolbarFixedTopOffset;

    if (this.detector.isMobile()) {
      if (this.fixedScrollTimeout) {
        clearTimeout(this.fixedScrollTimeout);
      }

      $toolbar.hide();
      this.fixedScrollTimeout = setTimeout(function () {
        $toolbar.show();
      }, 250);
    }

    $wrapper.height(toolbarHeight);
    $toolbar.addClass('redactor-toolbar-fixed');
    $toolbar.css({
      position: position,
      top: pinDistance + this.opts.toolbarFixedTopOffset + 'px',
      width: $container.width() + 'px',
    });

    var dropdown = this.toolbar.getDropdown();

    if (dropdown) {
      dropdown.updatePosition();
    }

    this.app.broadcast('toolbar.fixed');
  } else {
    this.reset();
    this.app.broadcast('toolbar.unfixed');
  }
};

var inputCleanerService = $R['services']['cleaner'];

inputCleanerService.prototype.input = function (html, paragraphize, started) {
  // fix &curren; entity in the links
  html = html.replace(/¤t/gi, '&current');

  // store
  var storedComments = [];
  html = this.storeComments(html, storedComments);

  // pre/code
  html = this.encodeCode(html);

  // sanitize
  var $wrapper = this.utils.buildWrapper(html);
  $wrapper
    .find('a, b, i, strong, em, img, svg, details, audio')
    .removeAttr('onload onerror ontoggle onwheel onmouseover oncopy');
  $wrapper.find('a, iframe, embed').each(function (node) {
    var $node = $R.dom(node);
    var href = $node.attr('href');
    var src = $node.attr('src');
    if (href && href.trim().search(/^data|javascript:/i) !== -1)
      $node.attr('href', '');
    if (src && src.trim().search(/^data|javascript:/i) !== -1)
      $node.attr('src', '');
  });

  var imageattrs = [
    'alt',
    'title',
    'src',
    'class',
    'width',
    'height',
    'srcset',
    'usemap',
  ];
  $wrapper.find('img').each(
    function (node) {
      if (node.attributes.length > 0) {
        var attrs = node.attributes;
        for (var i = attrs.length - 1; i >= 0; i--) {
          var removeAttrs =
            attrs[i].name.search(/^data-/) === -1 &&
            imageattrs.indexOf(attrs[i].name) === -1;
          var removeDataSrc =
            attrs[i].name === 'src' &&
            attrs[i].value.search(/^data|javascript:/i) !== -1;
          if (this.opts.imageSrcData) removeDataSrc = false;

          if (removeAttrs || removeDataSrc) {
            node.removeAttribute(attrs[i].name);
          }
        }
      }
    }.bind(this)
  );

  // get wrapper html
  html = this.utils.getWrapperHtml($wrapper);

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
  html = this.opts.removeScript
    ? this._removeScriptTag(html)
    : this._replaceScriptTag(html);
  //html = (this.opts.removeScript) ? this._removeScriptTag(html) : html;
  html = this.opts.removeComments ? this.removeComments(html) : html;
  html = this._isSpacedEmpty(html) ? this.opts.emptyHtml : html;

  // restore components
  html = this.restoreComponents(html);

  // clear wrapped components
  html = this._cleanWrapped(html);

  // restore comments
  html = this.restoreComments(html, storedComments);

  // paragraphize
  html = paragraphize ? this.paragraphize(html) : html;

  return html;
};

inputCleanerService.prototype.output = function (html, removeMarkers) {
  html = this.removeInvisibleSpaces(html);

  if (this.opts.breakline) {
    html = html.replace(
      /<\/(span|strong|b|i|em)><br\s?\/?><\/div>/gi,
      '</$1></div>'
    );
    html = html.replace(
      /<br\s?\/?><\/(span|strong|b|i|em)><\/div>/gi,
      '</$1></div>'
    );
  }

  html = html.replace(/&#36;/g, '$');

  // empty
  if (this._isSpacedEmpty(html)) return '';
  if (this._isParagraphEmpty(html)) return '';

  html = this.removeServiceTagsAndAttrs(html, removeMarkers);

  // store components
  html = this.storeComponents(html);

  html = this.removeSpanWithoutAttributes(html);
  html = this.removeFirstBlockBreaklineInHtml(html);

  html = this.opts.removeScript ? html : this._unreplaceScriptTag(html);
  html = this.opts.preClass ? this._setPreClass(html) : html;
  html = this.opts.linkNofollow ? this._setLinkNofollow(html) : html;
  html = this.opts.removeNewLines ? this.cleanNewLines(html) : html;

  // restore components
  html = this.restoreComponents(html);

  // convert to figure
  var converter = $R.create('cleaner.figure', this.app);
  html = converter.unconvert(html, this.unconvertRules);

  // final clean up
  html = this.removeEmptyAttributes(html, ['style', 'class', 'rel', 'title']);
  html = this.cleanSpacesInPre(html);
  html = this.tidy(html);

  // converting entity
  html = html.replace(/&amp;/g, '&');

  // breakline tidy
  if (this.opts.breakline) {
    html = html.replace(/<br\s?\/?>/gi, '<br>\n');
    html = html.replace(/<br\s?\/?>\n+/gi, '<br>\n');
  }

  // check whitespaces
  html = html.replace(/\n/g, '') === '' ? '' : html;

  return html;
};

var toolbarDropdownClass = $R['classes']['toolbar.dropdown'];

toolbarDropdownClass.prototype.updatePosition = function () {
  var isFixed = this.toolbar.isFixed();
  var isTarget = this.toolbar.isTarget();

  var btnHeight = this.$btn.height();
  var btnWidth = this.$btn.width();

  var pos = this.$btn.offset();
  var position = 'absolute';
  var topOffset = 2;

  if (isFixed) {
    pos.top = isTarget ? this.$btn.offset().top : this.$btn.position().top;
    position = 'fixed';
    topOffset = topOffset + this.opts.toolbarFixedTopOffset;
  }

  var leftOffset = 0;
  var left = pos.left + leftOffset;
  var width = parseFloat(this.css('width'));
  var winWidth = this.$win.width();
  var leftFix = winWidth < left + width ? width - btnWidth : 0;
  var leftPos = left - leftFix;
  var top = pos.top + btnHeight + topOffset;

  if (isFixed) {
    var toolbarElement = this.toolbar.getElement();
    top = toolbarElement.position().top + toolbarElement.height();
  }

  leftPos = leftPos < 0 ? 4 : leftPos;

  this.css({
    maxHeight: '',
    position: position,
    top: top + 'px',
    left: leftPos + 'px',
  });

  // height adaptive
  var heightTolerance = 10;
  var winHeight = this.$win.height();
  var scrollTop = this.$doc.scrollTop();
  var cropHeight = winHeight - (top - scrollTop) - heightTolerance;

  this.css('max-height', cropHeight + 'px');
};

var contextBarClass = $R['modules']['contextbar'];

contextBarClass.prototype.init = function (app) {
  this.app = app;
  this.opts = app.opts;
  this.uuid = app.uuid;
  this.$win = app.$win;
  this.$doc = app.$doc;
  this.$body = app.$body;
  this.editor = app.editor;
  this.toolbar = app.toolbar;
  this.detector = app.detector;
  this.livePreview = false;

  // local
  this.$target = this.toolbar.isTarget()
    ? this.toolbar.getTargetElement()
    : this.$body;

  // Change the target according to LP
  var attachLivePreview = () => {
    var $target = $('.lp-editor');
    if ($target.length) {
      $(this.$contextbar.get()).appendTo($target);
      this.livePreview = true;
    }
  };

  var detachLivePreview = () => {
    var $target = this.toolbar.getTargetElement();
    if ($target.length) {
      $(this.$contextbar.get(0)).appendTo($target.get(0));
    }
    this.livePreview = false;
  };

  attachPreviewListeners(attachLivePreview, detachLivePreview);
};

contextBarClass.prototype.close = function (e) {
  if (
    !this.$contextbar ||
    !this.$contextbar.nodes.length ||
    this.$contextbar.nodes[0].style.display === 'none'
  ) {
    return;
  }

  if (e) {
    var $target = $R.dom(e.target);
    if (this.$el && $target.closest(this.$el).length !== 0) {
      return;
    }
  }

  this.$contextbar.hide();
  this.$contextbar.removeClass('open');
  this.$doc.off('.redactor.context');
  this.app.broadcast('hardsync');
};

var toolbarService = $R['services']['toolbar'];

toolbarService.prototype.addButton = function (
  name,
  btnObj,
  position,
  $el,
  start
) {
  position = position || 'end';

  var $button = $R.create('toolbar.button', this.app, name, btnObj);
  if (btnObj.observe) {
    this.opts.activeButtonsObservers[name] = {
      observe: btnObj.observe,
      button: $button,
    };
  }

  if (this.is()) {
    if (position === 'first') this.$toolbar.prepend($button);
    else if (position === 'after') $el.after($button);
    else if (position === 'before') $el.before($button);
    else {
      var index = this.opts.buttons.indexOf(name);

      if (start !== true && index !== -1) {
        if (index === 0) {
          this.$toolbar.prepend($button);
        } else {
          var $btns = this._findButtons();

          // If this was an added button, it might not exist in the options with how things are, so make sure to stay inside bounds
          var $btn = $btns.eq(Math.min(index, $btns.length) - 1);
          $btn.after($button);
        }
      } else {
        this.$toolbar.append($button);
      }
    }
  }

  return $button;
};

function attachPreviewListeners(openCallback, closeCallback) {
  Garnish.on(Craft.Preview, 'open', openCallback);
  Garnish.on(Craft.LivePreview, 'enter', openCallback);

  Garnish.on(Craft.Preview, 'close', closeCallback);
  Garnish.on(Craft.LivePreview, 'exit', closeCallback);
}

window.imageResizeClass = imageResizeClass;
window.toolbarFixedClass = toolbarFixedClass;
window.inputCleanerService = inputCleanerService;
window.toolbarDropdownClass = toolbarDropdownClass;
window.contextBarClass = contextBarClass;
window.toolbarDropdownClass = toolbarDropdownClass;
window.toolbarService = toolbarService;
