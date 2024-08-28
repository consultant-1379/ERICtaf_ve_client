define([
    'app/lib/utils/MBAttributes',
    'app/lib/template/MessageBusTemplate',
    'jscore/ext/mvp'
], function (MBAttributes, MessageBusTemplate, mvp) {
    'use strict';

    describe('MBAttributes', function () {
        var should = chai.should();
        describe('Methods', function () {
            var event1 = {
                    "domainId": "kista",
                    "eventId": "d45cca9f-94ca-4fab-a83c-386b3c1660ff",
                    "eventType": "EiffelArtifactModifiedEvent2",
                    "eventTime": "2013-06-28T08:56:24.992Z",
                    "eventData":{
                        "jobInstance":"1_LMDeliveryPoller_rnc_main_89.1",
                        "jobExecutionId":"544",
                        "resultCode": "SUCCESS"
                    },
                    "eventSource": "FlowEventsDemo"
            };
            var list = new mvp.Collection();
            list.addModel({
                "id":"domainId",
                "title":"domainId",
                "isSelected":true,
                "child":null
            });
            list.addModel({
                "id":"eventId",
                "title":"eventId",
                "isSelected":false,
                "child":null
            });
            var child = new mvp.Collection();
            child.addModel({
                "title":"jobInstance",
                "id":"jobInstance",
                 "isSelected":true,
                "child":null
            });
            child.addModel({
                "id":"resultCode",
                "title":"resultCode",
                "isSelected":false,
                "child":null
            });
            list.addModel({
                "id":"eventData",
                "title":"eventData",
                "isSelected":false,
                "child":child
            });
            var list2 = new mvp.Collection();
            list2.addModel({
                "id":"domainId",
                "title":"domainId",
                "isSelected":true,
                "child":null
            });
            list2.addModel({
                "id":"list2Only",
                "title":"list2Only",
                "isSelected":true,
                "child":null
            });
            describe('getDefaultCollection(event:Hash)', function () {
                it('should create a defauly collection of columns', function () {
                    var msg = MBAttributes.getDefaultCollection(event1);
                    msg._collection.models[0].attributes.should.have.property('title', 'domainId');
                });
            });
            describe('getModel(event:hash)', function () {
                it('should create a flattened version of event', function () {
                    var value = MBAttributes.getModel(event1);
                    value.jobInstance.should.equal(event1.eventData.jobInstance);
                });
            });
            describe('getModelRecursive(map: Object, list:Object)', function () {
                it('should populate map with a flattened version of event', function () {
                    var value = {};
                    MBAttributes.getModelRecursive(value, event1);

                    var result = {
                        "domainId": "kista",
                        "eventId": "d45cca9f-94ca-4fab-a83c-386b3c1660ff",
                        "eventType": "EiffelArtifactModifiedEvent2",
                        "eventTime": "2013-06-28T08:56:24.992Z",
                        "jobInstance":"1_LMDeliveryPoller_rnc_main_89.1",
                        "jobExecutionId":"544",
                        "resultCode": "SUCCESS",
                        "eventSource": "FlowEventsDemo"
                    };
                    value.should.eql(result);
                });
            });
            describe('getModelWithoutRecursion(map: Object, list:Object)', function () {
                it('should populate map with a flattened version of event', function () {
                    
                    var result1 = "120398adb9d781120398adb9d781";
                    var result2 = "081401087aajapife0e3e8f80f3f2b2";
                    var configuration = {
                        "id": "8as762aw08u0ca7s8as762aw08u0ca7s",
                        "title": "dashboard",
                        "author": "test",
                        "view": "dashboard",
                        "tags": [
                            "LTE",
                            "Design"
                        ],
                        "viewIds": [
                            "120398adb9d781120398adb9d781",
                            "081401087aajapife0e3e8f80f3f2b2"
                        ]
                    };
                    
                    var value = MBAttributes.getModelWithoutRecursion({}, configuration);
                  
                    value.viewIds[0].should.eql(result1);
                    value.viewIds[1].should.eql(result2);
                });
            });
            describe('getSelectedItems(list:collection)', function () {
                it('should get the selected item from top layer in \"title\"', function () {
                    var value  = MBAttributes.getSelectedItems(list);
                    expect(value.length).to.equal(2);
                    value[0].should.have.property('title', 'domainId');
                });
                it('should get the selected item from lower layer as \"title\"', function () {
                    var value  = MBAttributes.getSelectedItems(list);
                    value[1].should.have.property('title', 'eventData.jobInstance');
                });
            });

            describe('getColumnHeaders(events:Array of Events)', function () {
                it('should extract the attributes list from fist event ', function () {
                    var value  = MBAttributes.getColumnHeaders([event1]);
                    value[0].should.have.property('title', "domainId");
                });

            });
            describe('mergeCollections(list1:EventColleciton, list2:EventCollection)', function () {
                it('should merge two Collections ', function () {
                    var tempList = MBAttributes.mergeCollections(list, list2);
                    tempList._collection._byId["list2Only"].should.not.equal(undefined);


                });
                it('should not duplicate ', function () {
                    var tempList = MBAttributes.mergeCollections(list, list2);
                    tempList._collection.length.should.equal(4);


                });
                it('should merge child as well ', function () {
                    var child = new mvp.Collection();
                    child.addModel({
                        "title":"list2Child",
                        "id":"list2Child",
                        "isSelected":true,
                        "child":null
                    });
                    list2.addModel({
                        "id":"eventData",
                        "title":"eventData",
                        "isSelected":false,
                        "child":child
                    });
                    var tempList = MBAttributes.mergeCollections(list, list2);
                    tempList._collection._byId["eventData"].attributes.child._collection._byId["list2Child"].should.not.equal(undefined);
                });

            });
        });
    });
});