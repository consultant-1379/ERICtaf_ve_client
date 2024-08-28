define([
    'jscore/core',
    'jscore/ext/utils/base/underscore',
    'app/plugins/ClusterView/region/ClusterChartView',
    'app/plugins/ClusterView/widgets/ClusterChart/ClusterChart',
    'app/regions/BaseRegion/BaseRegion',
    'app/models/BaseModel',
    'app/widgets/SettingsDialog/Resizing/Resizing',
    'app/widgets/SettingsDialog/Clustering/Clustering'
], function (core, _, View, ClusterChart, BaseRegion, Model, Resizer, Clustering) {

    return BaseRegion.extend({

        View: View,

        init: function () {
            this.defaultAspectRatio = 0.8;

            this.clusterWidget = new ClusterChart({parentUID: this.uid});

            // Resized events are sent both for region and browser resizing
            this.getEventBus().subscribe('resized', this.resizeChart, this);
            
            var fadeoutValue    = 0;
            var columnValue     = 2;

            //TODO: Set server value to clustering widget
            this.widgetSettings = {
                clustering: new Clustering(),
                fadeout: new Resizer({title: "Fade out nodes in (h)", min: 0, max: 255,value:fadeoutValue}),
                columns: new Resizer({title: "Nodes/row", value: columnValue})
            };
/*
            this.nodeWidgets = {
                nodeWidth: new Resizer({title: "Width of nodes", min: 0, max: 255, value: 80}),
                nodeHeight: new Resizer({title: "Height of nodes", min: 0, max: 255, value: 80}),
            };
*/
            this.settingsTabs = [];
            this.settingsTabs.push({
                title: "Clustering Settings",
                widgets: [
                    this.widgetSettings.clustering,
                    this.widgetSettings.fadeout,
                    this.widgetSettings.columns
                ]
            });
/*
            this.settingsTabs.push({
                title: "Node Settings",
                widgets: [
                    this.nodeWidgets.nodeWidth,
                    this.nodeWidgets.nodeHeight
                ]
            });
*/
        },

        defineEventHandlers: function () {
            /*
             * Region specific event handlers
             */

            // Handles event from settingsIcon and also the event originally triggered by settingsDialog
            this.getSettingsDialog().addEventHandler('settingsDialogVisibleEvent', function (e) {
                this.widgetSettings.clustering.toggleLiveUpdate(e);
                if(e === false) {
                    this.widgetSettings.clustering.toggleLiveUpdate();
                }
            }.bind(this));

            this.widgetSettings.clustering.addEventHandler('clusterBaseEvent', function (e) {
                this.clusterWidget.setClusterBase(e);
            }.bind(this));

            this.widgetSettings.clustering.addEventHandler('oneNodeModeEvent', function (e) {
                var fadeOutTime = 0;
                if(e === true) {
                    this.widgetSettings.fadeout.detach();
                    this.widgetSettings.columns.detach();
                }
                else {
                    fadeOutTime = this.widgetSettings.fadeout.spinner.getValue();
                    this.widgetSettings.fadeout.attach();
                    this.widgetSettings.columns.attach();
                }
                this.clusterWidget.setFadeout(fadeOutTime*60*60);
                this.clusterWidget.setOneNode(e);
            }.bind(this));

            this.widgetSettings.fadeout.addEventHandler('changeSizeEvent', function (e) {
                var fadeOutTime = this.widgetSettings.fadeout.spinner.getValue();
                this.clusterWidget.setFadeout(fadeOutTime*60*60);
            }.bind(this));

            this.widgetSettings.columns.addEventHandler('changeSizeEvent', function (e) {
                this.clusterWidget.setColumns(e);
            }.bind(this));


            /*
             * Common event handlers
             */
            this.getRegionHandler().addEventHandler('changeAspectRatioEvent', function (e) {
                this.aspectRatio = e/10;                
                this.clusterWidget.setAspectRatio(this.aspectRatio*10);
                this.resizeChart();
            }, this);

            this.getRegionHandler().addEventHandler('defaultAspectRatioEvent', function (e) {
                if (e === true) {
                    this.aspectRatio = this.defaultAspectRatio;  
                    this.clusterWidget.setAspectRatio(this.aspectRatio*10);
                    this.resizeChart();
                }
            }, this);

            this.getRegionHandler().addEventHandler('changeSizeEvent', function (e) {
                this.clusterWidget.redraw();
            }, this);

            this.regionHandler.addEventHandler('addSubscriptionEvent', function () {
                this.view.showLoaderAnimation();
            }, this);            
        },

        /*
        afterOnStartMethod will initialise all job chart functions
        */
        afterOnStart: function () {
            //create the job chart
            this.clusterWidget.attachTo(this.getElement());

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
        },

        onNewModel: function (model) {
            this.receiveEvent(model);
            // Update chart data when new events are received
            this.clusterWidget.update(model.toJSON());
        },

        receiveEvent: function(event) {
            if(this.widgetSettings.clustering) {
                this.widgetSettings.clustering.receiveEvent(event.toJSON());
            }
        },

        onERFetch: function () {
            // Returns a list of all keys and nested keys in object
            function deepKeys(object) {
                return _.reduce(_.pairs(object), function (array, item) {
                    if (_.isObject(item[1]) && !_.isArray(item[1])) {
                        array.push(item[0]);
                        array.push(deepKeys(item[1]));
                        return array;
                    } else {
                        array.push(item[0]);
                        return array;
                    }
                }, []);
            }

            var receiveEventFn = this.widgetSettings.clustering.receiveEvent.bind(this.widgetSettings.clustering),
                // Creates a memoized version of receiveEvent. The event keys are used to create a hash for caching the result of the function
                memoizedReceiveEventFn = _.memoize(receiveEventFn, function (eventObj) {
                    return deepKeys(eventObj).join();
                });

            this.clusterWidget.selectFromEventCollection();
            this.clusterWidget.arrangeNodes();
            this.clusterWidget.redraw();
            this.view.hideLoaderAnimation();
        },

        onERFailed: function () {
            this.view.hideLoaderAnimation();
        }
    });

});