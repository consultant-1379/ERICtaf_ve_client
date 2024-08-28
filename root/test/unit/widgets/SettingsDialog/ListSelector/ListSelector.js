'use strict';
define([
    'jscore/ext/mvp',
    'app/widgets/SettingsDialog/ListSelector/ListSelector',
    'app/lib/utils/MBAttributes'
], function (mvp, ListSelector, MBAttributes) {

    describe('ListSelector', function () {
        var should = chai.should();
        var listSelector;
        var dataset = new mvp.Collection(
            [{
                id: "0a",
                title: "0a",
                isSelected: false,
                parent:"",
                child: null
            },
            {
                id: "0b",
                title: "0b",
                parent:"",
                status:"right",
                child: new mvp.Collection(
                    [{
                        id: "1a",
                        title: "1a",
                        isSelected: false,
                        parent:"0b",
                        child: null
                    },
                    {
                        id: "1b",
                        title: "1b",
                        parent:"0b",
                        status:"right",
                        child: new mvp.Collection(
                            [{
                                id: "2a",
                                title: "2a",
                                isSelected: false,
                                parent:"1b",
                                child: null
                            },
                            {
                                id: "2b",
                                title: "2b",
                                isSelected: false,
                                parent:"1b",
                                child: new mvp.Collection(
                                    [{
                                        id: "3a",
                                        title: "3a",
                                        isSelected: false,
                                        parent:"1b/2b",
                                        child: null
                                    },
                                    {
                                        id: "3b",
                                        title: "3b",
                                        isSelected: false,
                                        parent:"1b/2b",
                                        child: null
                                    }]
                                )
                            }]
                        )
                    }]
                )
            },
            {
                id: "0c",
                title: "0c",
                isSelected: false,
                parent:parent,
                child: null
            }]
        );

        beforeEach(function() {
            listSelector = new ListSelector({title: "Select Columns", dataset:dataset, defaultValue:true });
        });


        afterEach(function() {
            listSelector.destroy();
            listSelector = undefined;
        });
        describe('Methods', function () {

            describe('setSelection(collection:mvp.collection, valueSetTo:boolean, topLevelOnly:boolean)', function () {
                it('should be able to set the default value and on top level only', function () {
                    listSelector.setSelection(dataset, false);
                    listSelector.dataset._collection.get("0a").attributes.isSelected.should.equal(false);
                    listSelector.setSelection(dataset, true,true);
                    listSelector.dataset._collection.get("0a").attributes.isSelected.should.equal(true);
                    listSelector.dataset._collection.get("0b").attributes.child._collection.get("1a").attributes.isSelected.should.equal(false);

                });
                it('should be able to set the default value on lower level as well', function () {

                    listSelector.setSelection(dataset, false);
                    listSelector.setSelection(dataset, true, false);
                    //demoainId field
                    listSelector.dataset._collection.get("0a").attributes.isSelected.should.equal(true);

                    listSelector.dataset._collection.get("0b").attributes.child._collection.get("1a").attributes.isSelected.should.equal(true);

                });


            });

            describe('createTable(model:mvp.model)', function () {
                it("should create a table for selecting items", function(){
                    listSelector.table.getHeaderRow().should.not.equal(undefined);
                });
            });

            describe('loadTableData()', function(){
                beforeEach(function() {
                    listSelector.createTable();
                });

                it('should be able to display top level entry', function(){
                    should.not.exist(listSelector.table.getData()._collection.models[0]);
                    listSelector.loadTableData(); //load top level data
                    listSelector.table.getData()._collection.models[0].attributes.title.should.equal("0a");
                });
                it('should be able to display lower level entry', function(){
                    should.not.exist(listSelector.table.getData()._collection.models[1]);
                    listSelector.loadTableData(listSelector.dataset._collection.get("0b")); //load top level data
                    listSelector.table.getData()._collection.models[1].attributes.title.should.equal("1a");
                });
                it('should be able to display upper level entry from lower lever first entry', function(){
                    should.not.exist(listSelector.table.getData()._collection.models[1]);
                    // go from third level back to the second level
                    var model = new mvp.Model({
                        id: "0b/1b/2b",
                        title: "0b/1b/2b",
                        isSelected: false,
                        parent:"0b/1b/2b",
                        status: "up",
                        child: null
                    });
                    listSelector.loadTableData(model);
                    listSelector.table.getData()._collection.models[1].attributes.title.should.equal("2a");
                });
            });

            describe('tableRowClicked(model:mvp.model)', function () {
                beforeEach(function() {
                    listSelector.createTable();
                    listSelector.loadTableData = function(model) {
                        if (model === undefined){
                            listSelector.table.setData(listSelector.dataset);
                        } else if(model.attributes.title === '0b/1b/'){
                            listSelector.table.setData(listSelector.dataset._collection.get("0b").attributes.child);
                        } else if(model.attributes.title === '0b'){
                            listSelector.table.setData(listSelector.dataset._collection.get("0b").attributes.child);
                        }else if(model.attributes.title === '1b'){
                            listSelector.table.setData(listSelector.dataset._collection.get("0b").attributes.child._collection.get("1b").attributes.child);
                        }

                    };
                });
                it('should be able to select a value', function () {

                    listSelector.setSelection(dataset, false);
                    listSelector.loadTableData();
                    var model = listSelector.table.getData()._collection.get("0c");
                    var row = listSelector.table.getRows()[2];
                    listSelector.dataset._collection.get("0c").attributes.isSelected.should.equal(false);
                    listSelector.tableRowClicked (row, model);
                    listSelector.dataset._collection.get("0c").attributes.isSelected.should.equal(true);

                });
                it('should be able to de-select a value by click the same row again', function () {

                    listSelector.setSelection(dataset, false);
                    listSelector.loadTableData();
                    var model = listSelector.table.getData()._collection.get("0c");
                    var row = listSelector.table.getRows()[2];
                    listSelector.tableRowClicked (row, model);
                    listSelector.dataset._collection.get("0c").attributes.isSelected.should.equal(true);
                    listSelector.tableRowClicked (row, model);
                    listSelector.dataset._collection.get("0c").attributes.isSelected.should.equal(false);

                });
                it('should display lower level item when click item with children', function () {
                    // click "eventData/", the table should go up one level
                    listSelector.loadTableData();
                    listSelector.table.getData()._collection.models[0].attributes.title.should.equal("0a")
                    var model = listSelector.table.getData()._collection.get("0b");
                    listSelector.tableRowClicked (null, model);
                    // this should put us  to the second level columns
                    listSelector.table.getData()._collection.models[0].attributes.title.should.equal("1a");
                    // this should put us  to the third level columns
                    model = listSelector.table.getData()._collection.models[1];
                    listSelector.tableRowClicked (null, model);
                    listSelector.table.getData()._collection.models[0].attributes.title.should.equal("2a");

                });

                it('should go back to upper level when click the first item from lower level item', function () {
                    // click "eventData/", the table should go up one level
                    var model = new mvp.Model({
                        id: "0b/1b/",
                        title: "0b/1b/",
                        isSelected: false,
                        parent:"0b/1b",
                        status: "up",
                        child: null
                    });

                    listSelector.loadTableData(listSelector.dataset._collection.get("0b").attributes.child._collection.get("1b"));
                    listSelector.table.getData()._collection.models[0].attributes.title.should.equal("2a");
                    listSelector.tableRowClicked (null, model);
                    // this should put us back to the top level columns
                    expect(listSelector.table.getData()._collection.models[0].attributes.title).to.equal("1a");
                });
            });
        });

        describe('Single table mode', function () {
            beforeEach(function() {
                listSelector = new ListSelector({title: "Select Columns", dataset:dataset, defaultValue:true, singleSelection:true });
                listSelector.createTable();
                listSelector.loadTableData();
            });

            it('should select one value', function () {
                var model = listSelector.table.getData()._collection.get("0c");
                var row = listSelector.table.getRows()[2];
                listSelector.tableRowClicked (row, model);
                listSelector.dataset._collection._byId["0c"].attributes.isSelected.should.equal(true);

            });
            it('should not change the selection is the same row is clicked twice', function () {
                var model = listSelector.table.getData()._collection.get("0c");
                var row = listSelector.table.getRows()[2];
                listSelector.tableRowClicked (row, model);
                listSelector.dataset._collection.get("0c").attributes.isSelected.should.equal(true);
                listSelector.tableRowClicked (row, model);
                listSelector.dataset._collection.get("0c").attributes.isSelected.should.equal(true);

            });
        });
    });
});