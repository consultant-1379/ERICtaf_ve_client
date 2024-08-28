/**
ViewConfigurationCollections is a UI-SDK mvp Collection of ViewConfigurationModels 
@class ViewConfigurationCollection
*/
define([
    "jscore/ext/mvp",
    "./ViewConfigurationModel"
], function(mvp, ViewConfigurationModel) {

    return mvp.Collection.extend({

        Model: ViewConfigurationModel,
       
        url: "/configuration/views"

    });

});