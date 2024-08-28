/**
DashboardModel is a UI-SDK mvp model 
@class DashboardModel
*/
define([
    'jscore/ext/mvp'
], function (mvp) {

    return mvp.Model.extend({

        url: "/configuration/dashboards",
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
        Get title attribute from model
        @name DashboardModel#getTitle
        @returns {Object} title
        */
        getTitle: function() {
            return this.getAttribute("title");
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
        Get tags attribute from model
        @name DashboardModel#getTags
        @returns {Object} tags
        */
        getTags: function() {
            return this.getAttribute("tags");
        },
        /**
        Get viewIds attribute from model
        @name DashboardModel#getViewIds
        @returns {Object} viewIds
        */
        getViewIds: function() {
            return this.getAttribute("viewIds");
        }

    });
});