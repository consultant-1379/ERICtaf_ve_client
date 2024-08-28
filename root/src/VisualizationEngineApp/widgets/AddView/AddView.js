/** addView sends the view selected to be created
    @class addView
*/
define([
    'jscore/core',
    './AddViewView',
    'widgets/Dialog',
    'app/widgets/SettingsDialog/ViewSelect/ViewSelect'
], function (core, View, Dialog, ViewSelect) {
    'use strict';

    return core.Widget.extend({
        View: View,

        init: function () {
            this.viewSelect = new ViewSelect({pluginViews:this.options.pluginViews});

            this.dialog = new Dialog({
                header: 'Select view',
                buttons: [
                    {
                        caption: 'OK',
                        color: 'green',
                        action: function () {
                            this.trigger('createNewView', this.viewSelect.getValue());
                            this.dialog.hide();
                        }.bind(this)
                    },
                    {
                        caption: 'Cancel',
                        color: 'blue',
                        action: function () {
                            this.dialog.hide();
                        }.bind(this)
                    }
                ]
            });

            this.dialog.setContent(this.viewSelect);
        },

        onViewReady: function () {
            var el = this.getElement();

            el.addEventHandler('click', function () {
                this.dialog.show();
            }.bind(this));
        },
        /** addView - adds the view to the selectView
            @name addView#addView
            @param {Object} object with values for adding a view {title,Description,Thumbnail}
        */   
        addView : function(view) {
              this.viewSelect.addView(view);
        }
    });
});