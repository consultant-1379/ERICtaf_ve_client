/**
Creates a Tab view widget
@class SettingsTab
*/
define([
    'jscore/core',
    './SettingsTabView',
    'jscore/ext/utils/base/underscore',
    'jscore/ext/dom'
], function (core, View, _, dom) {

    return core.Widget.extend({

        View: View,

        init: function () {
            this.widgets = this.options.widgets;
        },

        onViewReady: function () {
             _.each(this.widgets, function(widget) {
                this.addWidget(widget);
            }.bind(this));
        },
        /**
        Method to create tab division tag to dom element
        @name SettingsTab#createElement
        @returns Object {Object} JSCore element
        */
        createElement: function() {
            var el = core.Element.parse("<div></div>");
            el.setAttribute("class", "eaVEApp-wVESettingsTab-widget");
            return el;
        },
         /**
        Method add widget
        @name SettingsTab#addWidget
        @param Widget {Object} JSCore widget
        */
        addWidget: function(widget) {
            var widgetElement = this.createElement();
            this.view.appendToDOM(widgetElement);
            widget.attachTo(widgetElement);
        },
         /**
        Method to remove widget
        @name SettingsTab#removeWidget
        */
        removeWidget: function(widgetIndex) {
            this.widgets[widgetIndex].detach();
        }

    });
});