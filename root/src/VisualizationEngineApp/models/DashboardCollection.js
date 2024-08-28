/**
DashBoardCollections is an mvp model collection for the DashboardModel
@class DashBoardCollections
*/
define([
    "jscore/ext/mvp",
    "./DashboardModel"
], function(mvp, DashboardModel) {

    return mvp.Collection.extend({

        Model: DashboardModel,
       
        url: "/configuration/dashboards"

    });

});