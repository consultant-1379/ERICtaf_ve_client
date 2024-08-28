/**
Pagination widget to set the pagination for a table chart
@class Pagination
*/
define([
    'jscore/core',
    'app/widgets/SettingsDialog/Pagination/PaginationView',
    'widgets/SelectBox'
], function (core, View, SelectBox) {

    return core.Widget.extend({
        View: View,

        init: function () {
            this.options.widgetTitle = (this.options.widgetTitle || this.options.widgetTitle === "") ? this.options.widgetTitle : "Pagination:";
            var items;
            if(this.options.items){
                items = this.options.items;
            }
            else{
                items = [
                    {name: 'Page Size: 5', value: 5, title: '5'},
                    {name: 'Page Size: 10', value: 10, title: '10'},
                    {name: 'Page Size: 20', value: 20, title: '20'},
                    {name: 'Page Size: 40', value: 40, title: '40'},
                    {name: 'Page Size: 80', value: 80, title: '80'},
                    {name: 'Page Size: 200', value: 200, title: '200'}
                ];
            }

            this.pagination = new SelectBox({                
                value: this.options.value?this.options.value:{name: 'Page Size: 10', value: 10, title: '10'},
                items: items
            });
        },

        onViewReady: function () {
            this.getElement().find("H1").setText(this.options.widgetTitle);
            this.pagination.attachTo(this.element);
            this.pagination.addEventHandler('change', function(e) { this.trigger("change", e); }, this);
        },
        /**
        Method to return the selection value
        @name Pagination#getValue
        @returns Selection value
        */
        getValue: function () {
            return this.pagination.getValue();
        },
        /**
        Method to set the selection value
        @name Pagination#getValue
        */
        setValue: function (value) {
            if(value){
                this.pagination.setValue(value);
            }
        }

    });
});
