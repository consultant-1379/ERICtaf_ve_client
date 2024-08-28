define([
    'app/widgets/SettingsDialog/SettingsTab/SettingsTab',
    'app/widgets/SettingsDialog/Subscription/Subscription'
], function (SettingsTab, Subscription) {
    'use strict';

    describe('SettingsTab', function () {

        before(function() {
            this.settingsTab = new SettingsTab({
                widgets: [
                    new Subscription()
                ]
            });
            this.el = this.settingsTab.getElement();
        });

        describe('Functionality', function () {

            var should = chai.should();

            it('should initialise variables correctly', function() {
                this.settingsTab.widgets.length.should.equal(1);
            });

            it('should append elements to the DOM', function() {
                this.el.children()[0].getAttribute("class").should.equal("eaVEApp-wVESettingsTab-widget");
            });

            it('should remove elements from the DOM', function() {
                this.settingsTab.removeWidget(0);
                this.el.find(".eaVEApp-wVESettingsTab-widget").children().length.should.equal(0);
            })

        });
    });
});