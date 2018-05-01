(function($R) {
    $R.add('plugin', 'pagebreak', {
        translations: {
            en: {
                "insert-page-break": "Insert Page Break"
            }
        },
        init: function(app) {
            this.app = app;
            this.lang = app.lang;
            this.selection = app.selection;
            this.editor = app.editor;
        },
        start: function() {
            var $button = this.app.toolbar.addButton('pagebreak', {
                title: this.lang.get('insert-page-break'),
                api: 'plugin.pagebreak.insert'
            });
            $button.setIcon('<i class="re-icon-pagebreak"></i>');
        },
        insert: function() {
            var $pagebreakNode = $('<hr class="redactor_pagebreak" style="display:none" unselectable="on" contenteditable="false" />'),
                $currentBlock = $(this.selection.getBlock());

            // debugger;

            if ($currentBlock.length) {
                $pagebreakNode.insertAfter($currentBlock);
            }
            else {
                $pagebreakNode.appendTo(this.editor.getElement().nodes[0]);
            }

            var $p = $('<p><br/></p>').insertAfter($pagebreakNode);

            this.editor.focus();
            this.selection.setAll($p[0]);
        }
    });
})(Redactor);
