/**
Extends the UI-SDk pieChart and adds Callbacks
@class PieChartExt
*/
define([
    'chartlib/base/d3',
    'chartlib/widgets/PieChart'
], function (d3, Drawing) {

    return Drawing.extend({

        addEventHandler: function(event, callback, context) {
            var ctx = context || null;

            this.pie.chart.selectAll('g.slice').on(event,
                function() {
                    callback.call(ctx, this.pie.dataset.items, d3.event);
                }.bind(this));
        }
    });
});