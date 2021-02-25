import * as tslib_1 from "tslib";
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, Input, Output, ViewChild, ViewEncapsulation, } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as _moment from 'moment';
import { InputConverter } from '../../../decorators/input-converter';
var moment = _moment;
export var SideEnum;
(function (SideEnum) {
    SideEnum["left"] = "left";
    SideEnum["right"] = "right";
})(SideEnum || (SideEnum = {}));
var DaterangepickerComponent = (function () {
    function DaterangepickerComponent(_ref) {
        this._ref = _ref;
        this._old = { start: null, end: null };
        this.calendarVariables = { left: {}, right: {} };
        this.timepickerVariables = { left: {}, right: {} };
        this.daterangepicker = { start: new FormControl(), end: new FormControl() };
        this.applyBtn = { disabled: false };
        this.startDate = moment().startOf('day');
        this.endDate = moment().endOf('day');
        this.dateLimit = null;
        this.sideEnum = SideEnum;
        this.minDate = null;
        this.maxDate = null;
        this.autoApply = false;
        this.singleDatePicker = false;
        this.showDropdowns = false;
        this.showWeekNumbers = false;
        this.showISOWeekNumbers = false;
        this.linkedCalendars = false;
        this.autoUpdateInput = true;
        this.alwaysShowCalendars = false;
        this.maxSpan = false;
        this.timePicker = false;
        this.timePicker24Hour = false;
        this.timePickerIncrement = 1;
        this.timePickerSeconds = false;
        this.showClearButton = false;
        this.firstMonthDayClass = null;
        this.lastMonthDayClass = null;
        this.emptyWeekRowClass = null;
        this.firstDayOfNextMonthClass = null;
        this.lastDayOfPreviousMonthClass = null;
        this._ranges = {};
        this.showCancel = false;
        this.keepCalendarOpeningWithRange = false;
        this.showRangeLabelOnInput = false;
        this.rangesArray = [];
        this.isShown = false;
        this.inline = true;
        this.leftCalendar = {};
        this.rightCalendar = {};
        this.showCalInRanges = false;
        this.options = {};
        this.choosedDate = new EventEmitter();
        this.rangeClicked = new EventEmitter();
        this.datesUpdated = new EventEmitter();
    }
    Object.defineProperty(DaterangepickerComponent.prototype, "ranges", {
        get: function () {
            return this._ranges;
        },
        set: function (value) {
            this._ranges = value;
            this.renderRanges();
        },
        enumerable: true,
        configurable: true
    });
    DaterangepickerComponent.prototype.ngOnInit = function () {
        this._buildLocale();
        var daysOfWeek = tslib_1.__spread(this.locale.daysOfWeek);
        if (this.locale.firstDay !== 0) {
            var iterator = this.locale.firstDay;
            while (iterator > 0) {
                daysOfWeek.push(daysOfWeek.shift());
                iterator--;
            }
        }
        this.locale.daysOfWeek = daysOfWeek;
        if (this.inline) {
            this._old.start = this.startDate.clone();
            this._old.end = this.endDate.clone();
        }
        this.updateMonthsInView();
        this.renderCalendar(SideEnum.left);
        this.renderCalendar(SideEnum.right);
        this.renderRanges();
    };
    DaterangepickerComponent.prototype.renderRanges = function () {
        this.rangesArray = [];
        var start;
        var end;
        if (typeof this.ranges === 'object') {
            for (var range in this.ranges) {
                if (typeof this.ranges[range][0] === 'string') {
                    start = moment(this.ranges[range][0], this.locale.format);
                }
                else {
                    start = moment(this.ranges[range][0]);
                }
                if (typeof this.ranges[range][1] === 'string') {
                    end = moment(this.ranges[range][1], this.locale.format);
                }
                else {
                    end = moment(this.ranges[range][1]);
                }
                if (this.minDate && start.isBefore(this.minDate)) {
                    start = this.minDate.clone();
                }
                var maxDate = this.maxDate;
                if (this.maxSpan && maxDate && start.clone().add(this.maxSpan).isAfter(maxDate)) {
                    maxDate = start.clone().add(this.maxSpan);
                }
                if (maxDate && end.isAfter(maxDate)) {
                    end = maxDate.clone();
                }
                if ((this.minDate && end.isBefore(this.minDate, this.timePicker ? 'minute' : 'day'))
                    || (maxDate && start.isAfter(maxDate, this.timePicker ? 'minute' : 'day'))) {
                    continue;
                }
                var elem = document.createElement('textarea');
                elem.innerHTML = range;
                var rangeHtml = elem.value;
                this.ranges[rangeHtml] = [start, end];
            }
            for (var range in this.ranges) {
                this.rangesArray.push(range);
            }
            if (this.showCustomRangeLabel) {
                this.rangesArray.push(this.locale.customRangeLabel);
            }
            this.showCalInRanges = (!this.rangesArray.length) || this.alwaysShowCalendars;
            if (!this.timePicker) {
                this.startDate = this.startDate.startOf('day');
                this.endDate = this.endDate.endOf('day');
            }
            if (this.timePicker && this.autoApply) {
                this.autoApply = false;
            }
        }
    };
    DaterangepickerComponent.prototype.renderTimePicker = function (side) {
        if (side === SideEnum.right && !this.endDate) {
            return;
        }
        var selected;
        var minDate;
        var maxDate = this.maxDate;
        if (side === SideEnum.left) {
            selected = this.startDate.clone();
            minDate = this.minDate;
        }
        else if (side === SideEnum.right) {
            selected = this.endDate.clone();
            minDate = this.startDate;
        }
        var start = this.timePicker24Hour ? 0 : 1;
        var end = this.timePicker24Hour ? 23 : 12;
        this.timepickerVariables[side] = {
            hours: [],
            minutes: [],
            minutesLabel: [],
            seconds: [],
            secondsLabel: [],
            disabledHours: [],
            disabledMinutes: [],
            disabledSeconds: [],
            selectedHour: 0,
            selectedMinute: 0,
            selectedSecond: 0,
        };
        for (var i = start; i <= end; i++) {
            var i_in_24 = i;
            if (!this.timePicker24Hour) {
                i_in_24 = selected.hour() >= 12 ? (i === 12 ? 12 : i + 12) : (i === 12 ? 0 : i);
            }
            var time = selected.clone().hour(i_in_24);
            var disabled = false;
            if (minDate && time.minute(59).isBefore(minDate)) {
                disabled = true;
            }
            if (maxDate && time.minute(0).isAfter(maxDate)) {
                disabled = true;
            }
            this.timepickerVariables[side].hours.push(i);
            if (i_in_24 === selected.hour() && !disabled) {
                this.timepickerVariables[side].selectedHour = i;
            }
            else if (disabled) {
                this.timepickerVariables[side].disabledHours.push(i);
            }
        }
        for (var i = 0; i < 60; i += this.timePickerIncrement) {
            var padded = i < 10 ? '0' + i : i;
            var time = selected.clone().minute(i);
            var disabled = false;
            if (minDate && time.second(59).isBefore(minDate)) {
                disabled = true;
            }
            if (maxDate && time.second(0).isAfter(maxDate)) {
                disabled = true;
            }
            this.timepickerVariables[side].minutes.push(i);
            this.timepickerVariables[side].minutesLabel.push(padded);
            if (selected.minute() === i && !disabled) {
                this.timepickerVariables[side].selectedMinute = i;
            }
            else if (disabled) {
                this.timepickerVariables[side].disabledMinutes.push(i);
            }
        }
        if (this.timePickerSeconds) {
            for (var i = 0; i < 60; i++) {
                var padded = i < 10 ? '0' + i : i;
                var time = selected.clone().second(i);
                var disabled = false;
                if (minDate && time.isBefore(minDate)) {
                    disabled = true;
                }
                if (maxDate && time.isAfter(maxDate)) {
                    disabled = true;
                }
                this.timepickerVariables[side].seconds.push(i);
                this.timepickerVariables[side].secondsLabel.push(padded);
                if (selected.second() === i && !disabled) {
                    this.timepickerVariables[side].selectedSecond = i;
                }
                else if (disabled) {
                    this.timepickerVariables[side].disabledSeconds.push(i);
                }
            }
        }
        if (!this.timePicker24Hour) {
            if (minDate && selected.clone().hour(12).minute(0).second(0).isBefore(minDate)) {
                this.timepickerVariables[side].amDisabled = true;
            }
            if (maxDate && selected.clone().hour(0).minute(0).second(0).isAfter(maxDate)) {
                this.timepickerVariables[side].pmDisabled = true;
            }
            if (selected.hour() >= 12) {
                this.timepickerVariables[side].ampmModel = 'PM';
            }
            else {
                this.timepickerVariables[side].ampmModel = 'AM';
            }
        }
        this.timepickerVariables[side].selected = selected;
    };
    DaterangepickerComponent.prototype.renderCalendar = function (side) {
        var mainCalendar = (side === SideEnum.left) ? this.leftCalendar : this.rightCalendar;
        var month = mainCalendar.month.month();
        var year = mainCalendar.month.year();
        var hour = mainCalendar.month.hour();
        var minute = mainCalendar.month.minute();
        var second = mainCalendar.month.second();
        var daysInMonth = moment([year, month]).daysInMonth();
        var firstDay = moment([year, month, 1]);
        var lastDay = moment([year, month, daysInMonth]);
        var lastMonth = moment(firstDay).subtract(1, 'month').month();
        var lastYear = moment(firstDay).subtract(1, 'month').year();
        var daysInLastMonth = moment([lastYear, lastMonth]).daysInMonth();
        var dayOfWeek = firstDay.day();
        var calendar = [];
        calendar.firstDay = firstDay;
        calendar.lastDay = lastDay;
        for (var i = 0; i < 6; i++) {
            calendar[i] = [];
        }
        var startDay = daysInLastMonth - dayOfWeek + this.locale.firstDay + 1;
        if (startDay > daysInLastMonth) {
            startDay -= 7;
        }
        if (dayOfWeek === this.locale.firstDay) {
            startDay = daysInLastMonth - 6;
        }
        var curDate = moment([lastYear, lastMonth, startDay, 12, minute, second]);
        for (var i = 0, col = 0, row = 0; i < 42; i++, col++, curDate = moment(curDate).add(24, 'hour')) {
            if (i > 0 && col % 7 === 0) {
                col = 0;
                row++;
            }
            calendar[row][col] = curDate.clone().hour(hour).minute(minute).second(second);
            curDate.hour(12);
            if (this.minDate && calendar[row][col].format('YYYY-MM-DD') === this.minDate.format('YYYY-MM-DD') &&
                calendar[row][col].isBefore(this.minDate) && side === 'left') {
                calendar[row][col] = this.minDate.clone();
            }
            if (this.maxDate && calendar[row][col].format('YYYY-MM-DD') === this.maxDate.format('YYYY-MM-DD') &&
                calendar[row][col].isAfter(this.maxDate) && side === 'right') {
                calendar[row][col] = this.maxDate.clone();
            }
        }
        if (side === SideEnum.left) {
            this.leftCalendar.calendar = calendar;
        }
        else {
            this.rightCalendar.calendar = calendar;
        }
        var minDate = side === 'left' ? this.minDate : this.startDate;
        var maxDate = this.maxDate;
        if (this.endDate === null && this.dateLimit) {
            var maxLimit = this.startDate.clone().add(this.dateLimit, 'day').endOf('day');
            if (!maxDate || maxLimit.isBefore(maxDate)) {
                maxDate = maxLimit;
            }
        }
        this.calendarVariables[side] = {
            month: month,
            year: year,
            hour: hour,
            minute: minute,
            second: second,
            daysInMonth: daysInMonth,
            firstDay: firstDay,
            lastDay: lastDay,
            lastMonth: lastMonth,
            lastYear: lastYear,
            daysInLastMonth: daysInLastMonth,
            dayOfWeek: dayOfWeek,
            calRows: Array.from(Array(6).keys()),
            calCols: Array.from(Array(7).keys()),
            classes: {},
            minDate: minDate,
            maxDate: maxDate,
            calendar: calendar
        };
        if (this.showDropdowns) {
            var currentMonth = calendar[1][1].month();
            var currentYear = calendar[1][1].year();
            var maxYear = (maxDate && maxDate.year()) || (currentYear + 5);
            var minYear = (minDate && minDate.year()) || (currentYear - 50);
            var inMinYear = currentYear === minYear;
            var inMaxYear = currentYear === maxYear;
            var years = [];
            for (var y = minYear; y <= maxYear; y++) {
                years.push(y);
            }
            this.calendarVariables[side].dropdowns = {
                currentMonth: currentMonth,
                currentYear: currentYear,
                maxYear: maxYear,
                minYear: minYear,
                inMinYear: inMinYear,
                inMaxYear: inMaxYear,
                monthArrays: Array.from(Array(12).keys()),
                yearArrays: years
            };
        }
        this._buildCells(calendar, side);
    };
    DaterangepickerComponent.prototype.setStartDate = function (startDate) {
        if (typeof startDate === 'string') {
            this.startDate = moment(startDate, this.locale.format);
        }
        if (typeof startDate === 'object') {
            this.startDate = moment(startDate);
        }
        if (!this.timePicker) {
            this.startDate = this.startDate.startOf('day');
        }
        if (this.timePicker && this.timePickerIncrement) {
            this.startDate.minute(Math.round(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
        }
        if (this.minDate && this.startDate.isBefore(this.minDate)) {
            this.startDate = this.minDate.clone();
            if (this.timePicker && this.timePickerIncrement) {
                this.startDate.minute(Math.round(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
            }
        }
        if (this.maxDate && this.startDate.isAfter(this.maxDate)) {
            this.startDate = this.maxDate.clone();
            if (this.timePicker && this.timePickerIncrement) {
                this.startDate.minute(Math.floor(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
            }
        }
        if (!this.isShown) {
            this.updateElement();
        }
        this.updateMonthsInView();
    };
    DaterangepickerComponent.prototype.setEndDate = function (endDate) {
        if (typeof endDate === 'string') {
            this.endDate = moment(endDate, this.locale.format);
        }
        if (typeof endDate === 'object') {
            this.endDate = moment(endDate);
        }
        if (!this.timePicker) {
            this.endDate = this.endDate.add(1, 'd').startOf('day').subtract(1, 'second');
        }
        if (this.timePicker && this.timePickerIncrement) {
            this.endDate.minute(Math.round(this.endDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
        }
        if (this.endDate.isBefore(this.startDate)) {
            this.endDate = this.startDate.clone();
        }
        if (this.maxDate && this.endDate.isAfter(this.maxDate)) {
            this.endDate = this.maxDate.clone();
        }
        if (this.dateLimit && this.startDate.clone().add(this.dateLimit, 'day').isBefore(this.endDate)) {
            this.endDate = this.startDate.clone().add(this.dateLimit, 'day');
        }
        if (!this.isShown) {
        }
        this.updateMonthsInView();
    };
    DaterangepickerComponent.prototype.isInvalidDate = function (date) {
        return false;
    };
    DaterangepickerComponent.prototype.isCustomDate = function (date) {
        return false;
    };
    DaterangepickerComponent.prototype.updateView = function () {
        if (this.timePicker) {
            this.renderTimePicker(SideEnum.left);
            this.renderTimePicker(SideEnum.right);
        }
        this.updateMonthsInView();
        this.updateCalendars();
    };
    DaterangepickerComponent.prototype.updateMonthsInView = function () {
        if (this.endDate) {
            if (!this.singleDatePicker && this.leftCalendar.month && this.rightCalendar.month &&
                ((this.startDate && this.leftCalendar && this.startDate.format('YYYY-MM') === this.leftCalendar.month.format('YYYY-MM')) ||
                    (this.startDate && this.rightCalendar && this.startDate.format('YYYY-MM') === this.rightCalendar.month.format('YYYY-MM')))
                &&
                    (this.endDate.format('YYYY-MM') === this.leftCalendar.month.format('YYYY-MM') ||
                        this.endDate.format('YYYY-MM') === this.rightCalendar.month.format('YYYY-MM'))) {
                return;
            }
            if (this.startDate) {
                this.leftCalendar.month = this.startDate.clone().date(2);
                if (!this.linkedCalendars && (this.endDate.month() !== this.startDate.month() ||
                    this.endDate.year() !== this.startDate.year())) {
                    this.rightCalendar.month = this.endDate.clone().date(2);
                }
                else {
                    this.rightCalendar.month = this.startDate.clone().date(2).add(1, 'month');
                }
            }
        }
        else {
            if (this.leftCalendar.month.format('YYYY-MM') !== this.startDate.format('YYYY-MM') &&
                this.rightCalendar.month.format('YYYY-MM') !== this.startDate.format('YYYY-MM')) {
                this.leftCalendar.month = this.startDate.clone().date(2);
                this.rightCalendar.month = this.startDate.clone().date(2).add(1, 'month');
            }
        }
        if (this.maxDate && this.linkedCalendars && !this.singleDatePicker && this.rightCalendar.month > this.maxDate) {
            this.rightCalendar.month = this.maxDate.clone().date(2);
            this.leftCalendar.month = this.maxDate.clone().date(2).subtract(1, 'month');
        }
    };
    DaterangepickerComponent.prototype.updateCalendars = function () {
        this.renderCalendar(SideEnum.left);
        this.renderCalendar(SideEnum.right);
        if (this.endDate === null) {
            return;
        }
        this.calculateChosenLabel();
    };
    DaterangepickerComponent.prototype.updateElement = function () {
        if (!this.singleDatePicker && this.autoUpdateInput) {
            if (this.startDate && this.endDate) {
                if (this.rangesArray.length && this.showRangeLabelOnInput === true && this.chosenRange &&
                    this.locale.customRangeLabel !== this.chosenRange) {
                    this.chosenLabel = this.chosenRange;
                }
                else {
                    this.chosenLabel = this.startDate.format(this.locale.format) +
                        this.locale.separator + this.endDate.format(this.locale.format);
                }
            }
        }
        else if (this.autoUpdateInput) {
            this.chosenLabel = this.startDate.format(this.locale.format);
        }
    };
    DaterangepickerComponent.prototype.remove = function () {
        this.isShown = false;
    };
    DaterangepickerComponent.prototype.calculateChosenLabel = function () {
        if (!this.locale || !this.locale.separator) {
            this._buildLocale();
        }
        var customRange = true;
        var i = 0;
        if (this.rangesArray.length > 0) {
            for (var range in this.ranges) {
                if (this.timePicker) {
                    var format = this.timePickerSeconds ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD HH:mm';
                    if (this.startDate.format(format) === this.ranges[range][0].format(format) && this.endDate.format(format) === this.ranges[range][1].format(format)) {
                        customRange = false;
                        this.chosenRange = this.rangesArray[i];
                        break;
                    }
                }
                else {
                    if (this.startDate.format('YYYY-MM-DD') === this.ranges[range][0].format('YYYY-MM-DD') && this.endDate.format('YYYY-MM-DD') === this.ranges[range][1].format('YYYY-MM-DD')) {
                        customRange = false;
                        this.chosenRange = this.rangesArray[i];
                        break;
                    }
                }
                i++;
            }
            if (customRange) {
                if (this.showCustomRangeLabel) {
                    this.chosenRange = this.locale.customRangeLabel;
                }
                else {
                    this.chosenRange = null;
                }
                this.showCalInRanges = true;
            }
        }
        this.updateElement();
    };
    DaterangepickerComponent.prototype.clickApply = function (e) {
        if (!this.singleDatePicker && this.startDate && !this.endDate) {
            this.endDate = this.startDate.clone();
            this.calculateChosenLabel();
        }
        if (this.isInvalidDate && this.startDate && this.endDate) {
            var d = this.startDate.clone();
            while (d.isBefore(this.endDate)) {
                if (this.isInvalidDate(d)) {
                    this.endDate = d.subtract(1, 'days');
                    this.calculateChosenLabel();
                    break;
                }
                d.add(1, 'days');
            }
        }
        if (this.chosenLabel) {
            this.choosedDate.emit({ chosenLabel: this.chosenLabel, startDate: this.startDate, endDate: this.endDate });
        }
        this.datesUpdated.emit({ startDate: this.startDate, endDate: this.endDate });
        this.hide();
    };
    DaterangepickerComponent.prototype.clickCancel = function (e) {
        this.startDate = this._old.start;
        this.endDate = this._old.end;
        if (this.inline) {
            this.updateView();
        }
        this.hide();
    };
    DaterangepickerComponent.prototype.monthChanged = function (monthEvent, side) {
        var year = this.calendarVariables[side].dropdowns.currentYear;
        var month = parseInt(monthEvent.target.value, 10);
        this.monthOrYearChanged(month, year, side);
    };
    DaterangepickerComponent.prototype.yearChanged = function (yearEvent, side) {
        var month = this.calendarVariables[side].dropdowns.currentMonth;
        var year = parseInt(yearEvent.target.value, 10);
        this.monthOrYearChanged(month, year, side);
    };
    DaterangepickerComponent.prototype.timeChanged = function (timeEvent, side) {
        var hour = parseInt(this.timepickerVariables[side].selectedHour, 10);
        var minute = parseInt(this.timepickerVariables[side].selectedMinute, 10);
        var second = this.timePickerSeconds ? parseInt(this.timepickerVariables[side].selectedSecond, 10) : 0;
        if (!this.timePicker24Hour) {
            var ampm = this.timepickerVariables[side].ampmModel;
            if (ampm === 'PM' && hour < 12) {
                hour += 12;
            }
            if (ampm === 'AM' && hour === 12) {
                hour = 0;
            }
        }
        if (side === SideEnum.left) {
            var start = this.startDate.clone();
            start.hour(hour);
            start.minute(minute);
            start.second(second);
            this.setStartDate(start);
            if (this.singleDatePicker) {
                this.endDate = this.startDate.clone();
            }
            else if (this.endDate && this.endDate.format('YYYY-MM-DD') === start.format('YYYY-MM-DD') && this.endDate.isBefore(start)) {
                this.setEndDate(start.clone());
            }
        }
        else if (this.endDate) {
            var end = this.endDate.clone();
            end.hour(hour);
            end.minute(minute);
            end.second(second);
            this.setEndDate(end);
        }
        this.updateCalendars();
        this.renderTimePicker(SideEnum.left);
        this.renderTimePicker(SideEnum.right);
    };
    DaterangepickerComponent.prototype.monthOrYearChanged = function (month, year, side) {
        var isLeft = side === SideEnum.left;
        if (!isLeft) {
            if (year < this.startDate.year() || (year === this.startDate.year() && month < this.startDate.month())) {
                month = this.startDate.month();
                year = this.startDate.year();
            }
        }
        if (this.minDate) {
            if (year < this.minDate.year() || (year === this.minDate.year() && month < this.minDate.month())) {
                month = this.minDate.month();
                year = this.minDate.year();
            }
        }
        if (this.maxDate) {
            if (year > this.maxDate.year() || (year === this.maxDate.year() && month > this.maxDate.month())) {
                month = this.maxDate.month();
                year = this.maxDate.year();
            }
        }
        this.calendarVariables[side].dropdowns.currentYear = year;
        this.calendarVariables[side].dropdowns.currentMonth = month;
        if (isLeft) {
            this.leftCalendar.month.month(month).year(year);
            if (this.linkedCalendars) {
                this.rightCalendar.month = this.leftCalendar.month.clone().add(1, 'month');
            }
        }
        else {
            this.rightCalendar.month.month(month).year(year);
            if (this.linkedCalendars) {
                this.leftCalendar.month = this.rightCalendar.month.clone().subtract(1, 'month');
            }
        }
        this.updateCalendars();
    };
    DaterangepickerComponent.prototype.clickPrev = function (side) {
        if (side === SideEnum.left) {
            this.leftCalendar.month.subtract(1, 'month');
            if (this.linkedCalendars) {
                this.rightCalendar.month.subtract(1, 'month');
            }
        }
        else {
            this.rightCalendar.month.subtract(1, 'month');
        }
        this.updateCalendars();
    };
    DaterangepickerComponent.prototype.clickNext = function (side) {
        if (side === SideEnum.left) {
            this.leftCalendar.month.add(1, 'month');
        }
        else {
            this.rightCalendar.month.add(1, 'month');
            if (this.linkedCalendars) {
                this.leftCalendar.month.add(1, 'month');
            }
        }
        this.updateCalendars();
    };
    DaterangepickerComponent.prototype.clickDate = function (e, side, row, col) {
        if (e.target.tagName === 'TD') {
            if (!e.target.classList.contains('available')) {
                return;
            }
        }
        else if (e.target.tagName === 'SPAN') {
            if (!e.target.parentElement.classList.contains('available')) {
                return;
            }
        }
        if (this.rangesArray.length) {
            this.chosenRange = this.locale.customRangeLabel;
        }
        var date = side === SideEnum.left ? this.leftCalendar.calendar[row][col] : this.rightCalendar.calendar[row][col];
        if (this.endDate || date.isBefore(this.startDate, 'day')) {
            if (this.timePicker) {
                date = this._getDateWithTime(date, SideEnum.left);
            }
            this.endDate = null;
            this.setStartDate(date.clone());
        }
        else if (!this.endDate && date.isBefore(this.startDate)) {
            this.setEndDate(this.startDate.clone());
        }
        else {
            if (this.timePicker) {
                date = this._getDateWithTime(date, SideEnum.right);
            }
            this.setEndDate(date.clone());
            if (this.autoApply) {
                this.calculateChosenLabel();
                this.clickApply();
            }
        }
        if (this.singleDatePicker) {
            this.setEndDate(this.startDate);
            this.updateElement();
            if (this.autoApply) {
                this.clickApply();
            }
        }
        this.updateView();
        e.stopPropagation();
    };
    DaterangepickerComponent.prototype.clickRange = function (e, label) {
        this.chosenRange = label;
        if (label === this.locale.customRangeLabel) {
            this.isShown = true;
            this.showCalInRanges = true;
        }
        else {
            var dates = this.ranges[label];
            this.startDate = dates[0].clone();
            this.endDate = dates[1].clone();
            if (this.showRangeLabelOnInput && label !== this.locale.customRangeLabel) {
                this.chosenLabel = label;
            }
            else {
                this.calculateChosenLabel();
            }
            this.showCalInRanges = (!this.rangesArray.length) || this.alwaysShowCalendars;
            if (!this.timePicker) {
                this.startDate.startOf('day');
                this.endDate.endOf('day');
            }
            if (!this.alwaysShowCalendars) {
                this.isShown = false;
            }
            this.rangeClicked.emit({ label: label, dates: dates });
            if (!this.keepCalendarOpeningWithRange) {
                this.clickApply();
            }
            else {
                this.leftCalendar.month.month(dates[0].month());
                this.leftCalendar.month.year(dates[0].year());
                this.rightCalendar.month.month(dates[1].month());
                this.rightCalendar.month.year(dates[1].year());
                this.updateCalendars();
                if (this.timePicker) {
                    this.renderTimePicker(SideEnum.left);
                    this.renderTimePicker(SideEnum.right);
                }
            }
        }
    };
    DaterangepickerComponent.prototype.show = function (e) {
        if (this.isShown) {
            return;
        }
        this._old.start = this.startDate.clone();
        this._old.end = this.endDate.clone();
        this.isShown = true;
        this.updateView();
    };
    DaterangepickerComponent.prototype.hide = function (e) {
        if (!this.isShown) {
            return;
        }
        if (!this.endDate) {
            if (this._old.start) {
                this.startDate = this._old.start.clone();
            }
            if (this._old.end) {
                this.endDate = this._old.end.clone();
            }
        }
        if (!this.startDate.isSame(this._old.start) || !this.endDate.isSame(this._old.end)) {
        }
        this.updateElement();
        this.isShown = false;
        this._ref.detectChanges();
    };
    DaterangepickerComponent.prototype.handleInternalClick = function (e) {
        e.stopPropagation();
    };
    DaterangepickerComponent.prototype.updateLocale = function (locale) {
        for (var key in locale) {
            if (locale.hasOwnProperty(key)) {
                this.locale[key] = locale[key];
            }
        }
    };
    DaterangepickerComponent.prototype.clear = function () {
        this.startDate = moment().startOf('day');
        this.endDate = moment().endOf('day');
        this.choosedDate.emit({ chosenLabel: '', startDate: null, endDate: null });
        this.datesUpdated.emit({ startDate: null, endDate: null });
        this.hide();
    };
    DaterangepickerComponent.prototype.disableRange = function (range) {
        var _this = this;
        if (range === this.locale.customRangeLabel) {
            return false;
        }
        var rangeMarkers = this.ranges[range];
        var areBothBefore = rangeMarkers.every(function (date) {
            if (!_this.minDate) {
                return false;
            }
            return date.isBefore(_this.minDate);
        });
        var areBothAfter = rangeMarkers.every(function (date) {
            if (!_this.maxDate) {
                return false;
            }
            return date.isAfter(_this.maxDate);
        });
        return (areBothBefore || areBothAfter);
    };
    DaterangepickerComponent.prototype._getDateWithTime = function (date, side) {
        var hour = parseInt(this.timepickerVariables[side].selectedHour, 10);
        if (!this.timePicker24Hour) {
            var ampm = this.timepickerVariables[side].ampmModel;
            if (ampm === 'PM' && hour < 12) {
                hour += 12;
            }
            if (ampm === 'AM' && hour === 12) {
                hour = 0;
            }
        }
        var minute = parseInt(this.timepickerVariables[side].selectedMinute, 10);
        var second = this.timePickerSeconds ? parseInt(this.timepickerVariables[side].selectedSecond, 10) : 0;
        return date.clone().hour(hour).minute(minute).second(second);
    };
    DaterangepickerComponent.prototype._buildLocale = function () {
        if (!this.locale.format) {
            if (this.timePicker) {
                this.locale.format = moment.localeData().longDateFormat('lll');
            }
            else {
                this.locale.format = moment.localeData().longDateFormat('L');
            }
        }
    };
    DaterangepickerComponent.prototype._buildCells = function (calendar, side) {
        for (var row = 0; row < 6; row++) {
            this.calendarVariables[side].classes[row] = {};
            var rowClasses = [];
            if (this.emptyWeekRowClass && !this.hasCurrentMonthDays(this.calendarVariables[side].month, calendar[row])) {
                rowClasses.push(this.emptyWeekRowClass);
            }
            for (var col = 0; col < 7; col++) {
                var classes = [];
                if (calendar[row][col].isSame(new Date(), 'day')) {
                    classes.push('today');
                }
                if (calendar[row][col].isoWeekday() > 5) {
                    classes.push('weekend');
                }
                if (calendar[row][col].month() !== calendar[1][1].month()) {
                    classes.push('off');
                    if (this.lastDayOfPreviousMonthClass && (calendar[row][col].month() < calendar[1][1].month() || calendar[1][1].month() === 0) && calendar[row][col].date() === this.calendarVariables[side].daysInLastMonth) {
                        classes.push(this.lastDayOfPreviousMonthClass);
                    }
                    if (this.firstDayOfNextMonthClass && (calendar[row][col].month() > calendar[1][1].month() || calendar[row][col].month() === 0) && calendar[row][col].date() === 1) {
                        classes.push(this.firstDayOfNextMonthClass);
                    }
                }
                if (this.firstMonthDayClass && calendar[row][col].month() === calendar[1][1].month() && calendar[row][col].date() === calendar.firstDay.date()) {
                    classes.push(this.firstMonthDayClass);
                }
                if (this.lastMonthDayClass && calendar[row][col].month() === calendar[1][1].month() && calendar[row][col].date() === calendar.lastDay.date()) {
                    classes.push(this.lastMonthDayClass);
                }
                if (this.minDate && calendar[row][col].isBefore(this.minDate, 'day')) {
                    classes.push('off', 'disabled');
                }
                if (this.calendarVariables[side].maxDate && calendar[row][col].isAfter(this.calendarVariables[side].maxDate, 'day')) {
                    classes.push('off', 'disabled');
                }
                if (this.isInvalidDate(calendar[row][col])) {
                    classes.push('off', 'disabled');
                }
                if (this.startDate && calendar[row][col].format('YYYY-MM-DD') === this.startDate.format('YYYY-MM-DD')) {
                    classes.push('active', 'start-date');
                }
                if (this.endDate !== null && calendar[row][col].format('YYYY-MM-DD') === this.endDate.format('YYYY-MM-DD')) {
                    classes.push('active', 'end-date');
                }
                if (this.endDate !== null && calendar[row][col] > this.startDate && calendar[row][col] < this.endDate) {
                    classes.push('in-range');
                }
                var isCustom = this.isCustomDate(calendar[row][col]);
                if (isCustom !== false) {
                    if (typeof isCustom === 'string') {
                        classes.push(isCustom);
                    }
                    else {
                        Array.prototype.push.apply(classes, isCustom);
                    }
                }
                var cname = '';
                var disabled = false;
                for (var i = 0; i < classes.length; i++) {
                    cname += classes[i] + ' ';
                    if (classes[i] === 'disabled') {
                        disabled = true;
                    }
                }
                if (!disabled) {
                    cname += 'available';
                }
                this.calendarVariables[side].classes[row][col] = cname.replace(/^\s+|\s+$/g, '');
            }
            this.calendarVariables[side].classes[row].classList = rowClasses.join(' ');
        }
    };
    DaterangepickerComponent.prototype.hasCurrentMonthDays = function (currentMonth, row) {
        for (var day = 0; day < 7; day++) {
            if (row[day].month() === currentMonth) {
                return true;
            }
        }
        return false;
    };
    DaterangepickerComponent.decorators = [
        { type: Component, args: [{
                    selector: 'o-daterange-picker',
                    template: "<div class=\"md-drppicker\" #pickerContainer\n[ngClass]=\"{\n    ltr: locale.direction === 'ltr',\n    rtl: this.locale.direction === 'rtl',\n    'shown': isShown || inline,\n    'hidden': !isShown && !inline,\n    'inline': inline,\n    'double': !singleDatePicker && showCalInRanges,\n    'show-ranges': rangesArray.length\n}\" [class]=\"'drops-' + drops + '-' + opens\">\n    <div class=\"ranges\">\n        <ul>\n          <li *ngFor=\"let range of rangesArray\">\n            <button type=\"button\"\n                    (click)=\"clickRange($event, range)\"\n                    [disabled]=\"disableRange(range)\"\n                    [ngClass]=\"{'active': range === chosenRange}\">{{range | oTranslate}}</button>\n          </li>\n        </ul>\n    </div>\n    <div class=\"calendar\" [ngClass]=\"{right: singleDatePicker, left: !singleDatePicker}\"\n        *ngIf=\"showCalInRanges\">\n        <div class=\"calendar-table\">\n            <table class=\"table-condensed\" *ngIf=\"calendarVariables\">\n                <thead>\n                    <tr>\n                        <th *ngIf=\"showWeekNumbers || showISOWeekNumbers\"></th>\n                        <ng-container *ngIf=\"!calendarVariables.left.minDate || calendarVariables.left.minDate.isBefore(calendarVariables.left.calendar.firstDay) && (!this.linkedCalendars || true)\">\n                            <th (click)=\"clickPrev(sideEnum.left)\" class=\"prev available\" >\n                            </th>\n                        </ng-container>\n                        <ng-container *ngIf=\"!(!calendarVariables.left.minDate || calendarVariables.left.minDate.isBefore(calendarVariables.left.calendar.firstDay) && (!this.linkedCalendars || true))\">\n                            <th></th>\n                        </ng-container>\n                        <th colspan=\"5\" class=\"month drp-animate\">\n                            <ng-container *ngIf=\"showDropdowns && calendarVariables.left.dropdowns\">\n                                <div class=\"dropdowns\">\n                                        {{this.locale.monthNames[calendarVariables?.left?.calendar[1][1].month()]}}\n                                        <select class=\"monthselect\" (change)=\"monthChanged($event, sideEnum.left)\">\n                                                <option\n                                                [disabled]=\"(calendarVariables.left.dropdowns.inMinYear && m < calendarVariables.left.minDate.month()) || (calendarVariables.left.dropdowns.inMaxYear && m > calendarVariables.left.maxDate.month())\"\n                                                *ngFor=\"let m of calendarVariables.left.dropdowns.monthArrays\" [value]=\"m\" [selected]=\"calendarVariables.left.dropdowns.currentMonth == m\">\n                                                    {{locale.monthNames[m]}}\n                                                </option>\n                                        </select>\n                                </div>\n                                <div class=\"dropdowns\">\n                                    {{ calendarVariables?.left?.calendar[1][1].format(\" YYYY\")}}\n                                    <select class=\"yearselect\"  (change)=\"yearChanged($event, sideEnum.left)\">\n                                        <option *ngFor=\"let y of calendarVariables.left.dropdowns.yearArrays\" [selected]=\"y === calendarVariables.left.dropdowns.currentYear\">\n                                            {{y}}\n                                        </option>\n                                    </select>\n                                </div>\n                            </ng-container>\n                            <ng-container *ngIf=\"!showDropdowns || !calendarVariables.left.dropdowns\">\n                                    {{this.locale.monthNames[calendarVariables?.left?.calendar[1][1].month()]}}  {{ calendarVariables?.left?.calendar[1][1].format(\" YYYY\")}}\n                            </ng-container>\n                        </th>\n                        <ng-container *ngIf=\"(!calendarVariables.left.maxDate || calendarVariables.left.maxDate.isAfter(calendarVariables.left.calendar.lastDay)) && (!linkedCalendars || singleDatePicker )\">\n                            <th class=\"next available\" (click)=\"clickNext(sideEnum.left)\">\n                            </th>\n                        </ng-container>\n                        <ng-container *ngIf=\"!((!calendarVariables.left.maxDate || calendarVariables.left.maxDate.isAfter(calendarVariables.left.calendar.lastDay)) && (!linkedCalendars || singleDatePicker ))\">\n                            <th></th>\n                        </ng-container>\n                    </tr>\n                    <tr class='week-days'>\n                        <th *ngIf=\"showWeekNumbers || showISOWeekNumbers\" class=\"week\"><span>{{this.locale.weekLabel}}</span></th>\n                        <th *ngFor=\"let dayofweek of locale.daysOfWeek\"><span>{{dayofweek}}</span></th>\n                    </tr>\n                </thead>\n                <tbody class=\"drp-animate\">\n                    <tr *ngFor=\"let row of calendarVariables.left.calRows\" [class]=\"calendarVariables.left.classes[row].classList\">\n                        <!-- add week number -->\n                        <td  class=\"week\" *ngIf=\"showWeekNumbers\">\n                            <span>{{calendarVariables.left.calendar[row][0].week()}}</span>\n                        </td>\n                        <td class=\"week\" *ngIf=\"showISOWeekNumbers\">\n                            <span>{{calendarVariables.left.calendar[row][0].isoWeek()}}</span>\n                        </td>\n                        <!-- cal -->\n                        <td *ngFor=\"let col of calendarVariables.left.calCols\" [class]=\"calendarVariables.left.classes[row][col]\" (click)=\"clickDate($event, sideEnum.left, row, col)\">\n                            <span>{{calendarVariables.left.calendar[row][col].date()}}</span>\n                        </td>\n                    </tr>\n                </tbody>\n            </table>\n        </div>\n        <div class=\"calendar-time\" *ngIf=\"timePicker\">\n            <div class=\"select\">\n                <select class=\"hourselect select-item\" [disabled]=\"!endDate\" [(ngModel)]=\"timepickerVariables.left.selectedHour\" (ngModelChange)=\"timeChanged($event, sideEnum.left)\">\n                    <option *ngFor=\"let i of timepickerVariables.left.hours\"\n                    [value]=\"i\"\n                    [disabled]=\"timepickerVariables.left.disabledHours.indexOf(i) > -1\">{{i}}</option>\n                </select>\n            </div>\n            <div class=\"select\">\n                <select class=\"select-item minuteselect\" [disabled]=\"!endDate\" [(ngModel)]=\"timepickerVariables.left.selectedMinute\" (ngModelChange)=\"timeChanged($event, sideEnum.left)\">\n                    <option *ngFor=\"let i of timepickerVariables.left.minutes; let index = index;\"\n                    [value]=\"i\"\n                    [disabled]=\"timepickerVariables.left.disabledMinutes.indexOf(i) > -1\">{{timepickerVariables.left.minutesLabel[index]}}</option>\n                </select>\n                <span class=\"select-highlight\"></span>\n                <span class=\"select-bar\"></span>\n            </div>\n            <div class=\"select\">\n                <select class=\"select-item secondselect\" *ngIf=\"timePickerSeconds\" [disabled]=\"!endDate\" [(ngModel)]=\"timepickerVariables.left.selectedSecond\" (ngModelChange)=\"timeChanged($event, sideEnum.left)\">\n                    <option *ngFor=\"let i of timepickerVariables.left.seconds; let index = index;\"\n                    [value]=\"i\"\n                    [disabled]=\"timepickerVariables.left.disabledSeconds.indexOf(i) > -1\">{{timepickerVariables.left.secondsLabel[index]}}</option>\n                </select>\n                <span class=\"select-highlight\"></span>\n                <span class=\"select-bar\"></span>\n            </div>\n            <div class=\"select\">\n                <select class=\"select-item ampmselect\" *ngIf=\"!timePicker24Hour\" [(ngModel)]=\"timepickerVariables.left.ampmModel\" (ngModelChange)=\"timeChanged($event, sideEnum.left)\">\n                    <option value=\"AM\" [disabled]=\"timepickerVariables.left.amDisabled\">AM</option>\n                    <option value=\"PM\"  [disabled]=\"timepickerVariables.left.pmDisabled\">PM</option>\n                </select>\n                <span class=\"select-highlight\"></span>\n                <span class=\"select-bar\"></span>\n            </div>\n        </div>\n    </div>\n    <div class=\"calendar right\"\n        *ngIf=\"showCalInRanges && !singleDatePicker\"\n        >\n        <div class=\"calendar-table\">\n            <table class=\"table-condensed\" *ngIf=\"calendarVariables\">\n                <thead>\n                    <tr>\n                        <th *ngIf=\"showWeekNumbers || showISOWeekNumbers\"></th>\n                        <ng-container *ngIf=\"(!calendarVariables.right.minDate || calendarVariables.right.minDate.isBefore(calendarVariables.right.calendar.firstDay)) && (!this.linkedCalendars)\">\n                            <th (click)=\"clickPrev(sideEnum.right)\" class=\"prev available\" >\n                            </th>\n                        </ng-container>\n                        <ng-container *ngIf=\"!((!calendarVariables.right.minDate || calendarVariables.right.minDate.isBefore(calendarVariables.right.calendar.firstDay)) && (!this.linkedCalendars))\">\n                            <th></th>\n                        </ng-container>\n                        <th colspan=\"5\" class=\"month\">\n                            <ng-container *ngIf=\"showDropdowns && calendarVariables.right.dropdowns\">\n                                <div class=\"dropdowns\">\n                                    {{this.locale.monthNames[calendarVariables?.right?.calendar[1][1].month()]}}\n                                    <select class=\"monthselect\" (change)=\"monthChanged($event, sideEnum.right)\">\n                                            <option\n                                            [disabled]=\"(calendarVariables.right.dropdowns.inMinYear && m < calendarVariables.right.minDate.month()) || (calendarVariables.right.dropdowns.inMaxYear && m > calendarVariables.right.maxDate.month())\"\n                                            *ngFor=\"let m of calendarVariables.right.dropdowns.monthArrays\" [value]=\"m\" [selected]=\"calendarVariables.right.dropdowns.currentMonth == m\">\n                                                {{locale.monthNames[m]}}\n                                            </option>\n                                    </select>\n                                </div>\n                                <div class=\"dropdowns\">\n                                        {{ calendarVariables?.right?.calendar[1][1].format(\" YYYY\")}}\n                                        <select class=\"yearselect\" (change)=\"yearChanged($event, sideEnum.right)\">\n                                        <option *ngFor=\"let y of calendarVariables.right.dropdowns.yearArrays\" [selected]=\"y === calendarVariables.right.dropdowns.currentYear\">\n                                            {{y}}\n                                        </option>\n                                    </select>\n                                </div>\n                            </ng-container>\n                            <ng-container *ngIf=\"!showDropdowns || !calendarVariables.right.dropdowns\">\n                                    {{this.locale.monthNames[calendarVariables?.right?.calendar[1][1].month()]}}  {{ calendarVariables?.right?.calendar[1][1].format(\" YYYY\")}}\n                            </ng-container>\n                        </th>\n                            <ng-container *ngIf=\"!calendarVariables.right.maxDate || calendarVariables.right.maxDate.isAfter(calendarVariables.right.calendar.lastDay) && (!linkedCalendars || singleDatePicker || true)\">\n                                <th class=\"next available\" (click)=\"clickNext(sideEnum.right)\">\n                                </th>\n                            </ng-container>\n                            <ng-container *ngIf=\"!(!calendarVariables.right.maxDate || calendarVariables.right.maxDate.isAfter(calendarVariables.right.calendar.lastDay) && (!linkedCalendars || singleDatePicker || true))\">\n                                <th></th>\n                            </ng-container>\n                    </tr>\n\n                    <tr>\n                        <th *ngIf=\"showWeekNumbers || showISOWeekNumbers\" class=\"week\"><span>{{this.locale.weekLabel}}</span></th>\n                        <th *ngFor=\"let dayofweek of locale.daysOfWeek\"><span>{{dayofweek}}</span></th>\n                    </tr>\n                </thead>\n                <tbody>\n                    <tr *ngFor=\"let row of calendarVariables.right.calRows\" [class]=\"calendarVariables.right.classes[row].classList\">\n                        <td class=\"week\" *ngIf=\"showWeekNumbers\">\n                            <span>{{calendarVariables.right.calendar[row][0].week()}}</span>\n                        </td>\n                        <td class=\"week\" *ngIf=\"showISOWeekNumbers\">\n                            <span>{{calendarVariables.right.calendar[row][0].isoWeek()}}</span>\n                        </td>\n                        <td *ngFor=\"let col of calendarVariables.right.calCols\" [class]=\"calendarVariables.right.classes[row][col]\" (click)=\"clickDate($event, sideEnum.right, row, col)\">\n                            <span>{{calendarVariables.right.calendar[row][col].date()}}</span>\n                        </td>\n                    </tr>\n                </tbody>\n            </table>\n        </div>\n        <div class=\"calendar-time\" *ngIf=\"timePicker\">\n            <div class=\"select\">\n                <select class=\"select-item hourselect\" [disabled]=\"!endDate\" [(ngModel)]=\"timepickerVariables.right.selectedHour\" (ngModelChange)=\"timeChanged($event, sideEnum.right)\">\n                    <option *ngFor=\"let i of timepickerVariables.right.hours\"\n                    [value]=\"i\"\n                    [disabled]=\"timepickerVariables.right.disabledHours.indexOf(i) > -1\">{{i}}</option>\n                </select>\n                <span class=\"select-highlight\"></span>\n                <span class=\"select-bar\"></span>\n            </div>\n            <div class=\"select\">\n                <select class=\"select-item minuteselect\" [disabled]=\"!endDate\" [(ngModel)]=\"timepickerVariables.right.selectedMinute\" (ngModelChange)=\"timeChanged($event, sideEnum.right)\">\n                    <option *ngFor=\"let i of timepickerVariables.right.minutes; let index = index;\"\n                    [value]=\"i\"\n                    [disabled]=\"timepickerVariables.right.disabledMinutes.indexOf(i) > -1\">{{timepickerVariables.right.minutesLabel[index]}}</option>\n                </select>\n                <span class=\"select-highlight\"></span>\n                <span class=\"select-bar\"></span>\n            </div>\n            <div class=\"select\">\n                <select *ngIf=\"timePickerSeconds\" class=\"select-item secondselect\" [disabled]=\"!endDate\" [(ngModel)]=\"timepickerVariables.right.selectedSecond\" (ngModelChange)=\"timeChanged($event, sideEnum.right)\">\n                    <option *ngFor=\"let i of timepickerVariables.right.seconds; let index = index;\"\n                    [value]=\"i\"\n                    [disabled]=\"timepickerVariables.right.disabledSeconds.indexOf(i) > -1\">{{timepickerVariables.right.secondsLabel[index]}}</option>\n                </select>\n                <span class=\"select-highlight\"></span>\n                <span class=\"select-bar\"></span>\n            </div>\n            <div class=\"select\">\n                <select *ngIf=\"!timePicker24Hour\" class=\"select-item ampmselect\" [(ngModel)]=\"timepickerVariables.right.ampmModel\" (ngModelChange)=\"timeChanged($event, sideEnum.right)\">\n                    <option value=\"AM\" [disabled]=\"timepickerVariables.right.amDisabled\">AM</option>\n                    <option value=\"PM\"  [disabled]=\"timepickerVariables.right.pmDisabled\">PM</option>\n                </select>\n                <span class=\"select-highlight\"></span>\n                <span class=\"select-bar\"></span>\n            </div>\n        </div>\n    </div>\n    <div class=\"buttons\" *ngIf=\"!autoApply && ( !rangesArray.length || (showCalInRanges && !singleDatePicker))\">\n        <div class=\"buttons_input\">\n            <button  *ngIf=\"showClearButton\" class=\"mat-primary mat-stroked-button clear\" type=\"button\" (click)=\"clear()\" title=\"clear the date\">\n                <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"30\" height=\"30\" viewBox=\"0 -5 24 24\"><path d=\"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z\"/></svg>\n            </button>\n            <button class=\"mat-primary mat-stroked-button\" *ngIf=\"showCancel\" type=\"button\" (click)=\"clickCancel($event)\">{{locale.cancelLabel}}</button>\n            <button class=\"mat-primary mat-stroked-button\"  [disabled]=\"applyBtn.disabled\" type=\"button\" (click)=\"clickApply($event)\">{{locale.applyLabel}}</button>\n        </div>\n    </div>\n</div>\n",
                    host: {
                        '(click)': 'handleInternalClick($event)',
                    },
                    encapsulation: ViewEncapsulation.None,
                    providers: [{
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(function () { return DaterangepickerComponent; }),
                            multi: true
                        }],
                    styles: [".md-drppicker{position:absolute;border-radius:4px;width:278px;padding:4px;margin-top:-10px;overflow:hidden;z-index:1000;font-size:13px;box-shadow:0 2px 4px 0 rgba(0,0,0,.16),0 2px 8px 0 rgba(0,0,0,.12)}.md-drppicker.double{width:auto}.md-drppicker.inline{position:relative;display:inline-block}.md-drppicker:after,.md-drppicker:before{position:absolute;display:inline-block;content:''}.md-drppicker.openscenter:after,.md-drppicker.openscenter:before{left:0;right:0;width:0;margin-left:auto;margin-right:auto}.md-drppicker.single .calendar,.md-drppicker.single .ranges{float:none}.md-drppicker.shown{transform:scale(1);transition:.1s ease-in-out;transform-origin:0 0;-webkit-touch-callout:none;-webkit-user-select:none;user-select:none}.md-drppicker.shown.drops-up-left{transform-origin:100% 100%}.md-drppicker.shown.drops-up-right{transform-origin:0 100%}.md-drppicker.shown.drops-down-left{transform-origin:100% 0}.md-drppicker.shown.drops-down-right{transform-origin:0 0}.md-drppicker.shown.drops-down-center{transform-origin:NaN}.md-drppicker.shown.drops-up-center{transform-origin:50%}.md-drppicker.shown .calendar{display:block}.md-drppicker.hidden{transition:.1s;transform:scale(0);transform-origin:0 0;cursor:default;-webkit-touch-callout:none;-webkit-user-select:none;user-select:none}.md-drppicker.hidden.drops-up-left{transform-origin:100% 100%}.md-drppicker.hidden.drops-up-right{transform-origin:0 100%}.md-drppicker.hidden.drops-down-left{transform-origin:100% 0}.md-drppicker.hidden.drops-down-right{transform-origin:0 0}.md-drppicker.hidden.drops-down-center{transform-origin:NaN}.md-drppicker.hidden.drops-up-center{transform-origin:50%}.md-drppicker.hidden .calendar{display:none}.md-drppicker .calendar{max-width:270px;margin:4px}.md-drppicker .calendar.single .calendar-table{border:none}.md-drppicker .calendar td,.md-drppicker .calendar th{padding:0;white-space:nowrap;text-align:center;height:36px;width:36px}.md-drppicker .calendar td span,.md-drppicker .calendar th span{pointer-events:none}.md-drppicker .calendar-table{border-style:1px solid;padding:4px;border-radius:4px}.md-drppicker table{width:100%;margin:0}.md-drppicker td,.md-drppicker th{text-align:center;border-radius:4px;border-style:1px solid;white-space:nowrap;cursor:pointer;height:2em;width:2em}.md-drppicker td.available.prev,.md-drppicker th.available.prev{display:block;background-image:url(data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgMy43IDYiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDMuNyA2IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnPg0KCTxwYXRoIGQ9Ik0zLjcsMC43TDEuNCwzbDIuMywyLjNMMyw2TDAsM2wzLTNMMy43LDAuN3oiLz4NCjwvZz4NCjwvc3ZnPg0K);background-repeat:no-repeat;background-size:.5em;background-position:center;opacity:.8;transition:background-color .2s;border-radius:2em}.md-drppicker td.available.prev:hover,.md-drppicker th.available.prev:hover{margin:0}.md-drppicker td.available.next,.md-drppicker th.available.next{transform:rotate(180deg);display:block;background-image:url(data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgMy43IDYiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDMuNyA2IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnPg0KCTxwYXRoIGQ9Ik0zLjcsMC43TDEuNCwzbDIuMywyLjNMMyw2TDAsM2wzLTNMMy43LDAuN3oiLz4NCjwvZz4NCjwvc3ZnPg0K);background-repeat:no-repeat;background-size:.5em;background-position:center;opacity:.8;transition:background-color .2s;border-radius:2em}.md-drppicker td.available.next:hover,.md-drppicker th.available.next:hover{margin:0;transform:rotate(180deg)}.md-drppicker td.available:hover,.md-drppicker th.available:hover{background-repeat:no-repeat;background-size:.5em;background-position:center;margin:.25em 0;opacity:.8;border-radius:2em;transform:scale(1);transition:450ms cubic-bezier(.23,1,.32,1) 0}.md-drppicker td.week,.md-drppicker th.week{font-size:80%}.md-drppicker td{margin:.25em 0;opacity:.8;transition:450ms cubic-bezier(.23,1,.32,1) 0;border-radius:2em;transform:scale(1)}.md-drppicker td.in-range{border-radius:0}.md-drppicker td.start-date{border-radius:2em 0 0 2em}.md-drppicker td.end-date{border-radius:0 2em 2em 0}.md-drppicker td.start-date.end-date{border-radius:4px}.md-drppicker th.month{width:auto}.md-drppicker option.disabled,.md-drppicker td.disabled{cursor:not-allowed;text-decoration:line-through}.md-drppicker .dropdowns{background-repeat:no-repeat;background-size:10px;background-position-y:center;background-position-x:right;width:50px;background-image:url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDI1NSAyNTUiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDI1NSAyNTU7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8ZyBpZD0iYXJyb3ctZHJvcC1kb3duIj4KCQk8cG9seWdvbiBwb2ludHM9IjAsNjMuNzUgMTI3LjUsMTkxLjI1IDI1NSw2My43NSAgICIgZmlsbD0iIzk4OGM4YyIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=)}.md-drppicker .dropdowns select{display:inline-block;width:100%;padding:5px;border:1px solid;border-radius:2px;height:3rem}.md-drppicker .dropdowns select.ampmselect,.md-drppicker .dropdowns select.hourselect,.md-drppicker .dropdowns select.minuteselect,.md-drppicker .dropdowns select.secondselect{width:50px;margin:0 auto;border-style:1px solid;padding:2px;outline:0;font-size:12px}.md-drppicker .dropdowns select.monthselect,.md-drppicker .dropdowns select.yearselect{font-size:12px;height:auto;cursor:pointer;opacity:0;position:absolute;top:0;left:0;margin:0;padding:0}.md-drppicker th.month>div{position:relative;display:inline-block}.md-drppicker .calendar-time{text-align:center;margin:4px auto 0;line-height:30px;position:relative}.md-drppicker .calendar-time .select{display:inline}.md-drppicker .calendar-time .select .select-item{display:inline-block;width:auto;position:relative;font-family:inherit;background-color:transparent;padding:10px 10px 10px 0;font-size:18px;border-radius:0;border:none;border-bottom-style:1px solid}.md-drppicker .calendar-time .select .select-item:after{position:absolute;top:18px;right:10px;width:0;height:0;padding:0;content:'';border-left:6px solid transparent;border-right:6px solid transparent;border-top:6px solid rgba(0,0,0,.12);pointer-events:none}.md-drppicker .calendar-time .select .select-item:focus{outline:0}.md-drppicker .calendar-time .select .select-item .select-label{font-size:16px;font-weight:400;position:absolute;pointer-events:none;left:0;top:10px;transition:.2s}.md-drppicker .calendar-time select.disabled{cursor:not-allowed}.md-drppicker .label-input{border-style:1px solid;border-radius:4px;height:30px;line-height:30px;display:block;vertical-align:middle;margin:0 auto 5px;padding:0 0 0 28px;width:100%}.md-drppicker .label-input.active{border-style:1px solid;border-radius:4px}.md-drppicker .md-drppicker_input{position:relative;padding:0 30px 0 0}.md-drppicker .md-drppicker_input i,.md-drppicker .md-drppicker_input svg{position:absolute;left:8px;top:8px}.md-drppicker.rtl .label-input{padding-right:28px;padding-left:6px}.md-drppicker.rtl .md-drppicker_input i,.md-drppicker.rtl .md-drppicker_input svg{left:auto;right:8px}.md-drppicker .show-ranges .drp-calendar.left{border-left-style:1px solid}.md-drppicker .ranges{float:none;text-align:left;margin:0}.md-drppicker .ranges ul{list-style:none;margin:0 auto;padding:0;width:100%}.md-drppicker .ranges ul li{font-size:12px}.md-drppicker .ranges ul li button{padding:8px 12px;width:100%;background:0 0;border:none;text-align:left;cursor:pointer}.md-drppicker .ranges ul li button[disabled]{opacity:.3}.md-drppicker .ranges ul li button:active{background:0 0}.md-drppicker .show-calendar .ranges{margin-top:8px}.md-drppicker [hidden]{display:none}.md-drppicker .buttons{text-align:right;margin:0 5px 5px 0}.md-drppicker .btn{position:relative;overflow:hidden;border-width:0;outline:0;padding:0 6px;cursor:pointer;border-radius:2px;box-shadow:0 1px 4px rgba(0,0,0,.6);color:#ecf0f1;transition:background-color .4s;height:auto;text-transform:uppercase;line-height:36px;border:none}.md-drppicker .btn>*{position:relative}.md-drppicker .btn span{display:block;padding:12px 24px}.md-drppicker .btn:before{content:\"\";position:absolute;top:50%;left:50%;display:block;width:0;padding-top:0;border-radius:100%;transform:translate(-50%,-50%)}.md-drppicker .btn:active:before{width:120%;padding-top:120%;transition:width .2s ease-out,padding-top .2s ease-out}.md-drppicker .btn:disabled{opacity:.5}.md-drppicker .clear{box-shadow:none}.md-drppicker .clear svg{fill:currentColor}@media (min-width:564px){.md-drppicker{width:auto}.md-drppicker.single .calendar.left{clear:none}.md-drppicker.ltr{direction:ltr;text-align:left}.md-drppicker.ltr .calendar.left{clear:left}.md-drppicker.ltr .calendar.left .calendar-table{border-right:none;border-top-right-radius:0;border-bottom-right-radius:0;padding-right:12px}.md-drppicker.ltr .calendar.right{margin-left:0}.md-drppicker.ltr .calendar.right .calendar-table{border-left:none;border-top-left-radius:0;border-bottom-left-radius:0}.md-drppicker.ltr .left .md-drppicker_input,.md-drppicker.ltr .right .md-drppicker_input{padding-right:35px}.md-drppicker.ltr .calendar,.md-drppicker.ltr .ranges{float:left}.md-drppicker.rtl{direction:rtl;text-align:right}.md-drppicker.rtl .calendar.left{clear:right;margin-left:0}.md-drppicker.rtl .calendar.left .calendar-table{border-left:none;border-top-left-radius:0;border-bottom-left-radius:0}.md-drppicker.rtl .calendar.right{margin-right:0}.md-drppicker.rtl .calendar.right .calendar-table{border-right:none;border-top-right-radius:0;border-bottom-right-radius:0}.md-drppicker.rtl .calendar.left .calendar-table,.md-drppicker.rtl .left .md-drppicker_input{padding-left:12px}.md-drppicker.rtl .calendar,.md-drppicker.rtl .ranges{text-align:right;float:right}.drp-animate{transform:translate(0);transition:transform .2s,opacity .2s}.drp-animate.drp-picker-site-this{transition-timing-function:linear}.drp-animate.drp-animate-right{transform:translateX(10%);opacity:0}.drp-animate.drp-animate-left{transform:translateX(-10%);opacity:0}}@media (min-width:730px){.md-drppicker .ranges{width:auto}.md-drppicker.ltr .ranges{float:left}.md-drppicker.rtl .ranges{float:right}.md-drppicker .calendar.left{clear:none!important}}"]
                }] }
    ];
    DaterangepickerComponent.ctorParameters = function () { return [
        { type: ChangeDetectorRef }
    ]; };
    DaterangepickerComponent.propDecorators = {
        dateLimit: [{ type: Input }],
        minDate: [{ type: Input }],
        maxDate: [{ type: Input }],
        autoApply: [{ type: Input }],
        singleDatePicker: [{ type: Input }],
        showDropdowns: [{ type: Input }],
        showISOWeekNumbers: [{ type: Input }],
        linkedCalendars: [{ type: Input }],
        autoUpdateInput: [{ type: Input }],
        alwaysShowCalendars: [{ type: Input }],
        maxSpan: [{ type: Input }],
        timePicker: [{ type: Input }],
        timePicker24Hour: [{ type: Input }],
        timePickerIncrement: [{ type: Input }],
        timePickerSeconds: [{ type: Input }],
        showClearButton: [{ type: Input }],
        firstMonthDayClass: [{ type: Input }],
        lastMonthDayClass: [{ type: Input }],
        emptyWeekRowClass: [{ type: Input }],
        firstDayOfNextMonthClass: [{ type: Input }],
        lastDayOfPreviousMonthClass: [{ type: Input }],
        locale: [{ type: Input }],
        ranges: [{ type: Input }],
        showCustomRangeLabel: [{ type: Input }],
        showCancel: [{ type: Input }],
        keepCalendarOpeningWithRange: [{ type: Input }],
        showRangeLabelOnInput: [{ type: Input }],
        drops: [{ type: Input }],
        opens: [{ type: Input }],
        choosedDate: [{ type: Output }],
        rangeClicked: [{ type: Output }],
        datesUpdated: [{ type: Output }],
        pickerContainer: [{ type: ViewChild, args: ['pickerContainer', { static: false },] }],
        isInvalidDate: [{ type: Input }],
        isCustomDate: [{ type: Input }]
    };
    tslib_1.__decorate([
        InputConverter(),
        tslib_1.__metadata("design:type", Boolean)
    ], DaterangepickerComponent.prototype, "showWeekNumbers", void 0);
    return DaterangepickerComponent;
}());
export { DaterangepickerComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiby1kYXRlcmFuZ2UtcGlja2VyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL29udGltaXplLXdlYi1uZ3gvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy9pbnB1dC9kYXRlLXJhbmdlL28tZGF0ZXJhbmdlLXBpY2tlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFDTCxpQkFBaUIsRUFDakIsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osVUFBVSxFQUNWLEtBQUssRUFFTCxNQUFNLEVBQ04sU0FBUyxFQUNULGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsV0FBVyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDaEUsT0FBTyxLQUFLLE9BQU8sTUFBTSxRQUFRLENBQUM7QUFFbEMsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBRXJFLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQztBQUV2QixNQUFNLENBQU4sSUFBWSxRQUdYO0FBSEQsV0FBWSxRQUFRO0lBQ2xCLHlCQUFhLENBQUE7SUFDYiwyQkFBZSxDQUFBO0FBQ2pCLENBQUMsRUFIVyxRQUFRLEtBQVIsUUFBUSxRQUduQjtBQUVEO0lBZ0hFLGtDQUNVLElBQXVCO1FBQXZCLFNBQUksR0FBSixJQUFJLENBQW1CO1FBbEd6QixTQUFJLEdBQTZCLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUM7UUFFcEUsc0JBQWlCLEdBQThCLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLENBQUM7UUFDdkUsd0JBQW1CLEdBQThCLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLENBQUM7UUFDekUsb0JBQWUsR0FBNkMsRUFBRSxLQUFLLEVBQUUsSUFBSSxXQUFXLEVBQUUs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QUUsTUFBTSxFQUFFLEtBQUssRUFBRTtnQ0FtWjlDLEtBQUs7K0JBSUwsS0FBSzs7SUE5ZE47UUFEQyxjQUFjLEVBQUU7O3FFQUNnQjtJQStrQ25DLCtCQUFDO0NBQUEsQUF0bkNELElBc25DQztTQXhtQ1ksd0JBQXdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBJbnB1dCxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgRm9ybUNvbnRyb2wsIE5HX1ZBTFVFX0FDQ0VTU09SIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0ICogYXMgX21vbWVudCBmcm9tICdtb21lbnQnO1xuXG5pbXBvcnQgeyBJbnB1dENvbnZlcnRlciB9IGZyb20gJy4uLy4uLy4uL2RlY29yYXRvcnMvaW5wdXQtY29udmVydGVyJztcblxuY29uc3QgbW9tZW50ID0gX21vbWVudDtcblxuZXhwb3J0IGVudW0gU2lkZUVudW0ge1xuICBsZWZ0ID0gJ2xlZnQnLFxuICByaWdodCA9ICdyaWdodCdcbn1cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnby1kYXRlcmFuZ2UtcGlja2VyJyxcbiAgc3R5bGVVcmxzOiBbJy4vby1kYXRlcmFuZ2UtcGlja2VyLmNvbXBvbmVudC5zY3NzJ10sXG4gIHRlbXBsYXRlVXJsOiAnLi9vLWRhdGVyYW5nZS1waWNrZXIuY29tcG9uZW50Lmh0bWwnLFxuICBob3N0OiB7XG4gICAgJyhjbGljayknOiAnaGFuZGxlSW50ZXJuYWxDbGljaygkZXZlbnQpJyxcbiAgfSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgcHJvdmlkZXJzOiBbe1xuICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IERhdGVyYW5nZXBpY2tlckNvbXBvbmVudCksXG4gICAgbXVsdGk6IHRydWVcbiAgfV1cbn0pXG5leHBvcnQgY2xhc3MgRGF0ZXJhbmdlcGlja2VyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgcHJpdmF0ZSBfb2xkOiB7IHN0YXJ0OiBhbnksIGVuZDogYW55IH0gPSB7IHN0YXJ0OiBudWxsLCBlbmQ6IG51bGwgfTtcbiAgY2hvc2VuTGFiZWw6IHN0cmluZztcbiAgY2FsZW5kYXJWYXJpYWJsZXM6IHsgbGVmdDogYW55LCByaWdodDogYW55IH0gPSB7IGxlZnQ6IHt9LCByaWdodDoge30gfTtcbiAgdGltZXBpY2tlclZhcmlhYmxlczogeyBsZWZ0OiBhbnksIHJpZ2h0OiBhbnkgfSA9IHsgbGVmdDoge30sIHJpZ2h0OiB7fSB9O1xuICBkYXRlcmFuZ2VwaWNrZXI6IHsgc3RhcnQ6IEZvcm1Db250cm9sLCBlbmQ6IEZvcm1Db250cm9sIH0gPSB7IHN0YXJ0OiBuZXcgRm9ybUNvbnRyb2woKSwgZW5kOiBuZXcgRm9ybUNvbnRyb2woKSB9O1xuICBhcHBseUJ0bjogeyBkaXNhYmxlZDogYm9vbGVhbiB9ID0geyBkaXNhYmxlZDogZmFsc2UgfTtcbiAgc3RhcnREYXRlID0gbW9tZW50KCkuc3RhcnRPZignZGF5Jyk7XG4gIGVuZERhdGUgPSBtb21lbnQoKS5lbmRPZignZGF5Jyk7XG4gIEBJbnB1dCgpXG4gIGRhdGVMaW1pdDogbnVtYmVyID0gbnVsbDtcbiAgLy8gdXNlZCBpbiB0ZW1wbGF0ZSBmb3IgY29tcGlsZSB0aW1lIHN1cHBvcnQgb2YgZW51bSB2YWx1ZXMuXG4gIHNpZGVFbnVtID0gU2lkZUVudW07XG5cbiAgQElucHV0KClcbiAgbWluRGF0ZTogX21vbWVudC5Nb21lbnQgPSBudWxsO1xuICBASW5wdXQoKVxuICBtYXhEYXRlOiBfbW9tZW50Lk1vbWVudCA9IG51bGw7XG4gIEBJbnB1dCgpXG4gIGF1dG9BcHBseTogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKVxuICBzaW5nbGVEYXRlUGlja2VyOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpXG4gIHNob3dEcm9wZG93bnM6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0Q29udmVydGVyKClcbiAgc2hvd1dlZWtOdW1iZXJzOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpXG4gIHNob3dJU09XZWVrTnVtYmVyczogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKVxuICBsaW5rZWRDYWxlbmRhcnM6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0KClcbiAgYXV0b1VwZGF0ZUlucHV0OiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0KClcbiAgYWx3YXlzU2hvd0NhbGVuZGFyczogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKVxuICBtYXhTcGFuOiBib29sZWFuID0gZmFsc2U7XG4gIC8vIHRpbWVwaWNrZXIgdmFyaWFibGVzXG4gIEBJbnB1dCgpXG4gIHRpbWVQaWNrZXI6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0KClcbiAgdGltZVBpY2tlcjI0SG91cjogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKVxuICB0aW1lUGlja2VySW5jcmVtZW50OiBudW1iZXIgPSAxO1xuICBASW5wdXQoKVxuICB0aW1lUGlja2VyU2Vjb25kczogYm9vbGVhbiA9IGZhbHNlO1xuICAvLyBlbmQgb2YgdGltZXBpY2tlciB2YXJpYWJsZXNcbiAgQElucHV0KClcbiAgc2hvd0NsZWFyQnV0dG9uOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpXG4gIGZpcnN0TW9udGhEYXlDbGFzczogc3RyaW5nID0gbnVsbDtcbiAgQElucHV0KClcbiAgbGFzdE1vbnRoRGF5Q2xhc3M6IHN0cmluZyA9IG51bGw7XG4gIEBJbnB1dCgpXG4gIGVtcHR5V2Vla1Jvd0NsYXNzOiBzdHJpbmcgPSBudWxsO1xuICBASW5wdXQoKVxuICBmaXJzdERheU9mTmV4dE1vbnRoQ2xhc3M6IHN0cmluZyA9IG51bGw7XG4gIEBJbnB1dCgpXG4gIGxhc3REYXlPZlByZXZpb3VzTW9udGhDbGFzczogc3RyaW5nID0gbnVsbDtcblxuICBASW5wdXQoKVxuICBsb2NhbGU6IGFueTtcbiAgLy8gY3VzdG9tIHJhbmdlc1xuICBfcmFuZ2VzOiBhbnkgPSB7fTtcblxuICBASW5wdXQoKSBzZXQgcmFuZ2VzKHZhbHVlKSB7XG4gICAgdGhpcy5fcmFuZ2VzID0gdmFsdWU7XG4gICAgdGhpcy5yZW5kZXJSYW5nZXMoKTtcbiAgfVxuICBnZXQgcmFuZ2VzKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuX3JhbmdlcztcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIHNob3dDdXN0b21SYW5nZUxhYmVsOiBib29sZWFuO1xuICBASW5wdXQoKVxuICBzaG93Q2FuY2VsOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpXG4gIGtlZXBDYWxlbmRhck9wZW5pbmdXaXRoUmFuZ2U6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0KClcbiAgc2hvd1JhbmdlTGFiZWxPbklucHV0OiBib29sZWFuID0gZmFsc2U7XG4gIGNob3NlblJhbmdlOiBzdHJpbmc7XG4gIHJhbmdlc0FycmF5OiBBcnJheTxhbnk+ID0gW107XG5cbiAgLy8gc29tZSBzdGF0ZSBpbmZvcm1hdGlvblxuICBpc1Nob3duOiBib29sZWFuID0gZmFsc2U7XG4gIGlubGluZTogYm9vbGVhbiA9IHRydWU7XG4gIGxlZnRDYWxlbmRhcjogYW55ID0ge307XG4gIHJpZ2h0Q2FsZW5kYXI6IGFueSA9IHt9O1xuICBzaG93Q2FsSW5SYW5nZXM6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBvcHRpb25zOiBhbnkgPSB7fTsgLy8gc2hvdWxkIGdldCBzb21lIG9wdCBmcm9tIHVzZXJcbiAgQElucHV0KCkgZHJvcHM6IHN0cmluZztcbiAgQElucHV0KCkgb3BlbnM6IHN0cmluZztcbiAgQE91dHB1dCgpIGNob29zZWREYXRlOiBFdmVudEVtaXR0ZXI8b2JqZWN0PjtcbiAgQE91dHB1dCgpIHJhbmdlQ2xpY2tlZDogRXZlbnRFbWl0dGVyPG9iamVjdD47XG4gIEBPdXRwdXQoKSBkYXRlc1VwZGF0ZWQ6IEV2ZW50RW1pdHRlcjxvYmplY3Q+O1xuICBAVmlld0NoaWxkKCdwaWNrZXJDb250YWluZXInLCB7IHN0YXRpYzogZmFsc2UgfSkgcGlja2VyQ29udGFpbmVyOiBFbGVtZW50UmVmO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX3JlZjogQ2hhbmdlRGV0ZWN0b3JSZWZcbiAgKSB7XG4gICAgdGhpcy5jaG9vc2VkRGF0ZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICB0aGlzLnJhbmdlQ2xpY2tlZCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICB0aGlzLmRhdGVzVXBkYXRlZCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuX2J1aWxkTG9jYWxlKCk7XG4gICAgY29uc3QgZGF5c09mV2VlayA9IFsuLi50aGlzLmxvY2FsZS5kYXlzT2ZXZWVrXTtcbiAgICBpZiAodGhpcy5sb2NhbGUuZmlyc3REYXkgIT09IDApIHtcbiAgICAgIGxldCBpdGVyYXRvciA9IHRoaXMubG9jYWxlLmZpcnN0RGF5O1xuXG4gICAgICB3aGlsZSAoaXRlcmF0b3IgPiAwKSB7XG4gICAgICAgIGRheXNPZldlZWsucHVzaChkYXlzT2ZXZWVrLnNoaWZ0KCkpO1xuICAgICAgICBpdGVyYXRvci0tO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmxvY2FsZS5kYXlzT2ZXZWVrID0gZGF5c09mV2VlaztcbiAgICBpZiAodGhpcy5pbmxpbmUpIHtcbiAgICAgIHRoaXMuX29sZC5zdGFydCA9IHRoaXMuc3RhcnREYXRlLmNsb25lKCk7XG4gICAgICB0aGlzLl9vbGQuZW5kID0gdGhpcy5lbmREYXRlLmNsb25lKCk7XG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGVNb250aHNJblZpZXcoKTtcbiAgICB0aGlzLnJlbmRlckNhbGVuZGFyKFNpZGVFbnVtLmxlZnQpO1xuICAgIHRoaXMucmVuZGVyQ2FsZW5kYXIoU2lkZUVudW0ucmlnaHQpO1xuICAgIHRoaXMucmVuZGVyUmFuZ2VzKCk7XG4gIH1cbiAgcmVuZGVyUmFuZ2VzKCkge1xuICAgIHRoaXMucmFuZ2VzQXJyYXkgPSBbXTtcbiAgICBsZXQgc3RhcnQ7XG4gICAgbGV0IGVuZDtcbiAgICBpZiAodHlwZW9mIHRoaXMucmFuZ2VzID09PSAnb2JqZWN0Jykge1xuICAgICAgZm9yIChjb25zdCByYW5nZSBpbiB0aGlzLnJhbmdlcykge1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMucmFuZ2VzW3JhbmdlXVswXSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICBzdGFydCA9IG1vbWVudCh0aGlzLnJhbmdlc1tyYW5nZV1bMF0sIHRoaXMubG9jYWxlLmZvcm1hdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3RhcnQgPSBtb21lbnQodGhpcy5yYW5nZXNbcmFuZ2VdWzBdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5yYW5nZXNbcmFuZ2VdWzFdID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIGVuZCA9IG1vbWVudCh0aGlzLnJhbmdlc1tyYW5nZV1bMV0sIHRoaXMubG9jYWxlLmZvcm1hdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZW5kID0gbW9tZW50KHRoaXMucmFuZ2VzW3JhbmdlXVsxXSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiB0aGUgc3RhcnQgb3IgZW5kIGRhdGUgZXhjZWVkIHRob3NlIGFsbG93ZWQgYnkgdGhlIG1pbkRhdGUgb3IgbWF4U3BhblxuICAgICAgICAvLyBvcHRpb25zLCBzaG9ydGVuIHRoZSByYW5nZSB0byB0aGUgYWxsb3dhYmxlIHBlcmlvZC5cbiAgICAgICAgaWYgKHRoaXMubWluRGF0ZSAmJiBzdGFydC5pc0JlZm9yZSh0aGlzLm1pbkRhdGUpKSB7XG4gICAgICAgICAgc3RhcnQgPSB0aGlzLm1pbkRhdGUuY2xvbmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBtYXhEYXRlID0gdGhpcy5tYXhEYXRlO1xuICAgICAgICBpZiAodGhpcy5tYXhTcGFuICYmIG1heERhdGUgJiYgc3RhcnQuY2xvbmUoKS5hZGQodGhpcy5tYXhTcGFuKS5pc0FmdGVyKG1heERhdGUpKSB7XG4gICAgICAgICAgbWF4RGF0ZSA9IHN0YXJ0LmNsb25lKCkuYWRkKHRoaXMubWF4U3Bhbik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1heERhdGUgJiYgZW5kLmlzQWZ0ZXIobWF4RGF0ZSkpIHtcbiAgICAgICAgICBlbmQgPSBtYXhEYXRlLmNsb25lKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiB0aGUgZW5kIG9mIHRoZSByYW5nZSBpcyBiZWZvcmUgdGhlIG1pbmltdW0gb3IgdGhlIHN0YXJ0IG9mIHRoZSByYW5nZSBpc1xuICAgICAgICAvLyBhZnRlciB0aGUgbWF4aW11bSwgZG9uJ3QgZGlzcGxheSB0aGlzIHJhbmdlIG9wdGlvbiBhdCBhbGwuXG4gICAgICAgIGlmICgodGhpcy5taW5EYXRlICYmIGVuZC5pc0JlZm9yZSh0aGlzLm1pbkRhdGUsIHRoaXMudGltZVBpY2tlciA/ICdtaW51dGUnIDogJ2RheScpKVxuICAgICAgICAgIHx8IChtYXhEYXRlICYmIHN0YXJ0LmlzQWZ0ZXIobWF4RGF0ZSwgdGhpcy50aW1lUGlja2VyID8gJ21pbnV0ZScgOiAnZGF5JykpKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICAvL1N1cHBvcnQgdW5pY29kZSBjaGFycyBpbiB0aGUgcmFuZ2UgbmFtZXMuXG4gICAgICAgIGxldCBlbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKTtcbiAgICAgICAgZWxlbS5pbm5lckhUTUwgPSByYW5nZTtcbiAgICAgICAgbGV0IHJhbmdlSHRtbCA9IGVsZW0udmFsdWU7XG5cbiAgICAgICAgdGhpcy5yYW5nZXNbcmFuZ2VIdG1sXSA9IFtzdGFydCwgZW5kXTtcbiAgICAgIH1cbiAgICAgIGZvciAoY29uc3QgcmFuZ2UgaW4gdGhpcy5yYW5nZXMpIHtcbiAgICAgICAgdGhpcy5yYW5nZXNBcnJheS5wdXNoKHJhbmdlKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnNob3dDdXN0b21SYW5nZUxhYmVsKSB7XG4gICAgICAgIHRoaXMucmFuZ2VzQXJyYXkucHVzaCh0aGlzLmxvY2FsZS5jdXN0b21SYW5nZUxhYmVsKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2hvd0NhbEluUmFuZ2VzID0gKCF0aGlzLnJhbmdlc0FycmF5Lmxlbmd0aCkgfHwgdGhpcy5hbHdheXNTaG93Q2FsZW5kYXJzO1xuICAgICAgaWYgKCF0aGlzLnRpbWVQaWNrZXIpIHtcbiAgICAgICAgdGhpcy5zdGFydERhdGUgPSB0aGlzLnN0YXJ0RGF0ZS5zdGFydE9mKCdkYXknKTtcbiAgICAgICAgdGhpcy5lbmREYXRlID0gdGhpcy5lbmREYXRlLmVuZE9mKCdkYXknKTtcbiAgICAgIH1cbiAgICAgIC8vIGNhbid0IGJlIHVzZWQgdG9nZXRoZXIgZm9yIG5vd1xuICAgICAgaWYgKHRoaXMudGltZVBpY2tlciAmJiB0aGlzLmF1dG9BcHBseSkge1xuICAgICAgICB0aGlzLmF1dG9BcHBseSA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlbmRlclRpbWVQaWNrZXIoc2lkZTogU2lkZUVudW0pIHtcbiAgICBpZiAoc2lkZSA9PT0gU2lkZUVudW0ucmlnaHQgJiYgIXRoaXMuZW5kRGF0ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsZXQgc2VsZWN0ZWQ7XG4gICAgbGV0IG1pbkRhdGU7XG4gICAgY29uc3QgbWF4RGF0ZSA9IHRoaXMubWF4RGF0ZTtcbiAgICBpZiAoc2lkZSA9PT0gU2lkZUVudW0ubGVmdCkge1xuICAgICAgc2VsZWN0ZWQgPSB0aGlzLnN0YXJ0RGF0ZS5jbG9uZSgpO1xuICAgICAgbWluRGF0ZSA9IHRoaXMubWluRGF0ZTtcbiAgICB9IGVsc2UgaWYgKHNpZGUgPT09IFNpZGVFbnVtLnJpZ2h0KSB7XG4gICAgICBzZWxlY3RlZCA9IHRoaXMuZW5kRGF0ZS5jbG9uZSgpO1xuICAgICAgbWluRGF0ZSA9IHRoaXMuc3RhcnREYXRlO1xuICAgIH1cbiAgICBjb25zdCBzdGFydCA9IHRoaXMudGltZVBpY2tlcjI0SG91ciA/IDAgOiAxO1xuICAgIGNvbnN0IGVuZCA9IHRoaXMudGltZVBpY2tlcjI0SG91ciA/IDIzIDogMTI7XG4gICAgdGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdID0ge1xuICAgICAgaG91cnM6IFtdLFxuICAgICAgbWludXRlczogW10sXG4gICAgICBtaW51dGVzTGFiZWw6IFtdLFxuICAgICAgc2Vjb25kczogW10sXG4gICAgICBzZWNvbmRzTGFiZWw6IFtdLFxuICAgICAgZGlzYWJsZWRIb3VyczogW10sXG4gICAgICBkaXNhYmxlZE1pbnV0ZXM6IFtdLFxuICAgICAgZGlzYWJsZWRTZWNvbmRzOiBbXSxcbiAgICAgIHNlbGVjdGVkSG91cjogMCxcbiAgICAgIHNlbGVjdGVkTWludXRlOiAwLFxuICAgICAgc2VsZWN0ZWRTZWNvbmQ6IDAsXG4gICAgfTtcbiAgICAvLyBnZW5lcmF0ZSBob3Vyc1xuICAgIGZvciAobGV0IGkgPSBzdGFydDsgaSA8PSBlbmQ7IGkrKykge1xuICAgICAgbGV0IGlfaW5fMjQgPSBpO1xuICAgICAgaWYgKCF0aGlzLnRpbWVQaWNrZXIyNEhvdXIpIHtcbiAgICAgICAgaV9pbl8yNCA9IHNlbGVjdGVkLmhvdXIoKSA+PSAxMiA/IChpID09PSAxMiA/IDEyIDogaSArIDEyKSA6IChpID09PSAxMiA/IDAgOiBpKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgdGltZSA9IHNlbGVjdGVkLmNsb25lKCkuaG91cihpX2luXzI0KTtcbiAgICAgIGxldCBkaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgaWYgKG1pbkRhdGUgJiYgdGltZS5taW51dGUoNTkpLmlzQmVmb3JlKG1pbkRhdGUpKSB7XG4gICAgICAgIGRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGlmIChtYXhEYXRlICYmIHRpbWUubWludXRlKDApLmlzQWZ0ZXIobWF4RGF0ZSkpIHtcbiAgICAgICAgZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uaG91cnMucHVzaChpKTtcbiAgICAgIGlmIChpX2luXzI0ID09PSBzZWxlY3RlZC5ob3VyKCkgJiYgIWRpc2FibGVkKSB7XG4gICAgICAgIHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5zZWxlY3RlZEhvdXIgPSBpO1xuICAgICAgfSBlbHNlIGlmIChkaXNhYmxlZCkge1xuICAgICAgICB0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uZGlzYWJsZWRIb3Vycy5wdXNoKGkpO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBnZW5lcmF0ZSBtaW51dGVzXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA2MDsgaSArPSB0aGlzLnRpbWVQaWNrZXJJbmNyZW1lbnQpIHtcbiAgICAgIGNvbnN0IHBhZGRlZCA9IGkgPCAxMCA/ICcwJyArIGkgOiBpO1xuICAgICAgY29uc3QgdGltZSA9IHNlbGVjdGVkLmNsb25lKCkubWludXRlKGkpO1xuXG4gICAgICBsZXQgZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgIGlmIChtaW5EYXRlICYmIHRpbWUuc2Vjb25kKDU5KS5pc0JlZm9yZShtaW5EYXRlKSkge1xuICAgICAgICBkaXNhYmxlZCA9IHRydWU7XG4gICAgICB9XG4gICAgICBpZiAobWF4RGF0ZSAmJiB0aW1lLnNlY29uZCgwKS5pc0FmdGVyKG1heERhdGUpKSB7XG4gICAgICAgIGRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5taW51dGVzLnB1c2goaSk7XG4gICAgICB0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0ubWludXRlc0xhYmVsLnB1c2gocGFkZGVkKTtcbiAgICAgIGlmIChzZWxlY3RlZC5taW51dGUoKSA9PT0gaSAmJiAhZGlzYWJsZWQpIHtcbiAgICAgICAgdGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnNlbGVjdGVkTWludXRlID0gaTtcbiAgICAgIH0gZWxzZSBpZiAoZGlzYWJsZWQpIHtcbiAgICAgICAgdGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLmRpc2FibGVkTWludXRlcy5wdXNoKGkpO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBnZW5lcmF0ZSBzZWNvbmRzXG4gICAgaWYgKHRoaXMudGltZVBpY2tlclNlY29uZHMpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNjA7IGkrKykge1xuICAgICAgICBjb25zdCBwYWRkZWQgPSBpIDwgMTAgPyAnMCcgKyBpIDogaTtcbiAgICAgICAgY29uc3QgdGltZSA9IHNlbGVjdGVkLmNsb25lKCkuc2Vjb25kKGkpO1xuXG4gICAgICAgIGxldCBkaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICBpZiAobWluRGF0ZSAmJiB0aW1lLmlzQmVmb3JlKG1pbkRhdGUpKSB7XG4gICAgICAgICAgZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtYXhEYXRlICYmIHRpbWUuaXNBZnRlcihtYXhEYXRlKSkge1xuICAgICAgICAgIGRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5zZWNvbmRzLnB1c2goaSk7XG4gICAgICAgIHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5zZWNvbmRzTGFiZWwucHVzaChwYWRkZWQpO1xuICAgICAgICBpZiAoc2VsZWN0ZWQuc2Vjb25kKCkgPT09IGkgJiYgIWRpc2FibGVkKSB7XG4gICAgICAgICAgdGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnNlbGVjdGVkU2Vjb25kID0gaTtcbiAgICAgICAgfSBlbHNlIGlmIChkaXNhYmxlZCkge1xuICAgICAgICAgIHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5kaXNhYmxlZFNlY29uZHMucHVzaChpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICAvLyBnZW5lcmF0ZSBBTS9QTVxuICAgIGlmICghdGhpcy50aW1lUGlja2VyMjRIb3VyKSB7XG5cbiAgICAgIGlmIChtaW5EYXRlICYmIHNlbGVjdGVkLmNsb25lKCkuaG91cigxMikubWludXRlKDApLnNlY29uZCgwKS5pc0JlZm9yZShtaW5EYXRlKSkge1xuICAgICAgICB0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uYW1EaXNhYmxlZCA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChtYXhEYXRlICYmIHNlbGVjdGVkLmNsb25lKCkuaG91cigwKS5taW51dGUoMCkuc2Vjb25kKDApLmlzQWZ0ZXIobWF4RGF0ZSkpIHtcbiAgICAgICAgdGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnBtRGlzYWJsZWQgPSB0cnVlO1xuICAgICAgfVxuICAgICAgaWYgKHNlbGVjdGVkLmhvdXIoKSA+PSAxMikge1xuICAgICAgICB0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uYW1wbU1vZGVsID0gJ1BNJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5hbXBtTW9kZWwgPSAnQU0nO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uc2VsZWN0ZWQgPSBzZWxlY3RlZDtcbiAgfVxuXG4gIHJlbmRlckNhbGVuZGFyKHNpZGU6IFNpZGVFbnVtKSB7IC8vIHNpZGUgZW51bVxuICAgIGNvbnN0IG1haW5DYWxlbmRhcjogYW55ID0gKHNpZGUgPT09IFNpZGVFbnVtLmxlZnQpID8gdGhpcy5sZWZ0Q2FsZW5kYXIgOiB0aGlzLnJpZ2h0Q2FsZW5kYXI7XG4gICAgY29uc3QgbW9udGggPSBtYWluQ2FsZW5kYXIubW9udGgubW9udGgoKTtcbiAgICBjb25zdCB5ZWFyID0gbWFpbkNhbGVuZGFyLm1vbnRoLnllYXIoKTtcbiAgICBjb25zdCBob3VyID0gbWFpbkNhbGVuZGFyLm1vbnRoLmhvdXIoKTtcbiAgICBjb25zdCBtaW51dGUgPSBtYWluQ2FsZW5kYXIubW9udGgubWludXRlKCk7XG4gICAgY29uc3Qgc2Vjb25kID0gbWFpbkNhbGVuZGFyLm1vbnRoLnNlY29uZCgpO1xuICAgIGNvbnN0IGRheXNJbk1vbnRoID0gbW9tZW50KFt5ZWFyLCBtb250aF0pLmRheXNJbk1vbnRoKCk7XG4gICAgY29uc3QgZmlyc3REYXkgPSBtb21lbnQoW3llYXIsIG1vbnRoLCAxXSk7XG4gICAgY29uc3QgbGFzdERheSA9IG1vbWVudChbeWVhciwgbW9udGgsIGRheXNJbk1vbnRoXSk7XG4gICAgY29uc3QgbGFzdE1vbnRoID0gbW9tZW50KGZpcnN0RGF5KS5zdWJ0cmFjdCgxLCAnbW9udGgnKS5tb250aCgpO1xuICAgIGNvbnN0IGxhc3RZZWFyID0gbW9tZW50KGZpcnN0RGF5KS5zdWJ0cmFjdCgxLCAnbW9udGgnKS55ZWFyKCk7XG4gICAgY29uc3QgZGF5c0luTGFzdE1vbnRoID0gbW9tZW50KFtsYXN0WWVhciwgbGFzdE1vbnRoXSkuZGF5c0luTW9udGgoKTtcbiAgICBjb25zdCBkYXlPZldlZWsgPSBmaXJzdERheS5kYXkoKTtcbiAgICAvLyBpbml0aWFsaXplIGEgNiByb3dzIHggNyBjb2x1bW5zIGFycmF5IGZvciB0aGUgY2FsZW5kYXJcbiAgICBjb25zdCBjYWxlbmRhcjogYW55ID0gW107XG4gICAgY2FsZW5kYXIuZmlyc3REYXkgPSBmaXJzdERheTtcbiAgICBjYWxlbmRhci5sYXN0RGF5ID0gbGFzdERheTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNjsgaSsrKSB7XG4gICAgICBjYWxlbmRhcltpXSA9IFtdO1xuICAgIH1cblxuICAgIC8vIHBvcHVsYXRlIHRoZSBjYWxlbmRhciB3aXRoIGRhdGUgb2JqZWN0c1xuICAgIGxldCBzdGFydERheSA9IGRheXNJbkxhc3RNb250aCAtIGRheU9mV2VlayArIHRoaXMubG9jYWxlLmZpcnN0RGF5ICsgMTtcbiAgICBpZiAoc3RhcnREYXkgPiBkYXlzSW5MYXN0TW9udGgpIHtcbiAgICAgIHN0YXJ0RGF5IC09IDc7XG4gICAgfVxuXG4gICAgaWYgKGRheU9mV2VlayA9PT0gdGhpcy5sb2NhbGUuZmlyc3REYXkpIHtcbiAgICAgIHN0YXJ0RGF5ID0gZGF5c0luTGFzdE1vbnRoIC0gNjtcbiAgICB9XG5cbiAgICBsZXQgY3VyRGF0ZSA9IG1vbWVudChbbGFzdFllYXIsIGxhc3RNb250aCwgc3RhcnREYXksIDEyLCBtaW51dGUsIHNlY29uZF0pO1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGNvbCA9IDAsIHJvdyA9IDA7IGkgPCA0MjsgaSsrICwgY29sKysgLCBjdXJEYXRlID0gbW9tZW50KGN1ckRhdGUpLmFkZCgyNCwgJ2hvdXInKSkge1xuICAgICAgaWYgKGkgPiAwICYmIGNvbCAlIDcgPT09IDApIHtcbiAgICAgICAgY29sID0gMDtcbiAgICAgICAgcm93Kys7XG4gICAgICB9XG4gICAgICBjYWxlbmRhcltyb3ddW2NvbF0gPSBjdXJEYXRlLmNsb25lKCkuaG91cihob3VyKS5taW51dGUobWludXRlKS5zZWNvbmQoc2Vjb25kKTtcbiAgICAgIGN1ckRhdGUuaG91cigxMik7XG5cbiAgICAgIGlmICh0aGlzLm1pbkRhdGUgJiYgY2FsZW5kYXJbcm93XVtjb2xdLmZvcm1hdCgnWVlZWS1NTS1ERCcpID09PSB0aGlzLm1pbkRhdGUuZm9ybWF0KCdZWVlZLU1NLUREJykgJiZcbiAgICAgICAgY2FsZW5kYXJbcm93XVtjb2xdLmlzQmVmb3JlKHRoaXMubWluRGF0ZSkgJiYgc2lkZSA9PT0gJ2xlZnQnKSB7XG4gICAgICAgIGNhbGVuZGFyW3Jvd11bY29sXSA9IHRoaXMubWluRGF0ZS5jbG9uZSgpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5tYXhEYXRlICYmIGNhbGVuZGFyW3Jvd11bY29sXS5mb3JtYXQoJ1lZWVktTU0tREQnKSA9PT0gdGhpcy5tYXhEYXRlLmZvcm1hdCgnWVlZWS1NTS1ERCcpICYmXG4gICAgICAgIGNhbGVuZGFyW3Jvd11bY29sXS5pc0FmdGVyKHRoaXMubWF4RGF0ZSkgJiYgc2lkZSA9PT0gJ3JpZ2h0Jykge1xuICAgICAgICBjYWxlbmRhcltyb3ddW2NvbF0gPSB0aGlzLm1heERhdGUuY2xvbmUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBtYWtlIHRoZSBjYWxlbmRhciBvYmplY3QgYXZhaWxhYmxlIHRvIGhvdmVyRGF0ZS9jbGlja0RhdGVcbiAgICBpZiAoc2lkZSA9PT0gU2lkZUVudW0ubGVmdCkge1xuICAgICAgdGhpcy5sZWZ0Q2FsZW5kYXIuY2FsZW5kYXIgPSBjYWxlbmRhcjtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yaWdodENhbGVuZGFyLmNhbGVuZGFyID0gY2FsZW5kYXI7XG4gICAgfVxuICAgIC8vXG4gICAgLy8gRGlzcGxheSB0aGUgY2FsZW5kYXJcbiAgICAvL1xuICAgIGNvbnN0IG1pbkRhdGUgPSBzaWRlID09PSAnbGVmdCcgPyB0aGlzLm1pbkRhdGUgOiB0aGlzLnN0YXJ0RGF0ZTtcbiAgICBsZXQgbWF4RGF0ZSA9IHRoaXMubWF4RGF0ZTtcbiAgICAvLyBhZGp1c3QgbWF4RGF0ZSB0byByZWZsZWN0IHRoZSBkYXRlTGltaXQgc2V0dGluZyBpbiBvcmRlciB0b1xuICAgIC8vIGdyZXkgb3V0IGVuZCBkYXRlcyBiZXlvbmQgdGhlIGRhdGVMaW1pdFxuICAgIGlmICh0aGlzLmVuZERhdGUgPT09IG51bGwgJiYgdGhpcy5kYXRlTGltaXQpIHtcbiAgICAgIGNvbnN0IG1heExpbWl0ID0gdGhpcy5zdGFydERhdGUuY2xvbmUoKS5hZGQodGhpcy5kYXRlTGltaXQsICdkYXknKS5lbmRPZignZGF5Jyk7XG4gICAgICBpZiAoIW1heERhdGUgfHwgbWF4TGltaXQuaXNCZWZvcmUobWF4RGF0ZSkpIHtcbiAgICAgICAgbWF4RGF0ZSA9IG1heExpbWl0O1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmNhbGVuZGFyVmFyaWFibGVzW3NpZGVdID0ge1xuICAgICAgbW9udGg6IG1vbnRoLFxuICAgICAgeWVhcjogeWVhcixcbiAgICAgIGhvdXI6IGhvdXIsXG4gICAgICBtaW51dGU6IG1pbnV0ZSxcbiAgICAgIHNlY29uZDogc2Vjb25kLFxuICAgICAgZGF5c0luTW9udGg6IGRheXNJbk1vbnRoLFxuICAgICAgZmlyc3REYXk6IGZpcnN0RGF5LFxuICAgICAgbGFzdERheTogbGFzdERheSxcbiAgICAgIGxhc3RNb250aDogbGFzdE1vbnRoLFxuICAgICAgbGFzdFllYXI6IGxhc3RZZWFyLFxuICAgICAgZGF5c0luTGFzdE1vbnRoOiBkYXlzSW5MYXN0TW9udGgsXG4gICAgICBkYXlPZldlZWs6IGRheU9mV2VlayxcbiAgICAgIC8vIG90aGVyIHZhcnNcbiAgICAgIGNhbFJvd3M6IEFycmF5LmZyb20oQXJyYXkoNikua2V5cygpKSxcbiAgICAgIGNhbENvbHM6IEFycmF5LmZyb20oQXJyYXkoNykua2V5cygpKSxcbiAgICAgIGNsYXNzZXM6IHt9LFxuICAgICAgbWluRGF0ZTogbWluRGF0ZSxcbiAgICAgIG1heERhdGU6IG1heERhdGUsXG4gICAgICBjYWxlbmRhcjogY2FsZW5kYXJcbiAgICB9O1xuICAgIGlmICh0aGlzLnNob3dEcm9wZG93bnMpIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRNb250aCA9IGNhbGVuZGFyWzFdWzFdLm1vbnRoKCk7XG4gICAgICBjb25zdCBjdXJyZW50WWVhciA9IGNhbGVuZGFyWzFdWzFdLnllYXIoKTtcbiAgICAgIGNvbnN0IG1heFllYXIgPSAobWF4RGF0ZSAmJiBtYXhEYXRlLnllYXIoKSkgfHwgKGN1cnJlbnRZZWFyICsgNSk7XG4gICAgICBjb25zdCBtaW5ZZWFyID0gKG1pbkRhdGUgJiYgbWluRGF0ZS55ZWFyKCkpIHx8IChjdXJyZW50WWVhciAtIDUwKTtcbiAgICAgIGNvbnN0IGluTWluWWVhciA9IGN1cnJlbnRZZWFyID09PSBtaW5ZZWFyO1xuICAgICAgY29uc3QgaW5NYXhZZWFyID0gY3VycmVudFllYXIgPT09IG1heFllYXI7XG4gICAgICBjb25zdCB5ZWFycyA9IFtdO1xuICAgICAgZm9yIChsZXQgeSA9IG1pblllYXI7IHkgPD0gbWF4WWVhcjsgeSsrKSB7XG4gICAgICAgIHllYXJzLnB1c2goeSk7XG4gICAgICB9XG4gICAgICB0aGlzLmNhbGVuZGFyVmFyaWFibGVzW3NpZGVdLmRyb3Bkb3ducyA9IHtcbiAgICAgICAgY3VycmVudE1vbnRoOiBjdXJyZW50TW9udGgsXG4gICAgICAgIGN1cnJlbnRZZWFyOiBjdXJyZW50WWVhcixcbiAgICAgICAgbWF4WWVhcjogbWF4WWVhcixcbiAgICAgICAgbWluWWVhcjogbWluWWVhcixcbiAgICAgICAgaW5NaW5ZZWFyOiBpbk1pblllYXIsXG4gICAgICAgIGluTWF4WWVhcjogaW5NYXhZZWFyLFxuICAgICAgICBtb250aEFycmF5czogQXJyYXkuZnJvbShBcnJheSgxMikua2V5cygpKSxcbiAgICAgICAgeWVhckFycmF5czogeWVhcnNcbiAgICAgIH07XG4gICAgfVxuXG4gICAgdGhpcy5fYnVpbGRDZWxscyhjYWxlbmRhciwgc2lkZSk7XG4gIH1cbiAgc2V0U3RhcnREYXRlKHN0YXJ0RGF0ZSkge1xuICAgIGlmICh0eXBlb2Ygc3RhcnREYXRlID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5zdGFydERhdGUgPSBtb21lbnQoc3RhcnREYXRlLCB0aGlzLmxvY2FsZS5mb3JtYXQpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2Ygc3RhcnREYXRlID09PSAnb2JqZWN0Jykge1xuICAgICAgdGhpcy5zdGFydERhdGUgPSBtb21lbnQoc3RhcnREYXRlKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLnRpbWVQaWNrZXIpIHtcbiAgICAgIHRoaXMuc3RhcnREYXRlID0gdGhpcy5zdGFydERhdGUuc3RhcnRPZignZGF5Jyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMudGltZVBpY2tlciAmJiB0aGlzLnRpbWVQaWNrZXJJbmNyZW1lbnQpIHtcbiAgICAgIHRoaXMuc3RhcnREYXRlLm1pbnV0ZShNYXRoLnJvdW5kKHRoaXMuc3RhcnREYXRlLm1pbnV0ZSgpIC8gdGhpcy50aW1lUGlja2VySW5jcmVtZW50KSAqIHRoaXMudGltZVBpY2tlckluY3JlbWVudCk7XG4gICAgfVxuXG5cbiAgICBpZiAodGhpcy5taW5EYXRlICYmIHRoaXMuc3RhcnREYXRlLmlzQmVmb3JlKHRoaXMubWluRGF0ZSkpIHtcbiAgICAgIHRoaXMuc3RhcnREYXRlID0gdGhpcy5taW5EYXRlLmNsb25lKCk7XG4gICAgICBpZiAodGhpcy50aW1lUGlja2VyICYmIHRoaXMudGltZVBpY2tlckluY3JlbWVudCkge1xuICAgICAgICB0aGlzLnN0YXJ0RGF0ZS5taW51dGUoTWF0aC5yb3VuZCh0aGlzLnN0YXJ0RGF0ZS5taW51dGUoKSAvIHRoaXMudGltZVBpY2tlckluY3JlbWVudCkgKiB0aGlzLnRpbWVQaWNrZXJJbmNyZW1lbnQpO1xuICAgICAgfVxuXG4gICAgfVxuXG4gICAgaWYgKHRoaXMubWF4RGF0ZSAmJiB0aGlzLnN0YXJ0RGF0ZS5pc0FmdGVyKHRoaXMubWF4RGF0ZSkpIHtcbiAgICAgIHRoaXMuc3RhcnREYXRlID0gdGhpcy5tYXhEYXRlLmNsb25lKCk7XG4gICAgICBpZiAodGhpcy50aW1lUGlja2VyICYmIHRoaXMudGltZVBpY2tlckluY3JlbWVudCkge1xuICAgICAgICB0aGlzLnN0YXJ0RGF0ZS5taW51dGUoTWF0aC5mbG9vcih0aGlzLnN0YXJ0RGF0ZS5taW51dGUoKSAvIHRoaXMudGltZVBpY2tlckluY3JlbWVudCkgKiB0aGlzLnRpbWVQaWNrZXJJbmNyZW1lbnQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghdGhpcy5pc1Nob3duKSB7XG4gICAgICB0aGlzLnVwZGF0ZUVsZW1lbnQoKTtcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZU1vbnRoc0luVmlldygpO1xuICB9XG5cbiAgc2V0RW5kRGF0ZShlbmREYXRlKSB7XG4gICAgaWYgKHR5cGVvZiBlbmREYXRlID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5lbmREYXRlID0gbW9tZW50KGVuZERhdGUsIHRoaXMubG9jYWxlLmZvcm1hdCk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBlbmREYXRlID09PSAnb2JqZWN0Jykge1xuICAgICAgdGhpcy5lbmREYXRlID0gbW9tZW50KGVuZERhdGUpO1xuICAgIH1cbiAgICBpZiAoIXRoaXMudGltZVBpY2tlcikge1xuICAgICAgdGhpcy5lbmREYXRlID0gdGhpcy5lbmREYXRlLmFkZCgxLCAnZCcpLnN0YXJ0T2YoJ2RheScpLnN1YnRyYWN0KDEsICdzZWNvbmQnKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy50aW1lUGlja2VyICYmIHRoaXMudGltZVBpY2tlckluY3JlbWVudCkge1xuICAgICAgdGhpcy5lbmREYXRlLm1pbnV0ZShNYXRoLnJvdW5kKHRoaXMuZW5kRGF0ZS5taW51dGUoKSAvIHRoaXMudGltZVBpY2tlckluY3JlbWVudCkgKiB0aGlzLnRpbWVQaWNrZXJJbmNyZW1lbnQpO1xuICAgIH1cblxuXG4gICAgaWYgKHRoaXMuZW5kRGF0ZS5pc0JlZm9yZSh0aGlzLnN0YXJ0RGF0ZSkpIHtcbiAgICAgIHRoaXMuZW5kRGF0ZSA9IHRoaXMuc3RhcnREYXRlLmNsb25lKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubWF4RGF0ZSAmJiB0aGlzLmVuZERhdGUuaXNBZnRlcih0aGlzLm1heERhdGUpKSB7XG4gICAgICB0aGlzLmVuZERhdGUgPSB0aGlzLm1heERhdGUuY2xvbmUoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5kYXRlTGltaXQgJiYgdGhpcy5zdGFydERhdGUuY2xvbmUoKS5hZGQodGhpcy5kYXRlTGltaXQsICdkYXknKS5pc0JlZm9yZSh0aGlzLmVuZERhdGUpKSB7XG4gICAgICB0aGlzLmVuZERhdGUgPSB0aGlzLnN0YXJ0RGF0ZS5jbG9uZSgpLmFkZCh0aGlzLmRhdGVMaW1pdCwgJ2RheScpO1xuICAgIH1cblxuXG4gICAgaWYgKCF0aGlzLmlzU2hvd24pIHtcbiAgICAgIC8vIHRoaXMudXBkYXRlRWxlbWVudCgpO1xuICAgIH1cbiAgICB0aGlzLnVwZGF0ZU1vbnRoc0luVmlldygpO1xuICB9XG4gIEBJbnB1dCgpXG4gIGlzSW52YWxpZERhdGUoZGF0ZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBASW5wdXQoKVxuICBpc0N1c3RvbURhdGUoZGF0ZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHVwZGF0ZVZpZXcoKSB7XG4gICAgaWYgKHRoaXMudGltZVBpY2tlcikge1xuICAgICAgdGhpcy5yZW5kZXJUaW1lUGlja2VyKFNpZGVFbnVtLmxlZnQpO1xuICAgICAgdGhpcy5yZW5kZXJUaW1lUGlja2VyKFNpZGVFbnVtLnJpZ2h0KTtcbiAgICB9XG4gICAgdGhpcy51cGRhdGVNb250aHNJblZpZXcoKTtcbiAgICB0aGlzLnVwZGF0ZUNhbGVuZGFycygpO1xuICB9XG5cbiAgdXBkYXRlTW9udGhzSW5WaWV3KCkge1xuICAgIGlmICh0aGlzLmVuZERhdGUpIHtcbiAgICAgIC8vIGlmIGJvdGggZGF0ZXMgYXJlIHZpc2libGUgYWxyZWFkeSwgZG8gbm90aGluZ1xuICAgICAgaWYgKCF0aGlzLnNpbmdsZURhdGVQaWNrZXIgJiYgdGhpcy5sZWZ0Q2FsZW5kYXIubW9udGggJiYgdGhpcy5yaWdodENhbGVuZGFyLm1vbnRoICYmXG4gICAgICAgICgodGhpcy5zdGFydERhdGUgJiYgdGhpcy5sZWZ0Q2FsZW5kYXIgJiYgdGhpcy5zdGFydERhdGUuZm9ybWF0KCdZWVlZLU1NJykgPT09IHRoaXMubGVmdENhbGVuZGFyLm1vbnRoLmZvcm1hdCgnWVlZWS1NTScpKSB8fFxuICAgICAgICAgICh0aGlzLnN0YXJ0RGF0ZSAmJiB0aGlzLnJpZ2h0Q2FsZW5kYXIgJiYgdGhpcy5zdGFydERhdGUuZm9ybWF0KCdZWVlZLU1NJykgPT09IHRoaXMucmlnaHRDYWxlbmRhci5tb250aC5mb3JtYXQoJ1lZWVktTU0nKSkpXG4gICAgICAgICYmXG4gICAgICAgICh0aGlzLmVuZERhdGUuZm9ybWF0KCdZWVlZLU1NJykgPT09IHRoaXMubGVmdENhbGVuZGFyLm1vbnRoLmZvcm1hdCgnWVlZWS1NTScpIHx8XG4gICAgICAgICAgdGhpcy5lbmREYXRlLmZvcm1hdCgnWVlZWS1NTScpID09PSB0aGlzLnJpZ2h0Q2FsZW5kYXIubW9udGguZm9ybWF0KCdZWVlZLU1NJykpXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuc3RhcnREYXRlKSB7XG4gICAgICAgIHRoaXMubGVmdENhbGVuZGFyLm1vbnRoID0gdGhpcy5zdGFydERhdGUuY2xvbmUoKS5kYXRlKDIpO1xuICAgICAgICBpZiAoIXRoaXMubGlua2VkQ2FsZW5kYXJzICYmICh0aGlzLmVuZERhdGUubW9udGgoKSAhPT0gdGhpcy5zdGFydERhdGUubW9udGgoKSB8fFxuICAgICAgICAgIHRoaXMuZW5kRGF0ZS55ZWFyKCkgIT09IHRoaXMuc3RhcnREYXRlLnllYXIoKSkpIHtcbiAgICAgICAgICB0aGlzLnJpZ2h0Q2FsZW5kYXIubW9udGggPSB0aGlzLmVuZERhdGUuY2xvbmUoKS5kYXRlKDIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMucmlnaHRDYWxlbmRhci5tb250aCA9IHRoaXMuc3RhcnREYXRlLmNsb25lKCkuZGF0ZSgyKS5hZGQoMSwgJ21vbnRoJyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5sZWZ0Q2FsZW5kYXIubW9udGguZm9ybWF0KCdZWVlZLU1NJykgIT09IHRoaXMuc3RhcnREYXRlLmZvcm1hdCgnWVlZWS1NTScpICYmXG4gICAgICAgIHRoaXMucmlnaHRDYWxlbmRhci5tb250aC5mb3JtYXQoJ1lZWVktTU0nKSAhPT0gdGhpcy5zdGFydERhdGUuZm9ybWF0KCdZWVlZLU1NJykpIHtcbiAgICAgICAgdGhpcy5sZWZ0Q2FsZW5kYXIubW9udGggPSB0aGlzLnN0YXJ0RGF0ZS5jbG9uZSgpLmRhdGUoMik7XG4gICAgICAgIHRoaXMucmlnaHRDYWxlbmRhci5tb250aCA9IHRoaXMuc3RhcnREYXRlLmNsb25lKCkuZGF0ZSgyKS5hZGQoMSwgJ21vbnRoJyk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLm1heERhdGUgJiYgdGhpcy5saW5rZWRDYWxlbmRhcnMgJiYgIXRoaXMuc2luZ2xlRGF0ZVBpY2tlciAmJiB0aGlzLnJpZ2h0Q2FsZW5kYXIubW9udGggPiB0aGlzLm1heERhdGUpIHtcbiAgICAgIHRoaXMucmlnaHRDYWxlbmRhci5tb250aCA9IHRoaXMubWF4RGF0ZS5jbG9uZSgpLmRhdGUoMik7XG4gICAgICB0aGlzLmxlZnRDYWxlbmRhci5tb250aCA9IHRoaXMubWF4RGF0ZS5jbG9uZSgpLmRhdGUoMikuc3VidHJhY3QoMSwgJ21vbnRoJyk7XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiAgVGhpcyBpcyByZXNwb25zaWJsZSBmb3IgdXBkYXRpbmcgdGhlIGNhbGVuZGFyc1xuICAgKi9cbiAgdXBkYXRlQ2FsZW5kYXJzKCkge1xuICAgIHRoaXMucmVuZGVyQ2FsZW5kYXIoU2lkZUVudW0ubGVmdCk7XG4gICAgdGhpcy5yZW5kZXJDYWxlbmRhcihTaWRlRW51bS5yaWdodCk7XG5cbiAgICBpZiAodGhpcy5lbmREYXRlID09PSBudWxsKSB7IHJldHVybjsgfVxuICAgIHRoaXMuY2FsY3VsYXRlQ2hvc2VuTGFiZWwoKTtcbiAgfVxuICB1cGRhdGVFbGVtZW50KCkge1xuICAgIGlmICghdGhpcy5zaW5nbGVEYXRlUGlja2VyICYmIHRoaXMuYXV0b1VwZGF0ZUlucHV0KSB7XG4gICAgICBpZiAodGhpcy5zdGFydERhdGUgJiYgdGhpcy5lbmREYXRlKSB7XG4gICAgICAgIC8vIGlmIHdlIHVzZSByYW5nZXMgYW5kIHNob3VsZCBzaG93IHJhbmdlIGxhYmVsIG9uIGlucHVcbiAgICAgICAgaWYgKHRoaXMucmFuZ2VzQXJyYXkubGVuZ3RoICYmIHRoaXMuc2hvd1JhbmdlTGFiZWxPbklucHV0ID09PSB0cnVlICYmIHRoaXMuY2hvc2VuUmFuZ2UgJiZcbiAgICAgICAgICB0aGlzLmxvY2FsZS5jdXN0b21SYW5nZUxhYmVsICE9PSB0aGlzLmNob3NlblJhbmdlKSB7XG4gICAgICAgICAgdGhpcy5jaG9zZW5MYWJlbCA9IHRoaXMuY2hvc2VuUmFuZ2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5jaG9zZW5MYWJlbCA9IHRoaXMuc3RhcnREYXRlLmZvcm1hdCh0aGlzLmxvY2FsZS5mb3JtYXQpICtcbiAgICAgICAgICAgIHRoaXMubG9jYWxlLnNlcGFyYXRvciArIHRoaXMuZW5kRGF0ZS5mb3JtYXQodGhpcy5sb2NhbGUuZm9ybWF0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5hdXRvVXBkYXRlSW5wdXQpIHtcbiAgICAgIHRoaXMuY2hvc2VuTGFiZWwgPSB0aGlzLnN0YXJ0RGF0ZS5mb3JtYXQodGhpcy5sb2NhbGUuZm9ybWF0KTtcbiAgICB9XG4gIH1cblxuICByZW1vdmUoKSB7XG4gICAgdGhpcy5pc1Nob3duID0gZmFsc2U7XG4gIH1cbiAgLyoqXG4gICAqIHRoaXMgc2hvdWxkIGNhbGN1bGF0ZSB0aGUgbGFiZWxcbiAgICovXG4gIGNhbGN1bGF0ZUNob3NlbkxhYmVsKCkge1xuICAgIGlmICghdGhpcy5sb2NhbGUgfHwgIXRoaXMubG9jYWxlLnNlcGFyYXRvcikge1xuICAgICAgdGhpcy5fYnVpbGRMb2NhbGUoKTtcbiAgICB9XG4gICAgbGV0IGN1c3RvbVJhbmdlID0gdHJ1ZTtcbiAgICBsZXQgaSA9IDA7XG4gICAgaWYgKHRoaXMucmFuZ2VzQXJyYXkubGVuZ3RoID4gMCkge1xuICAgICAgZm9yIChjb25zdCByYW5nZSBpbiB0aGlzLnJhbmdlcykge1xuICAgICAgICBpZiAodGhpcy50aW1lUGlja2VyKSB7XG4gICAgICAgICAgY29uc3QgZm9ybWF0ID0gdGhpcy50aW1lUGlja2VyU2Vjb25kcyA/ICdZWVlZLU1NLUREIEhIOm1tOnNzJyA6ICdZWVlZLU1NLUREIEhIOm1tJztcbiAgICAgICAgICAvL2lnbm9yZSB0aW1lcyB3aGVuIGNvbXBhcmluZyBkYXRlcyBpZiB0aW1lIHBpY2tlciBzZWNvbmRzIGlzIG5vdCBlbmFibGVkXG4gICAgICAgICAgaWYgKHRoaXMuc3RhcnREYXRlLmZvcm1hdChmb3JtYXQpID09PSB0aGlzLnJhbmdlc1tyYW5nZV1bMF0uZm9ybWF0KGZvcm1hdCkgJiYgdGhpcy5lbmREYXRlLmZvcm1hdChmb3JtYXQpID09PSB0aGlzLnJhbmdlc1tyYW5nZV1bMV0uZm9ybWF0KGZvcm1hdCkpIHtcbiAgICAgICAgICAgIGN1c3RvbVJhbmdlID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmNob3NlblJhbmdlID0gdGhpcy5yYW5nZXNBcnJheVtpXTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvL2lnbm9yZSB0aW1lcyB3aGVuIGNvbXBhcmluZyBkYXRlcyBpZiB0aW1lIHBpY2tlciBpcyBub3QgZW5hYmxlZFxuICAgICAgICAgIGlmICh0aGlzLnN0YXJ0RGF0ZS5mb3JtYXQoJ1lZWVktTU0tREQnKSA9PT0gdGhpcy5yYW5nZXNbcmFuZ2VdWzBdLmZvcm1hdCgnWVlZWS1NTS1ERCcpICYmIHRoaXMuZW5kRGF0ZS5mb3JtYXQoJ1lZWVktTU0tREQnKSA9PT0gdGhpcy5yYW5nZXNbcmFuZ2VdWzFdLmZvcm1hdCgnWVlZWS1NTS1ERCcpKSB7XG4gICAgICAgICAgICBjdXN0b21SYW5nZSA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5jaG9zZW5SYW5nZSA9IHRoaXMucmFuZ2VzQXJyYXlbaV07XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpKys7XG4gICAgICB9XG4gICAgICBpZiAoY3VzdG9tUmFuZ2UpIHtcbiAgICAgICAgaWYgKHRoaXMuc2hvd0N1c3RvbVJhbmdlTGFiZWwpIHtcbiAgICAgICAgICB0aGlzLmNob3NlblJhbmdlID0gdGhpcy5sb2NhbGUuY3VzdG9tUmFuZ2VMYWJlbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmNob3NlblJhbmdlID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICAvLyBpZiBjdXN0b20gbGFiZWw6IHNob3cgY2FsZW5hclxuICAgICAgICB0aGlzLnNob3dDYWxJblJhbmdlcyA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGVFbGVtZW50KCk7XG4gIH1cblxuICBjbGlja0FwcGx5KGU/KSB7XG4gICAgaWYgKCF0aGlzLnNpbmdsZURhdGVQaWNrZXIgJiYgdGhpcy5zdGFydERhdGUgJiYgIXRoaXMuZW5kRGF0ZSkge1xuICAgICAgdGhpcy5lbmREYXRlID0gdGhpcy5zdGFydERhdGUuY2xvbmUoKTtcbiAgICAgIHRoaXMuY2FsY3VsYXRlQ2hvc2VuTGFiZWwoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuaXNJbnZhbGlkRGF0ZSAmJiB0aGlzLnN0YXJ0RGF0ZSAmJiB0aGlzLmVuZERhdGUpIHtcbiAgICAgIC8vIGdldCBpZiB0aGVyZSBhcmUgaW52YWxpZCBkYXRlIGJldHdlZW4gcmFuZ2VcbiAgICAgIGNvbnN0IGQgPSB0aGlzLnN0YXJ0RGF0ZS5jbG9uZSgpO1xuICAgICAgd2hpbGUgKGQuaXNCZWZvcmUodGhpcy5lbmREYXRlKSkge1xuICAgICAgICBpZiAodGhpcy5pc0ludmFsaWREYXRlKGQpKSB7XG4gICAgICAgICAgdGhpcy5lbmREYXRlID0gZC5zdWJ0cmFjdCgxLCAnZGF5cycpO1xuICAgICAgICAgIHRoaXMuY2FsY3VsYXRlQ2hvc2VuTGFiZWwoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBkLmFkZCgxLCAnZGF5cycpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5jaG9zZW5MYWJlbCkge1xuICAgICAgdGhpcy5jaG9vc2VkRGF0ZS5lbWl0KHsgY2hvc2VuTGFiZWw6IHRoaXMuY2hvc2VuTGFiZWwsIHN0YXJ0RGF0ZTogdGhpcy5zdGFydERhdGUsIGVuZERhdGU6IHRoaXMuZW5kRGF0ZSB9KTtcbiAgICB9XG5cbiAgICB0aGlzLmRhdGVzVXBkYXRlZC5lbWl0KHsgc3RhcnREYXRlOiB0aGlzLnN0YXJ0RGF0ZSwgZW5kRGF0ZTogdGhpcy5lbmREYXRlIH0pO1xuICAgIHRoaXMuaGlkZSgpO1xuICB9XG5cbiAgY2xpY2tDYW5jZWwoZSkge1xuICAgIHRoaXMuc3RhcnREYXRlID0gdGhpcy5fb2xkLnN0YXJ0O1xuICAgIHRoaXMuZW5kRGF0ZSA9IHRoaXMuX29sZC5lbmQ7XG4gICAgaWYgKHRoaXMuaW5saW5lKSB7XG4gICAgICB0aGlzLnVwZGF0ZVZpZXcoKTtcbiAgICB9XG4gICAgdGhpcy5oaWRlKCk7XG4gIH1cbiAgLyoqXG4gICAqIGNhbGxlZCB3aGVuIG1vbnRoIGlzIGNoYW5nZWRcbiAgICogQHBhcmFtIG1vbnRoRXZlbnQgZ2V0IHZhbHVlIGluIGV2ZW50LnRhcmdldC52YWx1ZVxuICAgKiBAcGFyYW0gc2lkZSBsZWZ0IG9yIHJpZ2h0XG4gICAqL1xuICBtb250aENoYW5nZWQobW9udGhFdmVudDogYW55LCBzaWRlOiBTaWRlRW51bSkge1xuICAgIGNvbnN0IHllYXIgPSB0aGlzLmNhbGVuZGFyVmFyaWFibGVzW3NpZGVdLmRyb3Bkb3ducy5jdXJyZW50WWVhcjtcbiAgICBjb25zdCBtb250aCA9IHBhcnNlSW50KG1vbnRoRXZlbnQudGFyZ2V0LnZhbHVlLCAxMCk7XG4gICAgdGhpcy5tb250aE9yWWVhckNoYW5nZWQobW9udGgsIHllYXIsIHNpZGUpO1xuICB9XG4gIC8qKlxuICAgKiBjYWxsZWQgd2hlbiB5ZWFyIGlzIGNoYW5nZWRcbiAgICogQHBhcmFtIHllYXJFdmVudCBnZXQgdmFsdWUgaW4gZXZlbnQudGFyZ2V0LnZhbHVlXG4gICAqIEBwYXJhbSBzaWRlIGxlZnQgb3IgcmlnaHRcbiAgICovXG4gIHllYXJDaGFuZ2VkKHllYXJFdmVudDogYW55LCBzaWRlOiBTaWRlRW51bSkge1xuICAgIGNvbnN0IG1vbnRoID0gdGhpcy5jYWxlbmRhclZhcmlhYmxlc1tzaWRlXS5kcm9wZG93bnMuY3VycmVudE1vbnRoO1xuICAgIGNvbnN0IHllYXIgPSBwYXJzZUludCh5ZWFyRXZlbnQudGFyZ2V0LnZhbHVlLCAxMCk7XG4gICAgdGhpcy5tb250aE9yWWVhckNoYW5nZWQobW9udGgsIHllYXIsIHNpZGUpO1xuICB9XG4gIC8qKlxuICAgKiBjYWxsZWQgd2hlbiB0aW1lIGlzIGNoYW5nZWRcbiAgICogQHBhcmFtIHRpbWVFdmVudCAgYW4gZXZlbnRcbiAgICogQHBhcmFtIHNpZGUgbGVmdCBvciByaWdodFxuICAgKi9cbiAgdGltZUNoYW5nZWQodGltZUV2ZW50OiBhbnksIHNpZGU6IFNpZGVFbnVtKSB7XG5cbiAgICBsZXQgaG91ciA9IHBhcnNlSW50KHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5zZWxlY3RlZEhvdXIsIDEwKTtcbiAgICBjb25zdCBtaW51dGUgPSBwYXJzZUludCh0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uc2VsZWN0ZWRNaW51dGUsIDEwKTtcbiAgICBjb25zdCBzZWNvbmQgPSB0aGlzLnRpbWVQaWNrZXJTZWNvbmRzID8gcGFyc2VJbnQodGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnNlbGVjdGVkU2Vjb25kLCAxMCkgOiAwO1xuXG4gICAgaWYgKCF0aGlzLnRpbWVQaWNrZXIyNEhvdXIpIHtcbiAgICAgIGNvbnN0IGFtcG0gPSB0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uYW1wbU1vZGVsO1xuICAgICAgaWYgKGFtcG0gPT09ICdQTScgJiYgaG91ciA8IDEyKSB7XG4gICAgICAgIGhvdXIgKz0gMTI7XG4gICAgICB9XG4gICAgICBpZiAoYW1wbSA9PT0gJ0FNJyAmJiBob3VyID09PSAxMikge1xuICAgICAgICBob3VyID0gMDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc2lkZSA9PT0gU2lkZUVudW0ubGVmdCkge1xuICAgICAgY29uc3Qgc3RhcnQgPSB0aGlzLnN0YXJ0RGF0ZS5jbG9uZSgpO1xuICAgICAgc3RhcnQuaG91cihob3VyKTtcbiAgICAgIHN0YXJ0Lm1pbnV0ZShtaW51dGUpO1xuICAgICAgc3RhcnQuc2Vjb25kKHNlY29uZCk7XG4gICAgICB0aGlzLnNldFN0YXJ0RGF0ZShzdGFydCk7XG4gICAgICBpZiAodGhpcy5zaW5nbGVEYXRlUGlja2VyKSB7XG4gICAgICAgIHRoaXMuZW5kRGF0ZSA9IHRoaXMuc3RhcnREYXRlLmNsb25lKCk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuZW5kRGF0ZSAmJiB0aGlzLmVuZERhdGUuZm9ybWF0KCdZWVlZLU1NLUREJykgPT09IHN0YXJ0LmZvcm1hdCgnWVlZWS1NTS1ERCcpICYmIHRoaXMuZW5kRGF0ZS5pc0JlZm9yZShzdGFydCkpIHtcbiAgICAgICAgdGhpcy5zZXRFbmREYXRlKHN0YXJ0LmNsb25lKCkpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGhpcy5lbmREYXRlKSB7XG4gICAgICBjb25zdCBlbmQgPSB0aGlzLmVuZERhdGUuY2xvbmUoKTtcbiAgICAgIGVuZC5ob3VyKGhvdXIpO1xuICAgICAgZW5kLm1pbnV0ZShtaW51dGUpO1xuICAgICAgZW5kLnNlY29uZChzZWNvbmQpO1xuICAgICAgdGhpcy5zZXRFbmREYXRlKGVuZCk7XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlIHRoZSBjYWxlbmRhcnMgc28gYWxsIGNsaWNrYWJsZSBkYXRlcyByZWZsZWN0IHRoZSBuZXcgdGltZSBjb21wb25lbnRcbiAgICB0aGlzLnVwZGF0ZUNhbGVuZGFycygpO1xuXG4gICAgLy8gcmUtcmVuZGVyIHRoZSB0aW1lIHBpY2tlcnMgYmVjYXVzZSBjaGFuZ2luZyBvbmUgc2VsZWN0aW9uIGNhbiBhZmZlY3Qgd2hhdCdzIGVuYWJsZWQgaW4gYW5vdGhlclxuICAgIHRoaXMucmVuZGVyVGltZVBpY2tlcihTaWRlRW51bS5sZWZ0KTtcbiAgICB0aGlzLnJlbmRlclRpbWVQaWNrZXIoU2lkZUVudW0ucmlnaHQpO1xuICB9XG4gIC8qKlxuICAgKiAgY2FsbCB3aGVuIG1vbnRoIG9yIHllYXIgY2hhbmdlZFxuICAgKiBAcGFyYW0gbW9udGggbW9udGggbnVtYmVyIDAgLTExXG4gICAqIEBwYXJhbSB5ZWFyIHllYXIgZWc6IDE5OTVcbiAgICogQHBhcmFtIHNpZGUgbGVmdCBvciByaWdodFxuICAgKi9cbiAgbW9udGhPclllYXJDaGFuZ2VkKG1vbnRoOiBudW1iZXIsIHllYXI6IG51bWJlciwgc2lkZTogU2lkZUVudW0pIHtcbiAgICBjb25zdCBpc0xlZnQgPSBzaWRlID09PSBTaWRlRW51bS5sZWZ0O1xuXG4gICAgaWYgKCFpc0xlZnQpIHtcbiAgICAgIGlmICh5ZWFyIDwgdGhpcy5zdGFydERhdGUueWVhcigpIHx8ICh5ZWFyID09PSB0aGlzLnN0YXJ0RGF0ZS55ZWFyKCkgJiYgbW9udGggPCB0aGlzLnN0YXJ0RGF0ZS5tb250aCgpKSkge1xuICAgICAgICBtb250aCA9IHRoaXMuc3RhcnREYXRlLm1vbnRoKCk7XG4gICAgICAgIHllYXIgPSB0aGlzLnN0YXJ0RGF0ZS55ZWFyKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubWluRGF0ZSkge1xuICAgICAgaWYgKHllYXIgPCB0aGlzLm1pbkRhdGUueWVhcigpIHx8ICh5ZWFyID09PSB0aGlzLm1pbkRhdGUueWVhcigpICYmIG1vbnRoIDwgdGhpcy5taW5EYXRlLm1vbnRoKCkpKSB7XG4gICAgICAgIG1vbnRoID0gdGhpcy5taW5EYXRlLm1vbnRoKCk7XG4gICAgICAgIHllYXIgPSB0aGlzLm1pbkRhdGUueWVhcigpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLm1heERhdGUpIHtcbiAgICAgIGlmICh5ZWFyID4gdGhpcy5tYXhEYXRlLnllYXIoKSB8fCAoeWVhciA9PT0gdGhpcy5tYXhEYXRlLnllYXIoKSAmJiBtb250aCA+IHRoaXMubWF4RGF0ZS5tb250aCgpKSkge1xuICAgICAgICBtb250aCA9IHRoaXMubWF4RGF0ZS5tb250aCgpO1xuICAgICAgICB5ZWFyID0gdGhpcy5tYXhEYXRlLnllYXIoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5jYWxlbmRhclZhcmlhYmxlc1tzaWRlXS5kcm9wZG93bnMuY3VycmVudFllYXIgPSB5ZWFyO1xuICAgIHRoaXMuY2FsZW5kYXJWYXJpYWJsZXNbc2lkZV0uZHJvcGRvd25zLmN1cnJlbnRNb250aCA9IG1vbnRoO1xuICAgIGlmIChpc0xlZnQpIHtcbiAgICAgIHRoaXMubGVmdENhbGVuZGFyLm1vbnRoLm1vbnRoKG1vbnRoKS55ZWFyKHllYXIpO1xuICAgICAgaWYgKHRoaXMubGlua2VkQ2FsZW5kYXJzKSB7XG4gICAgICAgIHRoaXMucmlnaHRDYWxlbmRhci5tb250aCA9IHRoaXMubGVmdENhbGVuZGFyLm1vbnRoLmNsb25lKCkuYWRkKDEsICdtb250aCcpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJpZ2h0Q2FsZW5kYXIubW9udGgubW9udGgobW9udGgpLnllYXIoeWVhcik7XG4gICAgICBpZiAodGhpcy5saW5rZWRDYWxlbmRhcnMpIHtcbiAgICAgICAgdGhpcy5sZWZ0Q2FsZW5kYXIubW9udGggPSB0aGlzLnJpZ2h0Q2FsZW5kYXIubW9udGguY2xvbmUoKS5zdWJ0cmFjdCgxLCAnbW9udGgnKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy51cGRhdGVDYWxlbmRhcnMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGljayBvbiBwcmV2aW91cyBtb250aFxuICAgKiBAcGFyYW0gc2lkZSBsZWZ0IG9yIHJpZ2h0IGNhbGVuZGFyXG4gICAqL1xuICBjbGlja1ByZXYoc2lkZTogU2lkZUVudW0pIHtcbiAgICBpZiAoc2lkZSA9PT0gU2lkZUVudW0ubGVmdCkge1xuICAgICAgdGhpcy5sZWZ0Q2FsZW5kYXIubW9udGguc3VidHJhY3QoMSwgJ21vbnRoJyk7XG4gICAgICBpZiAodGhpcy5saW5rZWRDYWxlbmRhcnMpIHtcbiAgICAgICAgdGhpcy5yaWdodENhbGVuZGFyLm1vbnRoLnN1YnRyYWN0KDEsICdtb250aCcpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJpZ2h0Q2FsZW5kYXIubW9udGguc3VidHJhY3QoMSwgJ21vbnRoJyk7XG4gICAgfVxuICAgIHRoaXMudXBkYXRlQ2FsZW5kYXJzKCk7XG4gIH1cbiAgLyoqXG4gICAqIENsaWNrIG9uIG5leHQgbW9udGhcbiAgICogQHBhcmFtIHNpZGUgbGVmdCBvciByaWdodCBjYWxlbmRhclxuICAgKi9cbiAgY2xpY2tOZXh0KHNpZGU6IFNpZGVFbnVtKSB7XG4gICAgaWYgKHNpZGUgPT09IFNpZGVFbnVtLmxlZnQpIHtcbiAgICAgIHRoaXMubGVmdENhbGVuZGFyLm1vbnRoLmFkZCgxLCAnbW9udGgnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yaWdodENhbGVuZGFyLm1vbnRoLmFkZCgxLCAnbW9udGgnKTtcbiAgICAgIGlmICh0aGlzLmxpbmtlZENhbGVuZGFycykge1xuICAgICAgICB0aGlzLmxlZnRDYWxlbmRhci5tb250aC5hZGQoMSwgJ21vbnRoJyk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMudXBkYXRlQ2FsZW5kYXJzKCk7XG4gIH1cbiAgLyoqXG4gICAqIFdoZW4gc2VsZWN0aW5nIGEgZGF0ZVxuICAgKiBAcGFyYW0gZSBldmVudDogZ2V0IHZhbHVlIGJ5IGUudGFyZ2V0LnZhbHVlXG4gICAqIEBwYXJhbSBzaWRlIGxlZnQgb3IgcmlnaHRcbiAgICogQHBhcmFtIHJvdyByb3cgcG9zaXRpb24gb2YgdGhlIGN1cnJlbnQgZGF0ZSBjbGlja2VkXG4gICAqIEBwYXJhbSBjb2wgY29sIHBvc2l0aW9uIG9mIHRoZSBjdXJyZW50IGRhdGUgY2xpY2tlZFxuICAgKi9cbiAgY2xpY2tEYXRlKGUsIHNpZGU6IFNpZGVFbnVtLCByb3c6IG51bWJlciwgY29sOiBudW1iZXIpIHtcbiAgICBpZiAoZS50YXJnZXQudGFnTmFtZSA9PT0gJ1REJykge1xuICAgICAgaWYgKCFlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2F2YWlsYWJsZScpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGUudGFyZ2V0LnRhZ05hbWUgPT09ICdTUEFOJykge1xuICAgICAgaWYgKCFlLnRhcmdldC5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnYXZhaWxhYmxlJykpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5yYW5nZXNBcnJheS5sZW5ndGgpIHtcbiAgICAgIHRoaXMuY2hvc2VuUmFuZ2UgPSB0aGlzLmxvY2FsZS5jdXN0b21SYW5nZUxhYmVsO1xuICAgIH1cblxuICAgIGxldCBkYXRlID0gc2lkZSA9PT0gU2lkZUVudW0ubGVmdCA/IHRoaXMubGVmdENhbGVuZGFyLmNhbGVuZGFyW3Jvd11bY29sXSA6IHRoaXMucmlnaHRDYWxlbmRhci5jYWxlbmRhcltyb3ddW2NvbF07XG5cbiAgICBpZiAodGhpcy5lbmREYXRlIHx8IGRhdGUuaXNCZWZvcmUodGhpcy5zdGFydERhdGUsICdkYXknKSkgeyAvLyBwaWNraW5nIHN0YXJ0XG4gICAgICBpZiAodGhpcy50aW1lUGlja2VyKSB7XG4gICAgICAgIGRhdGUgPSB0aGlzLl9nZXREYXRlV2l0aFRpbWUoZGF0ZSwgU2lkZUVudW0ubGVmdCk7XG4gICAgICB9XG4gICAgICB0aGlzLmVuZERhdGUgPSBudWxsO1xuICAgICAgdGhpcy5zZXRTdGFydERhdGUoZGF0ZS5jbG9uZSgpKTtcbiAgICB9IGVsc2UgaWYgKCF0aGlzLmVuZERhdGUgJiYgZGF0ZS5pc0JlZm9yZSh0aGlzLnN0YXJ0RGF0ZSkpIHtcbiAgICAgIC8vIHNwZWNpYWwgY2FzZTogY2xpY2tpbmcgdGhlIHNhbWUgZGF0ZSBmb3Igc3RhcnQvZW5kLFxuICAgICAgLy8gYnV0IHRoZSB0aW1lIG9mIHRoZSBlbmQgZGF0ZSBpcyBiZWZvcmUgdGhlIHN0YXJ0IGRhdGVcbiAgICAgIHRoaXMuc2V0RW5kRGF0ZSh0aGlzLnN0YXJ0RGF0ZS5jbG9uZSgpKTtcbiAgICB9IGVsc2UgeyAvLyBwaWNraW5nIGVuZFxuICAgICAgaWYgKHRoaXMudGltZVBpY2tlcikge1xuICAgICAgICBkYXRlID0gdGhpcy5fZ2V0RGF0ZVdpdGhUaW1lKGRhdGUsIFNpZGVFbnVtLnJpZ2h0KTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0RW5kRGF0ZShkYXRlLmNsb25lKCkpO1xuICAgICAgaWYgKHRoaXMuYXV0b0FwcGx5KSB7XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlQ2hvc2VuTGFiZWwoKTtcbiAgICAgICAgdGhpcy5jbGlja0FwcGx5KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2luZ2xlRGF0ZVBpY2tlcikge1xuICAgICAgdGhpcy5zZXRFbmREYXRlKHRoaXMuc3RhcnREYXRlKTtcbiAgICAgIHRoaXMudXBkYXRlRWxlbWVudCgpO1xuICAgICAgaWYgKHRoaXMuYXV0b0FwcGx5KSB7XG4gICAgICAgIHRoaXMuY2xpY2tBcHBseSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMudXBkYXRlVmlldygpO1xuXG4gICAgLy8gVGhpcyBpcyB0byBjYW5jZWwgdGhlIGJsdXIgZXZlbnQgaGFuZGxlciBpZiB0aGUgbW91c2Ugd2FzIGluIG9uZSBvZiB0aGUgaW5wdXRzXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuICB9XG4gIC8qKlxuICAgKiAgQ2xpY2sgb24gdGhlIGN1c3RvbSByYW5nZVxuICAgKiBAcGFyYW0gZTogRXZlbnRcbiAgICogQHBhcmFtIGxhYmVsXG4gICAqL1xuICBjbGlja1JhbmdlKGUsIGxhYmVsKSB7XG4gICAgdGhpcy5jaG9zZW5SYW5nZSA9IGxhYmVsO1xuICAgIGlmIChsYWJlbCA9PT0gdGhpcy5sb2NhbGUuY3VzdG9tUmFuZ2VMYWJlbCkge1xuICAgICAgdGhpcy5pc1Nob3duID0gdHJ1ZTsgLy8gc2hvdyBjYWxlbmRhcnNcbiAgICAgIHRoaXMuc2hvd0NhbEluUmFuZ2VzID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgZGF0ZXMgPSB0aGlzLnJhbmdlc1tsYWJlbF07XG4gICAgICB0aGlzLnN0YXJ0RGF0ZSA9IGRhdGVzWzBdLmNsb25lKCk7XG4gICAgICB0aGlzLmVuZERhdGUgPSBkYXRlc1sxXS5jbG9uZSgpO1xuICAgICAgaWYgKHRoaXMuc2hvd1JhbmdlTGFiZWxPbklucHV0ICYmIGxhYmVsICE9PSB0aGlzLmxvY2FsZS5jdXN0b21SYW5nZUxhYmVsKSB7XG4gICAgICAgIHRoaXMuY2hvc2VuTGFiZWwgPSBsYWJlbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlQ2hvc2VuTGFiZWwoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2hvd0NhbEluUmFuZ2VzID0gKCF0aGlzLnJhbmdlc0FycmF5Lmxlbmd0aCkgfHwgdGhpcy5hbHdheXNTaG93Q2FsZW5kYXJzO1xuXG4gICAgICBpZiAoIXRoaXMudGltZVBpY2tlcikge1xuICAgICAgICB0aGlzLnN0YXJ0RGF0ZS5zdGFydE9mKCdkYXknKTtcbiAgICAgICAgdGhpcy5lbmREYXRlLmVuZE9mKCdkYXknKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLmFsd2F5c1Nob3dDYWxlbmRhcnMpIHtcbiAgICAgICAgdGhpcy5pc1Nob3duID0gZmFsc2U7IC8vIGhpZGUgY2FsZW5kYXJzXG4gICAgICB9XG4gICAgICB0aGlzLnJhbmdlQ2xpY2tlZC5lbWl0KHsgbGFiZWw6IGxhYmVsLCBkYXRlczogZGF0ZXMgfSk7XG4gICAgICBpZiAoIXRoaXMua2VlcENhbGVuZGFyT3BlbmluZ1dpdGhSYW5nZSkge1xuICAgICAgICB0aGlzLmNsaWNrQXBwbHkoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubGVmdENhbGVuZGFyLm1vbnRoLm1vbnRoKGRhdGVzWzBdLm1vbnRoKCkpO1xuICAgICAgICB0aGlzLmxlZnRDYWxlbmRhci5tb250aC55ZWFyKGRhdGVzWzBdLnllYXIoKSk7XG4gICAgICAgIHRoaXMucmlnaHRDYWxlbmRhci5tb250aC5tb250aChkYXRlc1sxXS5tb250aCgpKTtcbiAgICAgICAgdGhpcy5yaWdodENhbGVuZGFyLm1vbnRoLnllYXIoZGF0ZXNbMV0ueWVhcigpKTtcbiAgICAgICAgdGhpcy51cGRhdGVDYWxlbmRhcnMoKTtcbiAgICAgICAgaWYgKHRoaXMudGltZVBpY2tlcikge1xuICAgICAgICAgIHRoaXMucmVuZGVyVGltZVBpY2tlcihTaWRlRW51bS5sZWZ0KTtcbiAgICAgICAgICB0aGlzLnJlbmRlclRpbWVQaWNrZXIoU2lkZUVudW0ucmlnaHQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cblxuXG4gIHNob3coZT8pIHtcbiAgICBpZiAodGhpcy5pc1Nob3duKSB7IHJldHVybjsgfVxuICAgIHRoaXMuX29sZC5zdGFydCA9IHRoaXMuc3RhcnREYXRlLmNsb25lKCk7XG4gICAgdGhpcy5fb2xkLmVuZCA9IHRoaXMuZW5kRGF0ZS5jbG9uZSgpO1xuICAgIHRoaXMuaXNTaG93biA9IHRydWU7XG4gICAgdGhpcy51cGRhdGVWaWV3KCk7XG4gIH1cblxuICBoaWRlKGU/KSB7XG4gICAgaWYgKCF0aGlzLmlzU2hvd24pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gaW5jb21wbGV0ZSBkYXRlIHNlbGVjdGlvbiwgcmV2ZXJ0IHRvIGxhc3QgdmFsdWVzXG4gICAgaWYgKCF0aGlzLmVuZERhdGUpIHtcbiAgICAgIGlmICh0aGlzLl9vbGQuc3RhcnQpIHtcbiAgICAgICAgdGhpcy5zdGFydERhdGUgPSB0aGlzLl9vbGQuc3RhcnQuY2xvbmUoKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLl9vbGQuZW5kKSB7XG4gICAgICAgIHRoaXMuZW5kRGF0ZSA9IHRoaXMuX29sZC5lbmQuY2xvbmUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBpZiBhIG5ldyBkYXRlIHJhbmdlIHdhcyBzZWxlY3RlZCwgaW52b2tlIHRoZSB1c2VyIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAgaWYgKCF0aGlzLnN0YXJ0RGF0ZS5pc1NhbWUodGhpcy5fb2xkLnN0YXJ0KSB8fCAhdGhpcy5lbmREYXRlLmlzU2FtZSh0aGlzLl9vbGQuZW5kKSkge1xuICAgICAgLy8gdGhpcy5jYWxsYmFjayh0aGlzLnN0YXJ0RGF0ZSwgdGhpcy5lbmREYXRlLCB0aGlzLmNob3NlbkxhYmVsKTtcbiAgICB9XG5cbiAgICAvLyBpZiBwaWNrZXIgaXMgYXR0YWNoZWQgdG8gYSB0ZXh0IGlucHV0LCB1cGRhdGUgaXRcbiAgICB0aGlzLnVwZGF0ZUVsZW1lbnQoKTtcbiAgICB0aGlzLmlzU2hvd24gPSBmYWxzZTtcbiAgICB0aGlzLl9yZWYuZGV0ZWN0Q2hhbmdlcygpO1xuXG4gIH1cblxuICAvKipcbiAgICogaGFuZGxlIGNsaWNrIG9uIGFsbCBlbGVtZW50IGluIHRoZSBjb21wb25lbnQsIHVzZWZ1bGwgZm9yIG91dHNpZGUgb2YgY2xpY2tcbiAgICogQHBhcmFtIGUgZXZlbnRcbiAgICovXG4gIGhhbmRsZUludGVybmFsQ2xpY2soZSkge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIH1cbiAgLyoqXG4gICAqIHVwZGF0ZSB0aGUgbG9jYWxlIG9wdGlvbnNcbiAgICogQHBhcmFtIGxvY2FsZVxuICAgKi9cbiAgdXBkYXRlTG9jYWxlKGxvY2FsZSkge1xuICAgIGZvciAoY29uc3Qga2V5IGluIGxvY2FsZSkge1xuICAgICAgaWYgKGxvY2FsZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIHRoaXMubG9jYWxlW2tleV0gPSBsb2NhbGVba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLyoqXG4gICAqICBjbGVhciB0aGUgZGF0ZXJhbmdlIHBpY2tlclxuICAgKi9cbiAgY2xlYXIoKSB7XG4gICAgdGhpcy5zdGFydERhdGUgPSBtb21lbnQoKS5zdGFydE9mKCdkYXknKTtcbiAgICB0aGlzLmVuZERhdGUgPSBtb21lbnQoKS5lbmRPZignZGF5Jyk7XG4gICAgdGhpcy5jaG9vc2VkRGF0ZS5lbWl0KHsgY2hvc2VuTGFiZWw6ICcnLCBzdGFydERhdGU6IG51bGwsIGVuZERhdGU6IG51bGwgfSk7XG4gICAgdGhpcy5kYXRlc1VwZGF0ZWQuZW1pdCh7IHN0YXJ0RGF0ZTogbnVsbCwgZW5kRGF0ZTogbnVsbCB9KTtcbiAgICB0aGlzLmhpZGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kIG91dCBpZiB0aGUgc2VsZWN0ZWQgcmFuZ2Ugc2hvdWxkIGJlIGRpc2FibGVkIGlmIGl0IGRvZXNuJ3RcbiAgICogZml0IGludG8gbWluRGF0ZSBhbmQgbWF4RGF0ZSBsaW1pdGF0aW9ucy5cbiAgICovXG4gIGRpc2FibGVSYW5nZShyYW5nZSkge1xuICAgIGlmIChyYW5nZSA9PT0gdGhpcy5sb2NhbGUuY3VzdG9tUmFuZ2VMYWJlbCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCByYW5nZU1hcmtlcnMgPSB0aGlzLnJhbmdlc1tyYW5nZV07XG4gICAgY29uc3QgYXJlQm90aEJlZm9yZSA9IHJhbmdlTWFya2Vycy5ldmVyeShkYXRlID0+IHtcbiAgICAgIGlmICghdGhpcy5taW5EYXRlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkYXRlLmlzQmVmb3JlKHRoaXMubWluRGF0ZSk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBhcmVCb3RoQWZ0ZXIgPSByYW5nZU1hcmtlcnMuZXZlcnkoZGF0ZSA9PiB7XG4gICAgICBpZiAoIXRoaXMubWF4RGF0ZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gZGF0ZS5pc0FmdGVyKHRoaXMubWF4RGF0ZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIChhcmVCb3RoQmVmb3JlIHx8IGFyZUJvdGhBZnRlcik7XG4gIH1cblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIGRhdGUgdGhlIGRhdGUgdG8gYWRkIHRpbWVcbiAgICogQHBhcmFtIHNpZGUgbGVmdCBvciByaWdodFxuICAgKi9cbiAgcHJpdmF0ZSBfZ2V0RGF0ZVdpdGhUaW1lKGRhdGUsIHNpZGU6IFNpZGVFbnVtKTogX21vbWVudC5Nb21lbnQge1xuICAgIGxldCBob3VyID0gcGFyc2VJbnQodGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnNlbGVjdGVkSG91ciwgMTApO1xuICAgIGlmICghdGhpcy50aW1lUGlja2VyMjRIb3VyKSB7XG4gICAgICBjb25zdCBhbXBtID0gdGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLmFtcG1Nb2RlbDtcbiAgICAgIGlmIChhbXBtID09PSAnUE0nICYmIGhvdXIgPCAxMikge1xuICAgICAgICBob3VyICs9IDEyO1xuICAgICAgfVxuICAgICAgaWYgKGFtcG0gPT09ICdBTScgJiYgaG91ciA9PT0gMTIpIHtcbiAgICAgICAgaG91ciA9IDA7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IG1pbnV0ZSA9IHBhcnNlSW50KHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5zZWxlY3RlZE1pbnV0ZSwgMTApO1xuICAgIGNvbnN0IHNlY29uZCA9IHRoaXMudGltZVBpY2tlclNlY29uZHMgPyBwYXJzZUludCh0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uc2VsZWN0ZWRTZWNvbmQsIDEwKSA6IDA7XG4gICAgcmV0dXJuIGRhdGUuY2xvbmUoKS5ob3VyKGhvdXIpLm1pbnV0ZShtaW51dGUpLnNlY29uZChzZWNvbmQpO1xuICB9XG4gIC8qKlxuICAgKiAgYnVpbGQgdGhlIGxvY2FsZSBjb25maWdcbiAgICovXG4gIHByaXZhdGUgX2J1aWxkTG9jYWxlKCkge1xuICAgIGlmICghdGhpcy5sb2NhbGUuZm9ybWF0KSB7XG4gICAgICBpZiAodGhpcy50aW1lUGlja2VyKSB7XG4gICAgICAgIHRoaXMubG9jYWxlLmZvcm1hdCA9IG1vbWVudC5sb2NhbGVEYXRhKCkubG9uZ0RhdGVGb3JtYXQoJ2xsbCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5sb2NhbGUuZm9ybWF0ID0gbW9tZW50LmxvY2FsZURhdGEoKS5sb25nRGF0ZUZvcm1hdCgnTCcpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBwcml2YXRlIF9idWlsZENlbGxzKGNhbGVuZGFyLCBzaWRlOiBTaWRlRW51bSkge1xuICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IDY7IHJvdysrKSB7XG4gICAgICB0aGlzLmNhbGVuZGFyVmFyaWFibGVzW3NpZGVdLmNsYXNzZXNbcm93XSA9IHt9O1xuICAgICAgY29uc3Qgcm93Q2xhc3NlcyA9IFtdO1xuICAgICAgaWYgKHRoaXMuZW1wdHlXZWVrUm93Q2xhc3MgJiYgIXRoaXMuaGFzQ3VycmVudE1vbnRoRGF5cyh0aGlzLmNhbGVuZGFyVmFyaWFibGVzW3NpZGVdLm1vbnRoLCBjYWxlbmRhcltyb3ddKSkge1xuICAgICAgICByb3dDbGFzc2VzLnB1c2godGhpcy5lbXB0eVdlZWtSb3dDbGFzcyk7XG4gICAgICB9XG4gICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCA3OyBjb2wrKykge1xuICAgICAgICBjb25zdCBjbGFzc2VzID0gW107XG4gICAgICAgIC8vIGhpZ2hsaWdodCB0b2RheSdzIGRhdGVcbiAgICAgICAgaWYgKGNhbGVuZGFyW3Jvd11bY29sXS5pc1NhbWUobmV3IERhdGUoKSwgJ2RheScpKSB7XG4gICAgICAgICAgY2xhc3Nlcy5wdXNoKCd0b2RheScpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGhpZ2hsaWdodCB3ZWVrZW5kc1xuICAgICAgICBpZiAoY2FsZW5kYXJbcm93XVtjb2xdLmlzb1dlZWtkYXkoKSA+IDUpIHtcbiAgICAgICAgICBjbGFzc2VzLnB1c2goJ3dlZWtlbmQnKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBncmV5IG91dCB0aGUgZGF0ZXMgaW4gb3RoZXIgbW9udGhzIGRpc3BsYXllZCBhdCBiZWdpbm5pbmcgYW5kIGVuZCBvZiB0aGlzIGNhbGVuZGFyXG4gICAgICAgIGlmIChjYWxlbmRhcltyb3ddW2NvbF0ubW9udGgoKSAhPT0gY2FsZW5kYXJbMV1bMV0ubW9udGgoKSkge1xuICAgICAgICAgIGNsYXNzZXMucHVzaCgnb2ZmJyk7XG5cbiAgICAgICAgICAvLyBtYXJrIHRoZSBsYXN0IGRheSBvZiB0aGUgcHJldmlvdXMgbW9udGggaW4gdGhpcyBjYWxlbmRhclxuICAgICAgICAgIGlmICh0aGlzLmxhc3REYXlPZlByZXZpb3VzTW9udGhDbGFzcyAmJiAoY2FsZW5kYXJbcm93XVtjb2xdLm1vbnRoKCkgPCBjYWxlbmRhclsxXVsxXS5tb250aCgpIHx8IGNhbGVuZGFyWzFdWzFdLm1vbnRoKCkgPT09IDApICYmIGNhbGVuZGFyW3Jvd11bY29sXS5kYXRlKCkgPT09IHRoaXMuY2FsZW5kYXJWYXJpYWJsZXNbc2lkZV0uZGF5c0luTGFzdE1vbnRoKSB7XG4gICAgICAgICAgICBjbGFzc2VzLnB1c2godGhpcy5sYXN0RGF5T2ZQcmV2aW91c01vbnRoQ2xhc3MpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIG1hcmsgdGhlIGZpcnN0IGRheSBvZiB0aGUgbmV4dCBtb250aCBpbiB0aGlzIGNhbGVuZGFyXG4gICAgICAgICAgaWYgKHRoaXMuZmlyc3REYXlPZk5leHRNb250aENsYXNzICYmIChjYWxlbmRhcltyb3ddW2NvbF0ubW9udGgoKSA+IGNhbGVuZGFyWzFdWzFdLm1vbnRoKCkgfHwgY2FsZW5kYXJbcm93XVtjb2xdLm1vbnRoKCkgPT09IDApICYmIGNhbGVuZGFyW3Jvd11bY29sXS5kYXRlKCkgPT09IDEpIHtcbiAgICAgICAgICAgIGNsYXNzZXMucHVzaCh0aGlzLmZpcnN0RGF5T2ZOZXh0TW9udGhDbGFzcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIG1hcmsgdGhlIGZpcnN0IGRheSBvZiB0aGUgY3VycmVudCBtb250aCB3aXRoIGEgY3VzdG9tIGNsYXNzXG4gICAgICAgIGlmICh0aGlzLmZpcnN0TW9udGhEYXlDbGFzcyAmJiBjYWxlbmRhcltyb3ddW2NvbF0ubW9udGgoKSA9PT0gY2FsZW5kYXJbMV1bMV0ubW9udGgoKSAmJiBjYWxlbmRhcltyb3ddW2NvbF0uZGF0ZSgpID09PSBjYWxlbmRhci5maXJzdERheS5kYXRlKCkpIHtcbiAgICAgICAgICBjbGFzc2VzLnB1c2godGhpcy5maXJzdE1vbnRoRGF5Q2xhc3MpO1xuICAgICAgICB9XG4gICAgICAgIC8vIG1hcmsgdGhlIGxhc3QgZGF5IG9mIHRoZSBjdXJyZW50IG1vbnRoIHdpdGggYSBjdXN0b20gY2xhc3NcbiAgICAgICAgaWYgKHRoaXMubGFzdE1vbnRoRGF5Q2xhc3MgJiYgY2FsZW5kYXJbcm93XVtjb2xdLm1vbnRoKCkgPT09IGNhbGVuZGFyWzFdWzFdLm1vbnRoKCkgJiYgY2FsZW5kYXJbcm93XVtjb2xdLmRhdGUoKSA9PT0gY2FsZW5kYXIubGFzdERheS5kYXRlKCkpIHtcbiAgICAgICAgICBjbGFzc2VzLnB1c2godGhpcy5sYXN0TW9udGhEYXlDbGFzcyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gZG9uJ3QgYWxsb3cgc2VsZWN0aW9uIG9mIGRhdGVzIGJlZm9yZSB0aGUgbWluaW11bSBkYXRlXG4gICAgICAgIGlmICh0aGlzLm1pbkRhdGUgJiYgY2FsZW5kYXJbcm93XVtjb2xdLmlzQmVmb3JlKHRoaXMubWluRGF0ZSwgJ2RheScpKSB7XG4gICAgICAgICAgY2xhc3Nlcy5wdXNoKCdvZmYnLCAnZGlzYWJsZWQnKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBkb24ndCBhbGxvdyBzZWxlY3Rpb24gb2YgZGF0ZXMgYWZ0ZXIgdGhlIG1heGltdW0gZGF0ZVxuICAgICAgICBpZiAodGhpcy5jYWxlbmRhclZhcmlhYmxlc1tzaWRlXS5tYXhEYXRlICYmIGNhbGVuZGFyW3Jvd11bY29sXS5pc0FmdGVyKHRoaXMuY2FsZW5kYXJWYXJpYWJsZXNbc2lkZV0ubWF4RGF0ZSwgJ2RheScpKSB7XG4gICAgICAgICAgY2xhc3Nlcy5wdXNoKCdvZmYnLCAnZGlzYWJsZWQnKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBkb24ndCBhbGxvdyBzZWxlY3Rpb24gb2YgZGF0ZSBpZiBhIGN1c3RvbSBmdW5jdGlvbiBkZWNpZGVzIGl0J3MgaW52YWxpZFxuICAgICAgICBpZiAodGhpcy5pc0ludmFsaWREYXRlKGNhbGVuZGFyW3Jvd11bY29sXSkpIHtcbiAgICAgICAgICBjbGFzc2VzLnB1c2goJ29mZicsICdkaXNhYmxlZCcpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGhpZ2hsaWdodCB0aGUgY3VycmVudGx5IHNlbGVjdGVkIHN0YXJ0IGRhdGVcbiAgICAgICAgaWYgKHRoaXMuc3RhcnREYXRlICYmIGNhbGVuZGFyW3Jvd11bY29sXS5mb3JtYXQoJ1lZWVktTU0tREQnKSA9PT0gdGhpcy5zdGFydERhdGUuZm9ybWF0KCdZWVlZLU1NLUREJykpIHtcbiAgICAgICAgICBjbGFzc2VzLnB1c2goJ2FjdGl2ZScsICdzdGFydC1kYXRlJyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gaGlnaGxpZ2h0IHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgZW5kIGRhdGVcbiAgICAgICAgaWYgKHRoaXMuZW5kRGF0ZSAhPT0gbnVsbCAmJiBjYWxlbmRhcltyb3ddW2NvbF0uZm9ybWF0KCdZWVlZLU1NLUREJykgPT09IHRoaXMuZW5kRGF0ZS5mb3JtYXQoJ1lZWVktTU0tREQnKSkge1xuICAgICAgICAgIGNsYXNzZXMucHVzaCgnYWN0aXZlJywgJ2VuZC1kYXRlJyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gaGlnaGxpZ2h0IGRhdGVzIGluLWJldHdlZW4gdGhlIHNlbGVjdGVkIGRhdGVzXG4gICAgICAgIGlmICh0aGlzLmVuZERhdGUgIT09IG51bGwgJiYgY2FsZW5kYXJbcm93XVtjb2xdID4gdGhpcy5zdGFydERhdGUgJiYgY2FsZW5kYXJbcm93XVtjb2xdIDwgdGhpcy5lbmREYXRlKSB7XG4gICAgICAgICAgY2xhc3Nlcy5wdXNoKCdpbi1yYW5nZScpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGFwcGx5IGN1c3RvbSBjbGFzc2VzIGZvciB0aGlzIGRhdGVcbiAgICAgICAgY29uc3QgaXNDdXN0b20gPSB0aGlzLmlzQ3VzdG9tRGF0ZShjYWxlbmRhcltyb3ddW2NvbF0pO1xuICAgICAgICBpZiAoaXNDdXN0b20gIT09IGZhbHNlKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBpc0N1c3RvbSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGNsYXNzZXMucHVzaChpc0N1c3RvbSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KGNsYXNzZXMsIGlzQ3VzdG9tKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gc3RvcmUgY2xhc3NlcyB2YXJcbiAgICAgICAgbGV0IGNuYW1lID0gJyc7XG4gICAgICAgIGxldCBkaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNsYXNzZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjbmFtZSArPSBjbGFzc2VzW2ldICsgJyAnO1xuICAgICAgICAgIGlmIChjbGFzc2VzW2ldID09PSAnZGlzYWJsZWQnKSB7XG4gICAgICAgICAgICBkaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghZGlzYWJsZWQpIHtcbiAgICAgICAgICBjbmFtZSArPSAnYXZhaWxhYmxlJztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNhbGVuZGFyVmFyaWFibGVzW3NpZGVdLmNsYXNzZXNbcm93XVtjb2xdID0gY25hbWUucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpO1xuICAgICAgfVxuICAgICAgdGhpcy5jYWxlbmRhclZhcmlhYmxlc1tzaWRlXS5jbGFzc2VzW3Jvd10uY2xhc3NMaXN0ID0gcm93Q2xhc3Nlcy5qb2luKCcgJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEZpbmQgb3V0IGlmIHRoZSBjdXJyZW50IGNhbGVuZGFyIHJvdyBoYXMgY3VycmVudCBtb250aCBkYXlzXG4gICAqIChhcyBvcHBvc2VkIHRvIGNvbnNpc3Rpbmcgb2Ygb25seSBwcmV2aW91cy9uZXh0IG1vbnRoIGRheXMpXG4gICAqL1xuICBoYXNDdXJyZW50TW9udGhEYXlzKGN1cnJlbnRNb250aCwgcm93KSB7XG4gICAgZm9yIChsZXQgZGF5ID0gMDsgZGF5IDwgNzsgZGF5KyspIHtcbiAgICAgIGlmIChyb3dbZGF5XS5tb250aCgpID09PSBjdXJyZW50TW9udGgpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuIl19