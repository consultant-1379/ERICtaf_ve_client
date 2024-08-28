/*global define, describe, it, expect */
define([
    'app/widgets/RegionHandler/RegionHandler'
], function (RegionHandler) {
    'use strict';

    describe('RegionHandler', function () {

        before(function() {
            this.regionHandler = new RegionHandler({configurationData:{title: 'Testing'}});
        });

        describe('Methods', function () {

            xit('init()', function() {
                this.regionHandler.widgetSettings.should.exist;
                this.regionHandler.settingsTabs.should.exist;
                this.regionHandler.settingsIcon.should.exist;
                this.regionHandler.removeIcon.should.exist;
                this.regionHandler.settingsDialog.should.exist;
                this.regionHandler.settingsDialog.options.contentTabs.should.equal(this.regionHandler.settingsTabs);
            });

            xit('onViewReady()', function() {
                var buttons = this.regionHandler.view.getSettingsElement().children();
                buttons[0].getAttribute("title").should.equal("settings");
                buttons[1].getAttribute("title").should.equal("remove");
            });

            xit('eventHandlers()', function() {
                // These tests are of no use.  They simply trigger events to increase line coverage.
                // As such no more of these types of expressions are included
                this.regionHandler.widgetSettings.span.trigger('changeSizeEvent');
                this.regionHandler.widgetSettings.subscription.trigger('addSubscriptionEvent');
                this.regionHandler.widgetSettings.subscription.trigger('removeSubscriptionEvent');
                this.regionHandler.widgetSettings.subscription.trigger('getSubscriptionEvent');
                this.regionHandler.widgetSettings.aspectRatio.trigger('changeAspectRatioEvent');
                this.regionHandler.widgetSettings.aspectRatio.trigger('defaultAspectRatioEvent');
                this.regionHandler.settingsDialog.trigger('settingsDialogVisibleEvent');
            });

            xit('openSettingsDialog()', function() {
                this.regionHandler.openSettingsDialog();
                this.regionHandler.settingsDialog.dialog.isVisible().should.equal(true);
                this.regionHandler.settingsDialog.dialog.hide();
            });

            it('getData()', function () {
                var handler = new RegionHandler({configurationData:{type: 'Testing'}}),
                    data = handler.getData();

                expect(data).to.be.an('object');
                expect(data).to.have.property('title', 'Testing');
            });

            xit('prepareTitleArea()', function () {
                this.regionHandler.titleElement.should.exist;
                this.regionHandler.titleTextElement.should.exist;
                this.regionHandler.titleInputElement.should.exist;
                this.regionHandler.editIconElement.should.exist;
                this.regionHandler.editTitleIcon.should.exist;
                this.regionHandler.input.should.exist;
            });

            xit('showInputField()', function () {
                this.regionHandler.view.getTitleElement().children().length.should.equal(3);
                this.regionHandler.view.getTitleInputElement().children().length.should.equal(0);
                this.regionHandler.showInputField();
                this.regionHandler.view.getTitleInputElement().children().length.should.equal(1);
                this.regionHandler.view.getTitleElement().children().length.should.equal(2);
            });

            xit('showTitleText()', function () {
                var text = "Hello World";
                this.regionHandler.showTitleText(text);
                this.regionHandler.view.getTitleTextElement().getText().should.equal(text);
            });
        });
    });
});