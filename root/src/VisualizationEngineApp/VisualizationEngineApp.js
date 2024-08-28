/**
VisualizationEngineApp - the core of the VE-Client and main operating body for the entire project
@class VisualizationEngineApp
*/
define([
    'jscore/core',
    'jscore/ext/mvp',
    'jscore/ext/locationController',
    'jscore/ext/utils/base/underscore',
    'app/VisualizationEngineAppView',
    'app/ext/regionFactory',
    'app/regions/Configuration/Configuration',
    'app/lib/CommunicationHandler',
    'app/widgets/ConnectionStatus/ConnectionStatus',
    'app/widgets/DashboardManager/DashboardManager',
    'widgets/Dialog',
    'app/ext/PluginManager',
    'app/models/ViewConfigurationCollection',
    'app/lib/utils/DateTimeUtils'
], function (core, mvp, LocationController, _, View, regionFactory, ConfigurationRegion, CommunicationHandler, ConnectionStatus, DashboardManager, Dialog, PluginManager, ViewConfigurationCollection, DateTimeUtils) {
    'use strict';
    
    return core.App.extend({

        View: View,

        init: function () {
            this.activeRegions = [];

            this.dashboardManager = new DashboardManager();
            this.addDashboardEventHandlers();
            
            
            this.namespace = 'main';
            this.dashboardConfigurationViewURL = '/configuration/views'; 
           
            this.pluginManager = new PluginManager();
            this.plugins = this.pluginManager.getPlugins();
            this.noOfAttempts = 8;
            
            this.urlHashState = {
                dashboardId:'',
                urlAttributes:false,
                query:[],
                endDate:"",
                startDate:"",
                liveData:undefined,                 
                queryIdentifier:"query",
                dashboardIdentifier:"dashboardId",
                startDateIdentifier:"startDate",
                endDateIdentifier:"endDate",
                liveDataIdentifier:"liveData"           
            };
        },
        /**
        Method to initialise all dashboardManager event Listeners
        @name VisualizationEngineApp#addDashboardEventHandlers
        */
        addDashboardEventHandlers: function() {

            this.dashboardManager.addEventHandler("loadDashboardEvent", function(configuration) {
                this.urlHashState.dashboardId = configuration.id;                
                this.loadViewConfigurations(configuration);
                this.dashboardManager.showCurrentDashboardNotification(configuration.author, configuration.title);
                this.updateUrlWithDashboardId(this.urlHashState.dashboardId,true);    
            }.bind(this));

            this.dashboardManager.addEventHandler("saveClickedEvent", function(dashBoardConfiguration) {
                var widgetConfigurationData = this.getRegionConfigurationData();
                this.dashboardManager.updateViewConfigurationsToSave(widgetConfigurationData);
            }.bind(this));

            this.dashboardManager.addEventHandler("onAfterSaveEvent", function(configuration) {
                this.urlHashState.dashboardId = configuration.id;   
                this.updateUrlWithDashboardId(this.urlHashState.dashboardId,true);
            }.bind(this));

            this.dashboardManager.addEventHandler("currentDashboardDeletedEvent", function() {
                this.removeAllRegions();
                
                this.urlHashState.dashboardId = "";
                this.urlHashState.query = [];
                this.urlHashState.endDate = "";
                this.urlHashState.startDate = "";
                this.urlHashState.liveData = undefined;
                this.urlHashState.urlAttributes = false;
                this.urlMap = {};
                        
                this.updateUrlWithDashboardId(this.urlHashState.dashboardId,true);
                this.dashboardManager.removeCurrentDashboardNotification();
            }.bind(this));

            this.dashboardManager.addEventHandler("assignServerIdEvent", function(data) {
                this.assignServerIdToRegion(data);
            }.bind(this));
   
        },

        onStart: function () {
                                    
            // Create LocationController and start listening for url changes
            this.lc = new LocationController();
            this.lc.namespace = this.namespace;
            this.lc.addLocationListener(this.hashChangeHandler, this); 
            this.lc.start();
            

            // Create a new CommunicationHandler for handling server events
            this.communicationHandler = new CommunicationHandler({
                host: window.location.hostname,
                port: window.location.port,
                eventBus: this.getEventBus()
            });

            //Connect to server and start monitoring the connection
            this.communicationHandler.connect();

            // Start listen to messages from the server
            this.communicationHandler.listen();

            // Subscribe for size change requests
            // this.getEventBus().subscribe('changeSize', this.changeSize, this);
            // Subscribe to the event bus for user input
            this.getEventBus().subscribe('subscribeMessageBus', this.subscribeMessageBusEvent, this);
            // Subscribe to the event bus for when user removes subscription
            this.getEventBus().subscribe('unsubscribeMessageBus', this.unsubscribeMessageBusEvent, this);
            // Subscribe to the event bus for when the user clicks the remove region button
            this.getEventBus().subscribe('removeRegion', this.removeRegion, this);
            // Toggle highlight when element start or stop dragging
            this.getEventBus().subscribe('createRegion', this.createRegionAndShowSettings, this);
            this.getEventBus().subscribe('connection:connected', this.connectionStatusHandler.bind(this, 'connected'));
            this.getEventBus().subscribe('connection:disconnected', this.connectionStatusHandler.bind(this, 'disconnected'));
            this.getEventBus().subscribe('serverStatus', function(model) {
                this.connectionStatus.setServerStatus(model);
            }.bind(this));

            this.getEventBus().subscribe('getHistoricalData', function(request) {
                this.communicationHandler.getHistoricalData(request);
            }.bind(this));

            window.addEventListener('resize', function() {
                 this.getEventBus().publish('resized');
                 
                _.each(this.activeRegions , function(region) {
                    region.getRegionHandler().view.setMinimize();              
                }.bind(this));
            }.bind(this));

            window.addEventListener('scroll', function() {
                 this.getEventBus().publish('scroll');
            }.bind(this));

            // When the current tab or the whole browser is being closed, try to unsubscribe all subscriptions
            window.addEventListener('beforeunload', function() {
                _.map(this.activeRegions, function(region) {
                    this.communicationHandler.unsubscribeLiveData(region.uid);
                }, this);
            }.bind(this));
                                        
            this.configurationRegion = new ConfigurationRegion({context: this.getContext()});
            this.configurationRegion.start(this.view.getConfigurationContainerElement());
            
                           
            this.connectionStatus = new ConnectionStatus();
            this.connectionStatus.attachTo(this.view.getSystemBarElement());

            this.dashboardManager.attachTo(this.view.getSystemBarElement());
            
            this.pluginManager.addEventHandler("pluginDataEvent", function(data) {
               this.configurationRegion.setView(data);
            }.bind(this));
            
        },
        /**
        Method to remove a single region
        @name VisualizationEngineApp#removeRegion
        @param region {object}
        */
        removeRegion: function (region) {          
            this.activeRegions = _.without(this.activeRegions, region);
            region.stop();
            this.communicationHandler.unsubscribeLiveData(region.uid);
        },
        /**
        Method to remove all regions
        @name VisualizationEngineApp#removeAllRegions
        */
        removeAllRegions: function () {     
            _.each(this.activeRegions , function(region) {
                region.stop();
                this.communicationHandler.unsubscribeLiveData(region.uid);
            }.bind(this));
            
            this.activeRegions = [];
 
        },

        /**
        Method to create regions
        @name VisualizationEngineApp#createRegion
        @param data {Object} Json
        @returns region {Object}
        */
        createRegion: function (data) {
            var region;
                     
            if(this.urlHashState.query && this.urlHashState.urlAttributes){
                data.subscription = this.urlHashState.query;
            }          
             if(this.urlHashState.endDate && this.urlHashState.urlAttributes){
                 data.datePicker.endDate = this.urlHashState.endDate;
            }           
             if(this.urlHashState.startDate && this.urlHashState.urlAttributes){
                data.datePicker.startDate = this.urlHashState.startDate;
            }
            if(typeof this.urlHashState.liveData !== 'undefined' && this.urlHashState.urlAttributes){
                data.datePicker.liveData = this.urlHashState.liveData;
            }
            
            region = regionFactory.create(data.type, {
                context: this.getContext(),
                configurationData: data,
                plugin: this.plugins
            });
            region.start(this.view.getViewContainerElement());
            this.activeRegions.push(region);
                        
            return region;

        },
        /**
        Method to return all region configurations
        @name VisualizationEngineApp#getRegionConfigurationData
        @returns regionData {Object}
        */
        getRegionConfigurationData: function () {
            var regionData = [];
            _.each(this.activeRegions, function (region) {
                var data = region.settingsDialog.getSettings();
                data.title = region.regionHandler.getTitle();
                regionData.push({region: region.uid, data: data});
            });
            return regionData;
        },
        /**
        Method Returns the index of the region with uid that was specified to it.
        @name VisualizationEngineApp#getRegionIndex
        @param regionId
        @returns int indexOf value in activeRegions if found, else returns undefined
        */
        getRegionIndex: function (regionId) {
            if (_.isEmpty(this.activeRegions)) {
                return undefined;
            }

            var region = _.findWhere(this.activeRegions, {"uid": regionId});
            var index = this.activeRegions.indexOf(region);

            if (index === -1) {
                index = undefined;
            }
            return index;
        },
        /**
        Method send a query to Server.
        @name VisualizationEngineApp#subscribeMessageBusEvent
        @param subscription {Object} Json
        */
        subscribeMessageBusEvent: function (subscription) {
            // Make a subscription for region source to the server for the topic the user entered
            this.communicationHandler.subscribeLiveData(subscription.region, subscription.eventBody);
        },
        /**
        Method to remove a query that was sent to Server.
        @name VisualizationEngineApp#unsubscribeMessageBusEvent
        @param id {String} UUID of region
        */
        unsubscribeMessageBusEvent: function (id) {
            // Make a unsubscription for region source to the server for the topic the user entered
            this.communicationHandler.unsubscribeLiveData(id);
        },
        /**
        Method to create a region and show its settings dialog to the user.
        @name VisualizationEngineApp#createRegionAndShowSettings
        @param data {Object} Region
        */
        createRegionAndShowSettings: function (data) {
            var region = this.createRegion(data);
            region.regionHandler.trigger('settingClicked');
        },
        /** 
        Method to handle the url when changed and to load that dashboard views by sending an ajax request
        @name VisualizationEngineApp#hashChangeHandler
        @param url {String} -  the dashboard Id from the http url in the browser
        */
        hashChangeHandler: function (url) {         
            url = url.replace("?","");
            this.urlInfos = url.split("&");
            var splitValue = "=";
            if(this.urlInfos[0] !== ""){
                this.urlMap = _.object(_.map(this.urlInfos, function(item) {
                   return [item.split("=")[0], item];
                }));
                
                if( this.urlMap[this.urlHashState.dashboardIdentifier]){
                    var dashboardId = this.urlMap[this.urlHashState.dashboardIdentifier].split(splitValue)[1];
                    if(dashboardId && dashboardId != this.urlHashState.dashboardId) {
                        this.urlHashState.dashboardId = dashboardId;               
                        this.dashboardManager.getModelById(this.urlHashState.dashboardId);                     
                    }
                }
                if( this.urlMap[this.urlHashState.queryIdentifier]){
                    var query = this.urlMap[this.urlHashState.queryIdentifier].split("query"+splitValue)[1];
                        query = query.split(",");
                        this.urlHashState.query = query;               
                        this.urlHashState.urlAttributes = true; 
                }
                if( this.urlMap[this.urlHashState.endDateIdentifier]){
                    var endDate = this.urlMap[this.urlHashState.endDateIdentifier].split(splitValue)[1];
                        endDate = endDate.split(",");
                        this.urlHashState.endDate = DateTimeUtils.setTime(new Date(endDate[0].replace(/-/g,"/")), endDate[1]);              
                        this.urlHashState.urlAttributes = true;  
                }
                if( this.urlMap[this.urlHashState.startDateIdentifier]){
                    var startDate = this.urlMap[this.urlHashState.startDateIdentifier].split(splitValue)[1];
                        startDate = startDate.split(",");
                        this.urlHashState.startDate = DateTimeUtils.setTime(new Date(startDate[0].replace(/-/g,"/")), startDate[1]);               
                        this.urlHashState.urlAttributes = true;   
                }
                if( this.urlMap[this.urlHashState.liveDataIdentifier]){
                    var liveData = this.urlMap[this.urlHashState.liveDataIdentifier].split(splitValue)[1];
                        if(liveData === "true"){
                            this.urlHashState.liveData = true;
                        }
                        else if(liveData === "false") {
                            this.urlHashState.liveData = false;
                        }            
                        this.urlHashState.urlAttributes = true;              
                }
            }

                if(_.isEmpty(this.urlMap)) {
                    this.lc.setNamespaceLocation(url, true);
                }
                
                    
        },
        /** 
        Method to load the view configuration to the web page by sending an ajax request to the server for the view settings
        @name VisualizationEngineApp#loadViewConfigurations
        @param {Object} configuration Json
        */
        loadViewConfigurations: function(configuration) {
            this.removeAllRegions();                 

            if(configuration.viewIds){
                var  ids = "?ids="+configuration.viewIds.join(",")+"&outputType=full";
                // Test url "/src/VisualizationEngineApp/lib/ViewConfiguration.js"
                var dashboardView = new mvp.Collection([], {url: this.dashboardConfigurationViewURL+ids});               
                dashboardView.fetch({
                    success: function() {
                        dashboardView.each(function(model) {
                            var count = 0;                       
                            var configInterval = setInterval(function(){
                               if(this.plugins[model.toJSON().type] || count === this.noOfAttempts) {
                                  clearInterval(configInterval);
                                  var region = this.createRegion(model.toJSON());
                                  region.sendSettingsToServer();
                               }
                            count++;  
                            }.bind(this), 1000);    
                        }.bind(this));
                      
                    }.bind(this),
                    error: function(status,xhr) {
                        console.log("Dashboard region configuration error ["+xhr._nativeXHR.status+"] "+xhr._nativeXHR.statusText);                                
                    }
                });
            }
        },
        /** 
        Method set the connection status of the server
        @name VisualizationEngineApp#connectionStatusHandler
        @param status {String}
        */
        connectionStatusHandler: function (status) {
            if (status === 'connected') {
                this.connectionStatus.setConnectedStatus();
            }

            if (status === 'disconnected') {
                this.connectionStatus.setDisconnectedStatus();
            }


        },
        /** 
        Assign a server generated id to the settings
        @name VisualizationEngineApp#assignServerIdToRegion
        @param  {Object} data
        */
        assignServerIdToRegion: function(data) {
             _.find(this.activeRegions , function(region) {
                if(region.uid === data.region) {
                    region.settingsDialog._assignId(data.id);
                }
            }.bind(this));
        },

        /**
        Method to update the url with the currect dashboard id
        @name VisualizationEngineApp#updateUrlWithDashboardId
        @param dashboardId 
        @param preventListeners
        */
        updateUrlWithDashboardId: function(dashboardId, preventListeners){
            var url = this.lc.getNamespaceLocation();
            if(!_.isEmpty(this.urlMap)) {
                var mapToArray = [];
                if(dashboardId){
                    this.urlMap[this.urlHashState.dashboardIdentifier] = "dashboardId="+dashboardId;
                }
                _.each(this.urlMap, function(value){
                    mapToArray.push(value);
                }.bind(this));           
                url = "?" + mapToArray.join("&"); 
            }
            else if(dashboardId){
                url = "?dashboardId=" + dashboardId;    
            }
            else {
                url = "";
            }            
            this.lc.setNamespaceLocation(url, preventListeners);
        }
    });
});
