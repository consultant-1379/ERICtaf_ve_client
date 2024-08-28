/*global define, describe, it, expect */
define([
    'app/widgets/Icon/Icon',
    '../../../test/utils/TestUtils'
], function (Icon, TestUtils) {
    'use strict';

    describe('Icon', function () {

        describe('Methods', function () {
            var myFunc = function myFunc () {};
            var i0 = new Icon({icon: "icon-play", text: "equal to i2", onclickevent: myFunc });
            var i1 = new Icon({text: "equal to i2"});
            var i2 = new Icon({icon: "no_icon_available", text: "equal to i2"});
            var i3 = new Icon({text: "not equal to i1"});

            describe('getTemplateData()', function () {
                it('should return data for template', function () {
                    expect(i0.getTemplateData().icon).to.match(/icon-play/);
                    expect(i0.getTemplateData().text).to.equal("equal to i2");
                    expect(i0.getTemplateData().icon).to.match(/ebIcon_interactive/);
                    expect(i1.getTemplateData().cursor).to.not.match(/ebIcon_interactive/);
                });
            });

            describe('faultCheck()', function () {
                it('should check faulty icon constructor', function () {
                    expect(i1.getTemplateData().icon).to.not.equal(i2.getTemplateData().icon); // i1 changes icon
                    expect(i1.getTemplateData().icon).to.match(/ebIcon_warning/); // i1 icon changed into warning sign. Requires Bootstrap CSS
                    expect(i1.getTemplateData().text).to.equal(i3.getTemplateData().text); // i3 text changed if no icon is defined
                    expect(i1.getTemplateData().text).to.equal("WARNING: Icon not specified");
                });
            });

            describe('makeInteractive()', function () {
                it('should add ebIcon_interactive class to element', function () {
                    var icon = new Icon({icon: "icon-play", interactive: false});
                    icon.makeInteractive();

                    expect(TestUtils.haveClass(icon.getElement().element, 'ebIcon_interactive')).to.be.true;
                });
            });

            describe('makeUninteractive()', function () {
                it('should remove ebIcon_interactive class from an element', function () {
                    var icon = new Icon({icon: "icon-play", interactive: true});
                    icon.makeUninteractive();

                    expect(TestUtils.haveClass(icon.getElement().element, 'ebIcon_interactive')).to.be.false;
                });
            });
        });
    });
});