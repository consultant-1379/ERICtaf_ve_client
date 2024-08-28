/** Configuration sends the view selected to be created
    @class Configuration
*/
define([
    'jscore/core',
    './ConfigurationView',
    'app/config/config',
    'app/widgets/AddView/AddView'
], function (core, View, config, AddView) {

    return core.Region.extend({

        View: View,

        onStart: function () {
            this.addView = new AddView();

            this.addView.addEventHandler('createNewView', function(view) {
                var regionSettings = {type: view, span: config.defaultViewSize};

                this.getEventBus().publish('createRegion', regionSettings);
            }, this);
            this.addView.attachTo(this.getElement());
        },
        /** setView - adds the view to addView
        @name Configuration#setView
        @param {Object} object with values for adding a view {title,Description,Thumbnail}
        */   
        setView : function(view) {
              this.addView.addView(view);
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