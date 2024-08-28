/**
Icon class to hold an Icon
@class Icon
*/
define([
    'jscore/core',
    './IconView'
], function(core, View) {
    'use strict';
    return core.Widget.extend({
        View: View,

        onViewReady: function () {
            if (typeof(this.options.onclickevent) === "function") {
                this.element.addEventHandler('click', function(e) {
                    var context = this.options.context || null;
                    this.options.onclickevent.call(context, e);
                }, this);
            }
            if (this.options.icon && this.options.text) {
                this.element.setAttribute("title", this.options.text);
            }
        },

        onDOMAttach: function() {
            if (this.options.interactive) {
                this.makeInteractive();
            } else if (this.options.interactive !== undefined) {
                this.makeUninteractive();
            }
        },
        /**
         Check if there is an issue with the icon       
         @name Icon#faultCheck
         */
        faultCheck: function() {
            this.isClickable = (typeof(this.options.onclickevent) === "function") ? "ebIcon_interactive" : "";

            if (!this.options.icon) {    // if there is a rule
                this.options.text = "WARNING: Icon not specified";
                this.options.icon = "ebIcon_warning";
            }
        },

         /**
         Sets the interactive modifer on the icon.        
         @name Icon#makeInteractive
         */
        makeInteractive: function() {
            this.view.addInteractiveClass();
            this.isClickable = 'ebIcon_interactive';
        },

         /**
         Removes the interactive modifier from the icon.
         @name Icon#makeUninteractive
         */
        makeUninteractive: function() {
            this.view.removeInteractiveClass();
            this.isClickable = '';
        },
        /**
        Removes the interactive modifer from the icon.
        @name Icon#getTemplateData
        */
        getTemplateData: function() {
            this.faultCheck();
            return {
                icon: "ebIcon ebIcon_medium " + this.options.icon + " " + this.isClickable,
                text: (this.options.text !== undefined) ? this.options.text : this.options.icon,
                test: this.test
            };
        }
    });
});
