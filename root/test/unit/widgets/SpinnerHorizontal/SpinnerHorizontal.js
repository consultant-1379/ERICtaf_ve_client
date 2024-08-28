/*global define, describe, it, expect */
define([
    'app/widgets/SpinnerHorizontal/SpinnerHorizontal'
], function (Resizing) {
    'use strict';

    describe('SpinnerHorizontal', function () {

        describe('Methods', function () {

            var r = new Resizing({
                min: 1, max: 12, value: 2
            });
            it('getValue()', function () {
                expect(r.getValue()).to.equal(2);
            });

            it('setValue()', function () {
                r.setValue(3);
                expect(r.getValue()).to.equal(3);
                r.setValue("a");
                expect(r.getValue()).to.equal(3);
                r.setValue(0);
                expect(r.getValue()).to.equal(1);
                r.setValue(100);
                expect(r.getValue()).to.equal(12);
            });
        });
    });
});