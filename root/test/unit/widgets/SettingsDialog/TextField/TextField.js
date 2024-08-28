define([
     'jscore/ext/utils/base/underscore',
    'app/widgets/SettingsDialog/TextField/TextField',
    'app/config/config'
], function (_, TextField, config) {
    'use strict';

    beforeEach(function() {
        this.TextField = new TextField();    
    });

    describe('TextField', function () {

        describe('Functionality', function () {

            var should = chai.should();

            it('Intialize TextField', function() {
                this.TextField =  new TextField({
                    title: "Group By:",
                    name: "ClusterBase",
                    enabled: false,
                    eventType: "TextChanged",
                    placeholder: "eventData.jobInstance",
                    elementIdentifier: "eaVEApp-wTextField-input",
                    info: config.infoPopups.clusterBase.text
                })
                this.TextField.should.exist;
            });

            
        });
    });
});