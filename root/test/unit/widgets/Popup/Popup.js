/*global define, describe, it, expect */
define([
    'jscore/core',
    'app/widgets/Popup/Popup'
], function (core, Popup) {
    'use strict';

    describe('Popup', function () {
        var popup;

        describe('initialisation', function () {
            it('should allow setting a title', function() {
                popup = new Popup({title: "hi place"});
                expect(popup.view.getTitleElement().element.innerHTML).to.equal("<h2>hi place</h2>");
            });
        });

        describe('fault prevension', function () {
            it('should not fail when content is empty', function() {
                popup = new Popup({});
                expect(popup.view.getContentElement().element.innerHTML).to.equal("");
            });

            it('should not fail when offset is empty', function() {
                expect(popup.element.element.style.left).to.equal("0px");
            });

            it('should not fail when offset is half set', function() {
                popup = new Popup({content: "hello world", position: {x:3}});
                expect(popup.element.element.style.left).to.equal("3px");
            });

            it('should not fail when title is empty', function() {
                expect(popup.view.getTitleElement().element.innerHTML).to.equal("");
            });
        });

        describe('Method updateContent', function () {
            it('should be possible to change the content', function() {
                expect(popup.view.getContentElement().element.innerHTML).to.equal("hello world");
                popup.updateContent("hello kitty");
                expect(popup.view.getContentElement().element.innerHTML).to.equal("hello kitty");
            });

            it('should be possible to set a core.Element as content', function() {
                var el = core.Element.parse("<div>Hi there Kitty</div>");
                popup.updateContent(el);
                expect(popup.view.getContentElement().children()[0].element.innerHTML).to.equal("Hi there Kitty");
            });
        });
    });
});