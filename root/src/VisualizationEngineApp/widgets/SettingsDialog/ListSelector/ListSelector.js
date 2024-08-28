define([
    'app/widgets/GenericSetting/GenericSetting',
    'jscore/ext/utils/base/underscore',
    'widgets/Table',
    'jscore/ext/mvp',
    'app/widgets/SettingsDialog/ListSelector/ListSelectorCell/ListSelectorCell'
], function(GenericSetting, _, Table, mvp, ListSelectorCell) {
    'use strict';
    return GenericSetting.extend({
        
        /**
        Method to add a table for multi layer selections
        @name ListSelector#setContent 
        @param 
        */
        setContent: function() {
            this.dataset = this.options.dataset;
            this.singleSelection = this.options.singleSelection === undefined ? false: this.options.singleSelection;
            this.defaultValue = this.options.defaultValue === undefined ? false: this.options.defaultValue;
            if (!this.singleSelection) {
                // set all top level item to selected
                this.setSelection(this.dataset, this.defaultValue, true);
            } else if (this.options.defaultGroupOn) {
                this.setOneSelected(this.options.defaultGroupOn);
            }
            this.createTable();
            this.loadTableData();
        },
        
        
        /*
         * set the "isSelected" attribute of a collection to the value passed in.
         * @name ListSelector#setSelection
         * @param {mvp.Collection} collection, {true/false} valueToSet, {true/false}topLevelOnly
         */
        setSelection: function(collection, value, topLevelOnly){
            if (topLevelOnly === undefined) {
                topLevelOnly = true;
            }
            _.each(collection._collection.models, function (model) {
                if (model.attributes.child === null) {
                    model.attributes.isSelected = value;
                } else if (!topLevelOnly) {
                    this.setSelection(model.attributes.child, value, topLevelOnly);
                }
            }.bind(this));
        },

        /*
         * set the "isSelected" attribute to true for the item in collection which title attribute matches 
         * the argument.
         * @name  ListSelector#setOneSelected
         * @param {string} title
         */
        setOneSelected: function(title, collection) {
            var coll = collection || this.dataset;

            coll.each(function (item) {
                if (item.getAttribute('child') === null) {
                    if (item.getAttribute('title') === title) {
                        item.setAttribute('isSelected', true);
                    } else {
                        item.setAttribute('isSelected', false);
                    }
                } else {
                    this.setOneSelected(title, item.getAttribute('child'));
                }
            }.bind(this));
        },

        /*
         * create the table to display the entries for selection
         * and calling loading table
         * @name  ListSelector#createTable
         * @param {model}model - the model who owns the items
         */
        createTable: function(model){

            if (this.table !== undefined) {
                this.table.clear();
            }
            var columns = [{
                title: this.options.title,
                attribute: "title",
                cellType: ListSelectorCell
            }];

            this.table = new Table({columns: columns, tooltips: true});

            if (this.view !== undefined) {this.table.attachTo(this.view.getContentElement());}
            this.table.addEventHandler('rowclick', function (row, model) {
                this.tableRowClicked(row, model);
            }.bind(this));
        },
        /*
         * load the entries into the selection table
         * @name  ListSelector#loadTableData
         * @param {model}model - the model who owns the items
         */
        loadTableData: function (model){
            var tableData = new mvp.Collection();
            var inputData = this.dataset;
            var parent = "";
            if (model !== undefined){
                if (model.attributes.status === "up"){
                    var paths = model.attributes.parent.split("/");
                    if (paths.length > 1){
                        parent = paths[0];
                    }
                    for (var i = 1; i < paths.length -1; i++){
                      parent = parent + "/" + paths[i];
                    }

                } else {
                    parent = model.attributes.parent === "" ? model.attributes.title : model.attributes.parent + "/" + model.attributes.title;
                }

                if (parent !== ""){
                    _.each(parent.split("/"), function (path){
                        inputData = inputData._collection._byId[path].attributes.child;
                    });

                    tableData.addModel({"title": parent + "/", "status":"up", "child":undefined, "parent":parent});
                }
            }

            _.each(inputData._collection.models, function (model) {
                tableData.addModel(model);
            });
            this.table.setData(tableData);

            // Set default row selection
            _.each(this.table.getRows(), function (row) {
                var model = row.getData();
                if ((model.attributes.child === null ) && (model.attributes.status !== "up")){
                    if (inputData._collection._byId[model.attributes.title].attributes.isSelected) {
                        row.highlight();
                    }
                }
            });

        },

        /*
         * trigger "selectionChanged" event if the item is not a parent nor with child
         * @name  ListSelector#tableRowClicked
         * @param {table.row} row, {model}model
         */
        tableRowClicked: function(row, model) {
            if ((model.attributes.child !== null ) || (model.attributes.status === "up")){
                this.loadTableData(model);
            } else {
                if(this.singleSelection){
                    if (!row.isHighlighted()){
                        this.setSelection(this.dataset, false, false);
                        this.unhighlightTableRows();
                        this.table.getData()._collection._byId[model.attributes.title].attributes.isSelected = true;
                        row.highlight();
                        this.trigger('selectionChanged', this.dataset);
                    }
                } else {
                    if (row.isHighlighted()) {
                        row.unhighlight();
                    } else {
                        row.highlight();
                    }
                    this.table.getData()._collection._byId[model.attributes.title].attributes.isSelected = row.isHighlighted();
                    this.trigger('selectionChanged', this.dataset);
                }
            } 
        },
        /*
         * Unselect all item in the table
         * @name  ListSelector#unhighlightTableRows
         */
        unhighlightTableRows: function() {
            _.each(this.table.getRows(), function (row) {
                row.unhighlight();
            }.bind(this));
        },

        /*
         * Finds all selected titles by recursion
         * @private
         * @name  ListSelector#_getSelected
         * @param selected {array} parents {string} collection {mvp.Collection}
         * @returns {array} the selected titles
         */
        _getSelected: function(selected, parents, collection) {
            var coll = collection || this.dataset,
                sel = selected || [],
                p = parents || '';

            coll.each(function (item) {
                if (item.getAttribute('child') === null) {
                    if (item.getAttribute('isSelected')) {
                        if (p === '') {
                            sel.push(item.getAttribute('title'));
                        } else {
                            sel.push(p + item.getAttribute('title'));
                        }
                    }
                } else {
                    sel.concat(this._getSelected(sel, p + item.getAttribute('title') + '.', item.getAttribute('child')));
                }
            }.bind(this));

            return sel;
        },

        /*
         * Returns selected rows as an array of strings 
         * @name  ListSelector#getValue
         */
        getValue: function () {           
            if (this.singleSelection) {
                return this._getSelected()[0];
            } else {
                return this._getSelected();  //TODO: Function ONLY returns the selected rows from the current level, should return ALL selected
            }
        },

        /*
         * Selects one row
         * @name  ListSelector#setValue
         * @param value {string} title of row to select
         */
        setValue: function (value) {
           //TODO: Should select rows from an array of strings. eg. ["eventId","eventData.jobInstance"]
            if (value !== undefined && !_.isArray(value)) {
                // Only care about the value part
                this.setOneSelected(_.last(value.split('.')));

                _.each(this.table.getRows(), function (row) {
                    if (row.options.data.getAttribute('isSelected')) {
                        row.highlight();
                    } else {
                        row.unhighlight();
                    }
                });
            }
        }
    });
});
