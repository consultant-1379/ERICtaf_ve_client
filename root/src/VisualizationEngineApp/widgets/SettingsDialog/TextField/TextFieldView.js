define([
    'jscore/core',
    'app/widgets/GenericSetting/GenericSettingView'
], function (core,GenericSettingView) {
    
    return GenericSettingView.extend({
        createInputElement: function(placeholder,defaultValue,elementIdentifier) {
           this.elementIdentifier = elementIdentifier;
           var nativeElement = document.createElement("input");
           var element = core.Element.wrap(nativeElement);
           element.setAttribute("class",elementIdentifier);
           element.setAttribute("placeholder",placeholder);
           element.setAttribute("value",defaultValue);
           element.setAttribute("id",elementIdentifier);
           element.setAttribute("maxlength",100);
           return element;
        },
        
        getInputElement: function () {
            return this.getElement().find('.'+this.elementIdentifier);
        }
   

    });
});