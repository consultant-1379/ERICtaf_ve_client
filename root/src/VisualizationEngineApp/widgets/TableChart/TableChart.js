define(['jscore/core',
    './TableChartView',
    "jscore/ext/mvp",
    'jscore/ext/utils/base/underscore',
    'widgets/Table',
    'widgets/Pagination',
    'app/widgets/Popup/Popup',
    'app/widgets/Popup/EventLook/EventLook',
    'app/lib/utils/MBAttributes',
    'app/lib/utils/EventController',
    'jscore/base/jquery'
], function (core, View, mvp, _, Table, Pagination, Popup, EventViewer, MBAttributes, EventController, $) {
    'use strict';

    return core.Widget.extend({
        View: View,

        init: function() {
            this.parentUID = this.options.parentUID;

            this.dataset = new mvp.Collection();
            this.displayedData  = new mvp.Collection();
            
            this.firstRun = true;

            this.tableSettings = {
                sortable: this.options.sortable?this.options.sortable:true,
                sortingColumn: "eventTime",
                sortingMode: "desc",
                columns: MBAttributes.getDefaultHeaders()
            };

            this.paginationSettings = {
                size: 10,   // 10 events/page to begin with
                pageCount: 1,  // 1 page available at start
                currentPage: 1, // show first page
                spacesLeft: 10  // count of event spaces remaining on last page (to know when to add new page)
            };

            this.event = {pageX:0, pageY:0};
        },

        /*
         * create the table to display the events
         * and calling loading table
         * @method: createTable
         * @param:
         */
        createTable: function() {
            if (this.firstRun) {
                return;
            }
            
            if (!_.isUndefined(this.table)) {
                this.table.destroy();
            }

            if(this.tableSettings.sortable === true) {
                _.each(this.tableSettings.columns, function(column) {
                    column.sortable = true;
                });
            }

            //create the table
            this.table = new Table({columns: this.tableSettings.columns, tooltips: true});

            //recalculate and bind the displayedData to the table
            this.displayPage(this.paginationSettings.currentPage);

            this.table.attachTo(this.view.getContentElement());

            this.table.getElement().find("*").addEventHandler("mousedown", function(event) {
                this.event = event.originalEvent;
            }, this);

            this.table.addEventHandler('rowclick', function (row, model) {
                this.tableClickHandler(row, model);
            }, this);

            this.table.addEventHandler("sort", function(attribute, sortingMode) {
                this.dataset.sort(attribute, sortingMode);
                this.tableSettings.sortingColumn = attribute;
                this.tableSettings.sortingMode = sortingMode;
                if (this.pagination !== undefined) {
                    this.displayPage(this.paginationSettings.currentPage);
                }
            }, this);
        },

        /*
         * display a particular page in a paginated table
         * @method: displayPage
         * @param: pageNumber (positive integer page number to display)
         */
        displayPage: function(pageNumber) {
            if (pageNumber > 0 && pageNumber <= this.paginationSettings.pageCount) {
                var startPosition = ((pageNumber - 1) * this.paginationSettings.size);
                var endPosition = Math.min((startPosition + this.paginationSettings.size - 1), (this.dataset.size() - 1));
                this.displayedData._collection.reset(this.dataset._collection.slice(startPosition, endPosition + 1));

                this.paginationSettings.currentPage = pageNumber;
                if (!_.isUndefined(this.table)) {
                    this.table.setData(this.displayedData);
                }
            }
        },

        /*
         * replace the pagination widget with one that has max number of pages numberOfPages
         * @method: createTablePagination
         * @param: numberOfPages (positive integer maximum number of pages the pagination widget will handle)
         */
        createTablePagination: function() {
            if (this.firstRun) {
                return;
            }

            if (!_.isUndefined(this.pagination)) {
               this.pagination.destroy();
            }

            this.pagination = new Pagination({
                pages: this.paginationSettings.pageCount,
                selectedPage: this.paginationSettings.currentPage
            });
            this.pagination.attachTo(this.getElement());

            this.pagination.addEventHandler("pagechange", function (pageNumber) {
                this.displayPage(pageNumber);
            }, this);
        },

        /*
         * set the page size to the requested page size (this routine
         * is called by the pageSizeChanged handler when
         * the user changes the setting of the pageSizeSelect)
         * @method: setPageSize
         * @param: requested page size (non-negative integer requestedPageSize) 
         */
        setPageSize: function(requestedPageSize) {
            if (requestedPageSize > 0) {
                //must have at least one page even if table is empty, otherwise, at least as of November 14, 2013, the  pagination widget
                //display may cause confusion ("<  >")
                var newMaxPages = Math.max(Math.ceil((this.dataset.size()) / requestedPageSize), 1);
                var newCurrentPage = 1;
                if (this.pagination) { // if paginagion already exists, recalculate currentPage
                    newCurrentPage = Math.ceil((((this.paginationSettings.currentPage - 1) * this.paginationSettings.size) + 1) / requestedPageSize);
                }
                this.paginationSettings.size = requestedPageSize;
                this.paginationSettings.currentPage = newCurrentPage;
                this.paginationSettings.pageCount = newMaxPages;
                this.paginationSettings.spacesLeft = (requestedPageSize * newMaxPages) - this.dataset.size();
            }
        },

        /*
         * extract the data of the event for selected columns
         * and format it as a model(hash)
         * @method: getModel
         * @param: {EventModel} event
         * @return: formatted model {"eventID":"92839283-2398923", "eventData.jobInstance":"1_LMDeliveryPoller_rnc_main_89.1",....}
         */
        getModel: function(event){
            var model = {};
            model.eventId = event.eventId;
            model = EventController.getEventFlattened(event);
            return model;
        },

        /*
         * insert the new event to the table
         * @method: updateTableData
         * @param: {eiffel Event} event
         */
        updateTableData: function(event) {
            // add the new data
            var model = this.getModel(event);
            this.dataset.addModel(model);

            // if this is the first run, create the table and the pagination
            if (this.firstRun) {
                this.firstRun = false;
                this.createTable();
                this.createTablePagination();
            }

            if (this.paginationSettings.spacesLeft === 0) { //need new page
                this.paginationSettings.pageCount++;
                this.paginationSettings.spacesLeft = this.paginationSettings.size - 1;//using the first row of the new page for the new model
                this.createTablePagination();
            }
            else {
                this.paginationSettings.spacesLeft--;
            }
            this.sortDataset();
            this.displayPage(this.paginationSettings.currentPage);
        },

        sortDataset: function () {
            this.dataset.sort(this.tableSettings.sortingColumn, this.tableSettings.sortingMode);
        },

        /*
         * set which column should be visible and create table based on selected columns
         * @method: setVisibleColumns
         * @param: {mvp.collection} columnCollection
         * @return: None
         */
        setVisibleColumns: function(columnCollection) {
            this.tableSettings.columns = {};
            this.tableSettings.columns = MBAttributes.getSelectedItems(columnCollection);
        },

        /*
         * handle the row click event to display the details of the event with an popup box
         * @method: tableClickHandler
         * @param: {table.row} row, {mvp.model} model
         * @return: None
         */
        tableClickHandler: function (row, model) {
            if (this.popup !== undefined) {
                this.popup.destroy();
                this.popup = undefined;
            }
            var eventId = row.getData().attributes.eventId;
            // if the same event is clicked, do not create the new popup
            if (this.lastPopupEventId !== eventId) {
                // We need to re-do this after we have decided how to handle the event details
//                var item = this.eventCollection._collection.get(eventId);
                var item;
                if (item === undefined || item.attributes === undefined) {
                    return;
                }

                // calculate the offset from click position to top of bounding element to click event location.
                var offsetRect = this.view.getContentElement().element.getBoundingClientRect();
                var offsetToPosition = {
                    x: this.event.pageX - offsetRect.left - window.scrollX,
                    y: this.event.pageY - offsetRect.top - window.scrollY + 22
                };

                var ev = new EventViewer({event: item.attributes});

                this.popup = new Popup({title: "Event", content: ev.getElement(), position: offsetToPosition});
                this.popup.attachTo(this.view.getContentElement());
                this.popup.addEventHandler('close', function() {
                    this.popup.destroy();
                    this.lastPopupEventId = undefined;
                }, this);
                this.lastPopupEventId = eventId;
            } else {
                this.lastPopupEventId = undefined;
            }
        },

        /*
         * handle the ER event collection
         * @method: reloadTableFromEREventCollection
         * @param:
         */
        reloadTableFromEREventCollection: function(){
            if (this.table) {
                this.table.clear();
            }
            this.selectFromEventCollection();
            if (this.firstRun === true) {
                this.firstRun = false;
            }
            this.createTable();
            this.setPageSize(this.paginationSettings.size);
            this.createTablePagination();
            this.displayPage(this.paginationSettings.currentPage);
        },

        selectFromEventCollection: function() {
            // we need to re-do when refactor this view
//            _.each(this.eventCollection.getByDestination(this.parentUID), function (event) {
//                var model = this.getModel(event.attributes);
//                this.dataset.addModel(model);
//            }.bind(this));
            this.sortDataset();
        }
    });
});
