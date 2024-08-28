define([
    'app/widgets/GenericSetting/GenericSetting',
    'app/widgets/SpinnerHorizontal/SpinnerHorizontal'
], function (GenericSetting, Spinner ) {

    return GenericSetting.extend({
        
        /**
        Method to add a spinner as the content of the setting widget
        @name Resizer#setContent 
        @param 
        */
        setContent: function () {
            this.content = new Spinner({
                min: typeof(this.options.min) === "number" ? this.options.min : 1,
                max: typeof(this.options.max) === "number" ? this.options.max : 12,
                value: this.options.value,
                show_percent: this.options.show_percent ? this.options.show_percent : false
            });
            this.content.triggerOnValueChange();

            this.content.attachTo(this.view.getContentElement()); 
        },

        setValue: function (value) {
            this.content.triggerSetValue(value);
        }
    });
});