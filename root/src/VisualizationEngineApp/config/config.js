/** Config sets some basic high-level configurations and sets up the list of
    available views
    @class config
*/

/* Note: ClusterView and TableView removed for GA - please uncomment them when
         these views become usable and supported. */

define([
    'jscore/ext/utils/base/underscore'
], function (_) {
    var thumbBase = "./resources/img/";
    return {
        views: [        
        ],
        
        defaultView: {
             title: 'View Options',
             description: "Welcome to the Eiffel Visualization Engine, please choose a view from the dropdown list. If your option is not present in the list then please check that the plug-in is properly deployed.",
             thumbnail: thumbBase+"globe.png"
        },
          
        infoPopups: {
            subscribe: {
                text: "<p>Key and value are taken from Eiffel messages.<p>Query supports AND (&&), OR (||) and NOT (!) operators.</p></p><p>Multiple criteria may be added, but please note that these are concatenated with the OR (||) operator.</p> <p>Visit the VE client <a href=\"https://eiffel.lmera.ericsson.se/com.ericsson.duraci/VisualizationEngineApp/usage/index.html\" target=\"_blank\">usage</a> site on the Eiffel portal for examples and more info.</p>"
            },

            dataMode: {
                textHistory: "Select time interval for retrieving historical data by entering respective start and end date/time.",
                textLive: "Choose to pre-populate the view with historical data by selecting a start date/time."
            },

            updateInterval: {
                text: "Select how frequently updates will be received. Value is seconds. Only valid for live data."
            },

            resize: {
                text: "Set the width of the view. Valid values are 1-12."
            },

            aspectRatio: {
                text: "Uncheck the checkbox to adjust the height of the view. Default value is 10. Valid values are 1-10."
            },

            clusterBase: {
                text: "Select which Eiffel event key to group data on."
            },

            nodesToDisplay: {
                text: "Uncheck the checkbox to limit how many nodes to draw in the view. Default is to draw all nodes. Valid values are 1-200."
            },

            nodeTitle: {
                text: "Select which Eiffel event key should be displayed as the title of each node."
            },

            nodeInfo: {
                text: "Select which Eiffel event key(s) should be displayed as information in each node. Keys should be separated by comma. Default keys are domainId and eventData.resultCode."
            },

            maxGraphs: {
                text: "Use to limit how many graphs will be visible at the same time."
            },

            sortOrder: {
                text: "Select if the graphs should be sorted in ascending or descending order. Default is descending."
            },

            sortQuery: {
                text: "Select which Eiffel event key should be used as base for sorting. Default is to sort on eventTime."
            }
        },

        defaultViewSize: 5,

        defaultClusteringOption: 'eventType',

        supportedEiffelVersion: '2.2.2.0.21',
        // Location for plugins
        serverPluginLocation: "/src/VisualizationEngineApp/plugins", //must have / at beginning for requireJs to find the file
       
        
	/** getViewNames - returns a list of the view titles
            @name config#getViewNames
            @returns list of names, each in the form name: view title
	*/    
        getViewNames: function() {
            return _.map(this.views, function (view) {
                return {name: view.title};
            });
        },

	/** getViewDescription - returns the description of the specified view
            @name config#getViewDescription
            @param {string} A view name
            @returns {string} description of the specified view
	*/    
        getViewDescription: function (name) {
            var item = (_.find(this.views, function (view) {
                return view.title === name;
            }));
            return item ? item.description : undefined;
        },


	/** getViewImage - returns the description of the specified view
            @name config#getViewImage
            @param {string} A view name
            @returns {string} path to the thumbnail for the specified view
	*/    
        getViewImage: function (name) {
            var item = (_.find(this.views, function (view) {
                return view.title === name;
            }));
            return item ? item.thumbnail : undefined;
        },

        /** addViews - specify the the given list of views is to be displayed
            @name config#addViews
            @param views 
        */
        addViews: function(views){
            _.each(views, function(view){
                this.views.push(view);
            }.bind(this));      
        },
         /** addViews - specify the the given list of views is to be displayed
            @name config#addView
            @param view 
        */
        addView: function(view) {
            this.views.push(view);
        }
    };
});
