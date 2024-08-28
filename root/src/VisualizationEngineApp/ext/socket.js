/**
Creates the websocket and socketio connection to the server
@class socket
*/
define([
    'thirdparty/socket.io'
], function (io) {
    'use strict';

    var SocketExt = function () {
        this.socket = null;
    };
    
    SocketExt.prototype = {
        /**
        Creates a connection to the server
        @name socket#connect
        @param {object} options - which contains host and port of the server
        */
        connect: function (options) {
            this.socket = io.connect('',options);
        },
        /**
        Listens for events from the socketio interface
        @name socket#on
        @param {String} event - name of event
        @param {Object} callback
        @param {Object} html context
        */
        on: function (event, callback, context) {
            var ctx = context || this;

            this.socket.on(event, callback.bind(ctx));
        },
        /**
        Sends an event to the server with a message
        @name socket#emit
        @param {String} event - name of event to server
        @param {Object} message - message sent to the server, normally a String but can be an Object 
        */
        emit: function (event, message) {
            this.socket.emit(event, message);
        }
    };

    return SocketExt;
});
