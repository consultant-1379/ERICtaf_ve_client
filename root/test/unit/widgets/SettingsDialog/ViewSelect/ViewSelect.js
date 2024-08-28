define([
     'jscore/ext/utils/base/underscore',
    'app/widgets/SettingsDialog/ViewSelect/ViewSelect'
], function (_, ViewSelect) {
    'use strict';

    beforeEach(function() {
        this.viewSelect = new ViewSelect();
        this.changeSelection = function(nameObj) {
            this.viewSelect.selectBox.selectedItem = nameObj;
            this.viewSelect.selectBox.trigger('change');
        }
    });

    describe('ViewSelect', function () {

        describe('Functionality', function () {

            var should = chai.should();
            var itemCounter = 0;
            var thumbBase = "../../resources/img/";

            var views = [
                {
                    title: 'View Options',
                    description: "Welcome to the Eiffel Visualization Engine, please choose a view from the dropdown list. If your option is not present in the list then please check that the plug-in is properly deployed.",
                    thumbnail: thumbBase+"globe.png"
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
            ];

            it('should create SelectBox correctly', function() {
                this.viewSelect.selectBox.setItems(views);
                var value = this.viewSelect.selectBox.getValue().name;
                value.should.equal("View Options");
                var selectBoxItems = this.viewSelect.selectBox.items;
                selectBoxItems[1].title.should.equal(views[1].title);
                selectBoxItems[2].title.should.equal(views[2].title);
                selectBoxItems[3].title.should.equal(views[3].title);
            });

            it('should attach the SelectBox to the DOM', function() {
                var dropdown = this.viewSelect.getElement().find(".eaVEApp-wVEViewSelect-dropdown").find(".ebSelect-value");
                dropdown.should.exist;
                dropdown.getText().should.equal(views[0].title);
            });

            it('should display description text correctly', function() {
                var descriptionText = this.viewSelect.getElement().find(".eaVEApp-wVEViewSelect-descriptionText");
                descriptionText.getText().should.equal(views[0].description);

                this.changeSelection({name: "PieView"});
                descriptionText.getText().should.equal(views[1].description);

                this.changeSelection({name: "FlowView"});
                descriptionText.getText().should.equal(views[2].description);

                this.changeSelection({name: "ClusterView"});
                descriptionText.getText().should.equal(views[3].description);
            });

            it('should load thumbnail images correctly', function() {
                var thumbnailImage = this.viewSelect.getElement().find(".eaVEApp-wVEViewSelect-thumbnailImage");
               
                this.changeSelection({name: "PieView"});
                thumbnailImage.getAttribute("src").should.equal(views[1].thumbnail);

                this.changeSelection({name: "FlowView"});
                thumbnailImage.getAttribute("src").should.equal(views[2].thumbnail);

                this.changeSelection({name: "ClusterView"});
                thumbnailImage.getAttribute("src").should.equal(views[3].thumbnail);
            });
        });
    });
});