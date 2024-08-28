define([
     'app/lib/utils/DashboardUtils',
      'app/models/DashboardCollection'
], function (DashboardUtils, DashboardCollection) {
    'use strict';

    describe('DashboardUtils', function () {

        beforeEach(function() {
           
            this.models = [
                {
                    "_id": "62jg5daw08u0ca7s8as762aw08u0ca7s",
                    "id": "62jg5daw08u0ca7s8as762aw08u0ca7s",
                    "title": "Robin's dashboard",             
                    "author": "erobsvi",
                    "view": "dashboard",       
                    "tags": [
                        "LTE",
                        "Design"
                    ],
                     "viewIds": [
                        "120398adb9d781120398adb9d781",
                        "081401087aajapife0e3e8f80f3f2b2"
                    ]
                },

                {
                    "_id": "9ig57saw08u0ca7s8as762aw08u0ca7s",
                    "id": "9ig57saw08u0ca7s8as762aw08u0ca7s",
                    "title": "Eiffel",              
                    "author": "ejhnhng",
                    "view": "dashboard",        
                    "tags": [
                        "DURACI",
                        "Design"
                    ],
                     "viewIds": [
                        "gg336adb9d781120398adb9d781",
                        "9f4hs1087aajapife0e3e8f80f3f2b2"
                    ]
                },

                {
                    "_id": "4lf37saw08u0ca7s8as762aw08u0ca7s",
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
                    "_id": "7fg44saw08u0ca7s8as762aw08u0ca7s",
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
                    "_id": "2hh55law08u0ca7s8as762aw08u0ca7s",
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
                    "_id": "0ff33sw08u0ca7s8as762aw08u0ca7s",
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

            ];
            
            this.dashboardCollection = new DashboardCollection();
            this.dashboardCollection.addModel(this.models);

        });

        describe('Functionality', function () {

            var should = chai.should();

            it('should create user items correctly', function() {
                var userItem = DashboardUtils.createUserItem("egergle");
                userItem.label.should.equal("egergle");
                userItem.icon.should.equal("folder");
                userItem.children.length.should.equal(0);
            });

            it('should create dashboard items correctly', function() {
                var dashboardItem = DashboardUtils.createDashboardItem("Eiffel");
                dashboardItem.label.should.equal("Eiffel");
                dashboardItem.icon.should.equal("newFile");
            });

            it('should nested Tree widget items correctly', function() {
                var items = DashboardUtils.createTreeWidgetItems(this.dashboardCollection, false);
                items[0].label.should.equal("erobsvi");
                items[0].icon.should.equal("folder");
                items[0].children.length.should.equal(2);
                items[0].children[0].label.should.equal("Robin's dashboard");
                items[0].children[1].label.should.equal("LTE dashboard");
            });

        });
    });
});