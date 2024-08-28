/**
Method to add strings into an internal structure.
Each time a string is added or removed a "change" event is triggered.
@class ListBuilder
*/
define([
    'jscore/core',
    './ListBuilderView',
   './ExistingListBuilderRow/ExistingListBuilderRow', 
    'widgets/Button',
    'jscore/ext/utils/base/underscore',
    'app/config/config',
    
], function (core, View,  ExistingListBuilderRow,  Button, _, config) {
    var ENTER_KEY = 13;

    return core.Widget.extend({
        View: View,

        init: function () {
            this.buttonWidget = new Button({
                caption: this.options.buttonLabel === undefined ? 'Add String' : this.options.buttonLabel,
                modifiers: [
                    {name: 'wMargin'},
                    {name: 'default'},
                    {name: 'color_darkBlue'}
                ],
                enabled: false
            });

            this.stringList = [];

            this.enableLB = this.options.enable === undefined ? true : this.options.enable;
            if (this.options.stringFilter !== undefined) this.stringFilter = new RegExp(this.options.stringFilter);

        },

        onViewReady: function() {
            var lbInput = this.view.getListBuilderInputElement();
            this.view.hideExistingListBuilderHeader();
            lbInput.addEventHandler('keyup', function (data) {
                if (this.checkValue(lbInput.getValue())) {
                    
                    this.buttonWidget.enable();
                    this.element.find(".ebInput-statusError").setStyle("display","none");

                    // allow 'enter'-key to add subscription
                    if (data.originalEvent.keyCode === ENTER_KEY) {
                        if(this.addListBuilder(this.view.getListBuilderInputValue())){
                            this.view.setListBuilderInputValue('');
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
                this.addListBuilder(this.view.getListBuilderInputValue());
                this.view.setListBuilderInputValue('');
            }, this);
            this.buttonWidget.attachTo(this.view.getListBuilderButtonElement());
        },  

        
        onAttach: function () {
           
        },
        /**
        Method to check the value entered into the input field
        @private
        @param value {string}
        @name ListBuilder#checkValue
        @returns {boolean} true valid string, false format not acceptable
        */
        checkValue: function (value) {
            var validValue = true;

            if ( (!value) || (value.length === 0) ){
                validValue = false;
            } else {
                if( (this.stringFilter !== undefined) && ( !value.match(this.stringFilter)) ) {                                  
                    validValue = false;     
                }
            }

            return validValue;

        },
        
        
         /**
        Method to add a string to internal object (stringList)
        @private
        @param inputVal {string}
        @name ListBuilder#addListBuilder 
        */
        addListBuilder: function (inputVal) {
            var addedString = false;
            if(this.enableLB){
                if (this.view.getExistingListBuilderListElement().children().length === 0) {
                    this.view.showExistingListBuilderHeader();
                }

                if ( _.indexOf(this.stringList, inputVal) === -1 ){
                
                    addedString = true;
                    // add to local list of items
                    this.stringList.push(inputVal);
                    // and update the stringlist to add the new item
                    var row = new ExistingListBuilderRow({name: inputVal, onClickCallback: this.removeListBuilder, context: this});

                    row.attachTo(this.view.getExistingListBuilderListElement());

                    // fire the change trigger
                    this.trigger('change', this.stringList);
                }
                // then disable the button
                this.buttonWidget.disable();
                this.getValue();

                return addedString;
            }
        },

        /**
        Method to remove a string from internal object stringList. 
        @private
        @param row {string}
        @name ListBuilder#removeListBuilder 
        */
        removeListBuilder: function (row) {
            var stringText = row.options.name;

            if ( _.indexOf(this.stringList, stringText) !== -1 ){
            
            // delete a string from list
            this.stringList = _.without(this.stringList, stringText);

            //remove the div that contains the remove button
            row.destroy();

            // hide the string list header if empty            
            if (this.view.getExistingListBuilderListElement().children().length === 0){
               this.view.hideExistingListBuilderHeader();
            } 

            // fire the change trigger
            this.trigger('change', this.stringList);
            }
            
        },

       /**
        Method to get the stored strings 
        @name ListBuilder#getValue
        @returns {array} list of strings
        */
        getValue: function () {            
           return this.stringList;
        },
        
        /**
        Method to set or add a string
        @name ListBuilder#setValue
        */
        setValue: function (strings) {
            if (this.enableLB){
                var stringArray = [];
            
                if ( _.isArray(strings)){
                    stringArray = strings;
                } else {
                    if (_.isString(strings)){
                        stringArray.push(strings);
                    }
                }

                if (_.size(stringArray) > 0){
                    _.each(stringArray, function(aString){
                        if (this.checkValue(aString)) {
                            this.addListBuilder(aString);
                        }
                    }.bind(this));
                }
            }
        },

       /**
        Method to clear the string list
        @name ListBuilder#clearList
        */
        clearList: function () {            
           this.stringList.length =  0;
        },
        
       /**
        Method to disable this widget. The widget will not accept any input. 
        @name ListBuilder#disable
        */
        disable: function () {
            this.enableLB = false;
            this.buttonWidget.disable();   
            this.view.disableInputElement();
            this.view.disableListBuilderListElement();
        },
    
       /**
        Method to enable this widget. The widget will accept input.
        @name ListBuilder#enable
        */
        enable: function () {
            this.enableLB = true;
            this.buttonWidget.enable();
            this.view.enableInputElement();
            this.view.enableListBuilderListElement();
        },
    });
});
