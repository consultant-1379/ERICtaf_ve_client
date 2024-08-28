/**
 Piechart region this class provides all widgets and styling of the region
 @class PiechartRegion
*/
define([
    'jscore/ext/utils/base/underscore',
    'app/plugins/PieView/region/PieChartView',
    'app/plugins/PieView/widgets/PieChart/PieChart',
    'app/widgets/Popup/Popup',
    'app/regions/BaseRegion/BaseRegion',
    'app/lib/utils/MBAttributes',
    'app/lib/utils/DateTimeUtils',
    'app/config/config',
    'app/widgets/SettingsDialog/SettingsDialog',
    'app/widgets/SettingsDialog/TextField/TextField'
    // 'app/widgets/SettingsDialog/ListSelector/ListSelector'
], function (_, View, PieChart, Popup, BaseRegion, MBAttributes, DateTimeUtils, config, SettingsDialog, TextField) {

    return BaseRegion.extend({

        View: View,
        /**
        Method to initialise the pie region
        @name PiechartRegion#init
        */
        init: function () {

            var columnset = MBAttributes.getDefaultCollection();

            this.settingsDialog = new SettingsDialog({
                header: 'PIEVIEW SETTINGS',
                buttons: [
                    {
                        caption: 'Save',
                        color: 'green',
                        action: function () {
                            this.settingsDialog.commitSettings();
                            this.sendSettingsToServer();
                            this.settingsDialog.hideDialog();
                        }.bind(this)
                    },
                    {
                        caption: 'Cancel',
                        color: 'blue',
                        action: function () {
                            this.settingsDialog.hideDialog();
                        }.bind(this)
                    }
                ],
                initSettings: this.options.configurationData
            });

            this.addBaseSettings();
            this.settingsDialog.addSettingWidget('Pie Settings',new TextField({
                                    title: "Group By:",
                                    name: "groupOn",
                                    placeholder: "Please type option....",
                                    defaultValue: "eventType",
                                    elementIdentifier: "eaVEApp-wTextField-input",
                                    info: config.infoPopups.clusterBase.text
                                })).build();

            this.settingsDialog.addEventHandler('change', this._handleSettingChange, this);

            if (this.settingsDialog.getSettingWidget('subscription').getValue().length === 0) {
                this.settingsDialog.getButtons()[0].disable();
            }
        },

        /**
        Method to get the pie region element and start the pie chart. The events required for this region are also defined in this method
        @name PiechartRegion#afterOnStart
        */
        afterOnStart: function () {   
            // Create a new pie chart with supplied settings and attach it to the this region
            this.pieChart = new PieChart({model: this.model, aspectRatio: this.aspectRatio, parentUID: this.uid});
            this.pieChart.attachTo(this.view.getPieChartElement());
            // Resized events are sent both for region and browser resizing
            this.getEventBus().subscribe('resized', this.pieChart.resizePie, this.pieChart);

            this.regionHandler.addEventHandler('settingClicked', function () {
                this.settingsDialog.showDialog();
            }, this);
        },

        /**
        Method to return an object containing the UID and size of the region i.e span
        @name PiechartRegion#getData
        @returns {Object} uid:String , span:String
        */
        getData: function() {
            var configData = this.options.configurationData;
            return {
                uid: this.uid,
                span: 'span' + configData.span
            };
        },

         /**
        Method to update the pie chart when a new model is received. Overrides BaseRegion's 
        onNewModel method.
        @name PiechartRegion#onNewModel
        @param model - the received model data
        */
        onNewModel: function (model) {
            this.view.hideLoaderAnimation();
            this.model.setAttribute('items', model.items);
            // Only update the view if there is data in the model
            if (this.model.toJSON().items !== undefined) {
                this.pieChart.pieChart.update(this.model.toJSON());
                this.pieChart.pieData = this.model.toJSON();
                this.pieChart.addClickEvent();
            }
        },
        /**
        Method send the query message to the server
        onNewModel method.
        @name PiechartRegion#createDataRequest
        @param {Object} rawSettings - rawSettings json
        @param {boolean} isLiveData - boolean
        */
        createDataRequest: function (rawSettings, isLiveData) {
            var requestOptions = {
                model: 'RatioDistributionModel',
                modelVersion: '1.0',
                query: rawSettings.subscription.join('||'),
                queryOptions: {
                    base: rawSettings.groupOn,
                    startDate: rawSettings.datePicker.startDate.toISOString(),
                    endDate: rawSettings.datePicker.endDate.toISOString()
                }      
            };

            if (isLiveData) {
                requestOptions.updateInterval = rawSettings.updateInterval;
                delete requestOptions.queryOptions.endDate;
            }
            
            this.view.showLoaderAnimation();
            
            return requestOptions;
        },

        _handleSettingChange: function (changeObj) {
            switch (changeObj.name) {
                case 'span':
                    this.changeSize(changeObj.newVal);
                    break;
                case 'aspectRatio':
                    if (changeObj.newVal.checked) {
                        this.pieChart.setDefaultRatio();
                    } else {
                        this.pieChart.setAspectRatio(changeObj.newVal.value);
                    }
                    break;
                case 'subscription':
                    if (changeObj.newVal.length > 0) {
                        this.settingsDialog.getButtons()[0].enable();
                    } else {
                        this.settingsDialog.getButtons()[0].disable();
                    }
                    break;
                case 'datePicker':
                    if (changeObj.newVal.liveData === false) {
                        this.settingsDialog.getSettingWidget('updateIntervalChange').detach();
                    } else {
                        this.settingsDialog.getSettingWidget('updateIntervalChange').attach();
                    }
                    break;
            }
        }
    });
});
