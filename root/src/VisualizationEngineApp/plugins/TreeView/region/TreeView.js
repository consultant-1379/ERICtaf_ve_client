define([
    'app/plugins/TreeView/region/TreeChartView',
    'app/regions/BaseRegion/BaseRegion',
    'app/plugins/TreeView/widgets/TreeChart',
    'app/widgets/SettingsDialog/SettingsDialog'
], function(View, BaseRegion, TemplateChart, SettingsDialog) {

    return BaseRegion.extend({

        View: View,

        init: function() {
            this.settingsDialog = new SettingsDialog({
                header: 'TREEVIEW SETTINGS',
                buttons: [
                    {
                        caption: 'Save',
                        color: 'green',
                        action: function() {
                            this.settingsDialog.commitSettings();
                            this.sendSettingsToServer();
                            this.settingsDialog.hideDialog();
                        }.bind(this)
                    },
                    {
                        caption: 'Cancel',
                        color: 'blue',
                        action: function() {
                            this.settingsDialog.hideDialog();
                        }.bind(this)
                    }
                ],
                initSettings: this.options.configurationData
            });

            this.addBaseSettings();
            this.settingsDialog.build();

            // Bind a function to be invoked every time a setting is changed
            this.settingsDialog.addEventHandler('change', this._handleSettingChange, this);
        },

        getData: function() {
            var configData = this.options.configurationData;
            return {
                uid: this.uid,
                span: 'span' + configData.span
            };
        },

        onNewModel: function(model) {
            if (model.items) {
                this.model.setAttribute('items', model.items);
            } else {
                console.error('Failed to make subscription: %s', model.message);
            }
        },

        afterOnStart: function() {
            this.templateChart = new TemplateChart({parentUID: this.uid});
            this.templateChart.attachTo(this.getElement());

            this.regionHandler.addEventHandler('settingClicked', function() {
                this.settingsDialog.showDialog();
            }, this);

            this.model.addEventHandler('change', function() {
                this.view.hideLoaderAnimation();
                var json = this.model.toJSON();
                if (json.items != null) {
                    this.templateChart.addEventToScreen(json);
                }
            }, this);

            this.model.addEventHandler('error', function(errorText) {
                this.view.hideLoaderAnimation();
                console.error('Failed to load data from ER: %s', errorText);
            }, this);
        },

        createDataRequest: function(rawSettings, isLiveData) {
            var requestOptions = {
                model: 'DirectedAcyclicGraphModel',
                modelVersion: '1.0',
                query: rawSettings.subscription.join('||'),
                queryOptions: {
                    base: 'eventId',
                    title: 'eventType',
                    information: [
                        'domainId',
                        'eventType',
                        'eventData.testId',
                        'eventData.name',
                        'eventData.resultCode',
                        'eventData.logReferences.jcat_logs.uri'
                    ],
                    includeConnections: true,
                    dagAggregation: false,
                    maxNumberOfDags: 1,
                    pageNo: 1,
                    pageSize: '1000000', // FIXME Workaround for default ER behavior
                    sortField: 'eventTime',
                    sortOrder: 'ascending',
                    startDate: rawSettings.datePicker.startDate.toISOString()
                    //endDate: rawSettings.datePicker.endDate.toISOString()
                }
            };

            if (isLiveData) {
                requestOptions.updateInterval = rawSettings.updateInterval;
                delete requestOptions.queryOptions.endDate;
            }
            this.view.showLoaderAnimation();

            return requestOptions;
        },

        _handleSettingChange: function(changeObj) {
            switch (changeObj.name) {
                case 'span':
                    this.changeSize(changeObj.newVal);
                    this.templateChart.redraw();
                    break;
                case 'subscription':
                    if (changeObj.newVal.length > 0) {
                        this.settingsDialog.getButtons()[0].enable();
                    } else {
                        this.settingsDialog.getButtons()[0].disable();
                    }
                    this.templateChart.clear();
                    this.templateChart.redraw();
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
