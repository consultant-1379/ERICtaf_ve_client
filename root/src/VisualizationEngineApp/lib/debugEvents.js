define(function() {
    'use strict';

    return {
        Event1: function() {
            return {
                "domainId":"kista",
                "eventId":"0c7d5153-7980-44e9-8542-b6292f22a1c8",
                "eventTime":"2013-08-22T14:36:16.000Z",
                "eventType":"EiffelBaselineDefinedEvent",
                "inputEventIds":[""],
                "eventData":{
                    "baselineName":"rnc,main,89.1,source",
                    "baselineIdentifiers": [],
                    "consistsOf": [],
                    "context": {
                        "environment": [],
                        "dependencies":[]
                    },
                    "optionalParameters":{
                        "org":"rnc",
                        "proj":"main",
                        "increment":"89.1",
                        "revision": "R89A",
                        "ccs":"/proj/ewcdmaci_dev/cis/cilogs/rnc/main/89.1/lmbuild/common/select_config_cs.txt",
                        "dw2cs":"/proj/ewcdmaci_dev/cis/cilogs/rnc/main/89.1/lmbuild/common/main_rnc_db_89.1.txt",
                        "arc_profile": "1",
                        "cis_sim":"true",
                        "forced":"false",
                        "eventSource":"1_LMDeliveryPoller_rnc_main_89.1"
                    }
                }
            };
        },

        Event2: function() {
            return {
                "domainId":"kista",
                "eventId":"d565c60f-0707-4d4c-8e67-18c71d2f440c",
                "eventTime":"2013-08-22T14:36:16.000Z",
                "eventType":"EiffelJobFinishedEvent",
                "inputEventIds":[""],
                "eventData":{
                    "jobInstance":"1_LMDeliveryPoller_rnc_main_89.1",
                    "jobExecutionId":"544",
                    "resultCode": "SUCCESS"
                }
            };
        },

        Event3: function() {
            return {
                "domainId":"kista",
                "eventId":"02cb6227-408e-41b3-a037-2146f8dd3962",
                "eventTime":"2013-08-22T14:36:19.000Z",
                "eventType":"EiffelBaselineDefinedEvent",
                "inputEventIds":["0c7d5153-7980-44e9-8542-b6292f22a1c8"],
                "eventData":{
                    "baselineName":"rnc,main,89.1,sourcecollection",
                    "baselineIdentifiers": [],
                    "consistsOf": [],
                    "context": {
                        "environment": [],
                        "dependencies":[]
                    },
                    "optionalParameters":{
                        "org":"rnc",
                        "proj":"main",
                        "increment":"89.1",
                        "revision": "R89A",
                        "ccs":"/proj/ewcdmaci_dev/cis/cilogs/rnc/main/89.1/lmbuild/common/select_config_cs.txt",
                        "dw2cs":"/proj/ewcdmaci_dev/cis/cilogs/rnc/main/89.1/lmbuild/common/main_rnc_db_89.1.txt",
                        "arc_profile": "1",
                        "cis_sim":"true",
                        "forced":"false",
                        "eventSource":"2_LMBaselineBuilder_rnc_main_89.1"
                    }
                }
            };
        },

        Event4: function() {
            return {
                "domainId":"kista",
                "eventId":"8da13726-b909-4449-9e56-e766a7ac75d6",
                "eventTime":"2013-08-22T14:36:19.000Z",
                "eventType":"EiffelJobFinishedEvent",
                "inputEventIds":["0c7d5153-7980-44e9-8542-b6292f22a1c8"],
                "eventData":{
                    "jobInstance":"2_LMBaselineBuilder_rnc_main_89.1",
                    "jobExecutionId":"393",
                    "resultCode": "SUCCESS"
                }
            };
        },

        Event5: function() {
            return {
                "domainId":"kista",
                "eventId":"311a0467-b1b6-4e10-9763-c48558ecd1aa",
                "eventTime":"2013-08-22T14:36:24.000Z",
                "eventType":"EiffelBaselineDefinedEvent",
                "inputEventIds":["02cb6227-408e-41b3-a037-2146f8dd3962"],
                "eventData":{
                    "baselineName":"rnc,main,89.1,rncLmBdh",
                    "baselineIdentifiers": [],
                    "consistsOf": [],
                    "context": {
                        "environment": [],
                        "dependencies":[]
                    },
                    "optionalParameters":{
                        "org":"rnc",
                        "proj":"main",
                        "increment":"89.1",
                        "revision": "R89A",
                        "buildcs":"/proj/ewcdmaci_dev/cis/cilogs/rnc/main/89.1/lmbuild/rncLmBdh/lastBuild/buildcs.txt",
                        "arc_profile": "1",
                        "cis_sim":"true",
                        "eventSource":"3_LMBuildCoordinator_rnc_main_89.1"
                    }
                }
            };
        },

        Event6: function() {
            return {
                "domainId":"kista",
                "eventId":"f6e66beb-f856-4ecc-8315-2e2889ab97c4",
                "eventTime":"2013-08-22T14:36:24.000Z",
                "eventType":"EiffelBaselineDefinedEvent",
                "inputEventIds":["02cb6227-408e-41b3-a037-2146f8dd3962"],
                "eventData":{
                    "baselineName":"rnc,main,89.1,rncLmGps",
                    "baselineIdentifiers": [],
                    "consistsOf": [],
                    "context": {
                        "environment": [],
                        "dependencies":[]
                    },
                    "optionalParameters":{
                        "org":"rnc",
                        "proj":"main",
                        "increment":"89.1",
                        "revision": "R89A",
                        "buildcs":"/proj/ewcdmaci_dev/cis/cilogs/rnc/main/89.1/lmbuild/rncLmGps/lastBuild/buildcs.txt",
                        "arc_profile": "1",
                        "cis_sim":"true",
                        "eventSource":"3_LMBuildCoordinator_rnc_main_89.1"
                    }
                }
            };
        },

        Event7: function() {
            return {
                "domainId":"kista",
                "eventId":"0e37ce61-20cf-4fcb-ad43-a91875ff89e0",
                "eventTime":"2013-08-22T14:36:24.000Z",
                "eventType":"EiffelBaselineDefinedEvent",
                "inputEventIds":["02cb6227-408e-41b3-a037-2146f8dd3962"],
                "eventData":{
                    "baselineName":"rnc,main,89.1,rncLmMao",
                    "baselineIdentifiers": [],
                    "consistsOf": [],
                    "context": {
                        "environment": [],
                        "dependencies":[]
                    },
                    "optionalParameters":{
                        "org":"rnc",
                        "proj":"main",
                        "increment":"89.1",
                        "revision": "R89A",
                        "buildcs":"/proj/ewcdmaci_dev/cis/cilogs/rnc/main/89.1/lmbuild/rncLmMao/lastBuild/buildcs.txt",
                        "arc_profile": "1",
                        "cis_sim":"true",
                        "eventSource":"3_LMBuildCoordinator_rnc_main_89.1"
                    }
                }
            };
        }
    };
});