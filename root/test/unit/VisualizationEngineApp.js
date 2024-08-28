/*global define, describe, it, expect */
define([
    'jscore/core',
    'app/VisualizationEngineApp'
], function (core, VisualizationEngineApp) {
    'use strict';

    describe('VisualizationEngineApp', function () {

        describe('Methods', function () {
            var app;

            describe('init', function () {
                var eventBus,
                    container;

                beforeEach(function () {
                    container = core.Element.parse('<div></div>');
                    eventBus = new core.EventBus();
                    app = new VisualizationEngineApp({context: {eventBus: eventBus}});
                    app.start(container);
                });

                afterEach(function () {
                    //app.stop();
                    
                   
                 });

                it('should set activeRegions to be empty', function () {
                    expect(app.activeRegions).to.be.empty;
                });

                
                it('should create a CommunicationHandler', function () {
                    expect(app.communicationHandler).to.not.be.undefined;
                });
                
                it('url should be processed through hashChangeHandler and add the url attribute to url map', function () {
                    var dashBoardId="test-123";
                    var dashboardIdentifier = "dashboardId";
                    var queryIndentifier = "query";
                    var dashboardIdentifier = "dashboardId";
                    var startDateIndentifier = "startDate";
                    var endDateIndentifier = "endDate";
                    var liveDataIndentifier = "liveData";
                    
                    var query = "query=test";
                    var liveData = "liveData=true";
                    var endDate = "endDate=12-2-2014,12:00";
                    var startDate = "startDate=6-2-2014,16:00"
                    var url = "?" + dashboardIdentifier + "="+dashBoardId +"&" + query+"&" + liveData+"&" + endDate+"&" + startDate;
                    app.dashboardManager.getModelById = function(dashboardId) {return;}; 
                    app.hashChangeHandler(url);
                    
                    app.updateUrlWithDashboardId(dashBoardId,true);
                    app.urlMap[dashboardIdentifier].should.equal("dashboardId="+dashBoardId);
                    app.urlMap[startDateIndentifier].should.equal(startDate);
                    app.urlMap[endDateIndentifier].should.equal(endDate);
                    app.urlMap[liveDataIndentifier].should.equal(liveData);
                    app.urlMap[queryIndentifier].should.equal(query);  
                                   
                    
                });
                    
            });

            describe('onStart', function () {
                var eventBus,
                    container;

                beforeEach(function () {
                    container = core.Element.parse('<div></div>');
                    eventBus = new core.EventBus();
                });

                it('should create a LocationListener', function () {
                    app = new VisualizationEngineApp({context: {eventBus: eventBus}});
                    app.start(container);

                    expect(app.lc).to.not.be.undefined;
                });

                // it('should attach a window resize listener', function () {
                //     var orgEventListener,
                //         resizeCallback;

                //     orgEventListener = window.addEventListener;
                //     window.addEventListener = function (event, callback) {
                //         if (event === 'resize') {
                //             resizeCallback = callback;
                //         }
                //     };

                //     app = new VisualizationEngineApp({context: {eventBus: eventBus}});
                //     app.start(container);

                //     expect(resizeCallback).to.not.be.undefined;

                //     window.addEventListener = orgEventListener;
                // });

                // it('should attach a window scroll listener', function () {
                //     var orgEventListener,
                //         scrollCallback;

                //     orgEventListener = window.addEventListener;
                //     window.addEventListener = function (event, callback) {
                //         if (event === 'scroll') {
                //             scrollCallback = callback;
                //         }
                //     };

                //     app = new VisualizationEngineApp({context: {eventBus: eventBus}});
                //     app.start(container);

                //     expect(scrollCallback).to.not.be.undefined;

                //     window.addEventListener = orgEventListener;
                // });

                // it('should attach a window beforeunload listener', function () {
                //     var orgEventListener,
                //         beforeunloadCallback;

                //     orgEventListener = window.addEventListener;
                //     window.addEventListener = function (event, callback) {
                //         if (event === 'beforeunload') {
                //             beforeunloadCallback = callback;
                //         }
                //     };

                //     app = new VisualizationEngineApp({context: {eventBus: eventBus}});
                //     app.start(container);

                //     expect(beforeunloadCallback).to.not.be.undefined;

                //     window.addEventListener = orgEventListener;
                // });

                // it('should call unsubscribeToServer when beforeunload callback is executed', function () {
                //     var orgEventListener,
                //         beforeunloadCallback,
                //         chMock;

                //     orgEventListener = window.addEventListener;
                //     window.addEventListener = function (event, callback) {
                //         if (event === 'beforeunload') {
                //             beforeunloadCallback = callback;
                //         }
                //     };

                //     app = new VisualizationEngineApp({context: {eventBus: eventBus}});
                //     app.start(container);

                //     app.activeRegions = [{uid: '123-test'}];
                //     chMock = sinon.mock(app.communicationHandler).expects('unsubscribeToServer').once();

                //     beforeunloadCallback.call(app);

                //     chMock.verify();

                //     window.addEventListener = orgEventListener;
                // });

                it('should create a Configuration region', function () {
                    app = new VisualizationEngineApp({context: {eventBus: eventBus}});
                    app.plugins = false;
                    app.start(container);

                    expect(app.configurationRegion).to.not.be.undefined;
                });
            });

            describe('removeRegion', function () {
                var eventBus,
                    container,
                    regionMock,
                    lcMock,
                    chMock,
                    ecMock,
                    getRegionIndexStub;

                beforeEach(function () {
                    container = core.Element.parse('<div></div>');
                    eventBus = new core.EventBus();
                    app = new VisualizationEngineApp({context: {eventBus: eventBus}});
                    app.start(container);

                    regionMock = sinon.mock({
                        stop: function () {},
                        uid: '123-test'
                    });
                  
                    chMock = sinon.mock(app.communicationHandler).expects('unsubscribeLiveData');
                });

                afterEach(function () {
                    // app.stop();
                    regionMock.restore();
                    
                });

                it('should call stop on removed region', function () {
                    regionMock.expects('stop').once();

                    app.removeRegion.call(app, regionMock.object);
                    regionMock.verify();
                });

                it('should remove region from activeRegions', function () {
                    app.activeRegions = [regionMock.object];

                    expect(app.activeRegions.length).to.equal(1);
                    app.removeRegion.call(app, regionMock.object);
                    expect(app.activeRegions.length).to.equal(0);
                });
             
                it('should unsubscribe region uid from server', function () {
                    chMock.once().withExactArgs('123-test');

                    app.removeRegion.call(app, regionMock.object);
                    chMock.verify();
                });

                
            });

            xdescribe('changeSize', function () {
                var eventBus,
                    container,
                    inputMock;
                   


                beforeEach(function () {
                    container = core.Element.parse('<div></div>');
                    eventBus = new core.EventBus();
                    app = new VisualizationEngineApp({context: {eventBus: eventBus}});
                    app.start(container);

                    inputMock = {
                        region: {
                            element: {
                                element: {
                                    className: 'eaVEApp-view eaVEApp-rTest span3'
                                }
                            },
                            uid: '123-test'
                        },
                        value: 6
                    };
                                 
                });

                afterEach(function () {
                    // app.stop();            
                });

                it('should publish resize event on event bus', function (done) {
                    app.getEventBus().subscribe('resized', function () {
                        done();
                    });

                    app.changeSize.call(app, inputMock);
                });
             
            });

            describe('createRegion', function () {
                var eventBus,
                    container,
                    lcMock;

                beforeEach(function () {
                    container = core.Element.parse('<div></div>');
                    eventBus = new core.EventBus();
                    app = new VisualizationEngineApp({context: {eventBus: eventBus}});
                    app.start(container);
                    
                    app.urlHashState.dashboardId = "";
                    app.urlHashState.query = [];
                    app.urlHashState.endDate = "";
                    app.urlHashState.startDate = "";
                    app.urlHashState.liveData = undefined;
                    app.urlHashState.urlAttributes = false;
                    app.urlHashState.urlMap = {};

                });

                it('should create a region', function () {
                    var region = app.createRegion.call(app, {});
                    expect(region).to.not.be.undefined;
                });

                it('should add the region to activeRegions', function () {
                    expect(app.activeRegions.length).to.equal(0);
                    app.createRegion.call(app, {});
                    expect(app.activeRegions.length).to.equal(1);
                });
            });
        
            describe('subscribeMessageBusEvent', function () {
                var eventBus,
                    container,
                    chMock,
                    chStub;

                beforeEach(function () {
                    container = core.Element.parse('<div></div>');
                    eventBus = new core.EventBus();
                    app = new VisualizationEngineApp({context: {eventBus: eventBus}});
                    app.start(container);
                });

                it('should call CommunicationHandlers subscribeLiveData method', function () {
                    var subscription = {
                        region: 'Test region',
                        eventBody: {
                            query: 'Test'
                        }
                    };

                    chMock = sinon.mock(app.communicationHandler).expects('subscribeLiveData').once().withExactArgs(subscription.region, {query: 'Test'});

                    app.subscribeMessageBusEvent.call(app, subscription);
                    chMock.verify();
                });

                
            });

            describe('unsubscribeMessageBusEvent', function () {
                var eventBus,
                    container,
                    chMock;

                beforeEach(function () {
                    container = core.Element.parse('<div></div>');
                    eventBus = new core.EventBus();
                    app = new VisualizationEngineApp({context: {eventBus: eventBus}});
                    app.start(container);

                    chMock = sinon.mock(app.communicationHandler).expects('unsubscribeLiveData');
                });

                it('should call CommunicationHandlers unsubscribeToServer method', function () {
                    var id = "abc-123";

                    chMock.once().withExactArgs("abc-123");

                    app.unsubscribeMessageBusEvent.call(app, id);
                    chMock.verify();
                });
            });

            describe('createRegionAndShowSettings', function () {
                var eventBus,
                    container,
                    triggerSpy = sinon.spy();

                beforeEach(function () {
                    container = core.Element.parse('<div></div>');
                    eventBus = new core.EventBus();
                    app = new VisualizationEngineApp({context: {eventBus: eventBus}});
                    app.start(container);

                    // sinon.stub(app, 'createRegion').returns({
                    //     openSettingsDialog: openSettingsDialogSpy
                    // });

                    sinon.stub(app, 'createRegion').returns({
                        regionHandler: {
                            trigger: triggerSpy
                        }
                    });

                });

                it('should trigger settingClicked event', function () {
                    app.createRegionAndShowSettings.call(app);

                    expect(triggerSpy.called).to.be.true;
                    expect(triggerSpy.calledWithExactly('settingClicked')).to.be.true;
                });
            });

            describe('hashChangeHandler', function () {
                var eventBus,
                    container,
                    appMock,
                    lcMock,
                    lcStub;

                var dashboardId = '12356346567';                

                beforeEach(function () {
                    container = core.Element.parse('<div></div>');
                    eventBus = new core.EventBus();
                    app = new VisualizationEngineApp({context: {eventBus: eventBus}});
                    app.start(container);
                    
                    this.models = [
                                    {   
                                        "_id": dashboardId,
                                        "id": dashboardId,
                                        "title": "dashboard",             
                                        "author": "John Doe",
                                        "view": "dashboard",       
                                        "tags": [
                                            "LTE",
                                            "Design"
                                        ],
                                         "viewIds": [
                                            "120398adb9d781120398adb9d781",
                                            "081401087aajapife0e3e8f80f3f2b2"
                                        ]
                                    }

                                ];
                                
                    app.dashboardManager.dashboardCollection.addModel(this.models);
                                   
                });
                /*
                it('Get DashboardId from URL', function () {
                    app.loadViewConfiguration = function(){};
                    
                    app.hashChangeHandler(dashboardId);
                    //app.alert.hide();
                    expect(app.dashboardId).to.equal(dashboardId);
                });
                */

               

                            
            });
            
            
            /** Note: this test case is based on the createRegion test case.
             * the main difference is that in this test case two active regions are created,
             * and then a "currentDashboardDeleteEvent" is triggered, supposedly removing the active regions.
             * omg, it works :)
            */ 
            describe('clear active regions - trigger the New dashboard option', function () {
                var eventBus,
                    container;

                beforeEach(function () {
                    container = core.Element.parse('<div></div>');
                    eventBus = new core.EventBus();
                    app = new VisualizationEngineApp({context: {eventBus: eventBus}});
                    app.start(container);
                    app.urlHashState.dashboardId = "";
                    app.urlHashState.query = [];
                    app.urlHashState.endDate = "";
                    app.urlHashState.startDate = "";
                    app.urlHashState.liveData = undefined;
                    app.urlHashState.urlAttributes = false;
                    app.urlHashState.urlMap = {};

                });

                it('should create two active regions, then trigger to clear/remove all active regions ', function () {
                    expect(app.activeRegions.length).to.equal(0);
                    app.createRegion.call(app, {});
                    app.createRegion.call(app, {});
                    // should have 2 active regions
                    expect(app.activeRegions.length).to.equal(2);
                    app.dashboardManager.trigger("currentDashboardDeletedEvent");
                    expect(app.activeRegions.length).to.equal(0);
                });
            });

            
        });
    });
});