/**
Class to format a json object into a human readable string
@class EventController
*/
define([
    'jscore/ext/utils/base/underscore'
], function (_) {
    'use strict';

    return {
        /**
        Get the values from the key
        @name EventController#getEventValueFromKey
        @param {Object[]} e json
        @param {String} key
        @returns {String} value
        */
        getEventValueFromKey: function(e, key) {
            var keyArray = key.split(".");
            _.each(keyArray, function (d) { // go down as deep as is needed to find if the key exists
                try {
                    e = e[d];               // try to get the next level of the key
                }
                catch (err) { return; }     // if no such key exists then we return undefined
            });
            return e;                       // if the last key level contained a value we return it
        },
        // fastest JSON-flattener found
        /**
        Flattens Json Object
        @name EventController#getEventFlattened
        @param {Object[]} e json
        @returns {Object} result
        */
        getEventFlattened: function (e) {
            var result = {};
            function recurse (cur, prop) {
                if (Object(cur) !== cur) {
                    result[prop] = cur;
                } else if (Array.isArray(cur)) {
                    for(var i=0, l=cur.length; i<l; i++)
                         recurse(cur[i], prop ? prop+"."+i : ""+i);
                    if (l === 0)
                        result[prop] = [];
                } else {
                    var isEmpty = true;
                    for (var p in cur) {
                        isEmpty = false;
                        recurse(cur[p], prop ? prop+"."+p : p);
                    }
                    if (isEmpty)
                        result[prop] = {};
                }
            }
            recurse(e, "");
            return result;
        },

        /**
         Function for converting Json event into a string of Eiffel MB - data
         @name  EventController#showTooltip
         @param {String} eventId
         @return {String} formatted html string of the event data
         */
        showTooltip: function (event) {
            if (typeof(event) !== 'object') {
                return;
            }

            var circular = [], outputTip = "";
            outputTip = JSON.stringify(event, function (key, value) {
                if (typeof value === 'object' && value !== null) {
                    if (circular.indexOf(value) !== -1) {
                        return "self"; // Circular reference found, discard key
                    }
                    if (key === "parent") {
                        return {"id": value.id};
                    }
                    if (key === "children") {
                        var objectList = [];
                        _.each(value, function (v) {
                            objectList.push({"id": v.id});
                        });
                        return objectList;
                    }
                    circular.push(value); // Store value in our collection
                }
                return value;
            }, "\t");
            circular = null; // clear the cache (garbage collection)

            var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
            // make the text readable;
            var message = outputTip.replace(/(\]\,|\}\,)\n\t+(\[|\{)/g, "$1$2")         //place "}," on same line as "{" to save space
                .replace(/\n/g, '<br />')                           //break rows
                .replace(/\t/g, '<span class="tab"></span>')                             //indent
                .replace(exp, "<a href='$1' target='_blank'>$1</a>");                //create the links

            return message;
        }
    };

});