define([
    'app/widgets/SettingsDialog/Clustering/Clustering',
    'jscore/base/jquery'
], function (Clustering, $) {
    'use strict';

    describe('Clustering', function () {

        describe('Init', function () {

            var should = chai.should();

            var defaultOptions = {
                "domainId": "vm18domain",
                "eventId": "",
                "eventTime": "",
                "eventType": "",
                "eventData": {
                    "jobInstance": ""
                }
            };

            var event = {
                "domainId": "vm18domain",
                "eventId": "",
                "eventTime": "",
                "eventType": "",
                "eventData": {
                    "jobInstance": "",
                    "optionalParameters": {
                        "option1": "",
                        "option2": "",
                        "option3": {
                            "nested1": "",
                            "nested2": {
                                "bottom": ""
                            }
                        }
                    }
                }
            };

            before(function() {
                this.clustering = new Clustering();
            });

            it('should initialise variable values correctly', function() {
                this.clustering.settingsDialogOpen.should.equal(false);
            });

            it('should toggle the menuDisplayed variable', function() {
                this.clustering.toggleLiveUpdate(true);
                this.clustering.settingsDialogOpen.should.equal(true);
                this.clustering.toggleLiveUpdate(false);
                this.clustering.settingsDialogOpen.should.equal(false);
            });

            it('should have a refresh button', function() {
                this.clustering.getElement().find("button").should.not.equal("undefined");
                this.clustering.getElement().find("button").getText().trim().should.equal("Refresh menu");
            });
        });
    });
});