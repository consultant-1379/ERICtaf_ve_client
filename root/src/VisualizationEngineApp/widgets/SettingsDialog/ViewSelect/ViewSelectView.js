define([
    'jscore/core',
    'text!./ViewSelect.html',
    'styles!./ViewSelect.less'
], function(core, template, style) {

    return core.View.extend({
        getTemplate: function() {
            return template;
        },

        getStyle: function() {
            return style;
        },

        getDropdownElement: function() {
            return this.getElement().find(".eaVEApp-wVEViewSelect-dropdown");
        },

        setDescriptionText: function(text) {
            this.getElement().find(".eaVEApp-wVEViewSelect-descriptionText").setText(text);
        },

        setThumbnailImage: function(imageUrl) {
            this.getElement().find(".eaVEApp-wVEViewSelect-thumbnailImage").setAttribute("src", imageUrl);
        }

    });
});