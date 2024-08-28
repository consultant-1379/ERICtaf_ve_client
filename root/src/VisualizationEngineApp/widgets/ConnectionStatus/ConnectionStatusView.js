define([
    'jscore/core',
    'text!./ConnectionStatus.html',
    'styles!./ConnectionStatus.less'
], function (core, template, style) {
    'use strict';

    return core.View.extend({

        getTemplate: function () {
            return template;
        },

        getStyle: function () {
            return style;
        },

        getConnectedElement: function () {
            return this.getElement().find('.eaVEApp-wConnectionStatus-connected');
        },

        getDisconnectedElement: function () {
            return this.getElement().find('.eaVEApp-wConnectionStatus-disconnected');
        },

        getConnectionErrorElement: function () {
            return this.getElement().find('.eaVEApp-wConnectionStatus-connection-error');
        },

        disableConnectedIcon: function () {
            this.getConnectedElement().find('i').setModifier('disabled', '', 'ebIcon');
        },

        enableConnectedIcon: function () {
            this.getConnectedElement().find('i').removeModifier('disabled', '', 'ebIcon');
        },

        disableDisconnectedIcon: function () {
            this.getDisconnectedElement().find('i').setModifier('disabled', '', 'ebIcon');
            this.getDisconnectedElement().removeModifier('blink', '', '');
        },

        enableDisconnectedIcon: function () {
            this.getDisconnectedElement().find('i').removeModifier('disabled', '', 'ebIcon');
            this.getDisconnectedElement().setModifier('blink', '', '');
        },

        enableConnectionErrorIcon: function () {
            this.getConnectionErrorElement().find('i').removeModifier('disabled', '', 'ebIcon');
            this.getConnectionErrorElement().setModifier('blink', '', '');
        },

        disableConnectionErrorIcon: function () {
            this.getConnectionErrorElement().find('i').setModifier('disabled', '', 'ebIcon');
            this.getConnectionErrorElement().removeModifier('blink', '', '');
        }
    });
});