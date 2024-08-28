/*global define, describe, it, expect */
define([
    'app/widgets/SettingsDialog/DefaultSettings/DefaultSettings'
], function (DefaultSettings) {
    'use strict';

    describe('DefaultSettings', function () {

        describe('initialise', function () {
            var defaultSettings = new DefaultSettings();


            it('Initialise', function () {
                   expect(defaultSettings).to.not.equal(undefined);

            });


        });
        describe('Methods', function () {
            var defaultSettings = new DefaultSettings();


                it('set the checkbox and the unset using isChecked()', function () {
                    defaultSettings.view.getCheckboxElement().element.checked = true
                    expect(defaultSettings.isChecked()).to.equal(true);
                    defaultSettings.view.getCheckboxElement().element.checked = false
                    expect(defaultSettings.isChecked()).to.equal(false);

                });

                it('Set the title of Default Settings', function () {
                    var obj
                    defaultSettings.view.setTitle(obj);
                    expect(defaultSettings.view.getTitleElement().getText()).to.equal('Use Default Settings');
                    defaultSettings.view.setTitle('This is a test do not adjust your screen')
                    expect(defaultSettings.view.getTitleElement().getText()).to.equal('This is a test do not adjust your screen');
                });
        });

    });
});