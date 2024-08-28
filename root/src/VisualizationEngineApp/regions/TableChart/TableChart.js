define(['./TableChartView',
    'app/widgets/TableChart/TableChart',
    'app/regions/BaseRegion/BaseRegion',
    'app/widgets/SettingsDialog/ListSelector/ListSelector',
    'app/widgets/SettingsDialog/Pagination/Pagination',
    'app/lib/utils/MBAttributes'
], function(View, TableChart, BaseRegion, ListSelector, Pagination, MBAttributes) {
    // List Region is meant to list all the eventTypes that are sent on the MB
    return BaseRegion.extend({

        View: View,

        init: function() {
            this.defaultAspectRatio = 0.8;
            
            this.aspectRatio = this.defaultAspectRatio;

            // Can we change this so that this data is fetched from the ListSelector widget itself?
            // I tried doing this but it broke a test
            var dataset = MBAttributes.getDefaultCollection();

            // Resized events are sent both for region and browser resizing
            this.getEventBus().subscribe('resized', this.resizeChart, this);

            this.widgetSettings = {
                columns: new ListSelector({title: "Select Columns to display", dataset: dataset, defaultValue:true }),
                pagination: new Pagination()
            };

            this.settingsTabs = [];
            this.settingsTabs.push({
                title: "Table Settings",
                widgets: [
                    this.widgetSettings.columns,
                    this.widgetSettings.pagination
                ]
            });
        },

        // create Table-specific event handlers
        defineEventHandlers: function () {
            this.widgetSettings.columns.addEventHandler('selectionChanged', function(dataset) {
                this.tableChart.setVisibleColumns(dataset);
                this.tableChart.createTable();
            }.bind(this));

            this.widgetSettings.pagination.addEventHandler('change', function(e) {
                this.tableChart.setPageSize(this.widgetSettings.pagination.getValue().value);
                this.tableChart.createTablePagination();
            }.bind(this));
        },

        onNewModel: function(model) {
            // Update chart data when new events are received
            this.tableChart.updateTableData(model.attributes);
        },

        onERFetch: function() {
            this.view.hideLoaderAnimation();
        },

        onERFailed: function () {
            this.view.hideLoaderAnimation();
        },

        afterOnStart: function() {
            //create the flow chart
            this.tableChart = new TableChart({
                aspectRatio: this.aspectRatio,
                sortable: true,
                parentUID: this.uid
            });

            this.regionHandler.addEventHandler('addSubscriptionEvent', function () {
                this.view.showLoaderAnimation();
            }, this);

           this.getRegionHandler().addEventHandler('changeAspectRatioEvent', function(e) {
                this.aspectRatio = e/10;
                this.resizeChart();
            }, this);

            this.getRegionHandler().addEventHandler('defaultAspectRatioEvent', function (e) {
                if (e === true) {
                    this.aspectRatio = this.defaultAspectRatio;
                    this.resizeChart();
                }
            }, this);

            this.tableChart.attachTo(this.getElement());  

            // Init all settings widgets
            this.getRegionHandler().setConfigurationData();

        },

        resizeChart: function() {
            var width = this.getElement().element.clientWidth;
            this.view.getElement().setStyle({"height": Math.max(width * this.aspectRatio, 100)});
        },

        getData: function() {
            var configData = this.options.configurationData;
            return {
                uid: this.uid,
                span: 'span' + configData.span
            };
        }
    });
});
