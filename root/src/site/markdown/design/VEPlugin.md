#Eiffel Visualization Engine (Client)

## Visualization Plugins #

### Introduction ##
This section will describe how to setup a plugin in the VE. Template for the plugin can be found in the plugins folder of the VE from its repository.

A plugin consists of a region and can contain charts or widgets depending on the design.  

A view and a region in VE client terms means the same thing.

### Plugin structure ##
The plugin folder/file structure must contain the following: 

- region 
- widgets 
- resources 
	 - img 
- plugin.js (file)


![Structure](../images/pluginStructure.png)	


From here the user can add the region into the region folder. This is the main link to the application.
 
The widget folder is there to add any designed widgets that will be used in the plugin.

The resource folder is there to add images,css etc.

The plugin.js file stores information that the VE-Client will use on the client

### UI-SDK Homepage ##

The VE-Client uses the UI-sdk framework. Please see standard widget design from ui-sdk webpage.

[UI-SDK Homepage](https://arm1s11-eiffel004.eiffel.gic.ericsson.se:8443/nexus/content/sites/tor/jscore/latest/appStructure.html)

### Designing a Plugin  ##

[For Beginners](pluginDesign.html)

When Designing a plugin the developer must install the server and client. The message bus enviroment which the developer can use to test the plugin can also be setup to return actual events.

The developer can then create the plugin using the client in order to test that this works.
 
The Client has a template plugin in the plugins folder this can be used as a base to create your own plugin.

UI-SDK (YMER) cdt tool can also be used but it will not have the ability to subscribe to events.


### Plugin Storage  ##
All Plugins written will be stored in a Eiffel Community plugins repository seperate to the client core. Please see link below.

[VE-Community-Plugins](https://eiffel.lmera.ericsson.se/com.ericsson.duraci/ve-client-plugins/index.html)


### Adding a Plugin  ##
The VE client comes complete with a template plugin that can be used to make another plugin.

In the plugin folder a plugin.js file must exist. This file is used to add your plugin to the client via a json object. It is automatically parsed onload of the ve client and added to the site. If their is no plugin.js file then it will not appear in the ve-client as an option.

<pre>
define(function () {
    return {
        plugin: [
            {       
    
                    description: "This is a template plugin which can be used to demonstrate how to write a plugin. Please take an instance of this plugin from the plugin folder and develop your own.",
                    thumbnail: "./src/VisualizationEngineApp/plugins/Template/resources/img/Template.jpg"
                
            }
        ]
    };
});
</pre>

Each plugin configuration will take the form as above.
The json key:


"description" -  is the description of the plugin that the user wants to display on screen.

"thumbnail" -  the image the users want to display to give a view of what the plugin looks like.

Once the configuration has been added and saved simply add the new plugin into the plugins folder. Refresh the page of the web browser and it will auto load the plugin.

The VE client will throw errors if they occur on load and likewise any javascript errors will be displayed in the web browser console for the developer to fix.

### RequireJs References ##
The region js file references look like below.

<pre>
    'app/plugins/Template/region/TemplateView',
    'app/models/BaseModel',
    'app/regions/BaseRegion/BaseRegion',
    'app/plugins/Template/widgets/TemplateChart'
</pre>

VE-Client has defined links for requireJs to reference a file which are:

**app** - Visualization Engine current directory i.e. src/VisualizationEngineApp/ 

**jscore**  - ui-sdk jscore 

**chartlib** - ui-sdk chartlib folder

**widgets** - ui-sdk widgets folder

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

### Base Region ##

The base region extends in the following way using requireJs functionalty.

<pre>
	define (['app/regions/BaseRegion/BaseRegion'],function(BaseRegion) {

	return BaseRegion.extend({

		...some code goes here

	});
});
</pre>
What is the importance of the base region? When the user extends the base region they inherit certain region features that have been previously created and can be used by the developer. The Base region itself creates an instance of the regionHandler. It configures the region handler for use with that region which in turn provides an automatic region handler for plugin development.

The Base Region mostly contains event handlers that are added to the region handler below. 

The regionhandler js file itself creates the look and feel, widget settings etc. that is generic for all regions. The regionHandler creates the menu bar at the top of a view which contains the widget settings for the specific view. It is possible to customise these options.

![Base Region](../images/regionBar.png)	


1. Look and Feel - The Base region inherits css and other styling information automatically for the plugin. The user can make additions if required from the plugin itself.

2. Widget Settings - The base region comes with common region settings for example to subscribe to events, control server communication, resize the region on screen, change aspect ratio etc. (for some settings additional code maybe required from inside the plugin)

3. Live data - Once the user uses the subscription widget all data from the server is passed through the base region and can be used from the plugin regions js file. From the template this function will give the region the model from the server. The model from here is usually passed for example to a d3 chart etc. The user can take this model, which is a parsed json object and converted to a javascript object to define what the plugin will do with the data provided by the server.

To show in a browsers web console a model it is as simple as:

<pre>
onNewModel: function(model) {
	console.log(model);
}
</pre>

### Subscription Request to Server ##
In the plugin region there is a function "createDataRequest". This is used to create the configuration to be sent to the server for subscribing to events. It is used for both live data view and historical data requests. 

If this method is missing then the subscription will not be made and an error will be thrown. The base region calls this method when a subscription has been made to generate the request to the server.

When designing the plugin please note that the predefined models used are the DirectedAcyclicGraphModel and RatioDistributionModel have different sets of options that can be added. This in turn may require adding settings widgets to the settings dialog. The flow chart and pie chart have these widgets predefined so this is possible to reuse. 


Example:

<pre>
createDataRequest: function (rawSettings, isLiveData) {
            var requestOptions = {
                model: 'RatioDistributionModel',
                modelVersion: '1.0',
                queryOptions: {
                    base: "eventId",
                    startDate: rawSettings.datePicker.startDate.toISOString(),
                    endDate: rawSettings.datePicker.endDate.toISOString()
                }    
            };

            if (isLiveData) {
                requestOptions.updateInterval = rawSettings.updateInterval;
                delete requestOptions.queryOptions.endDate;
            }

            return requestOptions;
        }
</pre>

When making subscription requst if the developer wants to change the model they wish to receive from the server then the string for "model" and "modelVersion" can be updated to the name of the model and version they want to use. 

### Adding Widget Settings in a new Tab from the Region ##
When the plugin extends the base region it will inherit certain functions i.e widgets for subscription, resizing. Once the subscription is made it will allow the events to pass to this region from the onNewModel function.


From the plugin region the developer can add new widgets for settings into widget settings for that plugin.

To add widget settings to the settings dialogbox as a new tab: First the user must create an object and add the new settings widgets to it. This is only for simplicity.

<pre> 
		this.widgetSettings = {
                clustering: new Clustering(),
                fadeout: new Resizer({title: "Fade out nodes in (h)", min: 0, max: 255,value:fadeoutValue}),
                columns: new Resizer({title: "Nodes/row", value: columnValue})
            };
</pre>

Next step is to add them as a tab to the widget settings. Follow the structure below. Push the object that takes (title: String) and (widgets: Array of widgets) 

<pre>
            this.settingsTabs = [];
            this.settingsTabs.push({
                title: "Clustering Settings",
                widgets: [
                    this.widgetSettings.clustering,
                    this.widgetSettings.fadeout,
                    this.widgetSettings.columns
                ]
            });
</pre>

### Saving a Configuration  ##
Each widget settings must have a 

1. getValue() function return  value of widget 
2. setValue() function set the value of the widget


These values are used to save the dashboard configuration to the server and must be implemented in whatever widget you are creating otherwise if the user tries to reload their dashboard the view settings will not have been saved.

This data is converted from json for either get or setting of the value.

These methods are called lower down when loading or saving a dashboard in the Regionhandler.



### Other information ##
The Visualization Engine has libraries and external js files for drawing d3 components and model conversion etc. in the ext and lib folder. The developer is free to use them as part of their project.  