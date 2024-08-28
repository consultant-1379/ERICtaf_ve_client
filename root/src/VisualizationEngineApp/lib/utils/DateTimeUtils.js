/** 
Date and time utilities 
@class DateTimeUtils
*/
define(function () {

    return {

        /**
        Checks input string for a match to 24 hour time format (hh:mm).
        @name DateTimeUtils#valid24HourTime
        @returns {boolean} boolean indicating valid 24 hour time format or not.
        **/
        valid24HourTime: function(timeString) {
            var timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
            return timePattern.test(timeString);
        },

        /**
        Sets the hours and minutes components of a Date object if
        the passed timeString parameter is of valid 24 hour format.
        @name DateTimeUtils#setTime
        @param {Object} dateObject - Date object.
        @param {String} timeString - String representing 24 time.
        @returns {Object} - updated Date object.
        **/
        setTime: function(dateObject, timeString) {
            if(this.valid24HourTime(timeString)) {
                var hours = timeString.split(":")[0];
                var minutes = timeString.split(":")[1];
                dateObject.setHours(hours);
                dateObject.setMinutes(minutes);
                dateObject.setSeconds(0);
                dateObject.setMilliseconds(0);
            }
            return dateObject;
        },

        /**
        Returns a date as a string in the form: m/dd/yyyy
        to match format of UI-SDK datepicker.
        @name DateTimeUtils#getDateAsString
        @param {Object} dateObject - dateObject.
        @returns {String} - string of the form m/dd/yyyy.
        **/
        getDateAsString: function(dateObject) {
            var day = dateObject.getDate();
            var month = dateObject.getMonth() + 1;
            var year = dateObject.getFullYear();
            return month + "/" + day + "/" + year;
        },

        /**
        Returns a time as a string in the form: hh:mm
        @name DateTimeUtils#getTimeAsString
        @param {Object} dateObject - dateObject.
        @returns {String} - string of the form hh:mm.
        **/
        getTimeAsString: function(dateObject) {
            var hours = dateObject.getHours().toString();
            if(hours.length === 1) {
                hours = "0" + hours;
            }
            var minutes = dateObject.getMinutes().toString();
            if(minutes.length === 1) {
                minutes = "0" + minutes;
            }
            return hours + ":" + minutes;
        },

        /**
        Checks if startDateObject is less than endDateObject.
        @name DateTimeUtils#startDateBeforeEndDate
        @returns {boolean} - boolean indicating whether startDate < endDate.
        **/
        startDateBeforeEndDate: function(startDateObject, endDateObject) {
            return startDateObject < endDateObject;
        }
    };
});
