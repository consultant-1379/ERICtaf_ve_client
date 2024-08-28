define([
    'app/widgets/SettingsDialog/DatePopup/DatePopup',
    'app/lib/utils/DateTimeUtils'
], function (DatePopup, DateTimeUtils) {
    'use strict';

    describe('DatePopup', function () {

        before(function() {
            this.datePopup = new DatePopup();
        });

        describe('Methods', function () {

            it('init()', function() {
                this.datePopup.startDate.should.not.be.undefined;
                this.datePopup.endDate.should.not.be.undefined;
                this.datePopup.startDatePicker.should.not.be.undefined;
                this.datePopup.endDatePicker.should.not.be.undefined;
                this.datePopup.liveDataCheckbox.should.not.be.undefined;
                this.datePopup.notification.should.not.be.undefined;
                this.datePopup.dateTimeError.should.be.false;
            });

            it('onViewReady()', function() {
                this.datePopup.view.getStartTimeInput().getValue().should.equal("00:00");
                this.datePopup.view.getEndTimeInput().getValue().should.equal("00:01");
                this.datePopup.getElement().find(".eaVEApp-wDatePopup-picker-end").getStyle("display").should.equal("none");
            });

            it('updateStartTime()', function() {
                this.datePopup.view.getStartTimeInput().setValue("18:56");
                this.datePopup.updateStartTime();
                this.datePopup.startDate.getHours().toString().should.equal("18");
                this.datePopup.startDate.getMinutes().toString().should.equal("56");
            });

            it('updateEndTime()', function() {
                this.datePopup.view.getEndTimeInput().setValue("19:21");
                this.datePopup.updateEndTime();
                this.datePopup.endDate.getHours().toString().should.equal("19");
                this.datePopup.endDate.getMinutes().toString().should.equal("21");
            });

            it('checkDateRange()', function() {

                this.datePopup.view.getStartTimeInput().setValue("00:00");
                this.datePopup.updateStartTime();
                this.datePopup.view.getEndTimeInput().setValue("00:00");
                this.datePopup.updateEndTime();
                this.datePopup.liveDataMode = false;
                this.datePopup.checkDateRange();
                this.datePopup.dateTimeError.should.be.true;

                this.datePopup.view.getStartTimeInput().setValue("18:56");
                this.datePopup.updateStartTime();
                this.datePopup.view.getEndTimeInput().setValue("19:21");
                this.datePopup.updateEndTime();
                this.datePopup.checkDateRange();
                this.datePopup.dateTimeError.should.be.false;

                this.datePopup.view.getStartTimeInput().setValue("20:56");
                this.datePopup.updateStartTime();
                this.datePopup.view.getEndTimeInput().setValue("19:20");
                this.datePopup.updateEndTime();
                this.datePopup.checkDateRange();
                this.datePopup.dateTimeError.should.be.true;

                this.datePopup.view.getStartTimeInput().setValue("20:56");
                this.datePopup.updateStartTime();
                this.datePopup.view.getEndTimeInput().setValue("19:2");
                this.datePopup.updateEndTime();
                this.datePopup.checkDateRange();
                this.datePopup.dateTimeError.should.be.true;

                this.datePopup.liveDataMode = true;
                this.datePopup.view.getStartTimeInput().setValue("20:56");
                this.datePopup.updateStartTime();
                this.datePopup.checkDateRange();
                this.datePopup.dateTimeError.should.be.false;

                this.datePopup.view.getStartTimeInput().setValue("aa:43");
                this.datePopup.updateStartTime();
                this.datePopup.checkDateRange();
                this.datePopup.dateTimeError.should.be.true;

                this.datePopup.view.getStartTimeInput().setValue("0:56");
                this.datePopup.updateStartTime();
                this.datePopup.checkDateRange();
                this.datePopup.dateTimeError.should.be.true;

                this.datePopup.view.getStartTimeInput().setValue("29:01");
                this.datePopup.updateStartTime();
                this.datePopup.checkDateRange();
                this.datePopup.dateTimeError.should.be.true;
            });

            it('getValue()', function() {
                var config = this.datePopup.getValue();
                config.liveData.should.be.true;
                config.startDate.should.equal(this.datePopup.startDate);
                config.endDate.should.equal(this.datePopup.endDate);
            });

            it('setValue()', function() {
                var start = new Date("2014-04-01T14:05:15.475Z");
                var end = new Date("2014-04-01T14:05:15.475Z");
                this.datePopup.setValue({liveData: false, startDate: "2014-04-01T14:05:15.475Z", endDate: "2014-04-01T14:05:15.475Z"});
                this.datePopup.getValue().liveData.should.be.false;
                this.datePopup.getValue().startDate.toString().should.equal(start.toString());
                this.datePopup.getValue().endDate.toString().should.equal(end.toString());
            });

        });
    });
});