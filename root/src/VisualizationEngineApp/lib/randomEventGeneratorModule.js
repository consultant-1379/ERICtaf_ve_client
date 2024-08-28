define([
    './eiffelEvents',
    'jscore/ext/utils/base/underscore'
], function (events, _) {
    'use strict';

    var RandomEventGeneratorModule = function () {
        this.eventList = [events.EiffelJobFinishedEvent, events.EiffelArtifactNewEvent, events.EiffelJobQueuedEvent, events.EiffelJobStartedEvent, events.EiffelArtifactModifiedEvent];
        this.started = false;
    };

    RandomEventGeneratorModule.prototype = {

        connect: function () {},

        on: function (event, callback, context) {
            var max = this.eventList.length - 1,
                ctx = context || this;

            window.setInterval(function () {
                if (this.started) {
                    var event = _.random(max);
                    callback.apply(ctx, [this.eventList[event](), true]);
                }
            }.bind(this), 1000);
        },

        emit: function () {
            this.started = true;
        }
    };

    return RandomEventGeneratorModule;
});
