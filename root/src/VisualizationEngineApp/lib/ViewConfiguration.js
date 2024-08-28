[
    
                {
                 "id": "1203983454311203453453781",   
                 "author": "erobsvi",    
                 "type": "FlowView",    
                 "title": "WMR Latest build",            
                 "subscription": ["key1:value1","key2:value2", "all"],    
                 "span": 10,    
                 "aspectRatio": 3,    
                 "tags": [        "WMR",        "Design"    ],     
                 "typeSettings": {
                        "ecSizeSelector": {"name": "300", "title": "300", "value": 300}
                 }
                },

                {
                 "id": "120398ad34534398adb9d781",   
                 "author": "erobsvi",    
                 "type": "PieView",    
                 "title": "WMR Latest build",            
                 "subscription": ["all", "key2:value1"],    
                 "span": 2,    
                 "aspectRatio": null,    
                 "tags": [        "WMR",        "Design"    ],     
                 "typeSettings": {}
                },

                {
                 "id": "120398adb9d78134543781",   
                 "author": "erobsvi",    
                 "type": "TableView",    
                 "title": "WMR Latest build",            
                 "subscription": ["key1:value1","key2:value2", "key2:value1"],    
                 "span": 10,    
                 "aspectRatio": "default",    
                 "tags": [        "WMR",        "Design"    ],     
                 "typeSettings": {
                        "columns": ["domainId", "eventTime", "eventType"],
                        "pagination" : { "name":"Page Size: 100", "value":100, "title":"100"}
                 } 
                },
                {
                 "id": "120398adb9d7813454378134234",   
                 "author": "erobsvi",    
                 "type": "ClusterView",    
                 "title": "WMR Latest build",            
                 "subscription": ["key1:value1","key2:value2", "key2:value1"],    
                 "span": 1,    
                 "aspectRatio": "default",    
                 "tags": [        "WMR",        "Design"    ],     
                 "typeSettings": {
                        "clustering":{"oneNode":false,"typeId":"eventData.jobInstance"},
                        "fadeout":3,
                        "columns":3
                        }
                }
               
]
