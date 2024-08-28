/**
All communication from socketIO is handled from the communicationhandler
@class CommunicationHandler
*/
define([
    'jscore/ext/mvp',
    'jscore/ext/net',
    'jscore/ext/utils/base/underscore',
    // Comment out the line below and comment in the next next line to have a random event generator in the browser
    'app/ext/socket'
    //'app/lib/randomEventGeneratorModule',
    //'app/lib/debugEventGeneratorModule'
], function (mvp, net, _, SocketExt) {
    'use strict';
    var CommunicationHandler = function(config) {
        // Can be removed
        this.watchedSubscriptions = {};

        this.socket = new SocketExt();

        this.host = config.host;
        this.port = config.port || 80;
        this.eventBus = config.eventBus;
    };

    CommunicationHandler.prototype = {

        /**
        Sets up a socketIO connection to the server.
        @name CommunicationHandler#connect
        */
        connect: function() {
            var options = {
                host:this.host,
                port:this.port,
                resource:"socket.io"
            };
            this.socket.connect(options);

            this.socket.on('connect', function () {
                if(this.eventBus !== undefined) {
                    this.eventBus.publish('connection:connected');
                }
            }, this);

            this.socket.on('disconnect', function () {
                if(this.eventBus !== undefined) {
                    this.eventBus.publish('connection:disconnected');
                }
            }, this);
        },

        /**
        Starts listening for 'update' events sent from the server.
        @name CommunicationHandler#listen
        */
        listen: function() {
            this.socket.on('update', this._handleLiveUpdate, this);
            this.socket.on('statusUpdate', this._updateServerStatus, this);
        },

        /**
        Sends a subscription request to the server
        @name CommunicationHandler#subscribeLiveData
        @param {String} id - The uuid of the region setting up the subscription
        @param {Object} subscriptionConfig - An object describing the subscription options. Available options
                                    are described here http://confluence-oss.lmera.ericsson.se/display/DURACI/VE+REST+Services
        */
        subscribeLiveData: function(id, subscriptionConfig) {
            var event = {
                method: 'PUT',
                eventURI : 've:livedata/subscriptions/' + id,
                version : '1.0',
                eventBody : subscriptionConfig
            };

            this.socket.emit('event', JSON.stringify(event));
        },

       

        /**
        Removes a subscription from the server
        @name CommunicationHandler#unsubscribeLiveData
        @param {String} id - The uuid of the region that are removing the subscription
        */
        unsubscribeLiveData: function(id) {
            var event = {
                method: 'DELETE',
                eventURI : 've:livedata/subscriptions/' + id,
                version : '1.0'
            };

            this.socket.emit('event', JSON.stringify(event));
        },

        getHistoricalData: function (request) {
            var xhr = net.ajax({
                url: '/historicaldata/queryhandler',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(request.queryOptions),
                success: function(response) {
                    var model = JSON.parse(response);
                    if (this.eventBus !== undefined) {              
                        this.eventBus.publish('update', {id: request.region, model: model});
                    }
                }.bind(this),
                error: function() {
                    this.trigger('error', {errCode: xhr.getStatus(), errText: xhr.getStatusText()});
                }.bind(this)
            });
        },
       
        /**
        Private method. Sends out the received model data on the message bus. Regions matching the id
        should update themselves.
        @name CommunicationHandler#_handleLiveUpdate
        @param {Object} model - model data received from server
        */
        _handleLiveUpdate: function(model) {
            var id = this._getId(model);
            if (this.eventBus !== undefined) {              
                this.eventBus.publish('update', {id: id, model: model.eventBody});
            }
        },

        /**
        Private method. Parses the id from a model event.
        @name CommunicationHandler#_getId
        @param {Object} model
        @returns {String} id - The model event id.
        */
        _getId: function(model) {
            return _.last(model.eventURI.split('/'));
        },

        _updateServerStatus: function(model) {
            if (this.eventBus !== undefined) {              
                this.eventBus.publish('serverStatus', {model: model});
            }
        }
    };

    return CommunicationHandler;
});
