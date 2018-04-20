(function($R)
{
    $R.add('plugin', 'limiter', {
        init: function(app)
        {
            this.app = app;
            this.utils = app.utils;
            this.opts = app.opts;
            this.editor = app.editor;
            this.keycodes = app.keycodes;
        },
        // public
        start: function()
        {
			if (!this.opts.limiter) return;

            this._count();

            var $editor = this.editor.getElement();
            $editor.on('keydown.redactor-plugin-limiter', this._limit.bind(this));
		},
		stop: function()
		{
            var $editor = this.editor.getElement();
            $editor.off('.redactor-plugin-limiter');

            this.opts.input = true;
		},

		// private
		_limit: function(e)
		{
    		var key = e.which;
			var ctrl = e.ctrlKey || e.metaKey;
			var arrows = [37, 38, 39, 40];

			if (key === this.keycodes.BACKSPACE
			   	|| key === this.keycodes.DELETE
			    || key === this.keycodes.ESC
			    || key === this.keycodes.SHIFT
			    || (ctrl && key === 65)
			    || (ctrl && key === 88)
			    || (ctrl && key === 82)
			    || (ctrl && key === 116)
			    || (arrows.indexOf(key) !== -1)
			)
			{
				return;
			}

            this._count(e);
		},
		_count: function(e)
		{
            var $editor = this.editor.getElement();
			var text = $editor.text();
			text = this.utils.removeInvisibleChars(text);

			var count = text.length;
			if (count >= this.opts.limiter)
			{
                if (e) e.preventDefault();
                this.opts.input = false;
				return false;
			}
			else
			{
    			this.opts.input = true;
			}
		}
    });
})(Redactor);