/*global define, describe, it, expect */
define([
    'jscore/ext/utils/base/underscore',
    'app/widgets/SettingsDialog/SettingsDialog',
    'app/widgets/SettingsDialog/ViewSelect/ViewSelect'
], function (_, SettingsDialog, ViewSelect) {
    'use strict';

    function countChildrenByClass(element, className) {
        return _.reduce(element.element.children, function(count, child) {
            if (child.className === className) {
                return ++count;
            }
            return count;
        }, 0);
    }

    describe("SettingsDialog", function () {

        it('should be defined', function () {
            expect(SettingsDialog).to.not.be.undefined;
        });

        it('should be able to add views on init', function () {
            var view1 = new ViewSelect(),
                view2 = new ViewSelect(),
                dialog = new SettingsDialog({header: 'Test', secondaryCaption: 'Test', views: [view1, view2]});

            expect(countChildrenByClass(dialog.view.getElement(), 'eaVEApp-wVEViewSelect')).to.equal(2);
        });

        it('should be able to add views to a running dialog', function () {
            var view1 = new ViewSelect(),
                view2 = new ViewSelect(),
                view3 = new ViewSelect(),
                dialog = new SettingsDialog({header: 'Test', secondaryCaption: 'Test'});

            dialog.addView(view1);
            dialog.addView(view2);
            dialog.addView(view3);

            expect(countChildrenByClass(dialog.view.getElement(), 'eaVEApp-wVEViewSelect')).to.equal(3);
        });
    });
});