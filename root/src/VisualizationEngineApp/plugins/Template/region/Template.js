/**
Plugin template to be used as an example by all developers
@class Template 
*/
define([
    'app/plugins/Template/region/TemplateView',
    'app/regions/BaseRegion/BaseRegion',
    'app/plugins/Template/widgets/TemplateChart',
    'app/widgets/SettingsDialog/SettingsDialog',
], function (View, BaseRegion, TemplateChart, SettingsDialog) {

    return BaseRegion.extend({

        View: View,
        /**
        Method to initialise the region
        @name Template#init
        */
        init: function () { 
            this.defaultAspectRatio = 0.8;

            this.settingsDialog = new SettingsDialog({
                header: 'TEMPLATE SETTINGS',
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
            this.settingsDialog.build();

            // Bind a function to be invoked every time a setting is changed
            this.settingsDialog.addEventHandler('change', this._handleSettingChange, this);
        },
        /**
        Method to return an object containing the UID and size of the region i.e span
        @name Template#getData
        @return {Object} uid:String , span:String
        */
        getData: function() {
            var configData = this.options.configurationData;
            return {
                uid: this.uid,
                span: 'span' + configData.span
            };
        },
        /**
        Method to receive a new event model and update the the chart. 
        This is the json from the server that can be used to draw a chart etc.
        @name Template#onNewModel
        */
        onNewModel: function (model) {
            this.model.setAttribute('items', model.items);          
        },

        /**
        Method that after on start create the chart and listens for events from the chart
        @name Template#afterOnStart
        */
        afterOnStart: function () {
            this.templateChart = new TemplateChart({parentUID: this.uid});
            this.templateChart.attachTo(this.getElement());

            this.regionHandler.addEventHandler('settingClicked', function () {
                this.settingsDialog.showDialog();
            }, this);            
            
            this.model.addEventHandler('change', function () {
                this.templateChart.addEventToScreen(this.model.toJSON());
            }, this);
            
        },     
        /**
        Method send the subscription message to the server. This is important as it is used
        to send a subscription. Each Region will have this method and can be tailored to any new
        model plugin developed on the server side
        @name Template#createDataRequest
        @param rawSettings {Object} - rawSettings is taken lower down in the base region and gathers all widget information
        which can be used here getValue in each region allows this information to be returned.
        */
        
        createDataRequest: function (rawSettings, isLiveData) {
            var requestOptions = {
                model: 'RatioDistributionModel',
                modelVersion: '1.0',
                query: rawSettings.subscription.join('||'),
                queryOptions: {
                    base: "eventType",
                    startDate: rawSettings.datePicker.startDate.toISOString(),
                    endDate: rawSettings.datePicker.endDate.toISOString()
                }    
            };

            if (isLiveData) {
                requestOptions.updateInterval = rawSettings.updateInterval;
                delete requestOptions.queryOptions.endDate;
            }

            return requestOptions;
        },

        // Will be called every time a setting is changed
        // changeObj = {
        //     name: // Setting name
        //     newVal: // The settings new value
        // }
        _handleSettingChange: function (changeObj) {
            switch (changeObj.name) {
                case 'span':
                    // Redraw view 
                    this.changeSize(changeObj.newVal);
                    break;
                case 'aspectRatio':
                    // Implement methods to resize the view according to aspect ratio,
                    // for instance setDefaultAspectRatio and setAspectRatio
                    
                    // if (changeObj.newVal.checked) {
                        // this.templateChart.setDefaultAspectRatio();
                    // } else {
                        // this.templateChart.setAspectRatio(changeObj.newVal.value);
                    // }
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