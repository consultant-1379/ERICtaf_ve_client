define([
    'jscore/core',
    'jscore/ext/utils/base/underscore',
    'text!./Popup.html',
    'styles!./Popup.less'
], function(core, _, template, style) {
    return core.View.extend({
        getTemplate: function() {
            return template;
        },

        getStyle: function() {
            return style;
        },

        getContentElement: function() {
            return this.getElement().find('.eaVEApp-wPopup-content');
        },

        getTitleElement: function() {
            return this.getElement().find('.eaVEApp-wPopup-title');
        },

        getCloseElement: function() {
            return this.getElement().find('.eaVEApp-wPopup-close');
        },

        setPopupTitle: function(title) {
            if (typeof title === 'string') {
                this.getTitleElement().element.innerHTML = "<h2>"+title+"</h2>";
            }
        },

        setPopupContent: function(content) {
            if (typeof content === 'string') {
                var contentEl = core.Element.parse(content);
                this.getContentElement().append(contentEl);
            } else if (typeof content === 'object') {
                this.getContentElement().append(content);
            }

        },

        clearPopupContent: function() {
            this.getContentElement().element.innerHTML = "";
            _.each(this.getContentElement().children(), function(item) {
                item.detach();
            });
        },

        /**
        * Method to set an offset to the element
        *
        * @param {object} position container for the x- and y-offsets
        */
        setPosition: function(position) {
            var offset = position || {};
            _.defaults(offset, {x:0, y:0});
            this.getElement().setStyle({
                top: offset.y + "px",
                left: offset.x + "px"
            });
        }
    });
});