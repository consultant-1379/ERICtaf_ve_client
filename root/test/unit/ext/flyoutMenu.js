define([
    'jscore/core',
    'app/ext/flyoutMenu',
    'app/widgets/SettingsDialog/Clustering/Clustering',
], function (core, Menu, Clustering) {
    'use strict';

    describe('Menu ("flyoutMenu")', function () {

        var defaultObj = {
            "domainId": "vm18domain",
            "eventId": "",
            "eventTime": "",
            "eventType": "",
            "eventData": {
                "jobInstance": ""
            }
        };

        var updateObj = {
            "domainId": "vm18domain",
            "eventId": "",
            "eventTime": "",
            "eventType": "",
            "eventData": {
                "jobInstance": "",
                "z-index": ""
            }
        };

        var arrayTestObject = {"key1": [], "key2": []};

        // Used to test that the menu executes the callback function passed to it corectly
        var testVariable = "";

        describe('Methods', function () {

            it('should test if an object only contains arrays', function() {
                Menu.containsOnlyArrays(defaultObj).should.equal(false);
                Menu.containsOnlyArrays(arrayTestObject).should.equal(true);
            });

            it('should create list items correctly', function() {
                Menu.setDefaultSelection("eventData.jobInstance", 0);
                var listItem = Menu.createListItem("domainId");
                listItem.should.exist;
                listItem.getText().should.equal("domainId");
                listItem.getAttribute("class").should.equal("ui-menu-item");
                listItem.find("a").should.exist;
                listItem.find("a").getAttribute("href").should.equal("#");
                listItem.find("a").getAttribute("onClick").should.equal("return false;");
            });

            it('should create submenus correctly', function() {
                Menu.setDefaultSelection("eventData.jobInstance", 0);
                var subMenu0 = Menu.createSubMenu("eventData", 0);
                var    subMenu1 = Menu.createSubMenu("gav", 1);
                subMenu0.should.exist;
                subMenu1.should.exist;
                subMenu0.find("ul").getAttribute("id").should.equal("0");
                subMenu1.find("ul").getAttribute("id").should.equal("1");
                subMenu0.getAttribute("class").should.equal("ui-menu-item");

                subMenu0.find("span").getAttribute("class").should.equal("ui-menu-icon ui-icon ui-icon-carat-1-e");

                var ul = subMenu0.find("ul");
                ul.getAttribute("class").should.equal("ui-menu-icons ui-menu ui-widget ui-widget-content ui-corner-all");
                ul.getAttribute("role").should.equal("menu");
                ul.getAttribute("aria-expanded").should.equal("false");
                ul.getAttribute("aria-hidden").should.equal("true");
                ul.getStyle("display").should.equal("none");
            });

            it('should take a JSON object and generate HTML from the object keys', function() {
                var clustering = new Clustering();
                var ul = clustering.getElement();

                var menuChildren = clustering.getElement().find("#menu").children();
                menuChildren[0].getText().should.equal("domainId");
                menuChildren[1].getText().should.equal("eventId");
                menuChildren[2].getText().should.equal("eventTime");
                menuChildren[3].getText().should.equal("eventType");

                var nestedMenu = menuChildren[4].find("a");
                nestedMenu.getText().should.equal("eventData");

                var nestedMenuChildren = menuChildren[4].find("ul").children();
                nestedMenuChildren[0].getText().should.equal("jobInstance");
            });

            it('should update HTML upon receiving an event', function() {
                var clustering = new Clustering();
                clustering.receiveEvent(updateObj);
                var menuChildren = clustering.getElement().find("#menu").children();
                var nestedMenuChildren = menuChildren[4].find("ul").children();
            });

            it('should execute the callback function passed as a parameter when currentSelection is changed', function() {
                Menu.defineCallback(function(value) {
                    testVariable = value;
                });
                Menu.changeSelection("selection1");
                testVariable.should.equal("selection1");
                Menu.changeSelection("selection2");
                testVariable.should.equal("selection2");
            });

            it('should update currentSelection correctly', function() {
                Menu.defineCallback(function() {});
                Menu.changeSelection("domainId");
                Menu.currentSelection.selection.should.equal("domainId");
                Menu.changeSelection("eventTime");
                Menu.currentSelection.selection.should.equal("eventTime");
            });

        });
    });
});