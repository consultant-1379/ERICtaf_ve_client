define([
     'jscore/ext/utils/base/underscore',
    'app/widgets/SettingsDialog/SettingsDialog'
], function (_, SettingsDialog) {
    'use strict';

    beforeEach(function() {
        this.settingsDialog = new SettingsDialog({header: 'Select view'});
    });

    describe('SettingsDialog', function () {

        describe('Functionality', function () {

            var should = chai.should();

            it('should initialise the Dialog correctly', function() {
                this.settingsDialog.dialog.should.exist;
                this.settingsDialog.dialog.isVisible().should.equal(false);
            });

            it('should attach the close button to the DOM', function() {
                this.settingsDialog.close.should.exist;
                this.settingsDialog.getElement().find('.eaVEApp-wVESettingsDialog-close').children()[0].getAttribute("title").should.equal("Close");
            });

            it('should toggle between visible and hidden', function() {
                this.settingsDialog.showDialog();
                this.settingsDialog.dialog.isVisible().should.equal(true);
                this.settingsDialog.hideDialog();
                this.settingsDialog.dialog.isVisible().should.equal(false);
            });
        });
    });
});