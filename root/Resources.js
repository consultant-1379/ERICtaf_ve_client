module.exports = function(app) {
    app.get('/configuration/dashboards', function(req, resp) {
        resp.send([
                {
                    "id": "62jg5daw08u0ca7s8as762aw08u0ca7s",
                    "title": "Robin's dashboard",             
                    "author": "erobsvi",
                    "view": "dashboard",       
                    "tags": [
                        "LTE",
                        "Design"
                    ],
                     "viewIds": [
                        "120398adb9d781120398adb9d781"
                    ]
                },

                {
                    "id": "9ig57saw08u0ca7s8as762aw08u0ca7s",
                    "title": "Eiffel",              
                    "author": "ejhnhng",
                    "view": "dashboard",        
                    "tags": [
                        "DURACI",
                        "Design"
                    ],
                     "viewIds": [
                        "1203983454311203453453781",
                        "120398ad34534398adb9d781",
                        "120398adb9d78134543781",
                        "120398adb9d7813454378134234"
                    ]
                },

                {
                    "id": "4lf37saw08u0ca7s8as762aw08u0ca7s",
                    "title": "PM Mediation dashboard",              
                    "author": "egergle",
                    "view": "dashboard",        
                    "tags": [
                        "SON",
                        "Design"
                    ],
                     "viewIds": [
                        "7f44h8adb9d781120398adb9d781",
                        "33hfd51087aajapife0e3e8f80f3f2b2"
                    ]
                },

                {
                    "id": "7fg44saw08u0ca7s8as762aw08u0ca7s",
                    "title": "LTE dashboard",             
                    "author": "erobsvi",
                    "view": "dashboard",       
                    "tags": [
                        "LTE",
                        "Design"
                    ],
                     "viewIds": [
                        "7f37f8adb9d781120398adb9d781",
                        "22hh5087aajapife0e3e8f80f3f2b2"
                    ]
                },

                {
                    "id": "2hh55law08u0ca7s8as762aw08u0ca7s",
                    "title": "TOR dashboard",              
                    "author": "ejhnhng",
                    "view": "dashboard",        
                    "tags": [
                        "OSS",
                        "Design"
                    ],
                     "viewIds": [
                        "0hd48adb9d781120398adb9d781",
                        "44hs21087aajapife0e3e8f80f3f2b2"
                    ]
                },

                {
                    "id": "0ff33sw08u0ca7s8as762aw08u0ca7s",
                    "title": "Policy Manager dashboard",              
                    "author": "egergle",
                    "view": "dashboard",        
                    "tags": [
                        "Vis",
                        "Design"
                    ],
                     "viewIds": [
                        "8f563d8adb9d781120398adb9d781",
                        "8f34d1087aajapife0e3e8f80f3f2b2"
                    ]
                }

            ]);
    });

    app.put('/configuration/dashboards', function(req, resp) {
        resp.send(200);
    });

    app.post('/configuration/dashboards', function(req, resp) {
        resp.send(201);
    });

    app.delete('/configuration/dashboards', function(req, resp) {
        resp.send(204);
    });

    app.get('/configuration/views', function(req, resp) {
        resp.send([
    
                {
                 "id": "1203983454311203453453781",   
                 "author": "ejhnhng",    
                 "type": "FlowView",    
                 "title": "WMR Latest build",            
                 "subscription": ["eventType:EiffelJobFinishedEvent","key2:value2", "all"],    
                 "span": 4,    
                 "aspectRatio": 3,    
                 "tags": [        "WMR",        "Design"    ],     
                 "typeSettings": {
                        "ecSizeSelector": {"name": "300", "title": "300", "value": 300}
                 }
                },

                {
                 "id": "120398ad34534398adb9d781",   
                 "author": "ejhnhng",    
                 "type": "PieView",    
                 "title": "WMR Latest build",            
                 "subscription": ["all", "key2:value1"],    
                 "span": 5,    
                 "aspectRatio": null,    
                 "tags": [        "WMR",        "Design"    ],     
                 "typeSettings": {}
                },

                {
                 "id": "120398adb9d78134543781",   
                 "author": "ejhnhng",    
                 "type": "TableView",    
                 "title": "WMR Latest build",            
                 "subscription": ["key1:value1","key2:value2", "key2:value1"],    
                 "span": 5,    
                 "aspectRatio": "default",    
                 "tags": [        "WMR",        "Design"    ],     
                 "typeSettings": {
                        "columns": ["domainId", "eventTime", "eventType"],
                        "pagination" : { "name":"Page Size: 100", "value":100, "title":"100"}
                 } 
                },
                {
                 "id": "120398adb9d7813454378134234",   
                 "author": "ejhnhng",    
                 "type": "ClusterView",    
                 "title": "WMR Latest build",            
                 "subscription": ["key1:value1","key2:value2", "key2:value1"],    
                 "span": 4,    
                 "aspectRatio": "default",    
                 "tags": [        "WMR",        "Design"    ],     
                 "typeSettings": {
                        "clustering":{"oneNode":false,"typeId":"eventData.jobInstance"},
                        "fadeout":3,
                        "columns":3
                        }
                }
               
            ]);
    });

    app.put('/configuration/views', function(req, resp) {
        resp.send(200);
    });

    app.post('/configuration/views', function(req, resp) {
        resp.send(201);
    });

    app.delete('/configuration/views', function(req, resp) {
        resp.send(204);
    });

    app.post('/historicaldata/queryhandler', function(req, resp) {
        var data = {};
        if (req.body.model === "DirectedAcyclicGraphModel"){
            data.items = [
                [{"id": 0,
                  "type"      : "events",
                  "uniqueId"  : "0c7d5153-7980-44e9-8542-b6292f22a1c8",
                  "title"     : "EiffelBaselineDefinedEvent",
                  "information": {"domainId":"kista", "Status":"Success"},
                  "status"    : "SUCCESS",
                  "connection": [{"id":2,"type":"inputEventId"},{"id":3,"type":"inputEventId"}]},            
                {"id": 2,
                 "type"      : "events",
                 "uniqueId"  : "02cb6227-408e-41b3-a037-2146f8dd3962",
                 "title"     : "EiffelBaselineDefinedEvent",
                 "information": {"domainId":"kista", "Status":"Success"},
                 "status"    : "SUCCESS",
                 "connection": [{"id":4,"type":"inputEventId"},{"id":5,"type":"inputEventId"},{"id":6,"type":"inputEventId"}]},
                {"id": 3,
                 "type"      : "events",
                 "uniqueId"  : "8da13726-b909-4449-9e56-e766a7ac75d6",
                 "title"     : "EiffelJobFinishedEvent",
                 "information": {"domainId":"kista", "Status":"Success"},
                 "status"    : "SUCCESS",
                 "connection": []},
                {"id": 4,
                 "type"      : "events",
                 "uniqueId"  : "8da13726-b909-4449-9e56-e766a7ac75d7",
                 "title"     : "EiffelJobFinishedEvent",
                 "information": {"domainId":"kista", "Status":"Success"},
                 "status"    : "SUCCESS",
                 "connection": []},
                {"id": 5,
                 "type"      : "events",
                 "uniqueId"  : "8da13726-b909-4449-9e56-e766a7ac75d8",
                 "title"     : "EiffelJobFinishedEvent",
                 "information": {"domainId":"kista", "Status":"Unknown"},
                 "status"    : "UNKNOWN",
                 "connection": []},
                {"id": 6,
                 "type"      : "events",
                 "uniqueId"  : "8da13726-b909-4449-9e56-e766a7ac75d9",
                 "title"     : "EiffelJobFinishedEvent",
                 "information": {"domainId":"kista", "Status":"Success"},
                 "status"    : "SUCCESS",
                 "connection": []}
                ],
                [{"id": 1,
                  "type"      : "events",
                  "uniqueId"  : "d565c60f-0707-4d4c-8e67-18c71d2f440c",
                  "title"       : "EiffelJobFinishedEvent",
                  "information": {"domainId":"kista", "Status":"Success"},
                  "status"    : "SUCCESS",
                  "connection": []}
                ]
            ]; 
        } else if(req.body.model === "RatioDistributionModel") {
            data.items = [
                {label: 'EiffelSCMChangedEvent', value: 11},
                {label: 'EiffelJobStartedEvent', value: 45},
                {label: 'EiffelJobTestCaseStartedEvent', value: 62},
                {label: 'EiffelJobTestCaseFinishedEvent', value: 58},
                {label: 'EiffelArtifactNewEvent', value: 4},
                {label: 'EiffelJobFinishedEvent', value: 77},
            ];
        }

        resp.send(data);
    });
}
