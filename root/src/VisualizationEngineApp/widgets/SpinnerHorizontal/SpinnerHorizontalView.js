define([
    'text!./SpinnerHorizontal.html',
    'widgets/utils/dataNameUtils',
    'widgets/Spinner'
], function (template, dataNameUtils) {
    var SpinnerView = require('widgets/Spinner/SpinnerView');

    return SpinnerView.extend({

        getTemplate: function () {
            return dataNameUtils.translate(null, template, this);
        },

        getSpinnerElement: function() {
            return this.getElement().find('.ebInput');
        },

        getSpinnerPercentElement: function() {
            return this.getElement().find('.ebInput_percent');
        },

        setSpinnerValue: function(element, value) {
            element.setAttribute("value", value);
        },

        setSpinnerStyle: function(element, style) {
            element.setStyle(style);
        }
    });
});