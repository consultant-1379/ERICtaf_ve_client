/**
    Build a select box based on the input for title and list of values

    @class EiffelSelectBox
*/

define([
    'jscore/core',
    './EiffelSelectBoxView',
    'widgets/SelectBox'
], function (core, View, SelectBox) {

    return core.Widget.extend({
        View: View,

        init: function () {
            this.eiffelSelectBox = new SelectBox({
                value: this.options.value,
                items: this.options.items,
                enabled: this.options.enabled,
                modifiers: this.options.modifiers
            });
            
        },

        onViewReady: function () {
            this.eiffelSelectBox.attachTo(this.getElement());
            //this.eiffelSelectBox.addEventHandler('change', function(e) { this.trigger("change", e); }, this); EVENT HERE TBD
        },

        /**
        Returns the currently selected value.

        @name EiffelSelectBox#getValue
        @returns {Object} Selectbox value
         */
        getValue: function () {
            return this.eiffelSelectBox.getValue().value;
        }
    });
});
