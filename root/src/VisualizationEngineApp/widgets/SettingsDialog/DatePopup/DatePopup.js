define([
    'jscore/core',
    './DatePopupView',
    'widgets/PopupDatePicker',
    'widgets/TimePicker',
    'app/widgets/SettingsDialog/DefaultSettings/DefaultSettings',
    'app/lib/utils/DateTimeUtils',
    'widgets/Notification',
    'widgets/InfoPopup',
    'app/config/config'
], function (core, View, PopupDatePicker, TimePicker, Checkbox, DateTimeUtils, Notification, InfoPopup, config) {

    return core.Widget.extend({
        View: View,

        init: function () {
            this.startDate = new Date();
            this.startDate = DateTimeUtils.setTime(this.startDate, "00:00");
            this.endDate = new Date();
            this.endDate = DateTimeUtils.setTime(this.endDate, "00:01");
            this.startDatePicker = new PopupDatePicker();
            this.endDatePicker = new PopupDatePicker();
            this.liveDataCheckbox = new Checkbox({checked: true, title: "Enable live data", onclickevent:
                function (e) {
                    if(this.liveDataCheckbox.isChecked() === true) {
                        this.view.hideEndDate();
                        this.liveDataMode = true;
                        this.checkDateRange();
                        this.parent.setInfo(config.infoPopups.dataMode.textLive);
                        this.parent.setTitle("Aggregate historical and live data:");
                    } else {
                        this.view.showEndDate();
                        this.liveDataMode = false;
                        this.checkDateRange();
                        this.parent.setInfo(config.infoPopups.dataMode.textHistory);
                        this.parent.setTitle("Date range:");
                    }
                    this.trigger('toggleUpdateIntervalVisible', this.liveDataMode);
                }.bind(this)
            });

            this.notification = new Notification({
                label: 'Invalid date(s)',
                content: 'error',
                color: 'red',
                showCloseButton: false,
                autoDismiss: false
            });

            this.dateTimeError = false;
            this.liveDataMode = true;
        },
        setParent: function (parent){
          this.parent = parent;  
        },
        onViewReady: function () {
            this.eventHandlers();
            this.liveDataCheckbox.attachTo(this.view.getCheckBoxElement());
            // Default behaviour is to set the datepicker date to today at midnight
            this.startDatePicker.setValue(DateTimeUtils.getDateAsString(new Date()));
            this.view.getStartTimeInput().setValue("00:00");
            this.startDatePicker.attachTo(this.view.getStartDateElement());
            this.endDatePicker.setValue(DateTimeUtils.getDateAsString(new Date()));
            this.view.getEndTimeInput().setValue("00:01");
            this.endDatePicker.attachTo(this.view.getEndDateElement());
            this.view.hideEndDate();
        },

        eventHandlers: function() {
            this.startDatePicker.datePicker.addEventHandler('dateselect', function (e) {
                this.startDate = e;
                this.updateStartTime();
                this.checkDateRange();
                // Trigger event or build subscription?
            }, this);

            this.endDatePicker.datePicker.addEventHandler('dateselect', function (e) {
                this.endDate = e;
                this.updateEndTime();
                this.checkDateRange();
                // Trigger event or build subscription?
            }, this);

            this.view.getStartTimeInput().addEventHandler("keyup", function() {
                this.updateStartTime();
                this.checkDateRange();
                // Trigger event or build subscription?
            }, this);

            this.view.getEndTimeInput().addEventHandler("keyup", function() {
                this.updateEndTime();
                this.checkDateRange();
                // Trigger event or build subscription?
            }, this);
        },

        /**
        Updates startTime Date object with the time value entered in the start date time input.
        @name DatePopup#updateStartTime
        **/
        updateStartTime: function() {
            var time = this.view.getStartTimeInput().getValue();
            this.startDate = DateTimeUtils.setTime(this.startDate, time);
        },

        /**
        Updates endTime Date object with the time value entered in the end date time input.
        @name DatePopup#updateEndTime
        **/
        updateEndTime: function() {
            var time = this.view.getEndTimeInput().getValue();
            this.endDate = DateTimeUtils.setTime(this.endDate, time);
        },

        /**
        Checks that startDate < endDate and if the times entered in the inputs are of the format hh:mm.
        Displays an error notification if these criteria are not met.
        @name DatePopup#checkDateRange
        **/
        checkDateRange: function() {
            var isValidDateRange = DateTimeUtils.startDateBeforeEndDate(this.startDate, this.endDate);
            var startTime = this.view.getStartTimeInput().getValue();
            var endTime = this.view.getEndTimeInput().getValue();
            var startTimeValid = DateTimeUtils.valid24HourTime(startTime);
            var endTimeValid = DateTimeUtils.valid24HourTime(endTime);
            if(this.liveDataMode) {
                if(startTimeValid) {
                    this.dateTimeError = false;
                    this.notification.detach();
                }
                else {
                    this.dateTimeError = true;
                    this.notification.attachTo(this.view.getNotificationElement());
                } 
            }
            else if(!this.liveDataMode) {
                if(startTimeValid && endTimeValid && isValidDateRange) {
                    this.dateTimeError = false;
                    this.notification.detach();
                }
                else {
                    this.dateTimeError = true;
                    this.notification.attachTo(this.view.getNotificationElement());
                }
            }
        },

        /**
        Returns the widget information.
        @name DatePopup#getValue
        @returns value {object} - {liveData: this.liveDataMode, startDate: this.startDate, endDate: this.endDate}
        **/
        getValue: function () {
            return {liveData: this.liveDataMode, startDate: this.startDate, endDate: this.endDate};
        },

        /**
        Sets the widget information.
        @name DatePopup#setValue
        @param config {Object}
        **/
        setValue: function(config) {
            this.liveDataMode = config.liveData;
            this.startDate = new Date(config.startDate);
            this.endDate = new Date(config.endDate);
            this.startDatePicker.setValue(DateTimeUtils.getDateAsString(this.startDate));
            this.view.getStartTimeInput().setValue(DateTimeUtils.getTimeAsString(this.startDate));
            this.endDatePicker.setValue(DateTimeUtils.getDateAsString(this.endDate));
            this.view.getEndTimeInput().setValue(DateTimeUtils.getTimeAsString(this.endDate));
            if(this.liveDataMode) {
                this.liveDataCheckbox.setChecked(true);
                this.view.hideEndDate();
            }
            else {
                this.liveDataCheckbox.setChecked(false);
                this.view.showEndDate();
            }
            this.trigger('toggleUpdateIntervalVisible', this.liveDataMode);
        },

         /**
        Returns the widget view settings information.
        @name DatePopup#getViewSettings
        @returns value {object} - {title: this.options.title?this.options.title:"Date Popup"}
        **/
        getViewSettings: function () {
            return {title: this.options.title?this.options.title:"Date Popup"};
        }
    });
});
