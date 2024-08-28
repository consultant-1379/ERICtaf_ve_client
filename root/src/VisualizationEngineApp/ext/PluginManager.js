/**
PluginManager loads all plugins to the application
@class PluginManager
*/
define([
    'jscore/core',
    'jscore/ext/utils/base/underscore',
    'app/config/config',
    'jscore/ext/net'  
], function(core, _, pluginConfig, net) {
    'use strict';
    
 return core.Widget.extend({
        /**
        Method to get the plugin informaation from the plugin.js file in the plugins folder create the region from the plugin
        @name PluginManager#getPlugins
        @returns Map =  Map of the plugin regions to be loaded, the map key is the name of the plugin
        */
        getPlugins : function() {       
        this.map = {};
        var location = pluginConfig.serverPluginLocation.replace(/\//g, '%2F');
        net.ajax({
                url: "/socket.io/dir/folder/"+location,
                dataType: "json",
                success: function(data){
                     var folders = data.folders;
                       _.each(folders, function(key){  
                            require ([pluginConfig.serverPluginLocation+'/'+key+'/region/'+key+'.js',pluginConfig.serverPluginLocation+'/'+key+'/plugin.js'], function(region,settings) {
                                 this.map[key] =  region;
                                 if(settings) {
                                    settings.plugin[0].title = key;
                                    this.trigger("pluginDataEvent",settings.plugin[0]);
                                 }
                            }.bind(this), function() {
                                console.log('Error loading plugin configuration, Please check your configuration for: '+key);
                            });
                          
                   }.bind(this));                                                                        
                }.bind(this)
        });
                                
                                        
            return this.map;    
        }
      
              
    });
       

});
