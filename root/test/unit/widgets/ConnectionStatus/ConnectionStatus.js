/*global define, describe, it, expect */
define([
    'app/widgets/ConnectionStatus/ConnectionStatus',
    '../../../test/utils/TestUtils'
], function (ConnectionStatus, TestUtils) {
    'use strict';

    describe("ConnectionStatus", function () {
        var should = chai.should();

        describe('Methods', function () {
            var connectionStatus;

            beforeEach(function () {
                connectionStatus = new ConnectionStatus();
            });

            describe('setConnectedStatus()', function () {

                it('should enable connected icon and disable disconnected icon', function () {
                    connectionStatus.setConnectedStatus();

                    TestUtils.haveClass(connectionStatus.view.getConnectedElement().find('i').element, 'ebIcon_disabled').should.be.false;
                    TestUtils.haveClass(connectionStatus.view.getDisconnectedElement().find('i').element, 'ebIcon_disabled').should.be.true;
                });
            });

            describe('setDisconnectedStatus()', function () {

                it('should enable disconnected icon and disable connected icon', function () {
                    connectionStatus.setDisconnectedStatus();

                    TestUtils.haveClass(connectionStatus.view.getConnectedElement().find('i').element, 'ebIcon_disabled').should.be.true;
                    TestUtils.haveClass(connectionStatus.view.getDisconnectedElement().find('i').element, 'ebIcon_disabled').should.be.false;
                });
            });
        });
    });
});