/**
Method to add subscriptions for each region by triggering an event
@class Subscription
*/
define([
    'jscore/core',
    './SubscriptionView',
    './ExistingSubscriptionRow/ExistingSubscriptionRow',
    'widgets/Button',
    'widgets/InfoPopup',
    'jscore/ext/utils/base/underscore',
    'app/config/config',
    
], function (core, View, ExistingSubscriptionRow, Button, InfoPopup, _, config) {
    var ENTER_KEY = 13;

    return core.Widget.extend({
        View: View,

        init: function () {
            this.buttonWidget = new Button({
                caption: 'Add Criteria',
                modifiers: [
                    {name: 'wMargin'},
                    {name: 'default'},
                    {name: 'color_darkBlue'}
                ],
                enabled: false
            });

            this.criteriaList = [];

        },

        onViewReady: function() {
            var subInput = this.view.getSubscriptionInputElement();
            this.view.hideExistingSubscriptionsHeader();
            subInput.addEventHandler('keyup', function (data) {
                if (this.checkValue(subInput.getValue())) {
                    
                    this.buttonWidget.enable();
                    this.element.find(".ebInput-statusError").setStyle("display","none");

                    // allow 'enter'-key to add subscription
                    if (data.originalEvent.keyCode === ENTER_KEY) {
                        if(this.addSubscription(this.view.getSubscriptionInputValue())){
                            this.view.setSubscriptionInputValue('');
                        }else{
                            this.element.find(".ebInput-statusError").setStyle("display","block");
                            this.buttonWidget.disable();
                        }
                    }
                }
                else {
                    this.element.find(".ebInput-statusError").setStyle("display","block");
                    this.buttonWidget.disable();
                }
            }, this);

            this.buttonWidget.addEventHandler('click', function (e) {
                this.addSubscription(this.view.getSubscriptionInputValue());
                this.view.setSubscriptionInputValue('');
            }, this);
            this.buttonWidget.attachTo(this.view.getSubscriptionButtonElement());

            this.infoPopupWidget = new InfoPopup({
                content: config.infoPopups.subscribe.text
            });

            this.infoPopupWidget.attachTo(this.view.getSubscriptionInfoElement());

        },       
        onAttach: function () {
           
        },
        /**
        Method to check the value entered into the input field
        @param value {string}
        @name Subscription#checkValue
        @returns {boolean} a valid subscription
        */
        checkValue: function (value) {
            var validSubscriptions = true;
            var arrayOfSubsciptions = [];
            
            
            if ( (!value) || (value.length === 0) ){
                validSubscriptions = false;
            } else {
                if ( _.isArray(value)){
                    arrayOfSubsciptions = value;
                } else {
                    if (value.indexOf("&&") > 0){
                        arrayOfSubsciptions = value.split("&&");
                    } else {
                        arrayOfSubsciptions.push(value);
                    }
                }

                _.each(arrayOfSubsciptions, function(v){
                    if ( !v.match(/^!?[^:{},'\[\]\+\-]+$|[a-zA-Z0-9-_]+=[a-zA-Z0-9-_]+$/)  ){
                        validSubscriptions = false;                    
                    }
                }.bind(this));
            }

            //return true;
            return validSubscriptions;
        },
         /**
        Method to add a criteria to internal object (criterialList)
        @param inputVal {string}
        @name Subscription#addSubscription 
        */
        addSubscription: function (inputVal) {
        
            var addedCriteria = false;            
        
            if (this.view.getExistingSubscriptionsListElement().children().length === 0) {
                this.view.showExistingSubscriptionsHeader();
                this.buttonWidget.trigger('anyCriteria', true);
            }
           
            var inputValState = this.criteriaState(inputVal);

            if (inputValState !== "duplicate" ){
                addedCriteria = true;

                if(inputValState === "new"){
                    // add to local list of items
                    this.criteriaList.push({criteria: inputVal, beenSaved: false, softDelete: false});
                }
                // and update the criteria list to add the new item
                var row = new ExistingSubscriptionRow({name: inputVal, onClickCallback: this.removeSubscription, context: this});
            
                row.attachTo(this.view.getExistingSubscriptionsListElement());
            
            }
            // then disable the button
            this.buttonWidget.disable();
            this.getValue();
            
            return addedCriteria;
            
        },
         /**
        Method to add a subscription and but NOT trigger an event "addSubscriptionEvent"
        @param inputVal {string}
        @name Subscription#addSubscriptionWithoutTrigger
        */
        addSubscriptionWithoutTrigger: function (inputVal) {
            if (this.subList.length === 0) {
                this.view.showExistingSubscriptionsHeader();
            }                  
            // add to local list of items
            this.subList.push(inputVal);
            // and update the subscription list to add the new item
            var row = new ExistingSubscriptionRow({name: inputVal, onClickCallback: this.removeSubscription, context: this});
            row.attachTo(this.view.getExistingSubscriptionsListElement());
            // then disable the button
            this.buttonWidget.disable();
            this.closeSubscriptionNotification();
            this.getValue();
            
        
            
        },
        /**
        Method to remove a criteria, mark as "soft delete", from internal object criterialList. 
        @param row {string}
        @name Subscription#removeSubscription 
        */
        removeSubscription: function (row) {
            var subscriptionText = row.options.name;
            
            // soft delete criteria
            this.setCriteriaSoftDelete(subscriptionText);

            //remove the div that contains the remove button
            row.destroy();

            // hide the criteria list header if empty            
            if (this.view.getExistingSubscriptionsListElement().children().length === 0){
                this.view.hideExistingSubscriptionsHeader();
                this.buttonWidget.trigger('anyCriteria', false);
            } 
        },

       /**
        Method to set "softDelete" of a particular entry in criterialIst to true 
        @name Subscription#setCriteriaSoftDelete Internal object modified
        */
        setCriteriaSoftDelete: function (criteriaOfInterest) {
             _.find(this.criteriaList , function(criterias) {
                if(criterias.criteria === criteriaOfInterest) {
                    criterias.softDelete = true;
                }
            }.bind(this));
        },

       /**
        Method to mark all entries in criteriaList saved and not soft deleted. 
        @name Subscription#markCriteriaToSave 
        */        
        markCriteriaToSave: function () {
            _.each(this.criteriaList, function(aCriteria){
                 aCriteria.softDelete = false;
                 aCriteria.beenSaved = true;
             }.bind(this));
        },

       /**
        Method to set "softDelete" of a particular entry in criterialIst to true 
        @name Subscription#acceptCriteria
        @returns {string} returns new - new criteria, unSoftDelete - un delete a criteria, duplicate - a duplicate entry
        */
        criteriaState: function (criteriaOfInterest) {
            var criteriaState = "new";
           
            _.find(this.criteriaList , function(criterias) {
                 if (criterias.criteria === criteriaOfInterest){
                     if (criterias.softDelete === true){
                         criterias.softDelete = false;
                         criteriaState = "unSoftDelete";
                     }else{
                         criteriaState = "duplicate";
                     }
                  }
            }.bind(this)); 

            return criteriaState;
        }, 


         /**
        Method to get all subscriptions 
        @name Subscription#getValue
        @returns {array} list of subscriptions
        */
        getValue: function () {            
            return _.pluck(this.criteriaList, "criteria");
        },
        
        /**
        Method to set subscriptions
        @name Subscription#setValue
        */
        setValue: function (criterias) {
            this.criteriaList = [];
            var criteriaArray = [];
            
            if (this.checkValue(criterias)) {
                if ( _.isArray(criterias)){
                    criteriaArray = criterias;
                } else {
                    if (criterias.indexOf("||") > 0){
                        criteriaArray = criterias.split("||");
                    } else {
                        criteriaArray.push(criterias);
                    }
                }

                _.each(criteriaArray, function(aCriteria){
                    this.addSubscription(aCriteria);
                    this.criteriaList[this.criteriaList.length-1].beenSaved = true;
                }.bind(this));
            }
        },
         /**
        Method to set subscriptions 
        @name Subscription#triggerQueryToServer
        */
        triggerQueryToServer: function () {
            this.trigger('addSubscriptionEvent', this.getValue().join("||"));
        }
        
    });
});
