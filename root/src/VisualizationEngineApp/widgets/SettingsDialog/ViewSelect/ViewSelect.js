/** ViewSelect sets the gui that gives the description of each view and allows the user to select a view
    @class ViewSelect
*/
define([
    'jscore/core',
    'jscore/ext/utils/base/underscore',
    './ViewSelectView',
    'app/config/config',
    'widgets/SelectBox'
], function (core, _, View, config, SelectBox) {
    'use strict';

    return core.Widget.extend({

        View: View,

        init: function () {
               
            this.selectBox = new SelectBox({
                value: {
                    name: config.defaultView.title,                 
                }
                
            });
        },

        onViewReady: function () {
            var dropdown = this.view.getDropdownElement();
            this.selectBox.attachTo(dropdown);

            // View description handling
            this.view.setDescriptionText(config.defaultView.description);
            
            // View thumbnail handling
            this.view.setThumbnailImage(config.defaultView.thumbnail);

            this.selectBox.addEventHandler('change', function () {
                this.view.setDescriptionText(config.getViewDescription(this.getValue()));
                this.view.setThumbnailImage(config.getViewImage(this.getValue()));
            }, this);
         
        },
        /** getValue - returns selectBox value
            @name ViewSelect#getValue
            @returns {string} selectBox value
        */    
        getValue: function () {
            return this.selectBox.getValue().name;
        },
        /** addView - adds to config view and then adds it to the selectbox
            @name ViewSelect#addView
            @param {Object} object with values for adding a view {title,Description,Thumbnail}
        */    
        addView : function(view) {
             config.addView(view);
             this.selectBox.setItems(config.getViewNames());
        }
    });
});