if (typeof define !== 'function') {
    var define = require('amdefine')(window.module);
}

define(function() {
    'use strict';

    return {
        EiffelJobFinishedEvent: function () {
            return {
                'domainId': 'kista',
                'eventId': '5d030ada-da4c-4881-9e6e-17eb88baa0db',
                'eventType': 'EiffelJobFinishedEvent',
                'eventTime': new Date().toISOString(),
                'inputEventIds': [
                    '55555555-b0fc-43a6-98de-e0572fad10bd',
                    '66666666-b0fc-43a6-98de-e0572fad10bd'
                ],
                'eiffelData': [{
                    'jobExecutionNumber': 1305,
                    'jobInstance': 'MockEvent',
                    'jobExecutionId': 'bcf820af-6bef-40a8-8b95-385bfb18e7f0',
                    'context': [
                        'eduraci.test'
                    ],
                    'version': '1.0.0'
                }]
            };
        },

        EiffelArtifactNewEvent: function () {
            return {
                'domainId': 'kista',
                'eventId': '3552b1b0-d299-42bc-a958-73e69b8b4391',
                'eventType': 'EiffelArtifactNewEvent',
                'eventTime': new Date().toISOString(),
                'inputEventIds': [
                    '55555555-b0fc-43a6-98de-e0572fad10bd',
                    '66666666-b0fc-43a6-98de-e0572fad10bd'
                ],
                'eiffelData': [{
                    'confidenceLevels': [
                        'CL1',
                        'CL2'
                    ],
                    'gav': {
                        'groupId': 'WMR',
                        'artifactId': 'CXP12345',
                        'version': 'R1A02'
                    },
                    'version': '1.0.0'
                }]
            };
        },

        EiffelJobQueuedEvent: function () {
            return {
                'domainId': 'kista',
                'eventId': '7171cd17-6357-4044-83d5-9ff5f9730484',
                'eventType': 'EiffelJobQueuedEvent',
                'eventTime': new Date().toISOString(),
                'inputEventIds': [
                    '55555555-b0fc-43a6-98de-e0572fad10bd',
                    '66666666-b0fc-43a6-98de-e0572fad10bd'
                ],
                'eiffelData': [{
                    'jobInstance': 'MockEvent',
                    'jobExecutionId': '1f0324a2-693f-44c8-a729-60d9deec4652',
                    'context': [
                        'eduraci.test'
                    ],
                    'version': '1.0.0'
                }]
            };
        },

        EiffelJobStartedEvent: function () {
            return {
                'domainId': 'kista',
                'eventId': '4e38aed5-1895-427c-a135-24b09a248a20',
                'eventType': 'EiffelJobStartedEvent',
                'eventTime': new Date().toISOString(),
                'inputEventIds': [
                    '55555555-b0fc-43a6-98de-e0572fad10bd',
                    '66666666-b0fc-43a6-98de-e0572fad10bd'
                ],
                'eiffelData': [{
                    'jobExecutionNumber': 1306,
                    'jobInstance': 'MockEvent',
                    'jobExecutionId': 'b1e80330-03c2-4e09-baa6-c2277eb59b84',
                    'context': [
                        'eduraci.test'
                    ],
                    'version': '1.0.0'
                }]
            };
        },

        EiffelArtifactModifiedEvent: function () {
            return {
                'domainId': 'kista',
                'eventId': 'fdf55396-3294-497f-b862-f23171120f41',
                'eventType': 'EiffelArtifactModifiedEvent',
                'eventTime': new Date().toISOString(),
                'inputEventIds': [
                    '55555555-b0fc-43a6-98de-e0572fad10bd',
                    '66666666-b0fc-43a6-98de-e0572fad10bd'
                ],
                'eiffelData': [{
                    'confidenceLevels': [
                        'CL1',
                        'CL2'
                    ],
                    'gav': {
                        'groupId': 'WMR',
                        'artifactId': 'CXP12345',
                        'version': 'R1A02'
                    },
                    'version': '1.0.0'
                }]
            };
        },

        VersionedEiffelEvent: function () {
            return {
                'eiffelMessageVersions': {
                    '3.1.2.0.16': {
                        'domainId': 'kista v3.2.1',
                        'eventId': '0f1a2fe5-2f65-4f71-88b1-d46ee3a084f4',
                        'eventTime': '2013-08-15T13:53:45.000Z',
                        'eventType': 'EiffelJobFinishedEvent',
                        'inputEventIds': [],
                        'eventData': {
                            'jobInstance': 'LMBaselineBuilder_rnc_main_89.1_Trigger',
                            'jobExecutionId': '241',
                            'resultCode': 'SUCCESS',
                            'optionalParameters': {
                                'org': 'rnc',
                                'proj': 'main',
                                'inc': '89.1',
                                'track': 'R89A',
                                'ccs': '/proj/ewcdmaci_dev/cis/cilogs/rnc/main/89.1/lmbuild/common/select_config_cs.txt',
                                'dw2cs': '/proj/ewcdmaci_dev/cis/cilogs/rnc/main/89.1/lmbuild/common/main_rnc_db_89.1.txt',
                                'arcprofile': '1',
                                'forced':'true'
                            }
                        }
                    },
                    '2.1.2.0.16': {
                        'domainId': 'kista v2.1.2',
                        'eventId': '0f1a2fe5-2f65-4f71-88b1-d46ee3a084f4',
                        'eventTime': '2013-08-15T13:53:45.000Z',
                        'eventType': 'EiffelJobFinishedEvent',
                        'inputEventIds': [],
                        'eventData': {
                            'jobInstance': 'LMBaselineBuilder_rnc_main_89.1_Trigger',
                            'jobExecutionId': '241',
                            'resultCode': 'SUCCESS',
                            'optionalParameters': {
                                'org': 'rnc',
                                'proj': 'main',
                                'inc': '89.1',
                                'track': 'R89A',
                                'ccs': '/proj/ewcdmaci_dev/cis/cilogs/rnc/main/89.1/lmbuild/common/select_config_cs.txt',
                                'dw2cs': '/proj/ewcdmaci_dev/cis/cilogs/rnc/main/89.1/lmbuild/common/main_rnc_db_89.1.txt',
                                'arcprofile': '1',
                                'forced':'true'
                            }
                        }
                    },
                    '2.1.1.0.9': {
                        'domainId': 'kista v2.1.1',
                        'eventId': '0f1a2fe5-2f65-4f71-88b1-d46ee3a084f4',
                        'eventTime': '2013-08-15T13:53:45.000Z',
                        'eventType': 'EiffelJobFinishedEvent',
                        'inputEventIds': [],
                        'eventData': {
                            'jobInstance': 'LMBaselineBuilder_rnc_main_89.1_Trigger',
                            'jobExecutionId': '241',
                            'resultCode': 'SUCCESS',
                            'optionalParameters': {
                                'org': 'rnc',
                                'proj': 'main',
                                'inc': '89.1',
                                'track': 'R89A',
                                'ccs': '/proj/ewcdmaci_dev/cis/cilogs/rnc/main/89.1/lmbuild/common/select_config_cs.txt',
                                'dw2cs': '/proj/ewcdmaci_dev/cis/cilogs/rnc/main/89.1/lmbuild/common/main_rnc_db_89.1.txt',
                                'arcprofile': '1',
                                'forced':'true'
                            }
                        }
                    }
                }
            };
        }
    };
});
