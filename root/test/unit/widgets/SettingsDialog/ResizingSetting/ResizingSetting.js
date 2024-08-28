/*global define, describe, it, expect */
define([
    'app/widgets/SettingsDialog/ResizingSetting/ResizingSetting'
], function (Resizer) {
    'use strict';

    describe('Resizer', function () {

        describe('Initialise', function () {
            var resizer = new Resizer();


            it('Initialise', function () {
                   resizer.onViewReady();
                   expect(resizer).to.not.equal(undefined);

            });


        });
        describe('Methods', function () {
            var resizer = new Resizer({
                min: 1,
                max: 10,
                value: 5,
                show_percent: false
                });

                it('Trigger value for content', function () {
                    resizer.onAttach();
                    resizer.content.triggerSetValue(5)
                    expect(resizer.content.value).to.equal(5);

                    // boundary value analysis

                    resizer.content.triggerSetValue(-1);
                    expect(resizer.content.value).to.equal(1);

                    resizer.content.triggerSetValue(0)
                    expect(resizer.content.value).to.equal(1);

                    resizer.content.triggerSetValue(12);
                    expect(resizer.content.value).to.equal(10);
                    resizer.content.triggerSetValue(13);
                    expect(resizer.content.value).to.equal(10);
                });
        });
    });
});