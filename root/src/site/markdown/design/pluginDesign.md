#Eiffel Visualization Engine (Client)

##Overview
The VE-Client uses the UI-SDK framework. This framework allows us to develop our VE-Client components. Each widget or view has a standard structure which will be explained below. But for more information please use the UI-SDK website for all information.

Firstly in this section the term region will be called region or view. These terms refer to the same thing. 

[UI-SDK Homepage](https://arm1s11-eiffel004.eiffel.gic.ericsson.se:8443/nexus/content/sites/tor/jscore/latest/appStructure.html)

UI-SDk provides us with predefined widgets, i.e widgets are essentially small pieces of code that are used and can be reused. for example a combox,datepicker or anything you want to define. It also provides a Rest Interface through AJAX, JScore is an overlay that will interface with the dom through its own API using JSCore functions, Its own widget Library and also its own assets library which containts images for UI for example buttons etc.  

JScore is a wrapper interface built around JQuery. However it has been designed that this can be changed.

Each component is linked together using RequireJs. please see UI-SDK link above.

The VE-Client makes use of this framework and is built on top of UI-SDK. The framework itself outlines the structures of the widgets etc. and their webpage is a good source of information. In simplest terms the VE-Client operates as follows


![Vis App](../images/VisApp.png)	


The diagram above is a simplistic view of the Visualisation Engine App. Their are other parts that are not shown. 

**VisualizationEngineApp** - this is the heart of everything. It calls all required files needed to perform tasks such as creating/deleting a view on screen to loading a dashboard.

**PluginManager** - loads all plugins to the VE-Client in the plugins folder.

**Dashboard Manager** - loads dashboards that have been selected by the user.

**RegionFactory** - creates and starts the region/view to be displayed onscreen.

**CommunicationHandler** - allows the VE-Client to communicate to the VE-server through websocket connection.

**RationDistributionModel or AcyclicDirectedGraphMode**l - these are 2 seperate models that inherit Basemodel. The plugin should inherit one of these models or basemodel directly.

**BaseModel** - this holds the ajax functionality for rest request for the historical data to the VE-Client. 

**BaseRegion** - in simplest terms this is a container for the plugin view and inherits the regionHandler which contains a standard template for all views. It is essential that this is inherited into the project and is a key file in the VE-Client.

**RegionHandler** - this contains and displays the menu bar for each view and the settings associated with that view. Setting are customisable. It also contains code for saving and loading a views configuration.


The flow for a plugin is that it is loaded through the plugin manager and updates the VE-Client UI to allow the user to select. Then once selected the reference of the plugin is passed to the regionFactory and from their an instance of the plugin is created.


##Common Widget Structure
From UI-SDK the standard widget contains 4 files, a html file for the original template, a less file for css and styling, a view js file for interacting with the dom and a main js file that conains the functionality.

In naming the files normally the view and the main file are similiar for example, (selectBoxView and selectBox).

###View js File
The view file interacts with the dom, for example to get an element of the template or to manipulate it in some way. These functions are then called by the main js file. It also loads the less file for styling. All dom manipulations and elements references must be called from here according to UI-SDK framework.

###Less File
This file contains the css for each dom element. If no styling is provided then it follows UI-SDK defaults

###HTML File
This file contains the templae of divs etc for the widget itself. This is just the bare bones, in somecases you can manipulate the dom and add divs and other elements dynamically.

###Main js File
This contains the main functionality of the widget.


![Vis App](../images/widgetStructure.png)
###HTML Example

~~~

	<div class="eaVEApp-wNodeInfo">
	    <h1>Node info:</h1>
	    <div class="eaVEApp-wNodeInfo-info"></div>
	    <input type="text" class="ebInput ebInput_disabled">
		<value="domainId,eventData.resultCode" disabled />
	</div>

~~~

###Less Example

~~~

		.eaVEApp-wNodeInfo {
		    position: relative;
		    padding: 10px;
		
		    &-info {
		        position: absolute;
		        top: 25px;
		    }
		}

~~~

###View Example
**Note:**  in the define it adds a dependency on jscore by the VE-clients RequireJs reference 'jscore/core'.

Within the function it then inherits the View class from jscore and inherits all its functioons using the .extends. the line for code that returns the inherits functions are core.View.extend({ ... });

The next dependency is the html file with the dom element structure followed by the less styling information.

~~~

	define([
	    'jscore/core',
	    'text!./NodeInfo.html',
	    'styles!./NodeInfo.less'
	], function (core, template, style) {
	    'use strict';
	
	    return core.View.extend({
	        getTemplate: function () {
	            return template;
	        },
	
	        getStyle: function () {
	            return style;
	        },
	
	        getInputElement: function () {
	            return this.getElement().find('input');
	        },
	
	        getInfoElement: function() {
	            return this.getElement().find('.eaVEApp-wNodeInfo-info');
	        },
	
	        getValue: function () {
	            return this.getInputElement().getValue();
	        },
	
	        setValue: function (value) {
	            this.getInputElement().setValue(value);
	        }
	    });
	});
~~~

###Main Example

**Note:** in the define it adds a dependency on jscore by the VE-clients RequireJs reference 'jscore/core'.

Within the function it then inherits the widget class from jscore and inherits all its functioons using the .extends. the line for code that returns the inherits functions are core.Widget.extend({ ... });

The next dependency is the view js file and is set by the View:View; line of code.

The last 2 dependencies are from other widgets that will be used in this class.

~~~

	/**
	    Setting for selecting which event keys should be used as information inside the flow chart and cluster chart nodes.
	
	    @class NodeInfo
	*/
	
	define([
	    'jscore/core',
	    './NodeInfoView',
	    'widgets/InfoPopup',
	    'app/config/config'
	], function (core, View, InfoPopup, config) {
	    'use strict';
	
	    return core.Widget.extend({ //inherits the widget class
	        View: View,
	
	        onViewReady: function () {
	            var info = new InfoPopup({
	                content: config.infoPopups.nodeInfo.text
	            });
	
	            info.attachTo(this.view.getInfoElement());
	        },
	
	        /**
	            Returns the currently selected event key or keys.
	
	            @name NodeInfo#getValue
	            @returns {String} comma separated list of event keys
	        */
	        getValue: function () {
	            return this.view.getValue();
	        },
	
	        /**
	            Sets the selected event key or keys.
	
	            @name NodeInfo#setValue
	            @param {String} value - comma separated list of event keys
	        */
	        setValue: function (value) {
	            this.view.setValue(value);
	        }
	    });
	});

~~~

##Common Region Structure for plugins
The Region follows the same widget structure. It contains Less file, html file and view.js and main.js. Standardly their is a region folder and a widget folder. Both will have the same structure. The region will call that widget to perform a task such as draw a chart or create a table for example.

Instead of inheriting the jscore the region inherits the BaseRegion via
BaseRegion.extend({...}); The key functions that **must** be present are:

**onNewModel(model)** - The onNewModel function is called when a new modelled event has been sent from the VE-Server. When the user queries the server the reponse from inside the VE-client is sent from the communicationHandler to the eventBus which it then passed to the region/view. The onNewModel is then given this model and from there this information can be used to create a chart etc. Generally the onNewModel will simply pass this model to the chart widget that is created. This widget follows the same strucutre as any widget that we have discussed above. 

**createDataRequest** - This is the message that is sent to the server. The developer can edit this here depending on what the desired query will be. The VE-standardly has widgets that allow the users to select these values so this can make this more dynamic. But this is down to the developer of the plugin.

Please read model webpage on each attribute. [Model Definition](https://eiffel.lmera.ericsson.se/com.ericsson.duraci/ve-server/usage/model_definitions.html)


###Region Example

~~~

	define([
	    'jscore/ext/utils/base/underscore',
	    './PieChartView',
	    'app/plugins/models/RatioDistributionModel',
	    'app/widgets/PieChart/PieChart',
	    'app/widgets/Popup/Popup',
	    'app/regions/BaseRegion/BaseRegion',
	    'app/widgets/SettingsDialog/ListSelector/ListSelector',
	    'app/lib/utils/MBAttributes',
	    'app/lib/utils/DateTimeUtils',
	    'app/config/config'
	], function (_, View, RDModel, PieChart, Popup, BaseRegion, ListSelector, MBAttributes, DateTimeUtils, config) {
	
	    return BaseRegion.extend({
	
	        View: View,
	        /**
	        Method to initialise the pie region
	        */
	        init: function () {
	            this.model = new RDModel();
	            var columnset = MBAttributes.getDefaultCollection();
	            this.widgetSettings = {
	                groupOn: new ListSelector({
	                    title: "Event keys:",
	                    dataset: columnset,
	                    singleSelection: true,
	                    enabled: false,
	                    defaultGroupOn: 'eventType',
	                    info: config.infoPopups.clusterBase.text
	                })
	            };
	
	            this.settingsTabs = [];
	            this.settingsTabs.push({
	                title: "Pie Settings",
	                widgets: [
	                    this.widgetSettings.groupOn
	                ]
	            });
	        },
	
	        /**
	        Method to get the pie region element and start the pie chart. The events required for this region are also defined in this method
	        */
	        afterOnStart: function () {   
	            this.el = this.view.getPieChartElement();
	
	            // Create a new pie chart with supplied settings and attach it to the this region
	            this.pieChart = new PieChart({model: this.model, aspectRatio: this.aspectRatio, parentUID: this.uid});
	            this.pieChart.attachTo(this.el);
	            // Resized events are sent both for region and browser resizing
	            this.getEventBus().subscribe('resized', this.pieChart.resizePie, this.pieChart);
	
	            this.getRegionHandler().addEventHandler('changeAspectRatioEvent', function (e) {
	                this.pieChart.setAspectRatio(e);
	            }, this);
	
	            this.getRegionHandler().addEventHandler('defaultAspectRatioEvent', function (e) {
	                this.pieChart.setDefaultRatio();
	            }, this);
	
	            this.model.addEventHandler('change', function () {
	                var subscriptionWidget;
	
	                // Only update the view if there is data in the model
	                if (this.model.toJSON().items !== undefined) {
	                    this.pieChart.pieChart.update(this.model.toJSON());
	                    this.pieChart.pieData = this.model.toJSON();
	                    this.pieChart.addClickEvent();
	                }
	
	                this.view.hideLoaderAnimation();
	            }, this);
	
	            this.model.addEventHandler('error', function (errorText) {
	                this.view.hideLoaderAnimation();
	
	                console.error('Failed to load data from ER: %s', errorText);
	            }, this);
	            
	
	            this.getRegionHandler().setConfigurationData();
	        },
	
	        /**
	        Method to return an object containing the UID and size of the region i.e span
	        @return {uid:String , span:String}
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
	        @param modelData - the received model data
	        */
	        onNewModel: function (modelData) {
	            this.model.setAttribute('items', modelData.items);
	        },
	
	        createDataRequest: function (rawSettings, isLiveData) {
	            var requestOptions = {
	                model: 'RatioDistributionModel',
	                modelVersion: '1.0',
	                queryOptions: {
	                    base: rawSettings.typeSettings.groupOn,
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
	        }
	    });
	});

~~~


##Important When Designing a plugin
### RequireJs References ##

The region js file references look like below.

**Plugin Region js file**

<pre>
    'app/plugins/Template/region/TemplateView',
    'app/models/BaseModel',
    'app/regions/BaseRegion/BaseRegion',
    'app/plugins/Template/widgets/TemplateChart'
</pre>

VE-Client has defined links for requireJs to reference a file which are:

app - src/VisualizationEngineApp/ 

jscore  - ui-sdk jscore 

chartlib - ui-sdk chartlib folder

widgets - ui-sdk widgets folder

For example:

<pre>
    'jscore/core',
    'app/plugins/Template/widgets/TemplateChartView',
    'chartlib/base/d3',
    'app/lib/utils/EventController',
    'jscore/ext/utils/base/underscore'
</pre>

**Note:**

It is advised to not use relative paths i.e. ../ or ./ to reference files, This will require the file extension to be added at the end (./TemplateChartView.js). If the user uses this and tries to re-use our predefined widgets through a relative path they will not be found by requireJs. This is because by adding the .js extension, requireJs would not add this automatically. However if the plug-in is standalone and using its own widgets then it may be fine. But be cautious.  