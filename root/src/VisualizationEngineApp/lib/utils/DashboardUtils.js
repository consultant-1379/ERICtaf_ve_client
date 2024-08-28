/**
Utilities used by the dashboardManager
@class DashboardUtils
*/
define([
    'jscore/ext/utils/base/underscore',
    'widgets/Tree'
    ],function (_, Tree) {

    return {

        /**
        Instantiates a Tree widget who's items can be configured to have a checkbox
        beside them or not.  If the Tree widget is specified not to contain checkboxes
        an event handler is set to fire when a bottom level item, i.e. a dashboard item, is selected.
        @name DashboardUtils#createTreeWidget
        @param checkbox - boolean to indicate whether checkboxes should be shown.
        @returns {Object} - a Tree widget.
        **/
        createTreeWidget: function(dashboardCollection, checkbox, callback) {
            var tree = new Tree({items: this.createTreeWidgetItems(dashboardCollection, checkbox)});
            if(!checkbox) {
                tree.addEventHandler("itemselect", function(item) {
                    var hasChildren = item.options.item.children;
                    if(!hasChildren) {
                        var dashboardItem = item.options.item;
                        var author = dashboardItem._parent.label;
                        var title = dashboardItem.label;
                        callback(author, title);
                    }
                }.bind(this));
            }
            
            return tree;
        },

        /**
        Creates nested Tree widget item array grouping dashboards by author.
        @name DashboardUtils#createTreeWidgetItems
        @param {Object} checkbox - boolean to indicate whether checkboxes should be shown.
        @returns - {Object} array of items which can be passed to a Tree widget.
        **/
        createTreeWidgetItems: function(dashboardCollection, checkbox) {
            var uniqueAuthors = [];
            var items = [];

            dashboardCollection.each(function(model) {
                var author = model.getAuthor();
                var existingAuthor = _.contains(uniqueAuthors, author);
                if(!existingAuthor) {
                    uniqueAuthors.push(author);
                    items.push(this.createUserItem(author, checkbox));
                }
            }.bind(this));
           
            _.each(items, function(item) {
                dashboardCollection.each(function(model) {
                    if(model.getAuthor() === item.label) {
                        var title = model.getTitle();
                        var dashboardItem = this.createDashboardItem(title, checkbox);
                        item.children.push(dashboardItem);
                    }
                }.bind(this));
            }.bind(this));

            return items;
        },

        /**
        Creates a tree widget item to represent a user.
        @name DashboardUtils#createUserItem
        @param {String}author - the author of the dashboard.
        @param {Object} checkbox - boolean to indicate whether checkbox should be shown.
        @returns {Object} - a tree widget item.
        **/
        createUserItem: function(author, checkbox) {
            if(checkbox) {
                return {label: author, icon: "folder", checkbox:{value:author}, children: []};
            }
            else {
                return {label: author, icon: "folder", children: []};
            }
        },

        /**
        Creates a tree widget item to represent a dashboard.
        @name DashboardUtils#createDashboardItem
        @param {String} title - the title of the dashboard.
        @returns {Object}- a tree widget item.
        **/
        createDashboardItem: function(title, checkbox) {
            if(checkbox) {
                return {label: title, icon: "newFile", checkbox:{value:title, checked:false}};
            }
            else {
                return {label: title, icon: "newFile"};
            }
        },
    };
});
