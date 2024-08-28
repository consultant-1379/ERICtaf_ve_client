/**
Popup widget that can be used to hold message for example
@class Popup
*/
define([
    'jscore/core',
    'app/widgets/Icon/Icon',
    './PopupView'
], function(core, Icon, View) {
    'use strict';
    return core.Widget.extend({
        View: View,

        onViewReady: function() {
            this.view.setPopupTitle(this.options.title);
            this.view.setPopupContent(this.options.content);
            this.view.setPosition(this.options.position);
            var close = new Icon({icon: "ebIcon_close", text: "Close", onclickevent: function() {
                this.trigger('close');
            }.bind(this)});
            close.attachTo(this.view.getCloseElement());
        },
        /**
        Popup widget that can be used to hold message for example
        @name Popup#updateContent
        @param content {Object} 
        */
        updateContent: function(content) {
            this.view.clearPopupContent();
            this.view.setPopupContent(content);
        },
        /**
        Popup widget that can be used to hold message for example
        @name Popup#getContent
        @returns content {Object} 
        */
        getContent: function() {
            return this.view.getContentElement();
        }
    });
});