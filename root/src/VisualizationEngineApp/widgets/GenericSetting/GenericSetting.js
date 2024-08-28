/**
Generic class to hold core element or widget
@class GenericSetting
*/
define([
    'jscore/core',
    './GenericSettingView',
    'widgets/InfoPopup',
    'jscore/ext/utils/base/underscore',

], function (core, View, InfoPopup, _) {
    'use strict';

    return core.Widget.extend({
        View: View,

        /**
        Method that initializes the generic setting widget with options
        @name GenericSetting#init
        */
        init: function () {
            this.createEventHandler = true;
            this.title = this.options.title === undefined ? "" : this.options.title;
            this.name = this.options.name === undefined ? "" : this.options.name;
            if (this.options.content !== undefined) {
                this.content = this.options.content;
                this.withGetValue = this.options.getValue;
            }
            this.enabled = this.options.enabled === undefined ? true : this.options.enabled;
            this.withGetValue = this.options.withGetValue;
            this.withSetValue = this.options.withSetValue;
        },

        /**
        @name GenericSetting#onViewReady
        */
       onViewReady: function () {
           this.setContent(this.options.content);
           this.setInfo(this.options.info);
           this.setEventType(this.options.eventType);
           this.setEnabled(this.options.enabled);
         },        

       /**
        Method that creates an event handler. It also publishes a 'setting:change' onto the event bus 
        @private
        @name GenericSetting#eventHandler
        @return {object} publishes a 'setting:change' message to the message bus
        */
        eventHandler: function () {
            /**
             * before the event handler is created, the dependent properties are checked to determine if they exist.
             * if all the conditions are met, the eventhandler is created, only once
             */
            if( (this.eventBus !== undefined) && (this.eventType !== undefined)  && ( (this.content !== undefined) && (typeof(this.content) !== 'string')) ){
                if (this.createEventHandler){
                    this.eventHandlerId = this.content.addEventHandler( this.eventType , function () {
                        this.eventBus.publish('setting:change', {
                            name: this.name,
                            newVal: this.getValue(),
                        });
                    }, this);
                    this.createEventHandler = false;
                }
            }
        },

        
        /**
        Method that returns the content from generic setting 
        @name GenericSetting#getContent
        @return {object} returns what is stored, core element, widget
        */
        getContent: function() {
            return this.content;
        },
        
        /**
        Method that returns the generic setting's name 
        @name GenericSetting#getName
        @return {string} returns the name
        */
        getName: function() {
            return this.name;
        },
        
        /**
        Method that returns the generic setting's title 
        @name GenericSetting#getTitle
        @return {string} returns the title
        */
        getTitle: function() {
            return this.title;
        },

        /**
        Method that returns the generic setting's info text for the popup 
        @name GenericSetting#getInfo
        @return {string} returns the info text
        */
        getInfo: function() {
            if (this.info !== undefined){
                return this.info.options.content;
            }else{
                return "";
            }
        },

        /**
        Method that returns the value of the content by calling the content's getValue method
        @name GenericSetting#getValue
        @return {object} returns what the content's getValue returns. return null if no content defined
        */
        getValue: function() {
            if ( (this.content === undefined)  || (typeof this.content.getValue !== 'function') ){
                return null;
            }else {
                if ((this.withGetValue === undefined) || (typeof this.withGetValue !== 'function')) {
                    return this.content.getValue();
                } else {
                    return this.withGetValue.call(this.content);
                }
            }
        },

        /**
        Method that returns the content's state, whether enabled or disabled
        @name GenericSetting#getContentState
        @return {boolean} returns true or false
        */
        getContentState: function() {
            return this.enabled;
        },

        /**
        Method that allows to assign a name to the generic setting  
        @name GenericSetting#setName
        */
        setName: function(name) {
            this.name = name;
        },

        /**
        Method that allows to assign a title to the generic setting  
        @name GenericSetting#setTitle
        */
        setTitle: function(text) {
            this.title = text; 
            this.view.getTitleElement().setText(text);
        },

        /**
        Method that sets the value of the content by calling the content's setValue method
        @param value {object}
        @name GenericSetting#setValue 
        */
        setValue: function(value) {
            if ((this.withSetValue !== undefined) && (typeof this.withSetValue === 'function')) {
                if (value !== this.content.getValue()) {
                    this.withSetValue.call(this.content, value);
                }
            } else if ( (this.content !== undefined) && (typeof this.content.setValue === 'function') && (value !== undefined) ){
                if (value !== this.content.getValue() ){
                    this.content.setValue(value);
                }
            }
        },

        /**
        Method to add a content
        @param content {string} can be a core widget, core element or a string
        @name GenericSetting#setContent 
        */
        setContent: function(content) {
            /**
             * this method validates the input and exits if it undefined.
             * if there already is a content in this GenericSetting, the existing content
             * is removed.
             */
 
            if (content !== undefined){
                if( (this.content !== undefined) && (typeof(content) !== 'string') ){
                    this.content.detach();
                }

                this.content = content;
                if (typeof(content) === 'string'){
                    this.view.getContentElement().setText(content);
                }

                if ( (content instanceof core.Widget) ){
                    this.content.attachTo(this.view.getContentElement());
                }

                if ( (content instanceof core.Element) ){
                    this.view.getContentElement().append(content);
                }
            }
         },        

        /**
        Method to set the content to either enable or disable it, if that functionality exists for the content.
        @name GenericSetting#setEnabled
        @param value {boolean} enable or disable the content's state
        */
        setEnabled: function(value) {
            /**
             * setEnabled validates the input, defaulting the enabled property to true if nothiong is passed
             * if the input parameter is true, the GenericSetting's enabled property is set to true
             * and will call the the content's enable function if it exists
             * if the input parameter is false, the opposite is done. 
             */
            if (value === undefined) value = true;

            if(this.content !== undefined){
                if(value === true ){
                    this.enabled = true;
                    if(typeof this.content.enable === 'function') {
                        this.content.enable();
                    }
                }

                if(value === false ){
                    this.enabled = false;
                    if(typeof this.content.disable === 'function') {
                       this.content.disable();
                    }
                }
            }
        }, 

        /**
        Method to set the generic setting's info text for the popup 
        @name GenericSetting#setInfo
        */        
        setInfo: function(value) {
            if (value !== undefined){
                if(this.info !== undefined){
                    this.info.detach();
                }

                this.info = new InfoPopup({
                    content: value
                });

                this.info.attachTo(this.view.getInfoElement());
            }
        },

         /**
        Method to add event bus to this generic setting
        @param  {eventBus} eventBus channel on which events can be published to or subscribed to
        @name GenericSetting#setEventBus 
        */        
        setEventBus: function(eventBus) {
            /**
             * this method validates the input and exits if it undefined.
             * if there already is an event bus property, the existing event handler 
             * is removed.
             */
            if (eventBus !== undefined){
                if (this.eventBus !== undefined){
                    if ( (this.eventBus !== eventBus) && (this.eventType !== undefined) ) {
                        /**
                         * there is already an event handler, because this.eventBus and this.eventType exist
                         */
                        this.content.removeEventHandler(this.eventType, this.eventHandlerId);
                    }else{
                        /**
                         * either this.eventBus or this.eventType do not exist
                         * both are needed to create an event handler
                         */
                        return;
                    }
                }
                this.eventBus = eventBus;
                this.eventHandler();
            }
        },


        /**
        Method to set/modify the event type
        @param  {eventtype} set the event this object will listen for
        @name GenericSetting#setEventType 
        */        
        setEventType: function(eventType) {
            if (eventType !== undefined){
                /**
                 * check to see if an event type already exists and different, 
                 * and there is an event bus, remove the event handler.
                 */
                if (this.eventType !== undefined){
                    if( (this.eventType !== eventType) &&  (this.eventBus !== undefined) ) {
                        this.content.removeEventHandler(this.eventType, this.eventHandlerId);
                    }else{
                        /**
                         * not all conditions met :(
                         */
                        return;	
                    }
                }
                this.eventType = eventType;
                this.eventHandler();
            }            
        },  


        /**
        Method that returns the generic setting's title 
        @name GenericSetting#getTitle
        @return {object} returns the title
        */
        getData: function() {
            return {
                title: this.title,
            };
        },
        

    });
});