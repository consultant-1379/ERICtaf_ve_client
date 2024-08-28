define([
    'jscore/core',
    'app/widgets/SettingsDialog/EiffelSpinner/EiffelSpinnerView',
    'app/widgets/SettingsDialog/DefaultSettings/DefaultSettings',
    'app/widgets/SpinnerHorizontal/SpinnerHorizontal',
    'widgets/InfoPopup',
    'app/config/config'
], function (core, View, Checkbox, Spinner, InfoPopup, config) {

    return core.Widget.extend({
        View: View,

        init: function () {

            this.spinner = new Spinner({
                min: typeof(this.options.min) === "number" ? this.options.min: 1, 
                max: typeof(this.options.max) === "number" ? this.options.max: 10, 
                value: this.options.value
            });
            this.spinner.triggerOnValueChange();

            this.spinner.addEventHandler('changeSizeEvent', function (e) {
                this.trigger('changeSizeEvent', e);
            }.bind(this));

            this.checkbox = new Checkbox({checked: true, title: "Use Default", onclickevent:
                function (e) {
                    if(this.checkbox.isChecked() === true) {
                        this.hideSpinner();
                        this.trigger('changeSizeEvent', true);
                    } else {
                        this.trigger('changeSizeEvent', this.getValue().value);
                        this.showSpinner();
                    }
                }.bind(this)
            });
        },

        showSpinner: function() {
            this.view.showSpinner();
        },

        hideSpinner: function() {
            this.view.hideSpinner();
        },

        onViewReady: function () {
            this.spinner.attachTo(this.view.getSpinnerElement());
            this.checkbox.attachTo(this.view.getCheckboxElement());
            this.hideSpinner();
        },

        /**
        Method that gets the value of the content 
        @return {object} returns what the spinner's getValue returns. return null if default value
        */
        getValue: function () {
            return {
                checked: this.checkbox.isChecked(),
                value: this.spinner.getValue()
            };
        },

        /**
        Method that sets the value of the content 
        @param value {string/int}
        @name EiffelSpinner#setValue 
        */
        setValue: function (value) {
            if (value) {
                this.checkbox.view.setCheckboxStatus(value.checked);
                this.spinner.setValue(value.value);
                if(value.checked === false) {
                    this.view.showSpinner();
                }
                else if(value.checked === true) {
                    this.view.hideSpinner();
                }
                setTimeout(function(){
                    this.trigger('changeSizeEvent', value);
                }.bind(this), 5);
            }
        },

        /**
        Disables the widget
        @name EiffelSpinner#disable 
        */
        disable: function () {
            this.checkbox.disable();
        },

        /**
        Enables the widget
        @name EiffelSpinner#enable 
        */
        enable: function () {
            this.checkbox.enable();
        }
    });
});