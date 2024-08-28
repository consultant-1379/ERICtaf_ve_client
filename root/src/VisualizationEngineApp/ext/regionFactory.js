/**
RegionFactory creates an instance of that region to be displayed on screen
@class RegionFactory
*/
define(function() {
    'use strict';
    
    function RegionFactory() {}
    /**
    Dynamically loads an instance of a region and loads it, if not present then loads integrated one.
    @name RegionFactory#create
    @param {String} type
    @param {Object} options contains plug-in references, configuration references etc
    */
    RegionFactory.create = function(type, options) {
        var newRegion;
        var plugins = options.plugin;
        if(typeof RegionFactory[type] !== 'function') {
             if(typeof plugins[type] !== 'undefined') {
                newRegion = new plugins[type]({context: options.context, configurationData:options.configurationData});
            }
             else {
                throw new Error('Can\'t create ' + type + ', factory method doesn\'t exist'); 
            }             
                                 
        }
            
        return newRegion;
    };
       

    return RegionFactory;
});
