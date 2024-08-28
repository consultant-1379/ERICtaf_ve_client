/**
Message Bus Attributes is designed to return a list of attributes
@class MBAttributes
*/
define([
    'jscore/ext/utils/base/underscore',
    'app/lib/template/MessageBusTemplate',
    'jscore/ext/mvp'
], function (_, MessageBusTemplate, mvp) {
    'use strict';

    return {
    
        /**
        The two (2) methods below grab hard-coded data from the MessageBusTemplate
        file. Can be useful for filling the table with an initial list of columns.
        Get the Default MessageBustTemplate Options (column header format)
        @name MBAttributes#getDefaultHeaders
        @returns {Object} ColumnHeaders
        */
        getDefaultHeaders: function() {
            return this.getColumnHeaders([MessageBusTemplate.getDefaultOptions()]);
        },

        /**
        Get the Default MessageBustTemplate Options (collection format)
        @name MBAttributes#getDefaultCollection
        @returns {Object} DataCollection        
        */
        getDefaultCollection: function() {
            return this.getDataCollection([MessageBusTemplate.getDefaultOptions()]);
        },

        /**
        Method to initiate recursively getting all non-object key-value pairs from event
        @name MBAttributes#getModel
        @param {Object} event object
        @returns {Map} map 
        */
        getModel: function(event) {
            return this.getModelRecursive({}, event);
        },

        /**
        Method to recursively get all non-object key-value pairs from event
        @name MBAttributes#getModelRecursive
        @param {Map} map 
        @param {Object} event object
        @returns {Map} map 
        */
        getModelRecursive: function(map, obj) {
            var keys = _.keys(obj);
            var values = _.values(obj);
            _.each(values, function(v,i) {
                if(typeof v !== 'object')
                    map[keys[i]] = v;
                else
                    map = this.getModelRecursive(map, v);
            }.bind(this));
            return map;
        },
        /**
        Method that will not use recursion to get the first level keys and values;
        @name MBAttributes#getModelWithoutRecursion
        @param {Map} - map object
        @param {Object} - object to be parsed
        @returns {Map} map
        */
        getModelWithoutRecursion: function(map, obj) {
			var keys = Object.keys(obj);
			for (var i=0;i<keys.length;i++) {
				map[keys[i]] = obj[keys[i]];
			}
			return map;
		},

        /**
        Method to create a eventCollection of eventModels from events.
        Parses Json Arrays
        @name MBAttributes#getDataCollection
        @param {Object[]} jsonArray
        @returns {Object[]} collection of models
        */
        getDataCollection: function(jsonArray) {
            return this.getRecursiveDataCollection(jsonArray[0]);
        },

        /**
        Method to recursively get objects within events
        @name MBAttributes#getRecursiveDataCollection
        @param {Object[]} jsonArray
        @param {String} parent
        @returns {Object[]} collection of models
        */
        getRecursiveDataCollection: function(obj, parent) {
            var parentCollection = new mvp.Collection();
            if (parent === undefined){
                parent = "";
            }
            var keys = _.keys(obj);
            _.each(keys, function (key) {
                var value = obj[key];
                parentCollection.addModel({
                    id: key,
                    title: key,
                    isSelected: false,
                    parent:parent,
                    child: null
                });
                if (typeof value === 'object') {
                    var childCollection = this.getRecursiveDataCollection(value, parent === "" ? key : parent + "/" + key);
                    parentCollection.getModel(key).set("child", childCollection);
                    parentCollection.getModel(key).set("status","right");
                }
            }.bind(this));
            return parentCollection;
        },

        /**
        Get Selected items as array of title:value pair.  for children, the values is "parent:child:groundchild"
        @name MBAttributes#getSelectedItems
        @param {Object[]} collection
        @param {String} parent
        @param {Object[]} selectedItems
        @return {Object[]} collection of selectedItems
        */
        getSelectedItems: function(collection, parent, selectedItems) {
            if (selectedItems === undefined ) { selectedItems = [];}
            if (parent === undefined){
                parent = "";
            }
            _.each (collection._collection.models, function (model) {
                var key = model.attributes.title;
                if (model.attributes.child !== null) {
                    this.getSelectedItems(model.attributes.child, parent === "" ? key : parent + "." + key, selectedItems);
                } else {
                    if (model.attributes.isSelected){
                        var itemValue = parent === "" ? key : parent + "." + key;
                        selectedItems.push({title: itemValue, attribute: itemValue});
                    }
                }
            }.bind(this));
            return _.uniq(selectedItems, false);
        },

        /**
        Merge two collections. Does not destroy collections.
        @name MBAttributes#mergeCollections
        @param {Object[]} collection1
        @param {Object[]} collection2
        @returns {Object[]} a new collection
        */
        mergeCollections: function(collection1, collection2) {
            var tempCollection = new mvp.Collection();
            _.each (collection1._collection.models, function (model) {
                tempCollection.addModel(model);
            });
            return this.mergeRecursiveCollection(tempCollection, collection2);
        },

        /**
        Method to merge collection 2 into collection 1
        @name MBAttributes#mergeRecursiveCollection
        @param {Object[]} collection1
        @param {Object[]} collection2
        @returns {Object[]} merged collection1
        */
        mergeRecursiveCollection: function(collection1, collection2) {

            // Iterate through collection 2
            if (collection2 !== null && collection2._collection.models !== undefined) {
                _.each(collection2._collection.models,  function (model) {

                    if (collection1 !== null) {
                        // check if collection 1 contains the same models as collection 2
                        if (collection1._collection._byId[model.id] === undefined) {
                            // add model from collection 2 to collection 1
                            collection1.addModel(model);
                        } else {
                            // replace collection 1 child's null collection with collection 2 child collection
                            if (collection1._collection._byId[model.id].attributes.child === null) {
                                collection1._collection._byId[model.id].attributes.child = model.attributes.child;
                            }
                            else if (model.attributes.child !== null) {
                                // Recursively call this method if both collections the same model with potentially different child collections
                                this.mergeRecursiveCollection(collection1._collection._byId[model.id].attributes.child, model.attributes.child);
                            }
                        }
                    }
                }.bind(this));
            }
            return collection1;
        },

        /**
        Method for creating an array of column
        headers for the tableChart Widget
        @name MBAttributes#getColumnHeaders
        @param {Object[]} event  = JSON formatted object
        @param {Object[]} eventKeys  = IGNORE THIS PARAMETER.
                            parameter used to call
                            method recurisvely
        @returns {Map} key:value map  
        */
        getColumnHeaders: function (event, eventKeys) {
            var obj = {};
            if (eventKeys === undefined) {
                eventKeys = [];
                obj = event[0];
            }
            _.each(_.keys(obj), function (key) {
                var value = obj[key];
                if(typeof value !== 'object')
                    eventKeys.push({title: key, attribute: key});
                else
                    eventKeys = this.getColumnHeaders(value, eventKeys);
            }.bind(this));

            return _.uniq(eventKeys, false);
        }
    };
});