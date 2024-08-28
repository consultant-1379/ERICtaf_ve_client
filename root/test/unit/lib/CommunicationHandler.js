/*global define, describe, it, expect */
define([
    'jscore/core',
    'jscore/ext/utils/base/underscore',
    'app/lib/CommunicationHandler'
], function (core, _, CommunicationHandler) {
    'use strict';

    describe('CommunicationHandler', function () {
        var ch,
            socketExtMock,
            eventBus = new core.EventBus(),
            should = chai.should();

        beforeEach(function () {

            ch = new CommunicationHandler({
                host: 'test.ericsson.se',
                port: 8080,
                eventBus: eventBus
            });

            socketExtMock = sinon.mock(ch.socket)
        });

        describe('Methods', function() {

            describe('connect()', function () {

                it('should connect to the provided host and port', function () {
                    var connectExpect = socketExtMock.expects('connect').once().withArgs({ host: "test.ericsson.se", port: 8080, resource: "socket.io" });
                    socketExtMock.expects('on').twice();

                    ch.connect();

                    connectExpect.verify();
                });

                it('should attach a listener for connect events', function () {
                    var onExpect = socketExtMock.expects('on').once().withArgs('connect');
                    socketExtMock.expects('connect').once();
                    socketExtMock.expects('on').once();

                    ch.connect();

                    onExpect.verify();
                });

                it('should attach a listener for disconnect events', function () {
                    var onExpect = socketExtMock.expects('on').once().withArgs('disconnect');
                    socketExtMock.expects('connect').once();
                    socketExtMock.expects('on').once();

                    ch.connect();

                    onExpect.verify();
                });
            });

            describe('listen()', function () {

                it('should attach listeners for new events', function() {
                    var updateExpect = socketExtMock.expects('on').once().withExactArgs('update', ch._handleLiveUpdate, ch);
                    var serverStatusExpect = socketExtMock.expects('on').once().withExactArgs('statusUpdate', ch._updateServerStatus, ch);
                    ch.listen();
                    updateExpect.verify();
                    serverStatusExpect.verify();
                });
            });
                        
            describe('_handleLiveUpdate', function () {
               
                it('should publish an update event on the message bus', function (done) {
                    var model = {
                        method: 'PUT',
                        eventURI: 've:livedata/subscriptions/e098b740-9348-11e3-baa8-0800200c9a66',
                        version: '1.0',
                        eventBody: {
                            model: {
                                items: [
                                    {label: 'Test1', value: 1},
                                    {label: 'Test2', value: 2},
                                    {label: 'Test3', value: 3}
                                ]
                            }
                        }
                    };
                    
                    eventBus.subscribe('update', function (liveEvent) {
                        liveEvent.id.should.equal('e098b740-9348-11e3-baa8-0800200c9a66');
                        liveEvent.model.model.should.eql({
                            items: [
                                {label: 'Test1', value: 1},
                                {label: 'Test2', value: 2},
                                {label: 'Test3', value: 3}
                            ]
                        });
                        done();
                    });

                    ch._handleLiveUpdate(model);
                });
            });
            
            describe('_getId', function () {

                it('should parse the id from a model', function () {
                    var model = {
                        method: 'PUT',
                        eventURI: 've:livedata/subscriptions/e098b740-9348-11e3-baa8-0800200c9a66',
                        version: '1.0',
                        eventBody: {
                            model: {
                                items: [
                                    {label: 'Test1', value: 1},
                                    {label: 'Test2', value: 2},
                                    {label: 'Test3', value: 3}
                                ]
                            }
                        }
                    };

                    ch._getId(model).should.equal('e098b740-9348-11e3-baa8-0800200c9a66');
                });
            });
        });
    });
});