# Visualization Plugins #

## Introduction ##
This section will describe how to setup a plugin in the VE. Template for the plugin can be found in the plugins folder of the VE from its repository.

For VE purposes a plugin create one region with one chart etc. that is attached to it. 

A view and a region in VE client terms means the same thing.

## Plugin structure ##
The plugin folder structure must contain the following: 

- region 
- widgets 
- resources 
	 - img 

From here the user can add the region into the region folder. This is the main link to the application.
 
The widget folder is there to add any designed widgets that will be used in the plugin.

The resource folder is there to add images,css etc.

Please see standard widget design from ui-sdk webpage.

## Adding a Plugin  ##
From the VE client it comes complete with a template plugin that can be used to make another plugin.

In the plugins folder located in root/src/VisualizationEngineApp/plugins is a plugin.js file. This file is used to add your plugin to the client as a json object.

<pre>
"Template": {
         "location":"Template",
         "description":"This is a template plugin which can be used to demonstrate how to write a plugin. Please take an instance of this plugin from the plugin folder and develop your own.",
         "thumbnail":"./src/VisualizationEngineApp/plugins/Template/resources/img/Template.jpg"
         } 
</pre>

Each plugin configuration will take the form as above.
The json key:

"Template" - is used both for the title of the plugin and the reference that is used internally to create the region. In the front select screen this value will be added to the combobox for the user to select.

"location" - is used to specify the name of the folder and also the name of the file in the region folder. Therefore the folder name and the file name in the region folder must be the same.

"description" -  is the description of the plugin that the user wants to display on screen.

"thumbnail" -  the image the users want to display to give a view of what the plugin looks like.

Once the configuration has been added and saved simply add the new plugin into the plugins folder. Refresh the page of the web browser and it should auto load the plugin.

The VE client will throw errors if they occur on load and likewise any javascript errors will be displayed in the web browser console for the developer to fix.

## RequireJs References ##
The first file must have direct links for requireJs

<pre>
    './TemplateView.js',
    '../../models/DirectedAcyclicGraphModel.js',
    '../../../regions/BaseRegion/BaseRegion.js',
    '../widgets/TemplateChart.js'
</pre>

Once the reference to the base region has been made the user can use requireJs quick links to link things 

app - src/VisualizationEngineApp/ 

jscore  - ui-sdk jscore 

chartlib - ui-sdk chartlib folder

For example:

<pre>
    'jscore/core',
    './TemplateChartView.js',
    'chartlib/base/d3',
    'jscore/ext/utils/base/underscore'
</pre>

All files written by the user must end in .js. but as you can see the references that have been predefined do not. i.e. 'jscore/core'

## Base Region ##

The base region can be inherited in the following way using requireJs functionalty.

<pre>
	define ([../../../regions/BaseRegion/BaseRegion.js'],function(BaseRegion) {

	return BaseRegion.extend({

		...some code goes here

	});
});
</pre>
What is the importance of the base region? When the user inherits the base region they inherit certain region features that have been created and can be used by the developer. The Base region itself inherits the regionHandler
but it mostly contains event handlers that are added to the region handler below. 

The regionhandler js file itself creates the look and feel,widget settings etc. that is generic for all regions. 	


1. Look and Feel - The Base region inherits css and other styling information automatically for the plugin. The user can make additions if required from the plugin itself.

2. Widget Settings - The base region comes with common region settings for example to subscribe to events, control server communication, resize the region on screen, change aspect ratio etc. (for some settings additional code maybe required from inside the plugin)

3. Live data - Once the user uses the subscription widget all data from the server is passed through the base region and can be used from the plugin regions js file. From the template this function will give the region the model from the server. The model from here is passed for example to a d3 chart etc. The User can take this model, convert to json and define what the plugin will do with the data provided by the server.

To convert a model to json it is as simple as:

<pre>
onNewModel: function(model) {
	model.toJSON();
}
</pre>

## Adding Widget Settings in a new Tab from the Region ##
When linking the plugin to the base region it will inherit certain functions i.e widgets for subscription, resizing. Once the subscription is made it will allow the events to pass to this region from the onNewModel function.


From the plugin region the developer can add new widgets for settings into widget settings for that plugin.

To add widget settings to the settings dialogbox as a new tab. First the user must create an object and add the new settings widgets to it. This is only for simplicity.

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

## Saving a Configuration  ##
Each widget settings must have a 

1. getValue() function return  value of widget 
2. setValue() function set the value of the widget


These values are used to save the dashboard configuration to the server and must be implemented in whatever widget you are creating otherwise if the user tries to reload there dashboard they will not be saved.

This data is converted from json for either get or setting of the value.

These methods are called lower down when loading or saving a dashboard in the Regionhandler.



## Other information ##
The Visualization Engine has libraries and external js files for drawing d3 components and model conversion etc. in the ext and lib folder. The developer is free to use them as part of their project.  