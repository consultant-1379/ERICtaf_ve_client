/*global define, describe, it, expect */
define([
    'app/ext/socket'
], function (SocketExt) {
    'use strict';

    describe("socket", function () {

        describe('Methods', function () {
            var onSpy = sinon.spy(),
                emitSpy = sinon.spy(),
                socket;

            beforeEach(function () {
                socket = new SocketExt();
                sinon.stub(io, 'connect').returns({on: onSpy, emit: emitSpy});
            });

            afterEach(function () {
                onSpy.reset();
                emitSpy.reset();
                io.connect.restore();
            });

            describe('connect(options: Object)', function () {

                it('should connect to a defined server', function () {
                    var options = {
                    host:'http://test.com'
                    };
                    socket.connect(options);

                    sinon.assert.calledOnce(io.connect);
                    sinon.assert.calledWith(io.connect, "",{ host:'http://test.com'});
                });
            });

            describe('on(event: String, callback: Function, context: Object)', function () {

                it('should call specified callback on event reception', function () {
                    socket.connect('http://test.com');
                    socket.on('event', function () {}, this);

                    sinon.assert.calledOnce(onSpy);
                    sinon.assert.calledWith(onSpy, 'event');
                });
            });

            describe('emit(event: String, message: Object)', function () {

                it('should emit a specified event togheter with a message', function () {
                    socket.connect('http://test.com');
                    socket.emit('event', 'text');

                    sinon.assert.calledOnce(emitSpy);
                    sinon.assert.calledWith(emitSpy, 'event', 'text');
                });
            });
        });
    });
});