define([
    'app/widgets/DashboardManager/DashboardManager',
    'app/models/ViewConfigurationModel',
    'jscore/ext/utils/base/underscore',
    'app/lib/utils/DashboardUtils'
], function (DashboardManager, ViewConfigurationModel, _, DashboardUtils) {
    'use strict';

    describe('DashboardManager', function () {

        beforeEach(function() {
            this.dashboardManager = new DashboardManager();
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
            this.dashboardManager.dashboardCollection.addModel(this.models);

            this.viewConfig = {
                "region": "13748c9f-66ab-7b00-b7a0-15ebae3e3d9a-1396427925164",
                "data": {
                    "_id": "1203983454311203453453781",   
                    "id": "1203983454311203453453781",   
                    "author": "erobsvi",    
                    "type": "FlowView",    
                    "title": "WMR Latest build",            
                    "subscription": ["eventType:EiffelJobFinishedEvent","key2:value2", "all"],    
                    "span": 4,    
                    "aspectRatio": 3,    
                    "tags": ["WMR", "Design"],     
                    "typeSettings": {
                        "ecSizeSelector": {"name": "300", "title": "300", "value": 300}
                    }
                }
            }
        });

        describe('Functionality', function () {

            var should = chai.should();

            it('should initialise variables correctly', function() {
                _.isEmpty(this.dashboardManager.currentDashboard).should.equal(true);
                this.dashboardManager.deleteOptions.length.should.equal[0];
                this.dashboardManager.columns.should.exist;
                this.dashboardManager.dialog.should.exist;
                this.dashboardManager.loadDialogButtons.should.exist;
                this.dashboardManager.deleteDialogButtons.should.exist;
                this.dashboardManager.saveDialogContent.should.exist;
                this.dashboardManager.saveDialogButtons.should.exist;
                this.dashboardManager.confirmSaveButtons.should.exist;
                this.dashboardManager.confirmDeleteButtons.should.exist;
                this.dashboardManager.dashboardCollection.should.exist;
                this.dashboardManager.viewConfigurationsToSave.length.should.equal(0);
            });

            it('should create buttons correctly', function() {
                var testFunction = function() {
                    console.log("test");
                };
                var button = this.dashboardManager.createButton("Button", testFunction, "blue");
                button.caption.should.equal("Button");
                button.action.should.equal(testFunction);
                button.color.should.equal("blue");
            });

            it('should fetch dashboards correctly', function() {
                var server = sinon.fakeServer.create();
                server.respondWith(
                    "GET",
                    "/configuration/dashboards",
                    [200, {"Content-Type": "application/json"}, JSON.stringify(this.models)]
                );

                this.dashboardManager.dashboardCollection.fetch();
                server.respond();
            });

            it('should generate tree widget correctly', function() {
                this.dashboardManager.updateTreeWidget();
                this.dashboardManager.loadDialogContent.should.exist;
                this.dashboardManager.deleteDialogContent.should.exist;
            });

            it('should configure dialogs correctly', function() {
                var buttons =  [this.dashboardManager.createButton('Caption', function() { console.log("test") }.bind(this), 'blue')]; 
                this.dashboardManager.configureDialog("Header", "Content", buttons, "error");
                this.dashboardManager.dialog.getButtons().length.should.equal(1);
                this.dashboardManager.dialog.getButtons()[0].options.caption.should.equal("Caption");
            });
            /*
            it('should retrieve model by id', function() {
                var model = this.dashboardManager.getModelById("62jg5daw08u0ca7s8as762aw08u0ca7s");
                model.author.should.equal("erobsvi");
                model.title.should.equal( "Robin's dashboard");
                model.tags[0].should.equal("LTE");
                model.tags[1].should.equal("Design");
                model.viewIds[0].should.equal("120398adb9d781120398adb9d781");
                model.viewIds[1].should.equal("081401087aajapife0e3e8f80f3f2b2");
            });
            */
            it('should retrieve model by author and title', function() {
                var model = this.dashboardManager.getModelByAuthorAndTitle("ejhnhng", "Eiffel").toJSON();
                model.author.should.equal("ejhnhng");
                model.title.should.equal( "Eiffel");
                model.tags[0].should.equal("DURACI");
                model.tags[1].should.equal("Design");
                model.viewIds[0].should.equal("gg336adb9d781120398adb9d781");
                model.viewIds[1].should.equal("9f4hs1087aajapife0e3e8f80f3f2b2");
            });

            it('should correctly determine whether a model exists when given its author and title', function() {
                var exists = this.dashboardManager.modelExists("ejhnhng", "Eiffel");
                exists.should.equal(true);
                exists = this.dashboardManager.modelExists("erobsvi", "Dashboard1");
                exists.should.equal(false);
            });
            /*
            it('should set the current dashboard correctly', function() {
                this.dashboardManager.loadDashboardByAuthorAndTitle("erobsvi", "LTE dashboard");
                this.dashboardManager.currentDashboard.author.should.equal("erobsvi");
                this.dashboardManager.currentDashboard.title.should.equal("LTE dashboard");
            });
            */
            it('should perform save checks correctly', function() {
                this.dashboardManager.performSaveChecks();
                this.dashboardManager.dialog.isVisible().should.equal(true);
                this.dashboardManager.saveDialogContent.setValue("signum", "ejhnhng");
                this.dashboardManager.saveDialogContent.setValue("title", "Eiffel");
                this.dashboardManager.updateViewConfigurationsToSave([this.viewConfig]);
                this.dashboardManager.performSaveChecks();
                this.dashboardManager.dialog.isVisible().should.equal(true);
                this.dashboardManager.dialog.hide();
            });

            it('should save view configurations correctly', function() {
                this.dashboardManager.updateViewConfigurationsToSave([this.viewConfig]);
                var view = new ViewConfigurationModel();
                var spy = sinon.spy(view, "save");
                this.dashboardManager.saveViewConfigurations();
                spy.should.have.been.calledOnce;
            });

            it('should create error dialogs correctly', function() {
                this.dashboardManager.displayErrorDialog("An error dialog");
                this.dashboardManager.dialog.isVisible().should.equal(true);
                this.dashboardManager.dialog.hide();
            });

            it('should retrieve form values correctly', function() {
                this.dashboardManager.saveDialogContent.setValue("signum", "erobsvi");
                this.dashboardManager.saveDialogContent.setValue("title", "LTE");
                var formValues = this.dashboardManager.getFormValues();
                formValues.author.should.equal("erobsvi");
                formValues.title.should.equal("LTE");
            });

            it('should update viewIds correctly', function() {
                this.dashboardManager.updateViewConfigurationsToSave(["abc", "def"]);
                this.dashboardManager.viewConfigurationsToSave[0].should.equal("abc");
                this.dashboardManager.viewConfigurationsToSave[1].should.equal("def");
            });

            it('should correctly choose which dashboard to load and close the dialog', function() {
                this.dashboardManager.loadDashboardByAuthorAndTitle("ejhnhng", "Eiffel");
                this.dashboardManager.dialog.isVisible().should.equal(false);
            });
            
            it('should get list of what has been selected for deletion', function() {
                var items = DashboardUtils.createTreeWidgetItems(this.dashboardManager.dashboardCollection, true);
                this.dashboardManager.updateTreeWidget();
                this.dashboardManager.deleteDialogContent.getItems()[0].definition.children[0].checkbox.checked=true
                this.dashboardManager.deleteDialogContent.getItems()[1].definition.children[0].checkbox.checked=true
                this.dashboardManager.findDashboardToDelete();
                this.dashboardManager.dialog.hide();
                this.dashboardManager.deleteOptions[0].author.should.equal("erobsvi")               
                this.dashboardManager.deleteOptions[1].title.should.equal("Eiffel") 
            });

            it('should remove the current dashboard details if the current dashboard has been deleted', function() {
                this.dashboardManager.currentDashboard = {author: "erobsvi", title: "LTE dashboard"};
                this.dashboardManager.deleteOptions.push({author: "erobsvi", title: "LTE dashboard"});
                this.dashboardManager.deleteDashboard();
                this.dashboardManager.currentDashboard.author.should.equal("");
                this.dashboardManager.currentDashboard.title.should.equal("");
            });
            

        });
    });
});