/**
Creates a tree like menu that is configurable
@class FlyoutMenu
*/
define([
    'jscore/core',
    'jscore/ext/dom',
    'jscore/ext/utils/base/underscore',
    'jscore/base/jquery',
    'jqueryui/menu'
], function(core, dom, _, $) {

    return {
        /**
        Generate a callback object
        @name FlyoutMenu#defineCallback
        */
        defineCallback: function(callback) {
            this.callback = callback;
            this.subMenuIdCounter = 0;
            this.currentSelection = {
                selection: "",
                subMenuId: this.subMenuIdCounter
            };
        },
        /**
        Generate a callback object
        @name FlyoutMenu#generateHTML
        @param {Object} jsonObj
        @param {Object} dom element to append to jsonObj values 
        */
        generateHTML: function(jsonObj, element) {
            var keys = _.keys(jsonObj);
            var value = _.values(jsonObj);
            _.each(value, function (v, i) {
                var isArray = _.isArray(v);
                var isEmptyObject = _.isEmpty(v);
                var vtype = typeof v;
                if(vtype === "string") {
                    var listItem = this.createListItem(keys[i]);
                    dom.append(element, listItem);
                } else if(!isEmptyObject && !isArray && vtype === "object" && !this.containsOnlyArrays(v)) {
                    var id = this.subMenuIdCounter.toString(10);
                    var subMenu = this.createSubMenu(keys[i], id);
                    this.subMenuIdCounter++;
                    dom.append(element, subMenu);
                    var selector = "#" + id;
                    var newElement = this.getElement().find(selector);
                    this.generateHTML(v, newElement);
                }
            }, this);
        },
        /**
        Checks Json object for only arrays
        @name FlyoutMenu#containsOnlyArrays
        @param {Object} jsonObj
        @returns {boolean} onlyArrays
        */
        containsOnlyArrays: function(jsonObj) {
            var onlyArrays = true;
            var values = _.values(jsonObj);
            _.each(values, function(value) {
                if(!_.isArray(value)) {
                    onlyArrays = false;
                    return onlyArrays;
                }
            });
            return onlyArrays;
        },
        /**
        Create sub HTML elements
        @name FlyoutMenu#createSubMenu
        @param {Object} item
        @param {String} id
        @returns {Object} subMenuHTML - HTML elements
        */
        createSubMenu: function(item, id) {
            var MAX_NUMBER_OF_CHAR = 16;
            var htmlString;

            var itemShort = item;
            
            if(itemShort && itemShort.length > MAX_NUMBER_OF_CHAR){
                itemShort = itemShort.substring(0,MAX_NUMBER_OF_CHAR)+"..."; 
            }

            if (parseInt(id, 10) <= (this.currentSelection.subMenuId - 1)) {
                htmlString = "<li class='ui-menu-item'><a title='"+item+"' href='#' onClick='return false;' class='ui-state-selected'><span></span>" + itemShort + "</a><ul id=" + id + " ></ul></li>";
            } else {
                htmlString = "<li class='ui-menu-item'><a title='"+item+"' href='#' onClick='return false;'><span></span>" + itemShort + "</a><ul id=" + id + " ></ul></li>";
            }
            var subMenuHTML = core.Element.parse(htmlString);
            var span = subMenuHTML.find("span");
            span.setAttribute("class", "ui-menu-icon ui-icon ui-icon-carat-1-e");
            var ul = subMenuHTML.find("ul");
            ul.setAttribute("class", "ui-menu-icons ui-menu ui-widget ui-widget-content ui-corner-all");
            ul.setAttribute("role", "menu");
            ul.setAttribute("aria-expanded", "false");
            ul.setAttribute("aria-hidden", "true");
            ul.setStyle("display", "none");
            return subMenuHTML;
        },
        /**
        Create item HTML elements
        @name FlyoutMenu#createListItem
        @param {Object} item
        @returns {Object} itemHTML - HTML elements
        */
        createListItem: function(item) {
            var MAX_NUMBER_OF_CHAR = 16;
            var itemHTML;

            var itemShort = item;
            if(itemShort && itemShort.length > MAX_NUMBER_OF_CHAR){
                itemShort = itemShort.substring(0,MAX_NUMBER_OF_CHAR)+"..."; 
            }
            if (this.currentSelection.selection.search(new RegExp(item)) > -1) {
                itemHTML = core.Element.parse("<li class='ui-menu-item'><a title='"+item+"' href='#'' onClick='return false;' class='ui-state-selected'>" + itemShort + "</a></li>");
            } else {
                itemHTML = core.Element.parse("<li class='ui-menu-item'><a title='"+item+"' href='#'' onClick='return false;'>" + itemShort + "</a></li>");
            }
            return itemHTML;
        },
        /**
        Create Tree Menu
        @name FlyoutMenu#createMenu
        @param {Object} element -  create html elements from this element
        */
        createMenu: function(element) {
            var self = this;
            var el = element.element;
            $(el).menu({
                select: function(event, ui) {
                    var subMenus = ui.item.find("ul");
                    // Only fire event if at bottom level of a menu or sub-menu.
                    if(subMenus.length === 0) {
                        var selection = "";
                        var activeParentItems = $(".ui-state-active");
                        activeParentItems.each(function(index, item) {
                            selection += item.text + ".";
                        });
                        try {
                            var clickedItem = $(".ui-state-focus");
                            selection += clickedItem[0].text;
                            // Only change the cluster base if it has changed.
                            if(selection !== self.currentSelection.selection) {
                                // remove all selected items
                                var selectedParentItems = $(".ui-state-selected");

                                selectedParentItems.each(function(index, item) {
                                    $(item).removeClass("ui-state-selected");
                                });

                                // send back selected item
                                self.changeSelection(selection, activeParentItems.length);

                                // set acrive item + all active parents as selected
                                clickedItem.addClass("ui-state-selected");
                                activeParentItems.each(function(index, item) {
                                    $(item).addClass("ui-state-selected");

                                });
                            }

                        }
                        catch(err) {
                            //No item in focus
                        }
                    }
                }
            });
        },
        /**
        Update Tree Menu
        @name FlyoutMenu#updateMenu 
        */
        updateMenu: function() {
            var menuElement = this.getElement().find("#menu");
            this.subMenuIdCounter = 0;
            _.each(menuElement.children(), function(child) {
                child.remove();
            });
            this.generateHTML(this.keyObj, menuElement);
            this.createMenu(menuElement);
        },
        /**
        Sets the default selection of the menu
        @name FlyoutMenu#setDefaultSelection
        @param {String} selection  
        @param {String} id  
        */
        setDefaultSelection: function(selection, id) {
            this.currentSelection = {
                selection: selection,
                subMenuId: id
            };
        },
        /**
        Change the selection of the menu item
        @name FlyoutMenu#changeSelection
        @param {String} selection  
        @param {String} id  
        */
        changeSelection: function(selection, id) {
            this.currentSelection = {
                selection: selection,
                subMenuId: id
            };
            this.callback(selection);
        },
        /**
        Find the list element from the dom
        @name FlyoutMenu#findLiItemByText
        @param {String} itemText
        @returns {Object} Dom element        
        */
        findLiItemByText: function(itemText) {
            return $("li:contains('" + itemText + "')");
        },
        /**
        Get Parent of selected Item
        @name FlyoutMenu#getParentsUntil
        @param {String} item  
        @param {String} selector  - dom selector
        */
        getParentsUntil: function(item, selector) {
            return $(item).parentsUntil(selector);
        },
        /**
        Sets the item as selected to the user
        @name FlyoutMenu#setItemSelected
        @param {String} item  
        */
        setItemSelected: function(item) {
            $(item).addClass("ui-state-selected");
        }
    };
});
