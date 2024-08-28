/**
ConnectionStatus -  check the connection status of the server for example
@class ConnectionStatus
*/
define([
    'jscore/core',
    './ConnectionStatusView',
    'widgets/Tooltip'
], function (core, View, Tooltip) {
    'use strict';

    return core.Widget.extend({
        View: View,

        onViewReady: function () {
            this.tooltip = new Tooltip({
                parent: this.getElement(),
                width: 150
            });

            this.setDisconnectedStatus();
            this.tooltip.attachTo(this.getElement());
        },
        /**
        Sets the connection status to conneced
        @name ConnectionStatus#setConnectedStatus
        */
        setConnectedStatus: function () {
            this.view.enableConnectedIcon();
            this.view.disableDisconnectedIcon();
            this.view.disableConnectionErrorIcon();
            this.tooltip.setContentText('Connected to server.');
        },
        /**
        Sets the connection status to disconnected
        @name ConnectionStatus#setDisconnectedStatus
        */
        setDisconnectedStatus: function () {
            this.view.enableDisconnectedIcon();
            this.view.disableConnectedIcon();
            this.view.disableConnectionErrorIcon();
            this.tooltip.setContentText('No connection to server.');
        },
        /**
        Sets the setServerStatus status
        @name ConnectionStatus#setServerStatus
        @param model {Object} - model connection of server
        */
        setServerStatus: function (model) {
            var messageBusStatus = model.model.eventBody.messageBus.status;
            if(messageBusStatus === "error") {
                this.view.disableConnectedIcon();
                this.view.enableConnectionErrorIcon();
                this.tooltip.setContentText('Server Message Bus connection down. No live data will be received.');
            }
            else if(messageBusStatus === "ok") {
                this.view.disableConnectionErrorIcon();
                this.view.enableConnectedIcon();
                this.tooltip.setContentText('Connected to server.');
            }
        }
    });
});