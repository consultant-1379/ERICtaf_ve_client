/**
    default settings is intended as a default checkbox to set a value to its origin default value.
    @class defaultSettings
*/
define([
    'jscore/core',
    './DefaultSettingsView'
], function (core, View) {

    return core.Widget.extend({

        View: View,
        /**
        onViewReady - initialises the dom elements
        @name defaultSettings#onViewReady
        */
        onViewReady: function () {
            this.view.setTitle(this.options.title);
            this.view.addCheckboxEventHandler(this.options.onclickevent);
            this.view.setCheckboxStatus(this.options.checked);
        },
        /**
        isChecked - checks that the checkbox has been checked
        @name defaultSettings#isChecked
        @returns checkbox state {boolean} 
        */
        isChecked: function () {
            return this.view.getCheckboxElement().element.checked;
        },
         /**
        isDisabled - checks that the checkbox has been disabled
        @name defaultSettings#isDisabled
        @returns checkbox disabled state {boolean} 
        */
        isDisabled: function () {
            return this.view.getCheckboxElement().element.disabled;
        },

         /**
         setDisabled - sets the checkbox to disabled
         @name defaultSettings#setDisabled
         */
         setDisabled : function() {
             this.view.getCheckboxElement().element.disabled = "disabled";
         }, 
        /**
        setChecked - sets the checkbox to checked if a true value is passed or false of unchecked
        @name defaultSettings#setChecked
        @param checked (boolean) 
        */
        setChecked: function(checked) {
            if(checked) {
                this.view.getCheckboxElement().element.checked = true;
            }
            else {
                this.view.getCheckboxElement().element.checked = false; 
            }
        },

        /**
        Disables the widget
        @name defaultSettings#disable 
        */
        disable: function() {
            this.view.disable();
        },

        /**
        Disables the widget
        @name defaultSettings#disable 
        */
        enable: function() {
            this.view.enable();
        }

    });
});