/*global define, describe, it, expect */
define([
    'app/widgets/SettingsDialog/EiffelSpinner/EiffelSpinner',
], function (EiffelSpinner) {
    'use strict';

    describe('EiffelSpinner', function () {

        describe('Initialise', function () {
             /**
                DefaultAspectRatio coverage line 25 to 27 is never covered as it is called from its own class
            */

            it('Initialise', function () {
                 var eiffelSpinner = new EiffelSpinner();
                   eiffelSpinner.onViewReady();
                   expect(EiffelSpinner).to.not.equal(undefined);
            });

        });

        describe('Methods', function () {
            var eiffelSpinner ;
                beforeEach(function() {
                    eiffelSpinner = new EiffelSpinner({
                        min: 1,
                        max: 10,
                        value: 8,
                        show_percent: false
                    });
                    eiffelSpinner.onAttach();
                    
                });
                afterEach(function() {
                    eiffelSpinner = undefined;
                });
                it('show EiffelSpinner', function () {
                    eiffelSpinner.onAttach();
                    eiffelSpinner.showSpinner();
                    expect(eiffelSpinner.getElement().find('.eaVEApp-wVEEiffelSpinner-spinner').element.style.display).to.equal("inline-block");
                });

                it('hide AspectRatio', function () {
                    eiffelSpinner.view.hideSpinner();
                    expect(eiffelSpinner.getElement().find('.eaVEApp-wVEEiffelSpinner-spinner').element.style.display).to.equal("none");
                });

                it ('has a default value', function() {
                    eiffelSpinner.onViewReady();
                    expect(eiffelSpinner.spinner.getValue()).to.equal(8);  
                });

                it('Trigger value for spinner', function () {
                    eiffelSpinner.onViewReady();

                    eiffelSpinner.spinner.triggerSetValue(5)
                    expect(eiffelSpinner.spinner.getValue()).to.equal(5);

                    // boundary value analysis

                    eiffelSpinner.spinner.triggerSetValue(-1);
                    expect(eiffelSpinner.spinner.value).to.equal(1);

                    eiffelSpinner.spinner.triggerSetValue(0)
                    expect(eiffelSpinner.spinner.value).to.equal(1);

                    eiffelSpinner.spinner.triggerSetValue(12);
                    expect(eiffelSpinner.spinner.value).to.equal(10);
                    eiffelSpinner.spinner.triggerSetValue(13);
                    expect(eiffelSpinner.spinner.value).to.equal(10);
                });
        });
    });
});