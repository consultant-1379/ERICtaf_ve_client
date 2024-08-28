/**
 Flowchart region this class provides all widgets and styling of the region
 @class flowchartRegion
*/
define([
    'jscore/core',
    'app/plugins/FlowView/region/FlowChartView',
    'app/plugins/FlowView/widgets/FlowChart/FlowChart',
    'app/regions/BaseRegion/BaseRegion',
    'jscore/ext/utils/base/underscore',
    'app/lib/utils/DateTimeUtils',
    'app/widgets/SettingsDialog/ResizingSetting/ResizingSetting',
    'app/widgets/SettingsDialog/EiffelSpinner/EiffelSpinner',
    'app/widgets/GenericSetting/GenericSetting',
    'app/widgets/SpinnerHorizontal/SpinnerHorizontal',
    'app/lib/utils/MBAttributes',
    'app/config/config',
    'app/widgets/SettingsDialog/SettingsDialog',
    'widgets/SelectBox',
    'app/widgets/SettingsDialog/EiffelSelectBox/EiffelSelectBox',
], function (core, View, FlowChart, BaseRegion, _, DateTimeUtils, Resizer, EiffelSpinner, Setting, Spinner, MBAttributes, config, SettingsDialog, SelectBox, EiffelSelectBox) {

    return BaseRegion.extend({

        View: View,
        /**
        Method to initialise the region
        @name flowchartRegion#init
        */
        init: function () {

            this.defaultAspectRatio = 0.8;
            this.aspectRatio = this.defaultAspectRatio;       

            this.settingsDialog = new SettingsDialog({
                header: 'FLOWVIEW SETTINGS',
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
            this.settingsDialog.addSettingWidget('Flow Settings', 
                                    new Resizer({
                                        title: "Max graphs",
                                        name: "maxGraphs",
                                        min: 1, 
                                        max: 12, 
                                        value:6, 
                                        info: config.infoPopups.maxGraphs.text
                                    }))
                                .addSettingWidget('Flow Settings', 
                                    new Setting({
                                        info: config.infoPopups.nodeTitle.text,
                                        title: "Node title:", 
                                        name: "nodeTitle", 
                                        eventType: "nodeTitle", 
                                        enabled: false,
                                        content: new EiffelSelectBox({
                                            value: {name: "eventType", value: "eventType", title: "eventType"},
                                            modifiers: [{name: 'width', value: 'small'}],
                                        })
                                    })) 
                                .addSettingWidget('Flow Settings', 
                                    new Setting({
                                        info: config.infoPopups.nodeInfo.text, 
                                        title: "Node info:", 
                                        name: "nodeInfo", 
                                        eventType: "nodeInfo", 
                                        enabled: false,
                                        content: core.Element.parse("<input type='text' class='ebInput ebInput_disabled' value='domainId,eventData.resultCode' />")
                                    })) 
                                .addSettingWidget('Flow Settings Ext', 
                                    new Setting({
                                        title: "Nodes to display:", 
                                        name: "maxNodes",
                                        eventType: 'changeSizeEvent',
                                        info: config.infoPopups.nodesToDisplay.text,
                                        enabled: false,
                                        content: new EiffelSpinner({
                                            min: 1, 
                                            max: 100, 
                                            value: 50
                                        }) 
                                    }))
                                .addSettingWidget('Flow Settings Ext', 
                                    new Setting({
                                        info: config.infoPopups.sortOrder.text,
                                        title: "Sort order:", 
                                        name: "sortOrder", 
                                        eventType: "sortOrder", 
                                        enabled: false,
                                        content: new EiffelSelectBox({
                                            value: {name: "ascending", value: "ascending", title: "ascending"},
                                            items: [{name: "ascending", value: "ascending", title: "ascending"},
                                                    {name: "descending", value: "descending", title: "descending"}],
                                            enabled: false,  // the presence of 'items' results in Setting.enabled option being overridden, thus it is included here
                                            modifiers: [{name: 'width', value: 'small'}],
                                        })
                                    })) 
                                .addSettingWidget('Flow Settings Ext', 
                                    new Setting({
                                        info: config.infoPopups.sortOrder.text,
                                        title: "Sort field:", 
                                        name: "sortField", 
                                        eventType: "sortField", 
                                        enabled: false,
                                        content: new EiffelSelectBox({
                                            value: {name: "eventTime", value: "eventTime", title: "eventTime"},
                                            items: [{name: "eventTime", value: "eventTime", title: "eventTime"}],
                                            enabled: false,  // the presence of 'items' results in Setting.enabled option being overridden, thus it is included here
                                            modifiers: [{name: 'width', value: 'small'}],
                                        })
                                    }));
            this.settingsDialog.build();
            this.settingsDialog.addEventHandler('change', this._handleSettingChange, this);

            if (this.settingsDialog.getSettingWidget('subscription').getValue().length === 0) {
                this.settingsDialog.getButtons()[0].disable();
            }
        },
        /**
        Method to return a data object {uid:"", span:""}
        @name flowchartRegion#getData
        @return object {uid:"", span:""}
        */
        getData: function() {
            var configData = this.options.configurationData;
            return {
                uid: this.uid,
                span: 'span' + configData.span
            };
        },
        /**
        Method to receive a new event model and update the flowChart
        @name flowchartRegion#onNewModel
        */
        onNewModel: function (model) {
            this.view.hideLoaderAnimation();
            this.model.setAttribute('items', model.items);
            // Update chart data when new events are received
            if (model.items === undefined) {
                model.items =  [];
                model.dataByEventId =  {};
            }
            this.flowChart.updateGraph(model.items);
        },
        
        /**
        Method that after on start create the flow chart and listens for events from the chart
        @name flowchartRegion#afterOnStart
        */
        afterOnStart: function () {

            //create the flow chart
            this.flowChart = new FlowChart({parentUID: this.uid});
            this.flowChart.attachTo(this.getElement());
            // Resized events are sent both for region and browser resizing
            this.getEventBus().subscribe('resized', this.resizeChart, this);

            this.flowChart.addEventHandler('onLoad', function (e) {
                this.resizeChart();
            }.bind(this));

            this.regionHandler.addEventHandler('settingClicked', function () {
                this.settingsDialog.showDialog();
            }, this);

            this.resizeChart();

        },

        /**
        Method to resize the chart depending on the client width and aspect ratio
        @name flowchartRegion#resizeChart
        */
        resizeChart: function() {
            this.width = this.getElement().element.clientWidth;
            this.view.setStyle({"height": Math.max(this.width * this.aspectRatio)});
            this.view.getElement().find(".eaVEApp-wFlowChart-svgArea").setStyle({"height": Math.round(this.width * this.aspectRatio - 70)});
            this.flowChart.changeColumnSize();
        },

        createDataRequest: function (rawSettings, isLiveData) {
            var requestOptions = {
                model: 'DirectedAcyclicGraphModel',
                modelVersion: '1.0',
                query: rawSettings.subscription.join('||'),
                queryOptions: {
                    base: "eventId",
                    title: rawSettings.nodeTitle,
                    //title: rawSettings.title,
                    information: _.map(rawSettings.nodeInfo.split(','), function (key) { return key.trim(); }),
                    includeConnections: true,   // Hardcoded
                    dagAggregation: false,      // Hardcoded
                    maxNumberOfDags: rawSettings.maxGraphs,
                    pageNo: 1,                  // TODO: Make configurable after GA
                    pageSize: 'all',            // TODO: Make configurable after GA
                    sortField: rawSettings.sortField,
                    sortOrder: rawSettings.sortOrder,
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
                    this.aspectRatio = changeObj.newVal.checked ? this.defaultAspectRatio : changeObj.newVal.value/ 10;
                    this.resizeChart();
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
        },

        /**
        Method to add a select box for selections
        @private
        @name SingleSelector#setContent 
        @param {Object} options
        */
        _createSingleSelector: function (options) {
            var selectBox = new SelectBox({
                value: {name: options.default, value: options.default, title: options.default},
                modifiers: [{name: 'width', value: 'small'}],
                enabled: options.enabled
            });
            var items = [];
            _.each(options.listItems, function (item) {
                items.push({name: item, value: item, title: item});
            });
            selectBox.setItems(items);
            
            
            var setting = new Setting({
                info: options.info,
                title: options.title,
                name:options.name,
                eventType:options.eventType,
                enabled:options.enabled,
                content:selectBox,
                withGetValue: function () {
                    return this.getValue().value;
                }
            }); 
            return setting;
        }
    });
});
