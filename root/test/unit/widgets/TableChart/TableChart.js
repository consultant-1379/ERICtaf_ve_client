/*global define, describe, it, expect */
define([
    'jscore/ext/mvp',
    'app/widgets/TableChart/TableChart',
    'jscore/ext/utils/base/underscore'
], function (mvp, TableChart, _) {
    'use strict';

    var event1 = {
            "id":"d45cca9f-94ca-4fab-a83c-386b3c1660ff",
            "domainId": "kista",
            "eventId": "d45cca9f-94ca-4fab-a83c-386b3c1660ff",
            "eventType": "EiffelArtifactModifiedEvent2",
            "eventTime": "2013-06-28T08:56:24.992Z",
            "eventData":{
                "jobInstance":"1_LMDeliveryPoller_rnc_main_89.1",
                "jobExecutionId":"544",
                "resultCode": "SUCCESS"
            },
            "eventSource": "FlowEventsDemo"
    };

    var aTableChart;


    describe('TableChart', function () {

        describe('Methods', function () {
            
            

            describe('createTable', function () {
                beforeEach(function() {
                    aTableChart = new TableChart();
                    aTableChart.firstRun = false;
                    aTableChart.createTable();
                });
                afterEach(function() {
                    aTableChart.destroy();
                    aTableChart = undefined;
                });

                it('should have a few default columns', function () {
                    aTableChart.table.getHeaderRow()._cells.length.should.not.equal(0);
                });
                it('should create a table widget', function () {
                    expect(aTableChart.table).to.not.be.undefined;
                });
            });

            describe('getModel(event::Hash)', function () {
                beforeEach(function() {
                    aTableChart = new TableChart();
                    aTableChart.firstRun = false;
                    aTableChart.createTable();
                });
                afterEach(function() {
                    aTableChart.destroy();
                    aTableChart = undefined;
                });

                it('should be a flattened view of original event', function () {
                    var columns = _.keys(aTableChart.tableSettings.columns);
                    var eventModel = aTableChart.getModel(event1);
                    var aColumnKey, aColumnTitle;
                    expect(_.keys(eventModel).length).to.equal(9);
                    for(aColumnKey in columns) {
                        aColumnTitle = aTableChart.tableSettings.columns[aColumnKey].title;
                        expect(eventModel[aColumnTitle]).to.equal(event1[aColumnTitle]);
                    }
                    // missing test case: eventData.jobInstance
                });
            });



            describe('updateTableData(event:Hash)', function () {
                beforeEach(function() {
                    aTableChart = new TableChart();
                     aTableChart.createTable();
                });
                afterEach(function() {
                    aTableChart.destroy();
                    aTableChart = undefined;
                });

                it ('should add the event to the table data collection', function() {
                    expect(aTableChart.dataset._collection.models.length).to.equal(0);
                    aTableChart.updateTableData(event1);
                    expect(aTableChart.dataset._collection.models.length).to.equal(1);
                });
                it('should have the correct data in table row model', function () {
                    aTableChart.updateTableData(event1);
                    expect(aTableChart.dataset._collection.models[0].attributes.eventId).to.equal(event1.eventId);

                });
            });

            describe('setPageSize(requestedPageSize:number)', function () {
                beforeEach(function() {
                    aTableChart = new TableChart();
                    aTableChart.firstRun = false;
                });
                afterEach(function() {
                    aTableChart.destroy();
                    aTableChart = undefined;
                });
                it('should have a pagination widget and a page size of 5', function () {
                    expect(aTableChart.pagination).to.be.undefined;
                    aTableChart.createTablePagination();
                    expect(aTableChart.pagination).to.not.be.undefined;
                    aTableChart.setPageSize(5);
                    expect(aTableChart.paginationSettings.size).to.equal(5);
                });
                it('should ignore changes to pagination if parameter is a non-positive integer', function () {
                    expect(aTableChart.paginationSettings.size).to.not.equal(5);
                    aTableChart.setPageSize(5);
                    expect(aTableChart.paginationSettings.size).to.equal(5);
                    aTableChart.setPageSize(0);
                    expect(aTableChart.paginationSettings.size).to.equal(5);
                    aTableChart.setPageSize(-10);
                    expect(aTableChart.paginationSettings.size).to.equal(5);
                });
            });
            describe('createTablePagination(numberOfPages:number)', function () {
                beforeEach(function() {
                    aTableChart = new TableChart();
                    aTableChart.firstRun = false;
                    aTableChart.createTable();
                });
                afterEach(function() {
                    aTableChart.destroy();
                    aTableChart = undefined;
                });

                it('should initially create a pagination widget with maximum pages 1', function () {
                    expect(aTableChart.pagination).to.be.undefined;
                    aTableChart.createTablePagination();
                    expect(aTableChart.pagination.totalPages).to.equal(1);
                });
                it('should be able to be replaced by another pagination widget with a different number of pages', function () {
                    aTableChart.createTablePagination();
                    expect(aTableChart.pagination.totalPages).to.equal(1);
                    aTableChart.paginationSettings.pageCount = 5;
                    aTableChart.createTablePagination();
                    expect(aTableChart.pagination.totalPages).to.equal(5);
                });
            });
            describe('displayPage(pageNumber:number)', function () {
                beforeEach(function(){
                    aTableChart = new TableChart();
                    aTableChart.firstRun = false;
                    aTableChart.createTable();
                    for(var count = 1; count <= 18; count++) { // add 18 events
                        event1.id = count;
                        aTableChart.dataset.addModel(event1);
                    }
                    aTableChart.setPageSize(aTableChart.paginationSettings.size); // calculate the pages
                    aTableChart.createTablePagination();
                });
                afterEach(function() {
                    aTableChart.destroy();
                    aTableChart = undefined;
                });

                it('should have a pagination widget with 2 pages of different counts', function () {
                    expect(aTableChart.pagination.totalPages).to.equal(2);
                    aTableChart.displayPage(1);
                    expect(aTableChart.displayedData._collection.length).to.equal(10);
                    aTableChart.displayPage(2);
                    expect(aTableChart.displayedData._collection.length).to.equal(8);
                });
                it('should have fault prevention if the parameter is non-positive or bigger than max page number' , function () {
                    aTableChart.displayPage(1);
                    expect(aTableChart.paginationSettings.currentPage).to.equal(1);
                    aTableChart.displayPage(-1);
                    expect(aTableChart.paginationSettings.currentPage).to.equal(1);
                    aTableChart.displayPage(3);
                    expect(aTableChart.paginationSettings.currentPage).to.equal(1);
                });
            });

            describe('setVisibleColumns(columns:collection)', function () {
                var child, list;
                beforeEach(function(){
                    aTableChart = new TableChart();
                    list = new mvp.Collection();
                    list.addModel({
                        "title":"domainId",
                        "isSelected":true,
                        "child":null
                    });
                    list.addModel({
                        "title":"eventId",
                        "isSelected":false,
                        "child":null
                    });
                    child = new mvp.Collection();
                    child.addModel({
                        "title":"jobInstance",
                        "isSelected":true,
                        "child":null
                    });
                    child.addModel({
                        "title":"resultCode",
                        "isSelected":false,
                        "child":null
                    });
                    list.addModel({
                        "title":"eventData",
                        "isSelected":false,
                        "child":child
                    });

                    aTableChart.setVisibleColumns(list);
                });
                afterEach(function() {
                    child = undefined;
                    list = undefined;
                    aTableChart = undefined;
                });
                it('should have the correct number of columns but no data rows', function () {
                    aTableChart.firstRun = false;
                    aTableChart.createTable();
                    aTableChart.table.getHeaderRow()._cells.length.should.equal(2);
                    aTableChart.dataset._collection.models.length.should.equal(0);
                });
                it('should add the event to table data collection', function () {
                    aTableChart.dataset._collection.models.length.should.not.equal(1);
                    aTableChart.updateTableData(event1);
                    aTableChart.dataset._collection.models.length.should.equal(1);
                });
                it('should have the event data in table row model top layer', function () {
                    aTableChart.updateTableData(event1);
                    aTableChart.table.getRows()[0].getData().attributes.should.have.property('eventId', event1.eventId);
                });
                it('should have the event datadfd  in table row model lower layer', function () {
                    aTableChart.updateTableData(event1);
                    aTableChart.table.getRows()[0].getData().attributes.should.have.property('eventData.jobInstance', event1.eventData.jobInstance);
                });
            });

            

        });
    });
});
