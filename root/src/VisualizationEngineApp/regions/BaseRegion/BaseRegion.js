/**
Class that can be extended for creating a regionhandler and providing a base for all regions to extend.
@class BaseRegion
*/
define([
    'jscore/core',
    'jscore/ext/mvp',
    'jscore/ext/utils/base/underscore',
    'app/widgets/RegionHandler/RegionHandler',
    'app/widgets/GenericSetting/GenericSetting',
    'app/widgets/ListBuilder/ListBuilder',
    'app/widgets/SettingsDialog/EiffelSpinner/EiffelSpinner',
    'app/widgets/SettingsDialog/ResizingSetting/ResizingSetting',
    'app/config/config',
    'app/widgets/SettingsDialog/DatePopup/DatePopup'
], function (core, mvp, _, RegionHandler, Setting, ListBuilder, EiffelSpinner, Resizer, config, DatePopup) {
    return core.Region.extend({

        init: function () {
            this.settingsTabs = [];
            this.isLive = false;
        },

        onStart: function () {
            this.model = new mvp.Model();
            this.atStart = true;

            this.regionHandler = new RegionHandler();
            this.regionHandler.attachTo(this.getElement().find('header'));

            if (this.options.configurationData.title !== undefined) {
                this.regionHandler.setTitle(this.options.configurationData.title);
            }

            this.commonEventHandlers();
            this.defineEventHandlers();

            this.afterOnStart();
        },
         /**
        Method initialise all event handlers for the base region
        @name BaseRegion#commonEventHandlers
        */
        commonEventHandlers: function () {
            this.regionHandler.addEventHandler('removeClicked', function () {
                this.getEventBus().publish('removeRegion', this);
            }, this);

            this.getEventBus().subscribe('update', function (data) {
                if (data.id === this.uid) {
                    this.onNewModel(data.model);
                }
            }, this);

            this.setUUIDFormat();
        },

        // defineEventHandlers should be overwritten when region-specific eventhandlers must be added
        defineEventHandlers: function () {
        },

        afterOnStart: function () {
        },

        /**
        Method to return regionhandler
        @name BaseRegion#getRegionHandler
        @returns the regionHandler {Object}
        */
        getRegionHandler: function () {
            return this.regionHandler;
        },

        /**
        Will be called everytime there is a live model update.
        Must be implemented by regions extending BaseRegion.
        @name BaseRegion#onNewModel
        @param model the new model
        */
        onNewModel: function(model) {
        },

        /**
        Method to create a request object for requesting data from the server
        Must be implemented by regions extending BaseRegion.
        @name BaseRegion#createDataRequest
        @param rawSettings {object} configuration data returned by the regionHandler
        @param isLiveData {boolean} if set to true options that are only valid for live data should be set
        @returns data request object {object}
        */
        createDataRequest: function (rawSettings, isLiveData) {
        },

        /**
        Method to convert UUID to correct format
        @name BaseRegion#setUUIDFormat
        */
        setUUIDFormat: function() {
            //change UUID to correct Format
            this.uid = ((this.uid.split('-')).slice(0,-1)).join("-");  
        },

        /**
        Method to resize a view by changing it's span value
        @name BaseRegion#changeSize
        @params {Number} size - the new size, value 1-12 allowed
        */
        changeSize: function (size) {
            if (size < 1 || size > 12) {
                return;
            }

            var className = this.getElement().getProperty('className'),
                newClassName = className.replace(/span\d*/, "span" + size);

            this.getElement().setProperty('className', newClassName);
            this.getEventBus().publish('resized');
        },

        addBaseSettings: function () {
            var spinner = new EiffelSpinner({
                    min: 1,
                    max: 10,
                    value: 10,
                    show_percent: false
                }),
                datePopup = new DatePopup(),
                datePicker = new Setting({
                    info: config.infoPopups.resize.text, 
                    title: "Aggregate historical and live data:", 
                    name: "datePicker",
                    eventType: "toggleUpdateIntervalVisible",
                    content:datePopup
                }),
                query = new ListBuilder({
                    buttonLabel: 'Add query',
                    stringFilter: "^!?[^:(){},'[]+-]+$|[a-zA-Z0-9-_]+"
                });

            datePopup.setParent (datePicker);

            this.settingsDialog.addSettingWidget('Data', new Setting({
                title: 'Query:',
                name: 'subscription',
                info: config.infoPopups.subscribe.text,
                eventType: "change",
                content: query
            }))
            .addSettingWidget('Data', datePicker)
            .addSettingWidget('Data', new Resizer({
                title: "Update interval (s)", 
                min: 1, 
                max: 120, 
                eventType: "updateIntervalChange", 
                name:"updateIntervalChange", 
                info: config.infoPopups.updateInterval.text
            }))
            .addSettingWidget('View Settings', new Setting({
                title: 'Aspect ratio:',
                name: 'aspectRatio',
                eventType: 'changeSizeEvent',
                info: config.infoPopups.aspectRatio.text,
                content: spinner
            }))
            .addSettingWidget('View Settings', new Resizer({
                title: "Resize", 
                name: 'span', 
                eventType: 'changeSizeEvent',
                min: 1, 
                max: 12, 
                value:1, 
                info: config.infoPopups.resize.text
            }));
        },

        sendSettingsToServer: function () {
            var rawSettings = this.settingsDialog.getSettings();
            if(this.atStart){
                this.getElement().find('[class*="eaVEApp-r"] h1').remove();
                this.atStart = false;
            }

            if (rawSettings.datePicker.liveData) {
                var eventBody = this.createDataRequest(rawSettings, true);
                this.getEventBus().publish('subscribeMessageBus', {
                    region: this.uid,
                    eventBody: eventBody
                });
                this.isLive = true;
            } else {
                var queryOptions = this.createDataRequest(rawSettings);
                // If the previous state was live data send an unsubscription notice the the server
                if (this.isLive) {
                    this.getEventBus().publish('unsubscribeMessageBus', this.uid);
                }
                this.isLive = false;
                
                this.getEventBus().publish('getHistoricalData', {
                    region: this.uid,
                    queryOptions: queryOptions
                });
            }
        }
    });
});