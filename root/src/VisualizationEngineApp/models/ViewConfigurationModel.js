/**
ViewConfigurationModel is a UI-SDK mvp model 
@class ViewConfigurationModel
*/
define([
    'jscore/ext/mvp'
], function (mvp) {

    return mvp.Model.extend({

        url: "/configuration/views",
        /**
        Parse Backbone response and convert _.Id to Id in the response object
        @name DashboardModel#getId
        @returns {Object} resp - response from backbone and server
        */
        parse: function(resp) {
            resp.id = resp._id;
            return resp;
        },
        /**
        Get Id attribute from model
        @name DashboardModel#getId
        @returns {Object} Id
        */
        getId: function() {
            return this.getAttribute("_id");
        },
        /**
        Get author attribute from model
        @name DashboardModel#getAuthor
        @returns {Object} author
        */
        getAuthor: function() {
            return this.getAttribute("author");
        },
        /**
        Get type attribute from model
        @name DashboardModel#getType
        @returns {Object} type
        */
        getType: function() {
            return this.getAttribute("type");
        },
        /**
        Get model attribute from model
        @name DashboardModel#getModel
        @returns {Object} model
        */
        getModel: function() {
            return this.getAttribute("model");
        },
        /**
        Get title attribute from model
        @name DashboardModel#getTitle
        @returns {Object} title
        */
        getTitle: function() {
            return this.getAttribute("title");
        },
        /**
        Get subscription attribute from model
        @name DashboardModel#getSubscription
        @returns {Object} subscription
        */
        getSubscription: function() {
            return this.getAttribute("subscription");
        },
        /**
        Get queryOptions attribute from model
        @name DashboardModel#getQueryOptions
        @returns {Object} queryOptions
        */
        getQueryOptions: function() {
            return this.getAttribute("queryOptions");
        },
        /**
        Get span attribute from model
        @name DashboardModel#getSpan
        @returns {Object} span
        */
        getSpan: function() {
            return this.getAttribute("span");
        },
        /**
        Get aspectRatio attribute from model
        @name DashboardModel#getAspectRatio
        @returns {Object} aspectRatio
        */
        getAspectRatio: function() {
            return this.getAttribute("aspectRatio");
        },
        /**
        Get tags attribute from model
        @name DashboardModel#getTags
        @returns {Object} tags
        */
        getTags: function() {
            return this.getAttribute("tags");
        },
        /**
        Get typeSettings attribute from model
        @name DashboardModel#getTypeSettings
        @returns {Object} typeSettings
        */
        getTypeSettings: function() {
            return this.getAttribute("typeSettings");
        }

    });
});