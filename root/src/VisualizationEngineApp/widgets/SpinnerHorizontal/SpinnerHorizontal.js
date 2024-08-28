/**
Changes the UI-SDk spinners buttons from vertical to horizontal
@class SpinnerHorizontal
*/
/*global define*/
define([
    'widgets/Spinner',
    './SpinnerHorizontalView'
], function (Spinner, View) {

    return Spinner.extend({
        View: View,

        onAttach: function () {

            var ebInput = this.view.getSpinnerElement();
            this.ebInput_percent = this.view.getSpinnerPercentElement();
            this.view.setSpinnerValue(this.ebInput_percent, (Math.round(100 * ebInput.getValue() / 12) + "%"));

            if (this.options.show_percent === true) {
                this.view.setSpinnerStyle(ebInput, {"display": "none"});
            }
            else {
                this.view.setSpinnerStyle(this.ebInput_percent, {"display": "none"});
            }

        },
        /**
        Triggers/ sets the value of the spinner
        @name SpinnerHorizontal#triggerSetValue
        */
        triggerSetValue: function (size) {
            this.setValue(size);
            this.trigger('changeSizeEvent', size);
            this.view.setSpinnerValue(this.ebInput_percent, (Math.round(100 * this.value / 12)) + "%");
        },
        /**
        Sets the eventHandlers for mouseup and mousedown on the spinner
        @name SpinnerHorizontal#triggerOnValueChange
        */
        triggerOnValueChange: function () {
            this.view.getUpButton().addEventHandler('mouseup', function() {
                this.trigger('changeSizeEvent', this.value);
                this.view.setSpinnerValue(this.ebInput_percent, (Math.round(100 * this.value / 12)) + "%");
            }, this);
            this.view.getDownButton().addEventHandler('mouseup', function() {
                this.trigger('changeSizeEvent', this.value);
                this.view.setSpinnerValue(this.ebInput_percent, (Math.round(100 * this.value / 12)) + "%");
            }, this);
        }
    });
});