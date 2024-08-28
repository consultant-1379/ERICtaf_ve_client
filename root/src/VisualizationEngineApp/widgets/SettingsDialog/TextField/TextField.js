/**
TextField Widget that will allow a user to input data
@class TextField
*/
define([
    'app/widgets/GenericSetting/GenericSetting',
    'app/widgets/SettingsDialog/TextField/TextFieldView'
], function (GenericSettings, View) {
    
    var textFieldSize = 20;
    return GenericSettings.extend({
       View: View,
       
        onViewReady: function () {
           var placeholder = this.options.placeholder === undefined ? "" : this.options.placeholder;
           var elementIdentifier = this.options.elementIdentifier === undefined ? "eaVEApp-wDefaultTextField-input" : this.options.elementIdentifier;
           var defaultValue = this.options.defaultValue === undefined ? "" : this.options.defaultValue;
            
           this.setContent(this.view.createInputElement(placeholder,defaultValue,elementIdentifier));
           this.setInfo(this.options.info);
           this.setEnabled(this.options.enabled);
           this.setTitle(this.options.title);
           
           this.view.getInputElement().setAttribute("size", textFieldSize);   
           
        },
        /**
        Method to set element enabled
        @name TextField#setEnabled
        @param value {boolean}
        */
       setEnabled : function(value) {
            if(value === false) {
                this.view.getInputElement().setAttribute("disabled",true);            
            }
            else {
                this.view.getInputElement().setAttribute("disabled",false);          
            }
       }
    });
});