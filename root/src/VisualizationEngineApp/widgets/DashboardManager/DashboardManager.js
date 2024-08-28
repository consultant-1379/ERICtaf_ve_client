/**
DashboardManager -  controls the loading and saving and deleting of a dashboard configuration
@class DashboardManager
*/
define([
    'jscore/core',
    'jscore/ext/mvp',
    'jscore/ext/utils/base/underscore',
    './DashboardManagerView',
    'widgets/Button',
    'widgets/Dialog',
    'app/models/DashboardModel',
    'app/models/DashboardCollection',
    'app/widgets/Form/Form',
    'widgets/Table',
    'widgets/SelectBox',
    'widgets/Notification',
    'app/models/ViewConfigurationModel',
    'app/lib/utils/DashboardUtils'
], function (core, mvp, _, View, Button, Dialog, DashboardModel, DashboardCollection, Form, Table, SelectBox, Notification, ViewConfigurationModel, DashboardUtils) {
    'use strict';
    
    var keyCode_N = 78;
    var keyCode_L = 76;
    var keyCode_S = 83;
    var keyCode_D = 68;
    
    return core.Widget.extend({

        View: View,

        init: function() {
                   
            this.itemSelectCallback = function(author, title) {
                this.trigger("currentDashboardDeletedEvent");
                this.loadDashboardByAuthorAndTitle(author, title);
                
            }.bind(this);

            this.dropdown = new SelectBox({
                enabled: true,
                value: {name: 'Dashboard Options', value: 'Dashboard Options'},
                items: [
                    {name: 'New (Alt + N)', value: 'New'},
                    {name: 'Load (Ctrl + L)', value: 'Load'},
                    {name: 'Save (Ctrl + S)', value: 'Save'},
                    {name: 'Delete (Ctrl + D)', value: 'Delete'}
                ]
            });

            this.currentDashboardNotification = new Notification({
                label: "Current Dashboard",
                color: "paleBlue",
                autoDismiss: false
            });

            this.currentDashboard = {};
            
            this.deleteOptions = [];
            
            this.columns = [{attribute: "author", title: "Author",width: '50px'},
                            {attribute: "title", title: "Dashboard Name", width: '50px'}];

            this.dialog = new Dialog();

            this.loadDialogButtons = [this.createButton('Cancel', function() { this.dialog.hide(); }.bind(this), 'blue')]; 
            
            this.deleteDialogButtons = [this.createButton('Delete', function() { if (typeof this.deleteDialogContent != 'undefined') {this.findDashboardToDelete();} }.bind(this), 'red'),
                                        this.createButton('Cancel', function() { this.cancelDeleteDashboard(); }.bind(this), 'blue')];

            this.saveDialogContent = new Form([{placeholder: "Signum", name: "signum", popupContent: "Signum should be a minimum of 6 letters. Lowercase only."}, 
                                         {placeholder: "Dashboard name", name: "title", popupContent: "Name should be a minimum of 4 letters or numbers. Hyphens permitted."}]);

            this.saveDialogContent.addInputChecks(["signum", "title"]);

            this.saveDialogButtons = [this.createButton('Save', function() { this.performSaveChecks(); }.bind(this), 'green'),
                                      this.createButton('Cancel', function() { this.dialog.hide(); }.bind(this), 'blue')];


            this.confirmSaveButtons = [this.createButton('Confirm', function() { this.updateExistingDashboard(); }.bind(this), 'green'),
                                             this.createButton('Back', function() { this.configureDialog("Save Dashboard Configuration", this.saveDialogContent, this.saveDialogButtons, "confirmation"); }.bind(this), 'blue')];

            this.confirmDeleteButtons = [this.createButton('Delete', function() {this.deleteDashboard(); }.bind(this), 'red'),
                                         this.createButton('Cancel', function() { this.cancelDeleteDashboard(); }.bind(this), 'blue')];

            this.confirmNewDashboard = [this.createButton('Continue', function() {this.clearDashboard(); }.bind(this), 'red'),
                                         this.createButton('Cancel', function() { this.dialog.hide(); }.bind(this), 'blue')];
                                                     
            this.dashboardCollection = new DashboardCollection();
               
            this.viewConfigurationsToSave = [];
        },

        onViewReady: function () {
            this.eventHandlers();
            this.dropdown.attachTo(this.view.getDropdownElement());
            
            window.onkeydown = function(event) {                 
                if (event.keyCode === keyCode_S && event.ctrlKey)
                {   
                    this.trigger("saveClickedEvent");
                    this.configureDialog("Save dashboard configuration", this.saveDialogContent, this.saveDialogButtons);
                    this.saveDialogContent.setValue("signum", this.currentDashboard.author);
                    this.saveDialogContent.setValue("title", this.currentDashboard.title);
                    this.saveDialogContent.trigger("validateFormEvent");
                    this.dialog.show();
                    event.preventDefault();    
                }
                else if((event.keyCode === keyCode_N && event.altKey) || (event.ctrlKey && event.keyCode === keyCode_N)){
                    this.displayInfoDialog("New");
                     event.preventDefault();
                }
                else if(event.keyCode === keyCode_D && event.ctrlKey){
                    this.displayInfoDialog("Delete");
                     event.preventDefault();
                }
                else if(event.keyCode === keyCode_L && event.ctrlKey){
                    this.displayInfoDialog("Load");
                     event.preventDefault();
                } 
            }.bind(this);
        },
        /**
        Adds Event handlers for the dashboard manager
        @name DashboardManager#eventHandlers
        */
        eventHandlers: function() {
            
            this.dropdown.addEventHandler("change", function() {
                var context = this.dropdown.getValue().value;
                this.dropdown.setValue({name: 'Dashboard Options', value: 'Dashboard Options'});
                if(context === "Save") {
                    this.trigger("saveClickedEvent");
                    this.configureDialog("Save dashboard configuration", this.saveDialogContent, this.saveDialogButtons);
                    this.saveDialogContent.setValue("signum", this.currentDashboard.author);
                    this.saveDialogContent.setValue("title", this.currentDashboard.title);
                    this.saveDialogContent.trigger("validateFormEvent");
                    this.dialog.show();
                }
                else {
                    this.displayInfoDialog(context);
                }
            }.bind(this));

            this.saveDialogContent.addEventHandler("validateFormEvent", function() {
                this.validateForm();
            }.bind(this));
        },

        /**
        Generates load and save dialogs displays the appropriate one according to context.
        @param context - String, 'Load' or 'Delete'.
        @name DashboardManager#displayInfoDialog
        */
        displayInfoDialog: function(context) {

            if (context === "New"){
                this.configureDialog("New will clear your dashboard",	"All unsaved information will be lost. Do you want to continue?", this.confirmNewDashboard, "warning");
                this.dialog.show();
            }else{

                this.dashboardCollection.fetch({

                    data: "outputType=full",

                    success: function() {
                        this.updateTreeWidget();
                        if(context === "Load") {
                            this.configureDialog("User dashboards", this.loadDialogContent, this.loadDialogButtons, "information");
                        }
                        else if(context === "Delete") {
                            this.configureDialog("Choose dashboards to delete", this.deleteDialogContent, this.deleteDialogButtons, "information");
                        }
                        this.dialog.show();
                    }.bind(this),

                    error: function() {
                        this.displayErrorDialog("Dashboards not fetched.");
                    }.bind(this)
                });
            }
        },
        /**
        Updates the tree widget that displays the configurations
        @param context - String, 'Load' or 'Delete'.
        @name DashboardManager#updateTreeWidget
        */
        updateTreeWidget: function() {
            this.loadDialogContent = DashboardUtils.createTreeWidget(this.dashboardCollection, false, this.itemSelectCallback);
            this.deleteDialogContent = DashboardUtils.createTreeWidget(this.dashboardCollection, true, null);
        },

        /**
        Configures dialog based on context.
        @name DashboardManager#configureDialog
        @param header - dialog header.
        @param content - dialog content.
        @param buttons - dialog buttons.
        **/
        configureDialog: function(header, content, buttons, type) {
            this.dialog.setHeader(header);
            this.dialog.setContent(content);
            this.dialog.setButtons(buttons);
            this.dialog.setDialogType(type);
        },
       
        createButton: function(caption, action, color) {
            return {caption: caption, action: action, color: color};
        },

        displayErrorDialog: function(errorMessage) {
            var button = this.createButton('OK', function() { this.dialog.hide(); }.bind(this), 'blue'); 
            this.configureDialog("Error", errorMessage, [button], "error");
            this.dialog.show();
        },

        /**
        Form validation. Regex matching employed.
        @name DashboardManager#validateForm
        **/
        validateForm: function() {
            var author = this.saveDialogContent.getValue("signum");
            var title = this.saveDialogContent.getValue("title");
            var lowerCasePattern = /^[a-z]+$/;
            var titlePattern  = /^[-a-zA-Z0-9]+$/;
            var signumLowercase = lowerCasePattern.test(author);
            var titleOk = titlePattern.test(title);
            var longEnough = author.length > 5 && title.length > 3;
           
            if(author.length <= 5 || !signumLowercase) {
                this.saveDialogContent.setErrorStatus("signum");
            }
            else {
                this.saveDialogContent.removeErrorStatus("signum");
            }

            if(title.length <= 3 || !titleOk) {
                this.saveDialogContent.setErrorStatus("title");
            }
            else {
                this.saveDialogContent.removeErrorStatus("title");
            }

            if(longEnough && signumLowercase && titleOk) {
                this.dialog.getButtons()[0].enable();
            }
            else {
                this.dialog.getButtons()[0].disable();
            }
        },

        /**
        Gets the values of the inputs of the Form widget used as content in the Dialog.
        @name DashboardManager#getFormValues
        @returns - an object containing the input values.
        **/
        getFormValues: function() {
            var author = this.saveDialogContent.getValue("signum");
            var title = this.saveDialogContent.getValue("title");
            return {author: author, title: title};
        },

        /**
        Searches the DashboardCollection for a model with a given id.
        @name DashboardManager#getModelById
        @param id - the id of the model to search for.
        @returns - DashboardModel or undefined.
        **/
        getModelById: function(id) {
            this.dashboardCollection.fetch({

                data:"ids="+id+"&outputType=full",

                success: function() {
                    var failed = true;
                    this.dashboardCollection.each(function(dashboard) {
                        if(dashboard.getId() === id) {
                            this.trigger("loadDashboardEvent", dashboard.toJSON());
                            failed = false;
                        }
                    }.bind(this));

                    if(failed) {
                        this.displayErrorDialog("Dashboards not fetched.  Please try again.");
                        this.trigger("loadDashboardEvent",{});                        
                    }
                }.bind(this),

                error: function() {
                    this.displayErrorDialog("Dashboards not fetched.  Please try again.");
                }.bind(this)
            });            
        },

        /**
        Searches the DashboardCollection for a model with
        attributes "author" and "title".
        @name DashboardManager#getModelByAuthorAndTitle
        @param author - the author of the dashboard.
        @param title - the title of the dashboard.
        @returns - DashboardModel or undefined
        **/
        getModelByAuthorAndTitle: function(author, title) {
            var dashboard;
            var authorsDashboards = new DashboardCollection();
            this.dashboardCollection.each(function(model) {
                if(model.getAuthor() === author) {
                    authorsDashboards.addModel(model);
                }
            });

            authorsDashboards.each(function(model) {
                if(model.getTitle() === title) {
                    dashboard = model;
                }
            });
            
            return dashboard;
        },

        /**
        Checks if the model "title" owned by "author" exists.
        @param author {string}
        @param title {string}
        @name DashboardManager#modelExists
        @returns - boolean
        **/
        modelExists: function(author, title) {
            var modelExists = false;
            var authorsDashboards = new DashboardCollection();
            this.dashboardCollection.each(function(model) {
                if(model.getAuthor() === author) {
                    authorsDashboards.addModel(model);
                }
            });

            authorsDashboards.each(function(model) {
                if(model.getTitle() === title) {
                    modelExists = true;
                }
            });
            return modelExists;
        },

        /**
        Loads the unique dashboard specified by author and title.
        @name DashboardManager#loadDashboardByAuthorAndTitle
        @param author - the author of the dashboard.
        @param title - the title of the dashboard.
        */
        loadDashboardByAuthorAndTitle: function(author, title) {
            var dashboard = this.getModelByAuthorAndTitle(author, title);            
            this.trigger("loadDashboardEvent", dashboard.toJSON());    
            this.dialog.hide();                  
        },

        /**
        Retrieves save dialog form values and checks data for uniqueness.  If the data is non-unique
        a confirm dialog is shown, presenting the user with options to overwrite previous data or cancel.
        @name DashboardManager#performSaveChecks
        */
        performSaveChecks: function() {
            var numberOfViews = this.viewConfigurationsToSave.length;
            if(numberOfViews === 0) {
                this.displayErrorDialog("No views in dashboard!");
            }
            else {
                this.dashboardCollection.fetch({
                    data: "outputType=full",

                    success: function() {
                        this.formValues = this.getFormValues();
                        var author = this.formValues.author;
                        var title = this.formValues.title;
                        if(!this.modelExists(author, title)) {
                            this.saveNewDashboard(author, title);
                        }
                        else {
                            this.configureDialog("Confirm Save", 
                                "The Dashboard \"" + this.formValues.author + ":" + this.formValues.title + "\" already exists. Overwrite?", 
                                this.confirmSaveButtons, "confirmation");
                        }
                    }.bind(this),

                    error: function() {
                        this.displayErrorDialog("Error");
                    }.bind(this)
                });
                
            }
        },

        /**
        Creates a new model from user input, adds it to the 
        DashboardCollection and saves it to the server-side resource.
        @name DashboardManager#saveNewDashboard
        @param author - the author of the dashboard.
        @param title - the title of the dashboard.
        **/
        saveNewDashboard: function(author, title) {
            var viewSaveStatus = this.saveViewConfigurations();
            if(viewSaveStatus.error) {
                this.displayErrorDialog("One or more views were not saved.");
            }
            else {
                var model = new DashboardModel({
                    title: title,
                    author: author,
                    viewIds: viewSaveStatus.viewIds
                });
                
                model.save(null, {
                    success: function() {
                        this.dashboardCollection.addModel(model);
                        this.updateTreeWidget();
                        this.trigger("onAfterSaveEvent", model.toJSON()); 
                        this.showCurrentDashboardNotification(author, title);                             
                    }.bind(this),

                    error: function() {
                        this.displayErrorDialog("Dashboard not saved.");
                    }.bind(this)
                });

                this.dialog.hide();
            }
        },

        /**
        Updates an existing DashboardModel with new tags and a list of viewIds.
        @name DashboardManager#updateExistingDashboard
        **/
        updateExistingDashboard: function() {
            var viewSaveStatus = this.saveViewConfigurations();
            if(viewSaveStatus.error) {
                this.displayErrorDialog("One or more views were not saved.");
            }
            else {
                var author = this.formValues.author;
                var title = this.formValues.title;
                var model = this.getModelByAuthorAndTitle(author, title);
               
                model.save({
                    viewIds: viewSaveStatus.viewIds
                }, {
                    success: function() {
                        this.trigger("onAfterSaveEvent", model.toJSON());   
                        this.showCurrentDashboardNotification(author, title);                     
                    }.bind(this),

                    error: function() {
                        this.displayErrorDialog("Dashboard not saved.");
                    }.bind(this)
                });
                
                this.dialog.hide();
            }
        },
        /**
        Save view configurations of a dashboard
        @name DashboardManager#saveViewConfigurations
        **/
        saveViewConfigurations: function() {
            var viewSaveStatus = {viewIds: []};

            _.each(this.viewConfigurationsToSave, function(config) {
                var model = new ViewConfigurationModel();
                if(config.data._id !== undefined) {
                    model.setAttribute("id", config.data._id);
                    model.fetch({
                        async: false
                    });
                }

                model.setAttribute(config.data);

                model.save(null, {
                    async: false, 

                    success: function() {
                        var viewId = model.getId();
                        this.trigger("assignServerIdEvent", {
                            region: config.region,
                            id: viewId
                        });
                        viewSaveStatus.viewIds.push(viewId);
                    }.bind(this),

                    error: function() {
                        viewSaveStatus.error = true;
                    }
                });
            }.bind(this));
            
            return viewSaveStatus;
        },

        /**
        Method to delete a dashboard
        @name DashboardManager#findDashboardToDelete
        **/
        findDashboardToDelete: function() {   
            this.dialog.hide();
            var items = this.deleteDialogContent.getItems();
            if (items) {                            
                _.each(items, function(options) {  
                    _.each(options.definition.children,function(child) {              
                        if(child.checkbox.checked) {
                            this.deleteOptions.push({author:child._parent.label, title:child.label});
                        }
                    }.bind(this));
                                          
                }.bind(this));
                
                if(this.deleteOptions.length !== 0) {
                    this.tableWidget = new Table({columns: this.columns, tooltips: true, minWidth: '430px'}, this.deleteOptions);                            
                    this.configureDialog("Are you sure you want to delete?", this.tableWidget, this.confirmDeleteButtons);
                    this.dialog.show();
                }
                else {
                    var button = this.createButton('Back', function() { this.configureDialog("Choose dashboards to delete", this.deleteDialogContent, this.deleteDialogButtons); }.bind(this), 'blue');
                    this.configureDialog("No dashboards selected", "Please choose dashboard(s) to delete", [button], "error");
                    this.dialog.show();
                }
            }
        },

        /**
        Method to delete a dashboard by sending an ajax request
        @name DashboardManager#deleteDashboard
        **/
        deleteDashboard: function() {
            this.dialog.hide();
            _.each(this.deleteOptions, function(options) {
                var model = this.getModelByAuthorAndTitle(options.author, options.title);                
                model.destroy();
                if(options.author === this.currentDashboard.author && options.title === this.currentDashboard.title) {
                    this.removeCurrentDashboardNotification();
                    this.trigger("currentDashboardDeletedEvent");
                }
            }.bind(this));

            this.updateTreeWidget();
            this.deleteOptions = [];
        },
        /**
        Method to update view configurations that already exist
        @name DashboardManager#updateViewConfigurationsToSave
        @param author {Object}    Json Object
        */
        updateViewConfigurationsToSave: function(views) {
            this.viewConfigurationsToSave = views;
        },
        /**
        Method to set dashboard notifications
        @name DashboardManager#showCurrentDashboardNotification
        @param author {String}
        @param title {String}       
        **/
        showCurrentDashboardNotification: function(author, title) {
            if(author && title){
                this.currentDashboard.author = author;
                this.currentDashboard.title = title;
                this.currentDashboardNotification.setLabel(author + " : " + title);
                this.currentDashboardNotification.attachTo(this.view.getCurrentDashboardElement());
            }
            else{
                this.removeCurrentDashboardNotification();
            }
        },
        /**
        Method to remove dashboard notifications
        @name DashboardManager#removeCurrentDashboardNotification        
        **/
        removeCurrentDashboardNotification: function() {
            this.currentDashboard.author = "";
            this.currentDashboard.title = "";
            this.currentDashboardNotification.detach();
        },
        
        /**
        Method to cancel remove selected delete options
        @name DashboardManager#cancelDeleteDashboard        
        **/
        cancelDeleteDashboard: function() {
            this.dialog.hide();
            this.deleteOptions = [];
        },
        
       /**
        Method to clear the current dashboard of views 
        @name DashboardManager#clearDashboard
        */
        clearDashboard: function() {
            this.dialog.hide();
            this.trigger("currentDashboardDeletedEvent");
        },

        
    });
});