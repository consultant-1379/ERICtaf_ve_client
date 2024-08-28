/**
widget to draw a PieChart for a set of data.
@class PieChart
*/
define([
    'jscore/core',
    'app/ext/PieChartExt',
    'app/plugins/PieView/widgets/PieChart/PieChartView',
    'jscore/ext/utils/base/underscore',
    'app/widgets/Popup/Popup',
    'chartlib/base/d3',
    'widgets/Table',
    'widgets/utils/domUtils'
], function (core, PieChart, View, _, Popup, d3, Table, domUtils) {
    'use strict';

    return core.Widget.extend({
        View: View,

        /**
        Method to initialise the global variables for the pie chart
        @name PieChart#init
        */
        init: function () {
            this.defaultPieAspect = 0.7;

            // Initially set the pie chart to occupy 0 space
            this.pieRegionSettings = {
                pieSettings: {
                    colorPalette: 'eriRainbow',
                    legendWidth: 200,
                    width: 0,
                    height: 0
                },
                pieAspect: this.defaultPieAspect
            };

            this.columns = [{attribute: "label", title: "Data"},
                            {attribute: "value", title: "Qty", width: '70px'},
                            {attribute: "percent", title: "%", width: '70px'}];

            this.options.model.addEventHandler('change', function () {
                if (this.popup !== undefined) {
                    this.withPercentage(this.pieData.items);
                    this.processDatasetIntoTable(this.pieData.items);
                }
            }, this);
        },
        /**
        Method to initialise the pie chart when page view is ready
        @name PieChart#onViewReady
        */
        onViewReady: function () {
            this.pieChart = new PieChart({
                settings: this.pieRegionSettings.pieSettings
            });
            this.pieChart.attachTo(this.getElement());
        },

        onDOMAttach: function () {
            // When the size of the region is known, redraw the pie chart to occupy all available space
            this.resizePie();
        },

        addClickEvent: function () {
            this.pieChart.addEventHandler("click", this.pieClickHandler, this);
        },

        /**
        Method to change the size of the chart and also used to redraw the chart
        @name PieChart#resizePie
        */
        resizePie: function() {
            var dimensions = domUtils.getElementDimensions(this.getElement());
            this.pieChart.redraw({
                width: dimensions.width,
                height: Math.floor(dimensions.width * this.pieRegionSettings.pieAspect)
            });
        },

        /**
        Method Sets values back to the default value
        @name PieChart#setDefaultRatio
        */
        setDefaultRatio: function() {
            this.pieRegionSettings.pieAspect = this.defaultPieAspect;
            this.resizePie();
        },

        /**
        Method Sets Aspect Ratio and resizes the chart
        @name PieChart#setAspectRatio
        @param aspectRatio -  the value required to set the aspect Ratio [1-12] only
        */
        setAspectRatio: function(aspectRatio) {
            this.pieRegionSettings.pieAspect = (aspectRatio/10);
            this.resizePie();
        },

        /**
        Method to add popup to the pie chart in order to show the percentage data
        @name PieChart#pieClickHandler
        @param dataset - the set of data to be used
        @param mouse - the d3.event to give mouse co-ordinates
        */
        pieClickHandler: function(dataset, mouse) {
            if(!this.pieData.items) {
                return;
            }
            if (this.popup !== undefined) {
                this.popup.destroy();
                this.popup = undefined;
                return;
            }
            this.withPercentage(dataset);
            // calculate the offset from click position to top of svg to click event location.
            var offsetRect = this.getElement().element.getBoundingClientRect();
            var offsetToPosition = { x: mouse.pageX - offsetRect.left - window.scrollX + 40, y: mouse.pageY - offsetRect.top - window.scrollY + 40};

            this.popup = new Popup({title:"Statistics", position: offsetToPosition});
            this.popup.attachTo(this.getElement());
            this.processDatasetIntoTable(dataset);
            this.popup.addEventHandler('close', function() {
                this.popup.destroy();
            }, this);
        },
        /**
        Method to add data into a table and attach to the widget
        @name PieChart#processDatasetIntoTable
        @param dataset
        */
        processDatasetIntoTable: function(dataset) {
            if(this.tableWidget){
                this.tableWidget.destroy(this.popup.getContent());
            }
            this.tableWidget = new Table({columns: this.columns, tooltips: true, minWidth: '430px'}, dataset);
            this.tableWidget.attachTo(this.popup.getContent());
        },
        /**
        Takes a data set (label: label, value: value) and adds a percent key to each object
        @param {Object} dataset - data set to add percentage to
        @returns - the data set augmented with percentage values.
        */
        withPercentage: function (dataset) {
            var sumEvents = _.reduce(dataset, function(sum, item) {
                return sum += item.value;
            }, 0);

            _.map(dataset, function(item) {
                item.percent = Math.round((item.value / sumEvents) * 100, -1) + '%';
            });

            return dataset;
        }

    });
});