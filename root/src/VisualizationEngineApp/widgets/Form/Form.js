/**
Class that is a form container
@class Form
*/
define([
    'jscore/core',
    './FormView',
    'jscore/ext/utils/base/underscore',
    'jscore/ext/dom',
    'widgets/InfoPopup'
], function (core, View, _, dom, InfoPopup) {

    return core.Widget.extend({

        View: View,

        init: function() {
            this.inputs = [];
        },

        /**
        Takes an options array of the, form: placeholder: "xxx", name: "xxx",
        creates input elements and appends these inputs to the parent element.
        @name Form#onViewReady
        @param options - array of the form: placeholder: "xxx", name: "xxx", popupContent: "xxx".
        **/
        onViewReady: function (options) {
             _.each(options, function(option) {
                var container = core.Element.parse("<div><div class='eaVEApp-wVEForm-info-" + option.name + "'></div></div>");
                var input = this.createInput(option);
                var popup = this.createInfoPopup(option);
                container.append(input);
                popup.attachTo(container.find(".eaVEApp-wVEForm-info-" + option.name));
                this.appendElement(container);
            }.bind(this));
        },

        /**
        Creates an input element using the information from the option object
        @name Form#createInput
        @param option - obect of the form: placeholder: "xxx", name: "xxx", popupContent: "xxx".
        @returns - core.Element.
        **/
        createInput: function(option) {
            var input = core.Element.parse("<input type='text' class='ebInput_width_long ebInput_" + option.name + "' placeholder='" + option.placeholder + "'/>");
            input.setModifier(option.name);
            this.inputs.push(input);
            return input;
        },

        /**
        Creates an InfoPopup widget used to give information
        on what text is required from a particular input.
        @name Form#createInfoPopup
        @param option -  input of the form: placeholder: "xxx", name: "xxx", popupContent: "xxx".
        @returns - InfoPopup
        **/
        createInfoPopup: function(option) {
            var infoPopup = new InfoPopup({
                content: option.popupContent,
                corner: 'bottomLeft'
            });
            
            return infoPopup;
        },

        /**
        Appends generated input to the DOM.
        @name Form#appendElement
        @param input - core.Element.
        **/
        appendElement: function(element) {
            this.view.appendToDOM(element);
        },

        /**
        Gets the value of the input element who's option.name === name.
        @name Form#getValue
        @param name - the passed name option of the input element.
        @returns - value of the input element.
        **/
        getValue: function(name) {
            return this.view.getValue(name);
        },

        /**
        Returns the input element who's option.name === name.
        @name Form#getInputElement
        @param name - the passed name option of the input element.
        @returns - core.Element.
        **/
        getInputElement: function(name) {
            return this.view.getInputElement(name);
        },

        /**
        Sets the value of each generated input element to ''.
        @name Form#clearForm
        **/
        clearForm: function() {
            _.each(this.inputs, function(input) {
                input.setValue("");
            }.bind(this));
        },
        /**
        Method to set value
        @name Form#setValue
        @param name {String}
        @param tesxt {String}
        */
        setValue: function(name, text) {
            this.getInputElement(name).setValue(text);
        },

        /**
        Takes an array of name values, finds the respective
        input elements and adds a keyup event handler to each.
        @name Form#addInputChecks
        @param nameArray - array of names.
        **/
        addInputChecks: function(nameArray) {
            _.each(nameArray, function(name) {
                var input = this.view.getInputElement(name);
                input.addEventHandler("keyup", function() {
                    this.trigger("validateFormEvent");
                }.bind(this)); 
            }.bind(this));
        },

        /**
        Sets the border colour of the input to red to indicate erroneous text input.
        @name Form#setErrorStatus
        @param name - the name of the input.
        **/
        setErrorStatus: function(name) {
            this.getInputElement(name).setModifier("borderColor_red");
        },

        /**
        Removes red border colour of the specified input.
        @name Form#removeErrorStatus
        @param name - the name of the input.
        **/
        removeErrorStatus: function(name) {
            this.getInputElement(name).removeModifier("borderColor_red");   
        }

    });
});