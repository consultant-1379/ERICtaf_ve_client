/*global define, describe, it, expect */
define([
    'app/config/config',
    'jscore/ext/utils/base/underscore'
], function (config, _) {
    'use strict';

    describe("Config", function () {
        var allNames = [];
        var thumbBase = "../../resources/img/";
        var viewCounter = 0;
        var should = chai.should();
        // override inherent config.views with one made for test
        config.views = [
            {
                title: 'TableView',
                description: "A table for collecting and manipulating new events",
                thumbnail: thumbBase+"thumb_tableview.jpg"
            }, {
                title: 'PieView',
                description: "Pie chart that shows statistical information on event type",
                thumbnail: thumbBase+"thumb_pieview.jpg"
            }, {
                title: 'FlowView',
                description: "Shows new events in a flow. Uses arrows to connect those events that are related to each other",
                thumbnail: thumbBase+"thumb_flowview.jpg"
            }, {
                title: 'ClusterView',
                description: "Clusters events together on a user-provided criteria and shows only the latest event",
                thumbnail: thumbBase+"thumb_clusterview.jpg"
            }
        ],

        describe('Method getViewNames()', function () {
            it('should give us a non-empty list when called', function () {
                allNames = [];
                allNames = config.getViewNames();
                expect(allNames.length).to.not.equal(0);
            });
            it('should give all the view names in an array', function () {
                expect(allNames[0].name).to.equal("TableView");
                expect(allNames[1].name).to.equal("PieView");
                expect(allNames[2].name).to.equal("FlowView");
                expect(allNames[3].name).to.equal("ClusterView");
            });
        }),

        describe('Method getViewDescription()', function () {
            it("should give us the correct descriptions when called", function () {
                expect("Pie chart that shows statistical information on event type").to.be.equal(config.getViewDescription("PieView"));
                expect("Shows new events in a flow. Uses arrows to connect those events that are related to each other").to.be.equal(config.getViewDescription("FlowView"));
                expect("Clusters events together on a user-provided criteria and shows only the latest event").to.be.equal(config.getViewDescription("ClusterView"));
                expect("A table for collecting and manipulating new events").to.be.equal(config.getViewDescription("TableView"));
            });
            it("should not return anything if the name doesn't exist", function () {
                expect(undefined).to.be.equal(config.getViewDescription("FloorView"));
            });
        });

        describe('Method getViewImage()', function () {
            it("should return the correct thumbnails", function () {
                _.each(config.views, function(view) {
                    var viewName = view.title;
                    view.thumbnail.should.equal(config.getViewImage(viewName));
                });
            });
        });
    });
});
