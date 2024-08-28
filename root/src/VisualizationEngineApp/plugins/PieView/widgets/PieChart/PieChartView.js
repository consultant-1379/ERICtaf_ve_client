define([
    'jscore/core',
    'text!./PieChart.html'
], function (core, template) {
    'use strict';

    return core.View.extend({

        getTemplate: function() {
            return template;
        }
    });
});