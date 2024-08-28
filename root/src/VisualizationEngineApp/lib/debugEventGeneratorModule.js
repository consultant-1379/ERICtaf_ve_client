define([
    './debugEvents',
    'jscore/ext/utils/base/underscore'
], function (events, _) {
    'use strict';

    var DebugEventGeneratorModule = function () {
        this.eventList = [events.Event1, events.Event2, events.Event3, events.Event4, events.Event5, events.Event6, events.Event7];
    };

    DebugEventGeneratorModule.prototype = {

        connect: function () {},

        on: function (event, callback, context) {
            var max = this.eventList.length - 1,
                count = 0,
                ctx = context || this,
                intervalId;

            window.onkeypress = function(e) {
                if (e.charCode === 32) {
                    e.stopPropagation();
                    e.preventDefault();
                    if (count <= max) {
                        callback.apply(ctx, [this.eventList[count](), true]);
                        count++;
                    }
                }
                else if (e.charCode === 48) {
                    intervalId = window.setInterval(function () {
                        if (count <= max) {
                            callback.apply(ctx, [this.eventList[count](), true]);
                            count++;
                        }
                    }.bind(this), 0);
                }
                else if (e.charCode === 114) {
                    console.log('Resetting events');
                    window.clearInterval(intervalId);
                    count = 0;
                }
            }.bind(this);
        },

        emit: function () {}
    };

    return DebugEventGeneratorModule;
});