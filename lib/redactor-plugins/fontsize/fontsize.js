(function($R)
{
    $R.add('plugin', 'fontSize', {
        translations: {
            en: {
                "size": "Size",
                "remove-size":  "Remove Font Size"
            }
        },
        init: function(app)
        {
            this.app = app;
            this.opts = app.opts;
            this.lang = app.lang;
            this.inline = app.inline;
            this.toolbar = app.toolbar;

            // local
    		this.sizes = (this.opts.fontSizes) ? this.opts.fontSizes : [10, 11, 12, 14, 16, 18, 20, 24, 28, 30];
        },
        // public
        start: function()
        {
            var dropdown = {};
			for (var i = 0; i < this.sizes.length; i++)
			{
    			var size = this.sizes[i];
				dropdown[i] = {
    				title: size + 'px',
    				api: 'plugin.fontSize.set',
    				args: size
                };
			}

			dropdown.remove = {
    			title: this.lang.get('remove-size'),
    			api: 'plugin.fontSize.remove'
            };

            var $button = this.toolbar.addButton('fontSize', { title: this.lang.get('size') });
            $button.setIcon('<i class="re-icon-fontsize"></i>');
			$button.setDropdown(dropdown);
        },
        set: function(size)
		{
    		var args = {
        	    tag: 'span',
        	    style: { 'font-size': size + 'px' },
        	    type: 'toggle'
    		};

			this.inline.format(args);
		},
		remove: function()
		{
			this.inline.remove({ style: 'font-size' });
		}
    });
})(Redactor);
