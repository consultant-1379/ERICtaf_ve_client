define([
    'jscore/core',
    'text!./Configuration.html'
], function(core, template) {

    return core.View.extend({
        getTemplate: function() {
            return template;
        }
    });
});