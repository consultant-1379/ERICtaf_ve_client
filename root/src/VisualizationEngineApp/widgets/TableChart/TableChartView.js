
define(['jscore/core',
    'text!./TableChart.html'
], function(core, template) {
    'use strict';

    return core.View.extend({
        getTemplate: function() {
            return template;
        },

        getContentElement: function() {
            return this.getElement().find(".eaVEApp-wTableChart-tableChartArea");
        }
    });
});
