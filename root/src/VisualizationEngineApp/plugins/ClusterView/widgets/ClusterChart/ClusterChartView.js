define([
    'jscore/core',
    'template!./ClusterChart.html'
], function (core, template, style) {
    'use strict';
    return core.View.extend({

        getTemplate: function () {
            return template(this.options.presenter.getData());
        }
    });
});
