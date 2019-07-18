/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Days, MonthWeeks, Months } from './enums';
import Utils from './Utils';
var CronEditorComponent = /** @class */ (function () {
    function CronEditorComponent() {
        // the name is an Angular convention, @Input variable name + "Change" suffix
        this.cronChange = new EventEmitter();
        this.selectOptions = this.getSelectOptions();
    }
    Object.defineProperty(CronEditorComponent.prototype, "cron", {
        get: /**
         * @return {?}
         */
        function () { return this.localCron; },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this.localCron = value;
            this.cronChange.emit(this.localCron);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    CronEditorComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        if (this.options.removeSeconds) {
            this.options.hideSeconds = true;
        }
        this.state = this.getDefaultState();
        this.handleModelChange(this.cron);
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    CronEditorComponent.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        /** @type {?} */
        var newCron = changes['cron'];
        if (newCron && !newCron.firstChange) {
            this.handleModelChange(this.cron);
        }
    };
    /**
     * @param {?} tab
     * @return {?}
     */
    CronEditorComponent.prototype.setActiveTab = /**
     * @param {?} tab
     * @return {?}
     */
    function (tab) {
        if (!this.disabled) {
            this.activeTab = tab;
            this.regenerateCron();
        }
    };
    /**
     * @param {?} day
     * @return {?}
     */
    CronEditorComponent.prototype.dayDisplay = /**
     * @param {?} day
     * @return {?}
     */
    function (day) {
        return Days[day];
    };
    /**
     * @param {?} monthWeekNumber
     * @return {?}
     */
    CronEditorComponent.prototype.monthWeekDisplay = /**
     * @param {?} monthWeekNumber
     * @return {?}
     */
    function (monthWeekNumber) {
        return MonthWeeks[monthWeekNumber];
    };
    /**
     * @param {?} month
     * @return {?}
     */
    CronEditorComponent.prototype.monthDisplay = /**
     * @param {?} month
     * @return {?}
     */
    function (month) {
        return Months[month];
    };
    /**
     * @param {?} month
     * @return {?}
     */
    CronEditorComponent.prototype.monthDayDisplay = /**
     * @param {?} month
     * @return {?}
     */
    function (month) {
        if (month === 'L') {
            return 'Last Day';
        }
        else if (month === 'LW') {
            return 'Last Weekday';
        }
        else if (month === '1W') {
            return 'First Weekday';
        }
        else {
            return "" + month + this.getOrdinalSuffix(month) + " day";
        }
    };
    /**
     * @return {?}
     */
    CronEditorComponent.prototype.regenerateCron = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this.isDirty = true;
        switch (this.activeTab) {
            case 'minutes':
                this.cron = "0/" + this.state.minutes.minutes + " * 1/1 * ?";
                if (!this.options.removeSeconds) {
                    this.cron = this.state.minutes.seconds + " " + this.cron;
                }
                if (!this.options.removeYears) {
                    this.cron = this.cron + " *";
                }
                break;
            case 'hourly':
                this.cron = this.state.hourly.minutes + " 0/" + this.state.hourly.hours + " 1/1 * ?";
                if (!this.options.removeSeconds) {
                    this.cron = this.state.hourly.seconds + " " + this.cron;
                }
                if (!this.options.removeYears) {
                    this.cron = this.cron + " *";
                }
                break;
            case 'daily':
                switch (this.state.daily.subTab) {
                    case 'everyDays':
                        // tslint:disable-next-line:max-line-length
                        this.cron = this.state.daily.everyDays.minutes + " " + this.hourToCron(this.state.daily.everyDays.hours, this.state.daily.everyDays.hourType) + " 1/" + this.state.daily.everyDays.days + " * ?";
                        if (!this.options.removeSeconds) {
                            this.cron = this.state.daily.everyDays.seconds + " " + this.cron;
                        }
                        if (!this.options.removeYears) {
                            this.cron = this.cron + " *";
                        }
                        break;
                    case 'everyWeekDay':
                        // tslint:disable-next-line:max-line-length
                        this.cron = this.state.daily.everyWeekDay.minutes + " " + this.hourToCron(this.state.daily.everyWeekDay.hours, this.state.daily.everyWeekDay.hourType) + " ? * MON-FRI";
                        if (!this.options.removeSeconds) {
                            this.cron = this.state.daily.everyWeekDay.seconds + " " + this.cron;
                        }
                        if (!this.options.removeYears) {
                            this.cron = this.cron + " *";
                        }
                        break;
                    default:
                        throw new Error('Invalid cron daily subtab selection');
                }
                break;
            case 'weekly':
                /** @type {?} */
                var days = this.selectOptions.days
                    .reduce((/**
                 * @param {?} acc
                 * @param {?} day
                 * @return {?}
                 */
                function (acc, day) { return _this.state.weekly[day] ? acc.concat([day]) : acc; }), [])
                    .join(',');
                this.cron = this.state.weekly.minutes + " " + this.hourToCron(this.state.weekly.hours, this.state.weekly.hourType) + " ? * " + days;
                if (!this.options.removeSeconds) {
                    this.cron = this.state.weekly.seconds + " " + this.cron;
                }
                if (!this.options.removeYears) {
                    this.cron = this.cron + " *";
                }
                break;
            case 'monthly':
                switch (this.state.monthly.subTab) {
                    case 'specificDay':
                        /** @type {?} */
                        var day = this.state.monthly.runOnWeekday ? this.state.monthly.specificDay.day + "W" : this.state.monthly.specificDay.day;
                        // tslint:disable-next-line:max-line-length
                        this.cron = this.state.monthly.specificDay.minutes + " " + this.hourToCron(this.state.monthly.specificDay.hours, this.state.monthly.specificDay.hourType) + " " + day + " 1/" + this.state.monthly.specificDay.months + " ?";
                        if (!this.options.removeSeconds) {
                            this.cron = this.state.monthly.specificDay.seconds + " " + this.cron;
                        }
                        if (!this.options.removeYears) {
                            this.cron = this.cron + " *";
                        }
                        break;
                    case 'specificWeekDay':
                        // tslint:disable-next-line:max-line-length
                        this.cron = this.state.monthly.specificWeekDay.minutes + " " + this.hourToCron(this.state.monthly.specificWeekDay.hours, this.state.monthly.specificWeekDay.hourType) + " ? " + this.state.monthly.specificWeekDay.startMonth + "/" + this.state.monthly.specificWeekDay.months + " " + this.state.monthly.specificWeekDay.day + this.state.monthly.specificWeekDay.monthWeek;
                        if (!this.options.removeSeconds) {
                            this.cron = this.state.monthly.specificWeekDay.seconds + " " + this.cron;
                        }
                        if (!this.options.removeYears) {
                            this.cron = this.cron + " *";
                        }
                        break;
                    default:
                        throw new Error('Invalid cron monthly subtab selection');
                }
                break;
            case 'yearly':
                switch (this.state.yearly.subTab) {
                    case 'specificMonthDay':
                        // tslint:disable-next-line:max-line-length
                        /** @type {?} */
                        var day = this.state.yearly.runOnWeekday ? this.state.yearly.specificMonthDay.day + "W" : this.state.yearly.specificMonthDay.day;
                        // tslint:disable-next-line:max-line-length
                        this.cron = this.state.yearly.specificMonthDay.minutes + " " + this.hourToCron(this.state.yearly.specificMonthDay.hours, this.state.yearly.specificMonthDay.hourType) + " " + day + " " + this.state.yearly.specificMonthDay.month + " ?";
                        if (!this.options.removeSeconds) {
                            this.cron = this.state.yearly.specificMonthDay.seconds + " " + this.cron;
                        }
                        if (!this.options.removeYears) {
                            this.cron = this.cron + " *";
                        }
                        break;
                    case 'specificMonthWeek':
                        // tslint:disable-next-line:max-line-length
                        this.cron = this.state.yearly.specificMonthWeek.minutes + " " + this.hourToCron(this.state.yearly.specificMonthWeek.hours, this.state.yearly.specificMonthWeek.hourType) + " ? " + this.state.yearly.specificMonthWeek.month + " " + this.state.yearly.specificMonthWeek.day + this.state.yearly.specificMonthWeek.monthWeek;
                        if (!this.options.removeSeconds) {
                            this.cron = this.state.yearly.specificMonthWeek.seconds + " " + this.cron;
                        }
                        if (!this.options.removeYears) {
                            this.cron = this.cron + " *";
                        }
                        break;
                    default:
                        throw new Error('Invalid cron yearly subtab selection');
                }
                break;
            case 'advanced':
                this.cron = this.state.advanced.expression;
                break;
            default:
                throw new Error('Invalid cron active tab selection');
        }
    };
    /**
     * @private
     * @param {?} hour
     * @return {?}
     */
    CronEditorComponent.prototype.getAmPmHour = /**
     * @private
     * @param {?} hour
     * @return {?}
     */
    function (hour) {
        return this.options.use24HourTime ? hour : (hour + 11) % 12 + 1;
    };
    /**
     * @private
     * @param {?} hour
     * @return {?}
     */
    CronEditorComponent.prototype.getHourType = /**
     * @private
     * @param {?} hour
     * @return {?}
     */
    function (hour) {
        return this.options.use24HourTime ? undefined : (hour >= 12 ? 'PM' : 'AM');
    };
    /**
     * @private
     * @param {?} hour
     * @param {?} hourType
     * @return {?}
     */
    CronEditorComponent.prototype.hourToCron = /**
     * @private
     * @param {?} hour
     * @param {?} hourType
     * @return {?}
     */
    function (hour, hourType) {
        if (this.options.use24HourTime) {
            return hour;
        }
        else {
            return hourType === 'AM' ? (hour === 12 ? 0 : hour) : (hour === 12 ? 12 : hour + 12);
        }
    };
    /**
     * @private
     * @param {?} cron
     * @return {?}
     */
    CronEditorComponent.prototype.handleModelChange = /**
     * @private
     * @param {?} cron
     * @return {?}
     */
    function (cron) {
        var _this = this;
        if (this.isDirty) {
            this.isDirty = false;
            return;
        }
        else {
            this.isDirty = false;
        }
        this.validate(cron);
        /** @type {?} */
        var cronSeven = cron;
        if (this.options.removeSeconds) {
            cronSeven = "0 " + cron;
        }
        if (this.options.removeYears) {
            cronSeven = cronSeven + " *";
        }
        var _a = tslib_1.__read(cronSeven.split(' '), 6), seconds = _a[0], minutes = _a[1], hours = _a[2], dayOfMonth = _a[3], month = _a[4], dayOfWeek = _a[5];
        if (cronSeven.match(/\d+ 0\/\d+ \* 1\/1 \* \? \*/)) {
            this.activeTab = 'minutes';
            this.state.minutes.minutes = Number(minutes.substring(2));
            this.state.minutes.seconds = Number(seconds);
        }
        else if (cronSeven.match(/\d+ \d+ 0\/\d+ 1\/1 \* \? \*/)) {
            this.activeTab = 'hourly';
            this.state.hourly.hours = Number(hours.substring(2));
            this.state.hourly.minutes = Number(minutes);
            this.state.hourly.seconds = Number(seconds);
        }
        else if (cronSeven.match(/\d+ \d+ \d+ 1\/\d+ \* \? \*/)) {
            this.activeTab = 'daily';
            this.state.daily.subTab = 'everyDays';
            this.state.daily.everyDays.days = Number(dayOfMonth.substring(2));
            /** @type {?} */
            var parsedHours = Number(hours);
            this.state.daily.everyDays.hours = this.getAmPmHour(parsedHours);
            this.state.daily.everyDays.hourType = this.getHourType(parsedHours);
            this.state.daily.everyDays.minutes = Number(minutes);
            this.state.daily.everyDays.seconds = Number(seconds);
        }
        else if (cronSeven.match(/\d+ \d+ \d+ \? \* MON-FRI \*/)) {
            this.activeTab = 'daily';
            this.state.daily.subTab = 'everyWeekDay';
            /** @type {?} */
            var parsedHours = Number(hours);
            this.state.daily.everyWeekDay.hours = this.getAmPmHour(parsedHours);
            this.state.daily.everyWeekDay.hourType = this.getHourType(parsedHours);
            this.state.daily.everyWeekDay.minutes = Number(minutes);
            this.state.daily.everyWeekDay.seconds = Number(seconds);
        }
        else if (cronSeven.match(/\d+ \d+ \d+ \? \* (MON|TUE|WED|THU|FRI|SAT|SUN)(,(MON|TUE|WED|THU|FRI|SAT|SUN))* \*/)) {
            this.activeTab = 'weekly';
            this.selectOptions.days.forEach((/**
             * @param {?} weekDay
             * @return {?}
             */
            function (weekDay) { return _this.state.weekly[weekDay] = false; }));
            dayOfWeek.split(',').forEach((/**
             * @param {?} weekDay
             * @return {?}
             */
            function (weekDay) { return _this.state.weekly[weekDay] = true; }));
            /** @type {?} */
            var parsedHours = Number(hours);
            this.state.weekly.hours = this.getAmPmHour(parsedHours);
            this.state.weekly.hourType = this.getHourType(parsedHours);
            this.state.weekly.minutes = Number(minutes);
            this.state.weekly.seconds = Number(seconds);
        }
        else if (cronSeven.match(/\d+ \d+ \d+ (\d+|L|LW|1W) 1\/\d+ \? \*/)) {
            this.activeTab = 'monthly';
            this.state.monthly.subTab = 'specificDay';
            if (dayOfMonth.indexOf('W') !== -1) {
                this.state.monthly.specificDay.day = dayOfMonth.charAt(0);
                this.state.monthly.runOnWeekday = true;
            }
            else {
                this.state.monthly.specificDay.day = dayOfMonth;
            }
            this.state.monthly.specificDay.months = Number(month.substring(2));
            /** @type {?} */
            var parsedHours = Number(hours);
            this.state.monthly.specificDay.hours = this.getAmPmHour(parsedHours);
            this.state.monthly.specificDay.hourType = this.getHourType(parsedHours);
            this.state.monthly.specificDay.minutes = Number(minutes);
            this.state.monthly.specificDay.seconds = Number(seconds);
        }
        else if (cronSeven.match(/\d+ \d+ \d+ \? \d+\/\d+ (MON|TUE|WED|THU|FRI|SAT|SUN)((#[1-5])|L) \*/)) {
            /** @type {?} */
            var day = dayOfWeek.substr(0, 3);
            /** @type {?} */
            var monthWeek = dayOfWeek.substr(3);
            this.activeTab = 'monthly';
            this.state.monthly.subTab = 'specificWeekDay';
            this.state.monthly.specificWeekDay.monthWeek = monthWeek;
            this.state.monthly.specificWeekDay.day = day;
            if (month.indexOf('/') !== -1) {
                this.state.monthly.specificWeekDay.months = Number(month.substring(2));
                this.state.monthly.specificWeekDay.startMonth = Number(month.split('/')[0]);
            }
            /** @type {?} */
            var parsedHours = Number(hours);
            this.state.monthly.specificWeekDay.hours = this.getAmPmHour(parsedHours);
            this.state.monthly.specificWeekDay.hourType = this.getHourType(parsedHours);
            this.state.monthly.specificWeekDay.minutes = Number(minutes);
            this.state.monthly.specificWeekDay.seconds = Number(seconds);
        }
        else if (cronSeven.match(/\d+ \d+ \d+ (\d+|L|LW|1W) \d+ \? \*/)) {
            this.activeTab = 'yearly';
            this.state.yearly.subTab = 'specificMonthDay';
            this.state.yearly.specificMonthDay.month = Number(month);
            if (dayOfMonth.indexOf('W') !== -1) {
                this.state.yearly.specificMonthDay.day = dayOfMonth.charAt(0);
                this.state.yearly.runOnWeekday = true;
            }
            else {
                this.state.yearly.specificMonthDay.day = dayOfMonth;
            }
            /** @type {?} */
            var parsedHours = Number(hours);
            this.state.yearly.specificMonthDay.hours = this.getAmPmHour(parsedHours);
            this.state.yearly.specificMonthDay.hourType = this.getHourType(parsedHours);
            this.state.yearly.specificMonthDay.minutes = Number(minutes);
            this.state.yearly.specificMonthDay.seconds = Number(seconds);
        }
        else if (cronSeven.match(/\d+ \d+ \d+ \? \d+ (MON|TUE|WED|THU|FRI|SAT|SUN)((#[1-5])|L) \*/)) {
            /** @type {?} */
            var day = dayOfWeek.substr(0, 3);
            /** @type {?} */
            var monthWeek = dayOfWeek.substr(3);
            this.activeTab = 'yearly';
            this.state.yearly.subTab = 'specificMonthWeek';
            this.state.yearly.specificMonthWeek.monthWeek = monthWeek;
            this.state.yearly.specificMonthWeek.day = day;
            this.state.yearly.specificMonthWeek.month = Number(month);
            /** @type {?} */
            var parsedHours = Number(hours);
            this.state.yearly.specificMonthWeek.hours = this.getAmPmHour(parsedHours);
            this.state.yearly.specificMonthWeek.hourType = this.getHourType(parsedHours);
            this.state.yearly.specificMonthWeek.minutes = Number(minutes);
            this.state.yearly.specificMonthWeek.seconds = Number(seconds);
        }
        else {
            this.activeTab = 'advanced';
            this.state.advanced.expression = cron;
        }
    };
    /**
     * @private
     * @param {?} cron
     * @return {?}
     */
    CronEditorComponent.prototype.validate = /**
     * @private
     * @param {?} cron
     * @return {?}
     */
    function (cron) {
        this.state.validation.isValid = false;
        this.state.validation.errorMessage = '';
        if (!cron) {
            this.state.validation.errorMessage = 'Cron expression cannot be null';
            return;
        }
        /** @type {?} */
        var cronParts = cron.split(' ');
        /** @type {?} */
        var expected = 5;
        if (!this.options.removeSeconds) {
            expected++;
        }
        if (!this.options.removeYears) {
            expected++;
        }
        if (cronParts.length !== expected) {
            this.state.validation.errorMessage = "Invalid cron expression, there must be " + expected + " segments";
            return;
        }
        this.state.validation.isValid = true;
        return;
    };
    /**
     * @private
     * @return {?}
     */
    CronEditorComponent.prototype.getDefaultAdvancedCronExpression = /**
     * @private
     * @return {?}
     */
    function () {
        if (this.options.removeSeconds && !this.options.removeYears) {
            return '15 10 L-2 * ? 2019';
        }
        if (!this.options.removeSeconds && this.options.removeYears) {
            return '0 15 10 L-2 * ?';
        }
        if (this.options.removeSeconds && this.options.removeYears) {
            return '15 10 L-2 * ?';
        }
        return '0 15 10 L-2 * ? 2019';
    };
    /**
     * @private
     * @return {?}
     */
    CronEditorComponent.prototype.getDefaultState = /**
     * @private
     * @return {?}
     */
    function () {
        var _a = tslib_1.__read(this.options.defaultTime.split(':').map(Number), 3), defaultHours = _a[0], defaultMinutes = _a[1], defaultSeconds = _a[2];
        return {
            minutes: {
                minutes: 1,
                seconds: 0
            },
            hourly: {
                hours: 1,
                minutes: 0,
                seconds: 0
            },
            daily: {
                subTab: 'everyDays',
                everyDays: {
                    days: 1,
                    hours: this.getAmPmHour(defaultHours),
                    minutes: defaultMinutes,
                    seconds: defaultSeconds,
                    hourType: this.getHourType(defaultHours)
                },
                everyWeekDay: {
                    hours: this.getAmPmHour(defaultHours),
                    minutes: defaultMinutes,
                    seconds: defaultSeconds,
                    hourType: this.getHourType(defaultHours)
                }
            },
            weekly: {
                MON: true,
                TUE: false,
                WED: false,
                THU: false,
                FRI: false,
                SAT: false,
                SUN: false,
                hours: this.getAmPmHour(defaultHours),
                minutes: defaultMinutes,
                seconds: defaultSeconds,
                hourType: this.getHourType(defaultHours)
            },
            monthly: {
                subTab: 'specificDay',
                runOnWeekday: false,
                specificDay: {
                    day: '1',
                    months: 1,
                    hours: this.getAmPmHour(defaultHours),
                    minutes: defaultMinutes,
                    seconds: defaultSeconds,
                    hourType: this.getHourType(defaultHours)
                },
                specificWeekDay: {
                    monthWeek: '#1',
                    day: 'MON',
                    startMonth: 1,
                    months: 1,
                    hours: this.getAmPmHour(defaultHours),
                    minutes: defaultMinutes,
                    seconds: defaultSeconds,
                    hourType: this.getHourType(defaultHours)
                }
            },
            yearly: {
                subTab: 'specificMonthDay',
                runOnWeekday: false,
                specificMonthDay: {
                    month: 1,
                    day: '1',
                    hours: this.getAmPmHour(defaultHours),
                    minutes: defaultMinutes,
                    seconds: defaultSeconds,
                    hourType: this.getHourType(defaultHours)
                },
                specificMonthWeek: {
                    monthWeek: '#1',
                    day: 'MON',
                    month: 1,
                    hours: this.getAmPmHour(defaultHours),
                    minutes: defaultMinutes,
                    seconds: defaultSeconds,
                    hourType: this.getHourType(defaultHours)
                }
            },
            advanced: {
                expression: this.getDefaultAdvancedCronExpression()
            },
            validation: {
                isValid: true,
                errorMessage: ''
            }
        };
    };
    /**
     * @private
     * @param {?} value
     * @return {?}
     */
    CronEditorComponent.prototype.getOrdinalSuffix = /**
     * @private
     * @param {?} value
     * @return {?}
     */
    function (value) {
        if (value.length > 1) {
            /** @type {?} */
            var secondToLastDigit = value.charAt(value.length - 2);
            if (secondToLastDigit === '1') {
                return 'th';
            }
        }
        /** @type {?} */
        var lastDigit = value.charAt(value.length - 1);
        switch (lastDigit) {
            case '1':
                return 'st';
            case '2':
                return 'nd';
            case '3':
                return 'rd';
            default:
                return 'th';
        }
    };
    /**
     * @private
     * @return {?}
     */
    CronEditorComponent.prototype.getSelectOptions = /**
     * @private
     * @return {?}
     */
    function () {
        return {
            months: Utils.getRange(1, 12),
            monthWeeks: ['#1', '#2', '#3', '#4', '#5', 'L'],
            days: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
            minutes: Utils.getRange(0, 59),
            fullMinutes: Utils.getRange(0, 59),
            seconds: Utils.getRange(0, 59),
            hours: Utils.getRange(1, 23),
            monthDays: Utils.getRange(1, 31),
            monthDaysWithLasts: tslib_1.__spread(Utils.getRange(1, 31).map(String), ['L']),
            hourTypes: ['AM', 'PM']
        };
    };
    CronEditorComponent.decorators = [
        { type: Component, args: [{
                    selector: 'cron-editor',
                    template: "<!-- Tabs -->\r\n<ul class=\"nav nav-tabs tab-nav\" role=\"tablist\">\r\n    <li [ngClass]=\"{'active': activeTab === 'minutes'}\" *ngIf=\"!options.hideMinutesTab\">\r\n        <a aria-controls=\"minutes\" role=\"tab\" data-toggle=\"tab\" (click)=\"setActiveTab('minutes')\">\r\n            Minutes\r\n        </a>\r\n    </li>\r\n\r\n    <li role=\"presentation\" *ngIf=\"!options.hideHourlyTab\" [ngClass]=\"{'active': activeTab === 'hourly'}\">\r\n        <a aria-controls=\"hourly\" role=\"tab\" data-toggle=\"tab\" (click)=\"setActiveTab('hourly')\">\r\n            Hourly\r\n        </a>\r\n    </li>\r\n\r\n    <li role=\"presentation\" *ngIf=\"!options.hideDailyTab\" [ngClass]=\"{'active': activeTab === 'daily'}\">\r\n        <a aria-controls=\"daily\" role=\"tab\" data-toggle=\"tab\" (click)=\"setActiveTab('daily')\">\r\n            Daily\r\n        </a>\r\n    </li>\r\n\r\n    <li role=\"presentation\" *ngIf=\"!options.hideWeeklyTab\" [ngClass]=\"{'active': activeTab === 'weekly'}\">\r\n        <a aria-controls=\"weekly\" role=\"tab\" data-toggle=\"tab\" (click)=\"setActiveTab('weekly')\">\r\n            Weekly\r\n        </a>\r\n    </li>\r\n\r\n    <li role=\"presentation\" *ngIf=\"!options.hideMonthlyTab\" [ngClass]=\"{'active': activeTab === 'monthly'}\">\r\n        <a aria-controls=\"monthly\" role=\"tab\" data-toggle=\"tab\" (click)=\"setActiveTab('monthly')\">\r\n            Monthly\r\n        </a>\r\n    </li>\r\n\r\n    <li role=\"presentation\" *ngIf=\"!options.hideYearlyTab\" [ngClass]=\"{'active': activeTab === 'yearly'}\">\r\n        <a aria-controls=\"yearly\" role=\"tab\" data-toggle=\"tab\" (click)=\"setActiveTab('yearly')\">\r\n            Yearly\r\n        </a>\r\n    </li>\r\n\r\n    <li role=\"presentation\" *ngIf=\"!options.hideAdvancedTab\" [ngClass]=\"{'active': activeTab === 'advanced'}\">\r\n        <a aria-controls=\"advanced\" role=\"tab\" data-toggle=\"tab\" (click)=\"setActiveTab('advanced')\">\r\n            Advanced\r\n        </a>\r\n    </li>\r\n</ul>\r\n\r\n<!-- Tab content -->\r\n<div class=\"cron-editor-container\">\r\n    <div class=\"row\">\r\n        <div class=\"col-xs-12\">\r\n            <div class=\"tab-content\">\r\n                <!-- Minutes-->\r\n                <div class=\"tab-pane\" *ngIf=\"!options.hideMinutesTab\" [ngClass]=\"{'active': activeTab === 'minutes'}\">\r\n                    <div class=\"well well-small\">\r\n                        Every\r\n                        <select class=\"minutes\" [disabled]=\"disabled || activeTab !== 'minutes'\" (change)=\"regenerateCron()\"\r\n                            [(ngModel)]=\"state.minutes.minutes\" [ngClass]=\"options.formSelectClass\">\r\n                            <option *ngFor=\"let minute of selectOptions.minutes\" [ngValue]=\"minute\">\r\n                                {{minute}}\r\n                            </option>\r\n                        </select> minute(s)\r\n                        <span *ngIf=\"!options.hideSeconds\">on second</span>\r\n                        <select class=\"seconds\" *ngIf=\"!options.hideSeconds\" [disabled]=\"disabled || activeTab !== 'minutes'\"\r\n                            (change)=\"regenerateCron()\" [(ngModel)]=\"state.minutes.seconds\" [ngClass]=\"options.formSelectClass\">\r\n                            <option *ngFor=\"let second of selectOptions.seconds\" [ngValue]=\"second\">\r\n                                {{second}}\r\n                            </option>\r\n                        </select>\r\n                    </div>\r\n                </div>\r\n\r\n                <!-- Hourly-->\r\n                <div class=\"tab-pane\" *ngIf=\"!options.hideHourlyTab\" [ngClass]=\"{'active': activeTab === 'hourly'}\">\r\n                    <div class=\"well well-small\">\r\n                        Every\r\n                        <select class=\"hours\" [disabled]=\"disabled || activeTab !== 'hourly'\" (change)=\"regenerateCron()\"\r\n                            [(ngModel)]=\"state.hourly.hours\" [ngClass]=\"options.formSelectClass\">\r\n                            <option *ngFor=\"let hour of selectOptions.hours\" [ngValue]=\"hour\">\r\n                                {{hour}}\r\n                            </option>\r\n                        </select> hour(s) on minute\r\n                        <select class=\"minutes\" [disabled]=\"disabled || activeTab !== 'hourly'\" (change)=\"regenerateCron()\"\r\n                            [(ngModel)]=\"state.hourly.minutes\" [ngClass]=\"options.formSelectClass\">\r\n                            <option *ngFor=\"let minute of selectOptions.fullMinutes\" [ngValue]=\"minute\">\r\n                                {{minute}}\r\n                            </option>\r\n                        </select>\r\n                        <span *ngIf=\"!options.hideSeconds\">and second</span>\r\n                        <select class=\"seconds\" *ngIf=\"!options.hideSeconds\" [disabled]=\"disabled || activeTab !== 'hourly'\"\r\n                            (change)=\"regenerateCron()\" [(ngModel)]=\"state.hourly.seconds\" [ngClass]=\"options.formSelectClass\">\r\n                            <option *ngFor=\"let second of selectOptions.seconds\" [ngValue]=\"second\">\r\n                                {{second}}\r\n                            </option>\r\n                        </select>\r\n                    </div>\r\n                </div>\r\n\r\n                <!-- Daily-->\r\n                <div class=\"tab-pane\" *ngIf=\"!options.hideDailyTab\" [ngClass]=\"{'active': activeTab === 'daily'}\">\r\n                    <div class=\"well well-small\">\r\n                        <input type=\"radio\" name=\"daily-radio\" value=\"everyDays\" [disabled]=\"disabled\" (change)=\"regenerateCron()\"\r\n                            [(ngModel)]=\"state.daily.subTab\" value=\"everyDays\" [disabled]=\"disabled\" (change)=\"regenerateCron()\"\r\n                            [(ngModel)]=\"state.daily.subTab\" [ngClass]=\"state.formRadioClass\" checked=\"checked\">\r\n                        Every\r\n                        <select class=\"days\" [disabled]=\"disabled || activeTab !== 'daily' || state.daily.subTab !== 'everyDays'\"\r\n                            (change)=\"regenerateCron()\" [(ngModel)]=\"state.daily.everyDays.days\" [ngClass]=\"options.formSelectClass\">\r\n                            <option *ngFor=\"let monthDay of selectOptions.monthDays\" [ngValue]=\"monthDay\">\r\n                                {{monthDay}}\r\n                            </option>\r\n                        </select> day(s) at\r\n\r\n                        <cron-time-picker [disabled]=\"disabled || activeTab !== 'daily' || state.daily.subTab !== 'everyDays'\"\r\n                            (change)=\"regenerateCron()\" [(time)]=\"state.daily.everyDays\" [selectClass]=\"options.formSelectClass\"\r\n                            [use24HourTime]=\"options.use24HourTime\" [hideSeconds]=\"options.hideSeconds\">\r\n                        </cron-time-picker>\r\n                    </div>\r\n\r\n                    <div class=\"well well-small\">\r\n                        <input type=\"radio\" name=\"daily-radio\" value=\"everyWeekDay\" [disabled]=\"disabled\" (change)=\"regenerateCron()\"\r\n                            [(ngModel)]=\"state.daily.subTab\" [ngClass]=\"state.formRadioClass\"> Every working day at\r\n                        <cron-time-picker [disabled]=\"disabled || activeTab !== 'daily' || state.daily.subTab !== 'everyWeekDay'\"\r\n                            (change)=\"regenerateCron()\" [(time)]=\"state.daily.everyWeekDay\" [selectClass]=\"options.formSelectClass\"\r\n                            [use24HourTime]=\"options.use24HourTime\" [hideSeconds]=\"options.hideSeconds\">\r\n                        </cron-time-picker>\r\n                    </div>\r\n                </div>\r\n\r\n                <!-- Weekly-->\r\n                <div class=\"tab-pane\" *ngIf=\"!options.hideWeeklyTab\" [ngClass]=\"{'active': activeTab === 'weekly'}\">\r\n                    <div class=\"well well-small\">\r\n                        <div class=\"row\">\r\n                            <div class=\"col-sm-6\">\r\n                                <label class=\"advanced-cron-editor-label\"><input type=\"checkbox\" [disabled]=\"disabled || activeTab !== 'weekly'\" (change)=\"regenerateCron()\"\r\n                                    [(ngModel)]=\"state.weekly.MON\" [ngClass]=\"options.formCheckboxClass\"> Monday</label>\r\n                            </div>\r\n                            <div class=\"col-sm-6\">\r\n                                <label class=\"advanced-cron-editor-label\"><input type=\"checkbox\" [disabled]=\"disabled || activeTab !== 'weekly'\" (change)=\"regenerateCron()\"\r\n                                    [(ngModel)]=\"state.weekly.TUE\" [ngClass]=\"options.formCheckboxClass\"> Tuesday</label>\r\n                            </div>\r\n                            <div class=\"col-sm-6\">\r\n                                <label class=\"advanced-cron-editor-label\"><input type=\"checkbox\" [disabled]=\"disabled || activeTab !== 'weekly'\" (change)=\"regenerateCron()\"\r\n                                    [(ngModel)]=\"state.weekly.WED\" [ngClass]=\"options.formCheckboxClass\"> Wednesday</label>\r\n                            </div>\r\n                            <div class=\"col-sm-6\">\r\n                                <label class=\"advanced-cron-editor-label\"><input type=\"checkbox\" [disabled]=\"disabled || activeTab !== 'weekly'\" (change)=\"regenerateCron()\"\r\n                                    [(ngModel)]=\"state.weekly.THU\" [ngClass]=\"options.formCheckboxClass\"> Thursday</label>\r\n                            </div>\r\n                            <div class=\"col-sm-6\">\r\n                                <label class=\"advanced-cron-editor-label\"><input type=\"checkbox\" [disabled]=\"disabled || activeTab !== 'weekly'\" (change)=\"regenerateCron()\"\r\n                                    [(ngModel)]=\"state.weekly.FRI\" [ngClass]=\"options.formCheckboxClass\"> Friday</label>\r\n                            </div>\r\n                            <div class=\"col-sm-6\">\r\n                                <label class=\"advanced-cron-editor-label\"><input type=\"checkbox\" [disabled]=\"disabled || activeTab !== 'weekly'\" (change)=\"regenerateCron()\"\r\n                                    [(ngModel)]=\"state.weekly.SAT\" [ngClass]=\"options.formCheckboxClass\"> Saturday</label>\r\n                            </div>\r\n                            <div class=\"col-sm-6\">\r\n                                <label class=\"advanced-cron-editor-label\"><input type=\"checkbox\" [disabled]=\"disabled || activeTab !== 'weekly'\" (change)=\"regenerateCron()\"\r\n                                    [(ngModel)]=\"state.weekly.SUN\" [ngClass]=\"options.formCheckboxClass\"> Sunday</label>\r\n                            </div>\r\n                        </div>\r\n                        <div class=\"row\">\r\n                            <div class=\"col-sm-6\">\r\n                                at\r\n                                <cron-time-picker [disabled]=\"disabled || activeTab !== 'weekly'\" (change)=\"regenerateCron()\"\r\n                                    [(time)]=\"state.weekly\" [selectClass]=\"options.formSelectClass\" [use24HourTime]=\"options.use24HourTime\"\r\n                                    [hideSeconds]=\"options.hideSeconds\">\r\n                                </cron-time-picker>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n\r\n                </div>\r\n\r\n                <!-- Monthly-->\r\n                <div class=\"tab-pane\" *ngIf=\"!options.hideMonthlyTab\" [ngClass]=\"{'active': activeTab === 'monthly'}\">\r\n                    <div class=\"well well-small\">\r\n                        <input type=\"radio\" name=\"monthly-radio\" value=\"specificDay\" [disabled]=\"disabled\" (change)=\"regenerateCron()\"\r\n                            [(ngModel)]=\"state.monthly.subTab\" [ngClass]=\"state.formRadioClass\"> On the\r\n                        <select class=\"month-days\" [disabled]=\"disabled || activeTab !== 'monthly' || state.monthly.subTab !== 'specificDay'\"\r\n                            (change)=\"regenerateCron()\" [(ngModel)]=\"state.monthly.specificDay.day\" [ngClass]=\"options.formSelectClass\">\r\n                            <option *ngFor=\"let monthDaysWithLast of selectOptions.monthDaysWithLasts\" [ngValue]=\"monthDaysWithLast\">\r\n                                {{monthDayDisplay(monthDaysWithLast)}}\r\n                            </option>\r\n                        </select> of every\r\n                        <select class=\"months-small\" [disabled]=\"disabled || activeTab !== 'monthly' || state.monthly.subTab !== 'specificDay'\"\r\n                            (change)=\"regenerateCron()\" [(ngModel)]=\"state.monthly.specificDay.months\" [ngClass]=\"options.formSelectClass\">\r\n                            <option *ngFor=\"let month of selectOptions.months\" [ngValue]=\"month\">\r\n                                {{month}}\r\n                            </option>\r\n                        </select> month(s) at\r\n                        <cron-time-picker [disabled]=\"disabled || activeTab !== 'monthly' || state.monthly.subTab !== 'specificDay'\"\r\n                            (change)=\"regenerateCron()\" [(time)]=\"state.monthly.specificDay\" [selectClass]=\"options.formSelectClass\"\r\n                            [use24HourTime]=\"options.use24HourTime\" [hideSeconds]=\"options.hideSeconds\">\r\n                        </cron-time-picker>&nbsp;\r\n                        <label class=\"advanced-cron-editor-label\"><input type=\"checkbox\" [disabled]=\"disabled || activeTab !== 'monthly' || state.monthly.subTab !== 'specificDay'\" \r\n                            (change)=\"regenerateCron()\" [(ngModel)]=\"state.monthly.runOnWeekday\" [ngClass]=\"options.formCheckboxClass\"> during the nearest weekday</label>\r\n                    </div>\r\n                    <div class=\"well well-small\">\r\n                        <input type=\"radio\" name=\"monthly-radio\" value=\"specificWeekDay\" [disabled]=\"disabled\" (change)=\"regenerateCron()\"\r\n                            [(ngModel)]=\"state.monthly.subTab\" [ngClass]=\"state.formRadioClass\">\r\n                        On the\r\n                        <select class=\"day-order-in-month\" [disabled]=\"disabled || activeTab !== 'monthly' || state.monthly.subTab !== 'specificWeekDay'\"\r\n                            (change)=\"regenerateCron()\" [(ngModel)]=\"state.monthly.specificWeekDay.monthWeek\" [ngClass]=\"options.formSelectClass\">\r\n                            <option *ngFor=\"let monthWeek of selectOptions.monthWeeks\" [ngValue]=\"monthWeek\">\r\n                                {{monthWeekDisplay(monthWeek)}}\r\n                            </option>\r\n                        </select>\r\n                        <select class=\"week-days\" [disabled]=\"disabled || activeTab !== 'monthly' || state.monthly.subTab !== 'specificWeekDay'\"\r\n                            (change)=\"regenerateCron()\" [(ngModel)]=\"state.monthly.specificWeekDay.day\" [ngClass]=\"options.formSelectClass\">\r\n                            <option *ngFor=\"let day of selectOptions.days\" [ngValue]=\"day\">\r\n                                {{dayDisplay(day)}}\r\n                            </option>\r\n                        </select> of every\r\n                        <select class=\"months-small\" [disabled]=\"disabled || activeTab !== 'monthly' || state.monthly.subTab !== 'specificWeekDay'\"\r\n                            (change)=\"regenerateCron()\" [(ngModel)]=\"state.monthly.specificWeekDay.months\" [ngClass]=\"options.formSelectClass\">\r\n                            <option *ngFor=\"let month of selectOptions.months\" [ngValue]=\"month\">\r\n                                {{month}}\r\n                            </option>\r\n                        </select> month(s) starting in\r\n                        <select class=\"months\" [disabled]=\"disabled || activeTab !== 'monthly' || state.monthly.subTab !== 'specificWeekDay'\"\r\n                            (change)=\"regenerateCron()\" [(ngModel)]=\"state.monthly.specificWeekDay.startMonth\" [ngClass]=\"options.formSelectClass\">\r\n                            <option *ngFor=\"let month of selectOptions.months\" [ngValue]=\"month\">\r\n                                {{monthDisplay(month)}}\r\n                            </option>\r\n                        </select>\r\n                        \r\n                        at\r\n                        <cron-time-picker [disabled]=\"disabled || activeTab !== 'monthly' || state.monthly.subTab !== 'specificWeekDay'\"\r\n                            (change)=\"regenerateCron()\" [(time)]=\"state.monthly.specificWeekDay\" [selectClass]=\"options.formSelectClass\"\r\n                            [use24HourTime]=\"options.use24HourTime\" [hideSeconds]=\"options.hideSeconds\">\r\n                        </cron-time-picker>\r\n                    </div>\r\n                </div>\r\n\r\n                <!-- Yearly-->\r\n                <div class=\"tab-pane\" *ngIf=\"!options.hideYearlyTab\" [ngClass]=\"{'active': activeTab === 'yearly'}\">\r\n                    <div class=\"well well-small\">\r\n                        <input type=\"radio\" name=\"yearly-radio\" value=\"specificMonthDay\" [disabled]=\"disabled\" (change)=\"regenerateCron()\"\r\n                            [(ngModel)]=\"state.yearly.subTab\" [ngClass]=\"state.formRadioClass\">\r\n                        Every\r\n                        <select class=\"months\" [disabled]=\"disabled || activeTab !== 'yearly' || state.yearly.subTab !== 'specificMonthDay'\"\r\n                            (change)=\"regenerateCron()\" [(ngModel)]=\"state.yearly.specificMonthDay.month\" [ngClass]=\"options.formSelectClass\">\r\n                            <option *ngFor=\"let month of selectOptions.months\" [ngValue]=\"month\">\r\n                                {{monthDisplay(month)}}\r\n                            </option>\r\n                        </select> on the\r\n                        <select class=\"month-days\" [disabled]=\"disabled || activeTab !== 'yearly' || state.yearly.subTab !== 'specificMonthDay'\"\r\n                            (change)=\"regenerateCron()\" [(ngModel)]=\"state.yearly.specificMonthDay.day\" [ngClass]=\"options.formSelectClass\">\r\n                            <option *ngFor=\"let monthDaysWithLast of selectOptions.monthDaysWithLasts\" [ngValue]=\"monthDaysWithLast\">\r\n                                {{monthDayDisplay(monthDaysWithLast)}}\r\n                            </option>\r\n                        </select> at\r\n                        <cron-time-picker [disabled]=\"disabled || activeTab !== 'yearly' || state.yearly.subTab !== 'specificMonthDay'\"\r\n                            (change)=\"regenerateCron()\" [(time)]=\"state.yearly.specificMonthDay\" [selectClass]=\"options.formSelectClass\"\r\n                            [use24HourTime]=\"options.use24HourTime\" [hideSeconds]=\"options.hideSeconds\">\r\n                        </cron-time-picker>&nbsp;\r\n                        <label class=\"advanced-cron-editor-label\"><input type=\"checkbox\" (change)=\"regenerateCron()\"\r\n                        [(ngModel)]=\"state.yearly.runOnWeekday\" [ngClass]=\"options.formCheckboxClass\"> during the nearest weekday</label>\r\n                    </div>\r\n                    <div class=\"well well-small\">\r\n                        <input type=\"radio\" name=\"yearly-radio\" value=\"specificMonthWeek\" [disabled]=\"disabled\"\r\n                            (change)=\"regenerateCron()\" [(ngModel)]=\"state.yearly.subTab\" [ngClass]=\"state.formRadioClass\">\r\n                        On the\r\n                        <select class=\"day-order-in-month\" [disabled]=\"disabled || activeTab !== 'yearly' || state.yearly.subTab !== 'specificMonthWeek'\"\r\n                            (change)=\"regenerateCron()\" [(ngModel)]=\"state.yearly.specificMonthWeek.monthWeek\"\r\n                            [ngClass]=\"options.formSelectClass\">\r\n                            <option *ngFor=\"let monthWeek of selectOptions.monthWeeks\" [ngValue]=\"monthWeek\">\r\n                                {{monthWeekDisplay(monthWeek)}}\r\n                            </option>\r\n                        </select>\r\n                        <select class=\"week-days\" [disabled]=\"disabled || activeTab !== 'yearly' || state.yearly.subTab !== 'specificMonthWeek'\"\r\n                            (change)=\"regenerateCron()\" [(ngModel)]=\"state.yearly.specificMonthWeek.day\" [ngClass]=\"options.formSelectClass\">\r\n                            <option *ngFor=\"let day of selectOptions.days\" [ngValue]=\"day\">\r\n                                {{dayDisplay(day)}}\r\n                            </option>\r\n                        </select> of\r\n                        <select class=\"months\" [disabled]=\"disabled || activeTab !== 'yearly' || state.yearly.subTab !== 'specificMonthWeek'\"\r\n                            (change)=\"regenerateCron()\" [(ngModel)]=\"state.yearly.specificMonthWeek.month\" [ngClass]=\"options.formSelectClass\">\r\n                            <option *ngFor=\"let month of selectOptions.months\" [ngValue]=\"month\">\r\n                                {{monthDisplay(month)}}\r\n                            </option>\r\n                        </select> at\r\n                        <cron-time-picker [disabled]=\"disabled || activeTab !== 'yearly' || state.yearly.subTab !== 'specificMonthWeek'\"\r\n                            (change)=\"regenerateCron()\" [(time)]=\"state.yearly.specificMonthWeek\" [selectClass]=\"options.formSelectClass\"\r\n                            [use24HourTime]=\"options.use24HourTime\" [hideSeconds]=\"options.hideSeconds\">\r\n                        </cron-time-picker>\r\n                    </div>\r\n                </div>\r\n\r\n                <!-- Advanced-->\r\n                <div class=\"tab-pane\" *ngIf=\"!options.hideAdvancedTab\" [ngClass]=\"{'active': activeTab === 'advanced'}\">\r\n                    Cron Expression\r\n                    <input type=\"text\" class=\"advanced-cron-editor-input\" ng-disabled=\"disabled || activeTab !== 'advanced'\"\r\n                        (change)=\"regenerateCron()\" [(ngModel)]=\"state.advanced.expression\" [ngClass]=\"options.formInputClass\">\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"row\" *ngIf=\"!state.validation.isValid\">\r\n        <code>{{state.validation.errorMessage}}</code>\r\n    </div>\r\n</div>",
                    styles: [".cron-editor-container{margin-top:10px}.cron-editor-container .cron-editor-radio{width:20px;display:inline-block}.cron-editor-container .cron-editor-checkbox,.cron-editor-container .cron-editor-input,.cron-editor-container .cron-editor-select{display:inline-block}.cron-editor-container .well-time-wrapper{padding-left:20px}.cron-editor-container .inline-block{display:inline-block}.cron-editor-container .days,.cron-editor-container .hours,.cron-editor-container .minutes,.cron-editor-container .seconds{width:70px}.cron-editor-container .months{width:120px}.cron-editor-container .month-days{width:130px}.cron-editor-container .months-small{width:60px}.cron-editor-container .day-order-in-month{width:95px}.cron-editor-container .week-days{width:120px}.cron-editor-container .advanced-cron-editor-input{width:200px}.cron-editor-container .hour-types{width:70px}.cron-editor-container .advanced-cron-editor-label{font-weight:200}.nav-tabs li a{cursor:pointer}.form-control{height:auto}"]
                }] }
    ];
    CronEditorComponent.propDecorators = {
        disabled: [{ type: Input }],
        options: [{ type: Input }],
        cron: [{ type: Input }],
        cronChange: [{ type: Output }]
    };
    return CronEditorComponent;
}());
export { CronEditorComponent };
if (false) {
    /** @type {?} */
    CronEditorComponent.prototype.disabled;
    /** @type {?} */
    CronEditorComponent.prototype.options;
    /** @type {?} */
    CronEditorComponent.prototype.cronChange;
    /** @type {?} */
    CronEditorComponent.prototype.activeTab;
    /** @type {?} */
    CronEditorComponent.prototype.selectOptions;
    /** @type {?} */
    CronEditorComponent.prototype.state;
    /**
     * @type {?}
     * @private
     */
    CronEditorComponent.prototype.localCron;
    /**
     * @type {?}
     * @private
     */
    CronEditorComponent.prototype.isDirty;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3Jvbi1lZGl0b3IuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vY3Jvbi1lZGl0b3IvIiwic291cmNlcyI6WyJsaWIvY3Jvbi1lZGl0b3IuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBVSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBNEIsTUFBTSxlQUFlLENBQUM7QUFHekcsT0FBTyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQ25ELE9BQU8sS0FBSyxNQUFNLFNBQVMsQ0FBQztBQUU1QjtJQUFBOztRQWdCWSxlQUFVLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUduQyxrQkFBYSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBc2dCakQsQ0FBQztJQWhoQkMsc0JBQWEscUNBQUk7Ozs7UUFBakIsY0FBOEIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzs7Ozs7UUFDdEQsVUFBUyxLQUFhO1lBQ3BCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN2QyxDQUFDOzs7T0FKcUQ7Ozs7SUFnQi9DLHNDQUFROzs7SUFBZjtRQUNFLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUU7WUFDOUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1NBQ2pDO1FBRUQsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7UUFFcEMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNwQyxDQUFDOzs7OztJQUVNLHlDQUFXOzs7O0lBQWxCLFVBQW1CLE9BQXNCOztZQUNqQyxPQUFP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QXlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgU2ltcGxlQ2hhbmdlcywgT25DaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENyb25PcHRpb25zIH0gZnJvbSAnLi9Dcm9uT3B0aW9ucyc7XHJcblxyXG5pbXBvcnQgeyBEYXlzLCBNb250aFdlZWtzLCBNb250aHMgfSBmcm9tICcuL2VudW1zJztcclxuaW1wb3J0IFV0aWxzIGZyb20gJy4vVXRpbHMnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdjcm9uLWVkaXRvcicsXHJcbiAgdGVtcGxhdGVVcmw6ICcuL2Nyb24tZWRpdG9yLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi9jcm9uLWVkaXRvci5jb21wb25lbnQuY3NzJ11cclxufSlcclxuZXhwb3J0IGNsYXNzIENyb25FZGl0b3JDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcyB7XHJcbiAgQElucHV0KCkgcHVibGljIGRpc2FibGVkOiBib29sZWFuO1xyXG4gIEBJbnB1dCgpIHB1YmxpYyBvcHRpb25zOiBDcm9uT3B0aW9ucztcclxuXHJcbiAgQElucHV0KCkgZ2V0IGNyb24oKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMubG9jYWxDcm9uOyB9XHJcbiAgc2V0IGNyb24odmFsdWU6IHN0cmluZykge1xyXG4gICAgdGhpcy5sb2NhbENyb24gPSB2YWx1ZTtcclxuICAgIHRoaXMuY3JvbkNoYW5nZS5lbWl0KHRoaXMubG9jYWxDcm9uKTtcclxuICB9XHJcblxyXG4gIC8vIHRoZSBuYW1lIGlzIGFuIEFuZ3VsYXIgY29udmVudGlvbiwgQElucHV0IHZhcmlhYmxlIG5hbWUgKyBcIkNoYW5nZVwiIHN1ZmZpeFxyXG4gIEBPdXRwdXQoKSBjcm9uQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBwdWJsaWMgYWN0aXZlVGFiOiBzdHJpbmc7XHJcbiAgcHVibGljIHNlbGVjdE9wdGlvbnMgPSB0aGlzLmdldFNlbGVjdE9wdGlvbnMoKTtcclxuICBwdWJsaWMgc3RhdGU6IGFueTtcclxuXHJcbiAgcHJpdmF0ZSBsb2NhbENyb246IHN0cmluZztcclxuICBwcml2YXRlIGlzRGlydHk6IGJvb2xlYW47XHJcblxyXG4gIHB1YmxpYyBuZ09uSW5pdCgpIHtcclxuICAgIGlmICh0aGlzLm9wdGlvbnMucmVtb3ZlU2Vjb25kcykge1xyXG4gICAgICB0aGlzLm9wdGlvbnMuaGlkZVNlY29uZHMgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc3RhdGUgPSB0aGlzLmdldERlZmF1bHRTdGF0ZSgpO1xyXG5cclxuICAgIHRoaXMuaGFuZGxlTW9kZWxDaGFuZ2UodGhpcy5jcm9uKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XHJcbiAgICBjb25zdCBuZXdDcm9uID0gY2hhbmdlc1snY3JvbiddO1xyXG4gICAgaWYgKG5ld0Nyb24gJiYgIW5ld0Nyb24uZmlyc3RDaGFuZ2UpIHtcclxuICAgICAgdGhpcy5oYW5kbGVNb2RlbENoYW5nZSh0aGlzLmNyb24pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIHNldEFjdGl2ZVRhYih0YWI6IHN0cmluZykge1xyXG4gICAgaWYgKCF0aGlzLmRpc2FibGVkKSB7XHJcbiAgICAgIHRoaXMuYWN0aXZlVGFiID0gdGFiO1xyXG4gICAgICB0aGlzLnJlZ2VuZXJhdGVDcm9uKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZGF5RGlzcGxheShkYXk6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gRGF5c1tkYXldO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIG1vbnRoV2Vla0Rpc3BsYXkobW9udGhXZWVrTnVtYmVyOiBudW1iZXIpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIE1vbnRoV2Vla3NbbW9udGhXZWVrTnVtYmVyXTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBtb250aERpc3BsYXkobW9udGg6IG51bWJlcik6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gTW9udGhzW21vbnRoXTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBtb250aERheURpc3BsYXkobW9udGg6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICBpZiAobW9udGggPT09ICdMJykge1xyXG4gICAgICByZXR1cm4gJ0xhc3QgRGF5JztcclxuICAgIH0gZWxzZSBpZiAobW9udGggPT09ICdMVycpIHtcclxuICAgICAgcmV0dXJuICdMYXN0IFdlZWtkYXknO1xyXG4gICAgfSBlbHNlIGlmIChtb250aCA9PT0gJzFXJykge1xyXG4gICAgICByZXR1cm4gJ0ZpcnN0IFdlZWtkYXknO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIGAke21vbnRofSR7dGhpcy5nZXRPcmRpbmFsU3VmZml4KG1vbnRoKX0gZGF5YDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyByZWdlbmVyYXRlQ3JvbigpIHtcclxuICAgIHRoaXMuaXNEaXJ0eSA9IHRydWU7XHJcblxyXG4gICAgc3dpdGNoICh0aGlzLmFjdGl2ZVRhYikge1xyXG4gICAgICBjYXNlICdtaW51dGVzJzpcclxuICAgICAgICB0aGlzLmNyb24gPSBgMC8ke3RoaXMuc3RhdGUubWludXRlcy5taW51dGVzfSAqIDEvMSAqID9gO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5yZW1vdmVTZWNvbmRzKSB7XHJcbiAgICAgICAgICB0aGlzLmNyb24gPSBgJHt0aGlzLnN0YXRlLm1pbnV0ZXMuc2Vjb25kc30gJHt0aGlzLmNyb259YDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5vcHRpb25zLnJlbW92ZVllYXJzKSB7XHJcbiAgICAgICAgICB0aGlzLmNyb24gPSBgJHt0aGlzLmNyb259ICpgO1xyXG4gICAgICAgIH1cclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnaG91cmx5JzpcclxuICAgICAgICB0aGlzLmNyb24gPSBgJHt0aGlzLnN0YXRlLmhvdXJseS5taW51dGVzfSAwLyR7dGhpcy5zdGF0ZS5ob3VybHkuaG91cnN9IDEvMSAqID9gO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5yZW1vdmVTZWNvbmRzKSB7XHJcbiAgICAgICAgICB0aGlzLmNyb24gPSBgJHt0aGlzLnN0YXRlLmhvdXJseS5zZWNvbmRzfSAke3RoaXMuY3Jvbn1gO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMucmVtb3ZlWWVhcnMpIHtcclxuICAgICAgICAgIHRoaXMuY3JvbiA9IGAke3RoaXMuY3Jvbn0gKmA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdkYWlseSc6XHJcbiAgICAgICAgc3dpdGNoICh0aGlzLnN0YXRlLmRhaWx5LnN1YlRhYikge1xyXG4gICAgICAgICAgY2FzZSAnZXZlcnlEYXlzJzpcclxuICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1heC1saW5lLWxlbmd0aFxyXG4gICAgICAgICAgICB0aGlzLmNyb24gPSBgJHt0aGlzLnN0YXRlLmRhaWx5LmV2ZXJ5RGF5cy5taW51dGVzfSAke3RoaXMuaG91clRvQ3Jvbih0aGlzLnN0YXRlLmRhaWx5LmV2ZXJ5RGF5cy5ob3VycywgdGhpcy5zdGF0ZS5kYWlseS5ldmVyeURheXMuaG91clR5cGUpfSAxLyR7dGhpcy5zdGF0ZS5kYWlseS5ldmVyeURheXMuZGF5c30gKiA/YDtcclxuXHJcbiAgICAgICAgICAgIGlmICghdGhpcy5vcHRpb25zLnJlbW92ZVNlY29uZHMpIHtcclxuICAgICAgICAgICAgICB0aGlzLmNyb24gPSBgJHt0aGlzLnN0YXRlLmRhaWx5LmV2ZXJ5RGF5cy5zZWNvbmRzfSAke3RoaXMuY3Jvbn1gO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5yZW1vdmVZZWFycykge1xyXG4gICAgICAgICAgICAgIHRoaXMuY3JvbiA9IGAke3RoaXMuY3Jvbn0gKmA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICBjYXNlICdldmVyeVdlZWtEYXknOlxyXG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXHJcbiAgICAgICAgICAgIHRoaXMuY3JvbiA9IGAke3RoaXMuc3RhdGUuZGFpbHkuZXZlcnlXZWVrRGF5Lm1pbnV0ZXN9ICR7dGhpcy5ob3VyVG9Dcm9uKHRoaXMuc3RhdGUuZGFpbHkuZXZlcnlXZWVrRGF5LmhvdXJzLCB0aGlzLnN0YXRlLmRhaWx5LmV2ZXJ5V2Vla0RheS5ob3VyVHlwZSl9ID8gKiBNT04tRlJJYDtcclxuXHJcbiAgICAgICAgICAgIGlmICghdGhpcy5vcHRpb25zLnJlbW92ZVNlY29uZHMpIHtcclxuICAgICAgICAgICAgICB0aGlzLmNyb24gPSBgJHt0aGlzLnN0YXRlLmRhaWx5LmV2ZXJ5V2Vla0RheS5zZWNvbmRzfSAke3RoaXMuY3Jvbn1gO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5yZW1vdmVZZWFycykge1xyXG4gICAgICAgICAgICAgIHRoaXMuY3JvbiA9IGAke3RoaXMuY3Jvbn0gKmA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY3JvbiBkYWlseSBzdWJ0YWIgc2VsZWN0aW9uJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICd3ZWVrbHknOlxyXG4gICAgICAgIGNvbnN0IGRheXMgPSB0aGlzLnNlbGVjdE9wdGlvbnMuZGF5c1xyXG4gICAgICAgICAgLnJlZHVjZSgoYWNjLCBkYXkpID0+IHRoaXMuc3RhdGUud2Vla2x5W2RheV0gPyBhY2MuY29uY2F0KFtkYXldKSA6IGFjYywgW10pXHJcbiAgICAgICAgICAuam9pbignLCcpO1xyXG4gICAgICAgIHRoaXMuY3JvbiA9IGAke3RoaXMuc3RhdGUud2Vla2x5Lm1pbnV0ZXN9ICR7dGhpcy5ob3VyVG9Dcm9uKHRoaXMuc3RhdGUud2Vla2x5LmhvdXJzLCB0aGlzLnN0YXRlLndlZWtseS5ob3VyVHlwZSl9ID8gKiAke2RheXN9YDtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMucmVtb3ZlU2Vjb25kcykge1xyXG4gICAgICAgICAgdGhpcy5jcm9uID0gYCR7dGhpcy5zdGF0ZS53ZWVrbHkuc2Vjb25kc30gJHt0aGlzLmNyb259YDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5vcHRpb25zLnJlbW92ZVllYXJzKSB7XHJcbiAgICAgICAgICB0aGlzLmNyb24gPSBgJHt0aGlzLmNyb259ICpgO1xyXG4gICAgICAgIH1cclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnbW9udGhseSc6XHJcbiAgICAgICAgc3dpdGNoICh0aGlzLnN0YXRlLm1vbnRobHkuc3ViVGFiKSB7XHJcbiAgICAgICAgICBjYXNlICdzcGVjaWZpY0RheSc6XHJcbiAgICAgICAgICAgIGNvbnN0IGRheSA9IHRoaXMuc3RhdGUubW9udGhseS5ydW5PbldlZWtkYXkgPyBgJHt0aGlzLnN0YXRlLm1vbnRobHkuc3BlY2lmaWNEYXkuZGF5fVdgIDogdGhpcy5zdGF0ZS5tb250aGx5LnNwZWNpZmljRGF5LmRheTtcclxuICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1heC1saW5lLWxlbmd0aFxyXG4gICAgICAgICAgICB0aGlzLmNyb24gPSBgJHt0aGlzLnN0YXRlLm1vbnRobHkuc3BlY2lmaWNEYXkubWludXRlc30gJHt0aGlzLmhvdXJUb0Nyb24odGhpcy5zdGF0ZS5tb250aGx5LnNwZWNpZmljRGF5LmhvdXJzLCB0aGlzLnN0YXRlLm1vbnRobHkuc3BlY2lmaWNEYXkuaG91clR5cGUpfSAke2RheX0gMS8ke3RoaXMuc3RhdGUubW9udGhseS5zcGVjaWZpY0RheS5tb250aHN9ID9gO1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMucmVtb3ZlU2Vjb25kcykge1xyXG4gICAgICAgICAgICAgIHRoaXMuY3JvbiA9IGAke3RoaXMuc3RhdGUubW9udGhseS5zcGVjaWZpY0RheS5zZWNvbmRzfSAke3RoaXMuY3Jvbn1gO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5yZW1vdmVZZWFycykge1xyXG4gICAgICAgICAgICAgIHRoaXMuY3JvbiA9IGAke3RoaXMuY3Jvbn0gKmA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICBjYXNlICdzcGVjaWZpY1dlZWtEYXknOlxyXG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXHJcbiAgICAgICAgICAgIHRoaXMuY3JvbiA9IGAke3RoaXMuc3RhdGUubW9udGhseS5zcGVjaWZpY1dlZWtEYXkubWludXRlc30gJHt0aGlzLmhvdXJUb0Nyb24odGhpcy5zdGF0ZS5tb250aGx5LnNwZWNpZmljV2Vla0RheS5ob3VycywgdGhpcy5zdGF0ZS5tb250aGx5LnNwZWNpZmljV2Vla0RheS5ob3VyVHlwZSl9ID8gJHt0aGlzLnN0YXRlLm1vbnRobHkuc3BlY2lmaWNXZWVrRGF5LnN0YXJ0TW9udGh9LyR7dGhpcy5zdGF0ZS5tb250aGx5LnNwZWNpZmljV2Vla0RheS5tb250aHN9ICR7dGhpcy5zdGF0ZS5tb250aGx5LnNwZWNpZmljV2Vla0RheS5kYXl9JHt0aGlzLnN0YXRlLm1vbnRobHkuc3BlY2lmaWNXZWVrRGF5Lm1vbnRoV2Vla31gO1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMucmVtb3ZlU2Vjb25kcykge1xyXG4gICAgICAgICAgICAgIHRoaXMuY3JvbiA9IGAke3RoaXMuc3RhdGUubW9udGhseS5zcGVjaWZpY1dlZWtEYXkuc2Vjb25kc30gJHt0aGlzLmNyb259YDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMucmVtb3ZlWWVhcnMpIHtcclxuICAgICAgICAgICAgICB0aGlzLmNyb24gPSBgJHt0aGlzLmNyb259ICpgO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGNyb24gbW9udGhseSBzdWJ0YWIgc2VsZWN0aW9uJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICd5ZWFybHknOlxyXG4gICAgICAgIHN3aXRjaCAodGhpcy5zdGF0ZS55ZWFybHkuc3ViVGFiKSB7XHJcbiAgICAgICAgICBjYXNlICdzcGVjaWZpY01vbnRoRGF5JzpcclxuICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1heC1saW5lLWxlbmd0aFxyXG4gICAgICAgICAgICBjb25zdCBkYXkgPSB0aGlzLnN0YXRlLnllYXJseS5ydW5PbldlZWtkYXkgPyBgJHt0aGlzLnN0YXRlLnllYXJseS5zcGVjaWZpY01vbnRoRGF5LmRheX1XYCA6IHRoaXMuc3RhdGUueWVhcmx5LnNwZWNpZmljTW9udGhEYXkuZGF5O1xyXG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXHJcbiAgICAgICAgICAgIHRoaXMuY3JvbiA9IGAke3RoaXMuc3RhdGUueWVhcmx5LnNwZWNpZmljTW9udGhEYXkubWludXRlc30gJHt0aGlzLmhvdXJUb0Nyb24odGhpcy5zdGF0ZS55ZWFybHkuc3BlY2lmaWNNb250aERheS5ob3VycywgdGhpcy5zdGF0ZS55ZWFybHkuc3BlY2lmaWNNb250aERheS5ob3VyVHlwZSl9ICR7ZGF5fSAke3RoaXMuc3RhdGUueWVhcmx5LnNwZWNpZmljTW9udGhEYXkubW9udGh9ID9gO1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMucmVtb3ZlU2Vjb25kcykge1xyXG4gICAgICAgICAgICAgIHRoaXMuY3JvbiA9IGAke3RoaXMuc3RhdGUueWVhcmx5LnNwZWNpZmljTW9udGhEYXkuc2Vjb25kc30gJHt0aGlzLmNyb259YDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMucmVtb3ZlWWVhcnMpIHtcclxuICAgICAgICAgICAgICB0aGlzLmNyb24gPSBgJHt0aGlzLmNyb259ICpgO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgY2FzZSAnc3BlY2lmaWNNb250aFdlZWsnOlxyXG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXHJcbiAgICAgICAgICAgIHRoaXMuY3JvbiA9IGAke3RoaXMuc3RhdGUueWVhcmx5LnNwZWNpZmljTW9udGhXZWVrLm1pbnV0ZXN9ICR7dGhpcy5ob3VyVG9Dcm9uKHRoaXMuc3RhdGUueWVhcmx5LnNwZWNpZmljTW9udGhXZWVrLmhvdXJzLCB0aGlzLnN0YXRlLnllYXJseS5zcGVjaWZpY01vbnRoV2Vlay5ob3VyVHlwZSl9ID8gJHt0aGlzLnN0YXRlLnllYXJseS5zcGVjaWZpY01vbnRoV2Vlay5tb250aH0gJHt0aGlzLnN0YXRlLnllYXJseS5zcGVjaWZpY01vbnRoV2Vlay5kYXl9JHt0aGlzLnN0YXRlLnllYXJseS5zcGVjaWZpY01vbnRoV2Vlay5tb250aFdlZWt9YDtcclxuXHJcbiAgICAgICAgICAgIGlmICghdGhpcy5vcHRpb25zLnJlbW92ZVNlY29uZHMpIHtcclxuICAgICAgICAgICAgICB0aGlzLmNyb24gPSBgJHt0aGlzLnN0YXRlLnllYXJseS5zcGVjaWZpY01vbnRoV2Vlay5zZWNvbmRzfSAke3RoaXMuY3Jvbn1gO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5yZW1vdmVZZWFycykge1xyXG4gICAgICAgICAgICAgIHRoaXMuY3JvbiA9IGAke3RoaXMuY3Jvbn0gKmA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY3JvbiB5ZWFybHkgc3VidGFiIHNlbGVjdGlvbicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnYWR2YW5jZWQnOlxyXG4gICAgICAgIHRoaXMuY3JvbiA9IHRoaXMuc3RhdGUuYWR2YW5jZWQuZXhwcmVzc2lvbjtcclxuICAgICAgICBicmVhaztcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY3JvbiBhY3RpdmUgdGFiIHNlbGVjdGlvbicpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRBbVBtSG91cihob3VyOiBudW1iZXIpIHtcclxuICAgIHJldHVybiB0aGlzLm9wdGlvbnMudXNlMjRIb3VyVGltZSA/IGhvdXIgOiAoaG91ciArIDExKSAlIDEyICsgMTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0SG91clR5cGUoaG91cjogbnVtYmVyKSB7XHJcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLnVzZTI0SG91clRpbWUgPyB1bmRlZmluZWQgOiAoaG91ciA+PSAxMiA/ICdQTScgOiAnQU0nKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgaG91clRvQ3Jvbihob3VyOiBudW1iZXIsIGhvdXJUeXBlOiBzdHJpbmcpIHtcclxuICAgIGlmICh0aGlzLm9wdGlvbnMudXNlMjRIb3VyVGltZSkge1xyXG4gICAgICByZXR1cm4gaG91cjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBob3VyVHlwZSA9PT0gJ0FNJyA/IChob3VyID09PSAxMiA/IDAgOiBob3VyKSA6IChob3VyID09PSAxMiA/IDEyIDogaG91ciArIDEyKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgaGFuZGxlTW9kZWxDaGFuZ2UoY3Jvbjogc3RyaW5nKSB7XHJcbiAgICBpZiAodGhpcy5pc0RpcnR5KSB7XHJcbiAgICAgIHRoaXMuaXNEaXJ0eSA9IGZhbHNlO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmlzRGlydHkgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnZhbGlkYXRlKGNyb24pO1xyXG5cclxuICAgIGxldCBjcm9uU2V2ZW4gPSBjcm9uO1xyXG4gICAgaWYgKHRoaXMub3B0aW9ucy5yZW1vdmVTZWNvbmRzKSB7XHJcbiAgICAgIGNyb25TZXZlbiA9IGAwICR7Y3Jvbn1gO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLm9wdGlvbnMucmVtb3ZlWWVhcnMpIHtcclxuICAgICAgY3JvblNldmVuID0gYCR7Y3JvblNldmVufSAqYDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBbc2Vjb25kcywgbWludXRlcywgaG91cnMsIGRheU9mTW9udGgsIG1vbnRoLCBkYXlPZldlZWtdID0gY3JvblNldmVuLnNwbGl0KCcgJyk7XHJcblxyXG4gICAgaWYgKGNyb25TZXZlbi5tYXRjaCgvXFxkKyAwXFwvXFxkKyBcXCogMVxcLzEgXFwqIFxcPyBcXCovKSkge1xyXG4gICAgICB0aGlzLmFjdGl2ZVRhYiA9ICdtaW51dGVzJztcclxuXHJcbiAgICAgIHRoaXMuc3RhdGUubWludXRlcy5taW51dGVzID0gTnVtYmVyKG1pbnV0ZXMuc3Vic3RyaW5nKDIpKTtcclxuICAgICAgdGhpcy5zdGF0ZS5taW51dGVzLnNlY29uZHMgPSBOdW1iZXIoc2Vjb25kcyk7XHJcbiAgICB9IGVsc2UgaWYgKGNyb25TZXZlbi5tYXRjaCgvXFxkKyBcXGQrIDBcXC9cXGQrIDFcXC8xIFxcKiBcXD8gXFwqLykpIHtcclxuICAgICAgdGhpcy5hY3RpdmVUYWIgPSAnaG91cmx5JztcclxuXHJcbiAgICAgIHRoaXMuc3RhdGUuaG91cmx5LmhvdXJzID0gTnVtYmVyKGhvdXJzLnN1YnN0cmluZygyKSk7XHJcbiAgICAgIHRoaXMuc3RhdGUuaG91cmx5Lm1pbnV0ZXMgPSBOdW1iZXIobWludXRlcyk7XHJcbiAgICAgIHRoaXMuc3RhdGUuaG91cmx5LnNlY29uZHMgPSBOdW1iZXIoc2Vjb25kcyk7XHJcbiAgICB9IGVsc2UgaWYgKGNyb25TZXZlbi5tYXRjaCgvXFxkKyBcXGQrIFxcZCsgMVxcL1xcZCsgXFwqIFxcPyBcXCovKSkge1xyXG4gICAgICB0aGlzLmFjdGl2ZVRhYiA9ICdkYWlseSc7XHJcblxyXG4gICAgICB0aGlzLnN0YXRlLmRhaWx5LnN1YlRhYiA9ICdldmVyeURheXMnO1xyXG4gICAgICB0aGlzLnN0YXRlLmRhaWx5LmV2ZXJ5RGF5cy5kYXlzID0gTnVtYmVyKGRheU9mTW9udGguc3Vic3RyaW5nKDIpKTtcclxuICAgICAgY29uc3QgcGFyc2VkSG91cnMgPSBOdW1iZXIoaG91cnMpO1xyXG4gICAgICB0aGlzLnN0YXRlLmRhaWx5LmV2ZXJ5RGF5cy5ob3VycyA9IHRoaXMuZ2V0QW1QbUhvdXIocGFyc2VkSG91cnMpO1xyXG4gICAgICB0aGlzLnN0YXRlLmRhaWx5LmV2ZXJ5RGF5cy5ob3VyVHlwZSA9IHRoaXMuZ2V0SG91clR5cGUocGFyc2VkSG91cnMpO1xyXG4gICAgICB0aGlzLnN0YXRlLmRhaWx5LmV2ZXJ5RGF5cy5taW51dGVzID0gTnVtYmVyKG1pbnV0ZXMpO1xyXG4gICAgICB0aGlzLnN0YXRlLmRhaWx5LmV2ZXJ5RGF5cy5zZWNvbmRzID0gTnVtYmVyKHNlY29uZHMpO1xyXG4gICAgfSBlbHNlIGlmIChjcm9uU2V2ZW4ubWF0Y2goL1xcZCsgXFxkKyBcXGQrIFxcPyBcXCogTU9OLUZSSSBcXCovKSkge1xyXG4gICAgICB0aGlzLmFjdGl2ZVRhYiA9ICdkYWlseSc7XHJcblxyXG4gICAgICB0aGlzLnN0YXRlLmRhaWx5LnN1YlRhYiA9ICdldmVyeVdlZWtEYXknO1xyXG4gICAgICBjb25zdCBwYXJzZWRIb3VycyA9IE51bWJlcihob3Vycyk7XHJcbiAgICAgIHRoaXMuc3RhdGUuZGFpbHkuZXZlcnlXZWVrRGF5LmhvdXJzID0gdGhpcy5nZXRBbVBtSG91cihwYXJzZWRIb3Vycyk7XHJcbiAgICAgIHRoaXMuc3RhdGUuZGFpbHkuZXZlcnlXZWVrRGF5LmhvdXJUeXBlID0gdGhpcy5nZXRIb3VyVHlwZShwYXJzZWRIb3Vycyk7XHJcbiAgICAgIHRoaXMuc3RhdGUuZGFpbHkuZXZlcnlXZWVrRGF5Lm1pbnV0ZXMgPSBOdW1iZXIobWludXRlcyk7XHJcbiAgICAgIHRoaXMuc3RhdGUuZGFpbHkuZXZlcnlXZWVrRGF5LnNlY29uZHMgPSBOdW1iZXIoc2Vjb25kcyk7XHJcbiAgICB9IGVsc2UgaWYgKGNyb25TZXZlbi5tYXRjaCgvXFxkKyBcXGQrIFxcZCsgXFw/IFxcKiAoTU9OfFRVRXxXRUR8VEhVfEZSSXxTQVR8U1VOKSgsKE1PTnxUVUV8V0VEfFRIVXxGUkl8U0FUfFNVTikpKiBcXCovKSkge1xyXG4gICAgICB0aGlzLmFjdGl2ZVRhYiA9ICd3ZWVrbHknO1xyXG4gICAgICB0aGlzLnNlbGVjdE9wdGlvbnMuZGF5cy5mb3JFYWNoKHdlZWtEYXkgPT4gdGhpcy5zdGF0ZS53ZWVrbHlbd2Vla0RheV0gPSBmYWxzZSk7XHJcbiAgICAgIGRheU9mV2Vlay5zcGxpdCgnLCcpLmZvckVhY2god2Vla0RheSA9PiB0aGlzLnN0YXRlLndlZWtseVt3ZWVrRGF5XSA9IHRydWUpO1xyXG4gICAgICBjb25zdCBwYXJzZWRIb3VycyA9IE51bWJlcihob3Vycyk7XHJcbiAgICAgIHRoaXMuc3RhdGUud2Vla2x5LmhvdXJzID0gdGhpcy5nZXRBbVBtSG91cihwYXJzZWRIb3Vycyk7XHJcbiAgICAgIHRoaXMuc3RhdGUud2Vla2x5LmhvdXJUeXBlID0gdGhpcy5nZXRIb3VyVHlwZShwYXJzZWRIb3Vycyk7XHJcbiAgICAgIHRoaXMuc3RhdGUud2Vla2x5Lm1pbnV0ZXMgPSBOdW1iZXIobWludXRlcyk7XHJcbiAgICAgIHRoaXMuc3RhdGUud2Vla2x5LnNlY29uZHMgPSBOdW1iZXIoc2Vjb25kcyk7XHJcbiAgICB9IGVsc2UgaWYgKGNyb25TZXZlbi5tYXRjaCgvXFxkKyBcXGQrIFxcZCsgKFxcZCt8THxMV3wxVykgMVxcL1xcZCsgXFw/IFxcKi8pKSB7XHJcbiAgICAgIHRoaXMuYWN0aXZlVGFiID0gJ21vbnRobHknO1xyXG4gICAgICB0aGlzLnN0YXRlLm1vbnRobHkuc3ViVGFiID0gJ3NwZWNpZmljRGF5JztcclxuXHJcbiAgICAgIGlmIChkYXlPZk1vbnRoLmluZGV4T2YoJ1cnKSAhPT0gLTEpIHtcclxuICAgICAgICB0aGlzLnN0YXRlLm1vbnRobHkuc3BlY2lmaWNEYXkuZGF5ID0gZGF5T2ZNb250aC5jaGFyQXQoMCk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZS5tb250aGx5LnJ1bk9uV2Vla2RheSA9IHRydWU7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5zdGF0ZS5tb250aGx5LnNwZWNpZmljRGF5LmRheSA9IGRheU9mTW9udGg7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuc3RhdGUubW9udGhseS5zcGVjaWZpY0RheS5tb250aHMgPSBOdW1iZXIobW9udGguc3Vic3RyaW5nKDIpKTtcclxuICAgICAgY29uc3QgcGFyc2VkSG91cnMgPSBOdW1iZXIoaG91cnMpO1xyXG4gICAgICB0aGlzLnN0YXRlLm1vbnRobHkuc3BlY2lmaWNEYXkuaG91cnMgPSB0aGlzLmdldEFtUG1Ib3VyKHBhcnNlZEhvdXJzKTtcclxuICAgICAgdGhpcy5zdGF0ZS5tb250aGx5LnNwZWNpZmljRGF5LmhvdXJUeXBlID0gdGhpcy5nZXRIb3VyVHlwZShwYXJzZWRIb3Vycyk7XHJcbiAgICAgIHRoaXMuc3RhdGUubW9udGhseS5zcGVjaWZpY0RheS5taW51dGVzID0gTnVtYmVyKG1pbnV0ZXMpO1xyXG4gICAgICB0aGlzLnN0YXRlLm1vbnRobHkuc3BlY2lmaWNEYXkuc2Vjb25kcyA9IE51bWJlcihzZWNvbmRzKTtcclxuICAgIH0gZWxzZSBpZiAoY3JvblNldmVuLm1hdGNoKC9cXGQrIFxcZCsgXFxkKyBcXD8gXFxkK1xcL1xcZCsgKE1PTnxUVUV8V0VEfFRIVXxGUkl8U0FUfFNVTikoKCNbMS01XSl8TCkgXFwqLykpIHtcclxuICAgICAgY29uc3QgZGF5ID0gZGF5T2ZXZWVrLnN1YnN0cigwLCAzKTtcclxuICAgICAgY29uc3QgbW9udGhXZWVrID0gZGF5T2ZXZWVrLnN1YnN0cigzKTtcclxuICAgICAgdGhpcy5hY3RpdmVUYWIgPSAnbW9udGhseSc7XHJcbiAgICAgIHRoaXMuc3RhdGUubW9udGhseS5zdWJUYWIgPSAnc3BlY2lmaWNXZWVrRGF5JztcclxuICAgICAgdGhpcy5zdGF0ZS5tb250aGx5LnNwZWNpZmljV2Vla0RheS5tb250aFdlZWsgPSBtb250aFdlZWs7XHJcbiAgICAgIHRoaXMuc3RhdGUubW9udGhseS5zcGVjaWZpY1dlZWtEYXkuZGF5ID0gZGF5O1xyXG5cclxuICAgICAgaWYgKG1vbnRoLmluZGV4T2YoJy8nKSAhPT0gLTEpIHtcclxuICAgICAgICB0aGlzLnN0YXRlLm1vbnRobHkuc3BlY2lmaWNXZWVrRGF5Lm1vbnRocyA9IE51bWJlcihtb250aC5zdWJzdHJpbmcoMikpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUubW9udGhseS5zcGVjaWZpY1dlZWtEYXkuc3RhcnRNb250aCA9IE51bWJlcihtb250aC5zcGxpdCgnLycpWzBdKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgcGFyc2VkSG91cnMgPSBOdW1iZXIoaG91cnMpO1xyXG4gICAgICB0aGlzLnN0YXRlLm1vbnRobHkuc3BlY2lmaWNXZWVrRGF5LmhvdXJzID0gdGhpcy5nZXRBbVBtSG91cihwYXJzZWRIb3Vycyk7XHJcbiAgICAgIHRoaXMuc3RhdGUubW9udGhseS5zcGVjaWZpY1dlZWtEYXkuaG91clR5cGUgPSB0aGlzLmdldEhvdXJUeXBlKHBhcnNlZEhvdXJzKTtcclxuICAgICAgdGhpcy5zdGF0ZS5tb250aGx5LnNwZWNpZmljV2Vla0RheS5taW51dGVzID0gTnVtYmVyKG1pbnV0ZXMpO1xyXG4gICAgICB0aGlzLnN0YXRlLm1vbnRobHkuc3BlY2lmaWNXZWVrRGF5LnNlY29uZHMgPSBOdW1iZXIoc2Vjb25kcyk7XHJcbiAgICB9IGVsc2UgaWYgKGNyb25TZXZlbi5tYXRjaCgvXFxkKyBcXGQrIFxcZCsgKFxcZCt8THxMV3wxVykgXFxkKyBcXD8gXFwqLykpIHtcclxuICAgICAgdGhpcy5hY3RpdmVUYWIgPSAneWVhcmx5JztcclxuICAgICAgdGhpcy5zdGF0ZS55ZWFybHkuc3ViVGFiID0gJ3NwZWNpZmljTW9udGhEYXknO1xyXG4gICAgICB0aGlzLnN0YXRlLnllYXJseS5zcGVjaWZpY01vbnRoRGF5Lm1vbnRoID0gTnVtYmVyKG1vbnRoKTtcclxuXHJcbiAgICAgIGlmIChkYXlPZk1vbnRoLmluZGV4T2YoJ1cnKSAhPT0gLTEpIHtcclxuICAgICAgICB0aGlzLnN0YXRlLnllYXJseS5zcGVjaWZpY01vbnRoRGF5LmRheSA9IGRheU9mTW9udGguY2hhckF0KDApO1xyXG4gICAgICAgIHRoaXMuc3RhdGUueWVhcmx5LnJ1bk9uV2Vla2RheSA9IHRydWU7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5zdGF0ZS55ZWFybHkuc3BlY2lmaWNNb250aERheS5kYXkgPSBkYXlPZk1vbnRoO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBwYXJzZWRIb3VycyA9IE51bWJlcihob3Vycyk7XHJcbiAgICAgIHRoaXMuc3RhdGUueWVhcmx5LnNwZWNpZmljTW9udGhEYXkuaG91cnMgPSB0aGlzLmdldEFtUG1Ib3VyKHBhcnNlZEhvdXJzKTtcclxuICAgICAgdGhpcy5zdGF0ZS55ZWFybHkuc3BlY2lmaWNNb250aERheS5ob3VyVHlwZSA9IHRoaXMuZ2V0SG91clR5cGUocGFyc2VkSG91cnMpO1xyXG4gICAgICB0aGlzLnN0YXRlLnllYXJseS5zcGVjaWZpY01vbnRoRGF5Lm1pbnV0ZXMgPSBOdW1iZXIobWludXRlcyk7XHJcbiAgICAgIHRoaXMuc3RhdGUueWVhcmx5LnNwZWNpZmljTW9udGhEYXkuc2Vjb25kcyA9IE51bWJlcihzZWNvbmRzKTtcclxuICAgIH0gZWxzZSBpZiAoY3JvblNldmVuLm1hdGNoKC9cXGQrIFxcZCsgXFxkKyBcXD8gXFxkKyAoTU9OfFRVRXxXRUR8VEhVfEZSSXxTQVR8U1VOKSgoI1sxLTVdKXxMKSBcXCovKSkge1xyXG4gICAgICBjb25zdCBkYXkgPSBkYXlPZldlZWsuc3Vic3RyKDAsIDMpO1xyXG4gICAgICBjb25zdCBtb250aFdlZWsgPSBkYXlPZldlZWsuc3Vic3RyKDMpO1xyXG4gICAgICB0aGlzLmFjdGl2ZVRhYiA9ICd5ZWFybHknO1xyXG4gICAgICB0aGlzLnN0YXRlLnllYXJseS5zdWJUYWIgPSAnc3BlY2lmaWNNb250aFdlZWsnO1xyXG4gICAgICB0aGlzLnN0YXRlLnllYXJseS5zcGVjaWZpY01vbnRoV2Vlay5tb250aFdlZWsgPSBtb250aFdlZWs7XHJcbiAgICAgIHRoaXMuc3RhdGUueWVhcmx5LnNwZWNpZmljTW9udGhXZWVrLmRheSA9IGRheTtcclxuICAgICAgdGhpcy5zdGF0ZS55ZWFybHkuc3BlY2lmaWNNb250aFdlZWsubW9udGggPSBOdW1iZXIobW9udGgpO1xyXG4gICAgICBjb25zdCBwYXJzZWRIb3VycyA9IE51bWJlcihob3Vycyk7XHJcbiAgICAgIHRoaXMuc3RhdGUueWVhcmx5LnNwZWNpZmljTW9udGhXZWVrLmhvdXJzID0gdGhpcy5nZXRBbVBtSG91cihwYXJzZWRIb3Vycyk7XHJcbiAgICAgIHRoaXMuc3RhdGUueWVhcmx5LnNwZWNpZmljTW9udGhXZWVrLmhvdXJUeXBlID0gdGhpcy5nZXRIb3VyVHlwZShwYXJzZWRIb3Vycyk7XHJcbiAgICAgIHRoaXMuc3RhdGUueWVhcmx5LnNwZWNpZmljTW9udGhXZWVrLm1pbnV0ZXMgPSBOdW1iZXIobWludXRlcyk7XHJcbiAgICAgIHRoaXMuc3RhdGUueWVhcmx5LnNwZWNpZmljTW9udGhXZWVrLnNlY29uZHMgPSBOdW1iZXIoc2Vjb25kcyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmFjdGl2ZVRhYiA9ICdhZHZhbmNlZCc7XHJcbiAgICAgIHRoaXMuc3RhdGUuYWR2YW5jZWQuZXhwcmVzc2lvbiA9IGNyb247XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHZhbGlkYXRlKGNyb246IHN0cmluZyk6IHZvaWQge1xyXG4gICAgdGhpcy5zdGF0ZS52YWxpZGF0aW9uLmlzVmFsaWQgPSBmYWxzZTtcclxuICAgIHRoaXMuc3RhdGUudmFsaWRhdGlvbi5lcnJvck1lc3NhZ2UgPSAnJztcclxuXHJcbiAgICBpZiAoIWNyb24pIHtcclxuICAgICAgdGhpcy5zdGF0ZS52YWxpZGF0aW9uLmVycm9yTWVzc2FnZSA9ICdDcm9uIGV4cHJlc3Npb24gY2Fubm90IGJlIG51bGwnO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY3JvblBhcnRzID0gY3Jvbi5zcGxpdCgnICcpO1xyXG5cclxuICAgIGxldCBleHBlY3RlZCA9IDU7XHJcblxyXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMucmVtb3ZlU2Vjb25kcykge1xyXG4gICAgICBleHBlY3RlZCsrO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghdGhpcy5vcHRpb25zLnJlbW92ZVllYXJzKSB7XHJcbiAgICAgIGV4cGVjdGVkKys7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNyb25QYXJ0cy5sZW5ndGggIT09IGV4cGVjdGVkKSB7XHJcbiAgICAgIHRoaXMuc3RhdGUudmFsaWRhdGlvbi5lcnJvck1lc3NhZ2UgPSBgSW52YWxpZCBjcm9uIGV4cHJlc3Npb24sIHRoZXJlIG11c3QgYmUgJHtleHBlY3RlZH0gc2VnbWVudHNgO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zdGF0ZS52YWxpZGF0aW9uLmlzVmFsaWQgPSB0cnVlO1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXREZWZhdWx0QWR2YW5jZWRDcm9uRXhwcmVzc2lvbigpOiBzdHJpbmcge1xyXG4gICAgaWYgKHRoaXMub3B0aW9ucy5yZW1vdmVTZWNvbmRzICYmICF0aGlzLm9wdGlvbnMucmVtb3ZlWWVhcnMpIHtcclxuICAgICAgcmV0dXJuICcxNSAxMCBMLTIgKiA/IDIwMTknO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghdGhpcy5vcHRpb25zLnJlbW92ZVNlY29uZHMgJiYgdGhpcy5vcHRpb25zLnJlbW92ZVllYXJzKSB7XHJcbiAgICAgIHJldHVybiAnMCAxNSAxMCBMLTIgKiA/JztcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5vcHRpb25zLnJlbW92ZVNlY29uZHMgJiYgdGhpcy5vcHRpb25zLnJlbW92ZVllYXJzKSB7XHJcbiAgICAgIHJldHVybiAnMTUgMTAgTC0yICogPyc7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuICcwIDE1IDEwIEwtMiAqID8gMjAxOSc7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldERlZmF1bHRTdGF0ZSgpIHtcclxuICAgIGNvbnN0IFtkZWZhdWx0SG91cnMsIGRlZmF1bHRNaW51dGVzLCBkZWZhdWx0U2Vjb25kc10gPSB0aGlzLm9wdGlvbnMuZGVmYXVsdFRpbWUuc3BsaXQoJzonKS5tYXAoTnVtYmVyKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBtaW51dGVzOiB7XHJcbiAgICAgICAgbWludXRlczogMSxcclxuICAgICAgICBzZWNvbmRzOiAwXHJcbiAgICAgIH0sXHJcbiAgICAgIGhvdXJseToge1xyXG4gICAgICAgIGhvdXJzOiAxLFxyXG4gICAgICAgIG1pbnV0ZXM6IDAsXHJcbiAgICAgICAgc2Vjb25kczogMFxyXG4gICAgICB9LFxyXG4gICAgICBkYWlseToge1xyXG4gICAgICAgIHN1YlRhYjogJ2V2ZXJ5RGF5cycsXHJcbiAgICAgICAgZXZlcnlEYXlzOiB7XHJcbiAgICAgICAgICBkYXlzOiAxLFxyXG4gICAgICAgICAgaG91cnM6IHRoaXMuZ2V0QW1QbUhvdXIoZGVmYXVsdEhvdXJzKSxcclxuICAgICAgICAgIG1pbnV0ZXM6IGRlZmF1bHRNaW51dGVzLFxyXG4gICAgICAgICAgc2Vjb25kczogZGVmYXVsdFNlY29uZHMsXHJcbiAgICAgICAgICBob3VyVHlwZTogdGhpcy5nZXRIb3VyVHlwZShkZWZhdWx0SG91cnMpXHJcbiAgICAgICAgfSxcclxuICAgICAgICBldmVyeVdlZWtEYXk6IHtcclxuICAgICAgICAgIGhvdXJzOiB0aGlzLmdldEFtUG1Ib3VyKGRlZmF1bHRIb3VycyksXHJcbiAgICAgICAgICBtaW51dGVzOiBkZWZhdWx0TWludXRlcyxcclxuICAgICAgICAgIHNlY29uZHM6IGRlZmF1bHRTZWNvbmRzLFxyXG4gICAgICAgICAgaG91clR5cGU6IHRoaXMuZ2V0SG91clR5cGUoZGVmYXVsdEhvdXJzKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgd2Vla2x5OiB7XHJcbiAgICAgICAgTU9OOiB0cnVlLFxyXG4gICAgICAgIFRVRTogZmFsc2UsXHJcbiAgICAgICAgV0VEOiBmYWxzZSxcclxuICAgICAgICBUSFU6IGZhbHNlLFxyXG4gICAgICAgIEZSSTogZmFsc2UsXHJcbiAgICAgICAgU0FUOiBmYWxzZSxcclxuICAgICAgICBTVU46IGZhbHNlLFxyXG4gICAgICAgIGhvdXJzOiB0aGlzLmdldEFtUG1Ib3VyKGRlZmF1bHRIb3VycyksXHJcbiAgICAgICAgbWludXRlczogZGVmYXVsdE1pbnV0ZXMsXHJcbiAgICAgICAgc2Vjb25kczogZGVmYXVsdFNlY29uZHMsXHJcbiAgICAgICAgaG91clR5cGU6IHRoaXMuZ2V0SG91clR5cGUoZGVmYXVsdEhvdXJzKVxyXG4gICAgICB9LFxyXG4gICAgICBtb250aGx5OiB7XHJcbiAgICAgICAgc3ViVGFiOiAnc3BlY2lmaWNEYXknLFxyXG4gICAgICAgIHJ1bk9uV2Vla2RheTogZmFsc2UsXHJcbiAgICAgICAgc3BlY2lmaWNEYXk6IHtcclxuICAgICAgICAgIGRheTogJzEnLFxyXG4gICAgICAgICAgbW9udGhzOiAxLFxyXG4gICAgICAgICAgaG91cnM6IHRoaXMuZ2V0QW1QbUhvdXIoZGVmYXVsdEhvdXJzKSxcclxuICAgICAgICAgIG1pbnV0ZXM6IGRlZmF1bHRNaW51dGVzLFxyXG4gICAgICAgICAgc2Vjb25kczogZGVmYXVsdFNlY29uZHMsXHJcbiAgICAgICAgICBob3VyVHlwZTogdGhpcy5nZXRIb3VyVHlwZShkZWZhdWx0SG91cnMpXHJcbiAgICAgICAgfSxcclxuICAgICAgICBzcGVjaWZpY1dlZWtEYXk6IHtcclxuICAgICAgICAgIG1vbnRoV2VlazogJyMxJyxcclxuICAgICAgICAgIGRheTogJ01PTicsXHJcbiAgICAgICAgICBzdGFydE1vbnRoOiAxLFxyXG4gICAgICAgICAgbW9udGhzOiAxLFxyXG4gICAgICAgICAgaG91cnM6IHRoaXMuZ2V0QW1QbUhvdXIoZGVmYXVsdEhvdXJzKSxcclxuICAgICAgICAgIG1pbnV0ZXM6IGRlZmF1bHRNaW51dGVzLFxyXG4gICAgICAgICAgc2Vjb25kczogZGVmYXVsdFNlY29uZHMsXHJcbiAgICAgICAgICBob3VyVHlwZTogdGhpcy5nZXRIb3VyVHlwZShkZWZhdWx0SG91cnMpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB5ZWFybHk6IHtcclxuICAgICAgICBzdWJUYWI6ICdzcGVjaWZpY01vbnRoRGF5JyxcclxuICAgICAgICBydW5PbldlZWtkYXk6IGZhbHNlLFxyXG4gICAgICAgIHNwZWNpZmljTW9udGhEYXk6IHtcclxuICAgICAgICAgIG1vbnRoOiAxLFxyXG4gICAgICAgICAgZGF5OiAnMScsXHJcbiAgICAgICAgICBob3VyczogdGhpcy5nZXRBbVBtSG91cihkZWZhdWx0SG91cnMpLFxyXG4gICAgICAgICAgbWludXRlczogZGVmYXVsdE1pbnV0ZXMsXHJcbiAgICAgICAgICBzZWNvbmRzOiBkZWZhdWx0U2Vjb25kcyxcclxuICAgICAgICAgIGhvdXJUeXBlOiB0aGlzLmdldEhvdXJUeXBlKGRlZmF1bHRIb3VycylcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNwZWNpZmljTW9udGhXZWVrOiB7XHJcbiAgICAgICAgICBtb250aFdlZWs6ICcjMScsXHJcbiAgICAgICAgICBkYXk6ICdNT04nLFxyXG4gICAgICAgICAgbW9udGg6IDEsXHJcbiAgICAgICAgICBob3VyczogdGhpcy5nZXRBbVBtSG91cihkZWZhdWx0SG91cnMpLFxyXG4gICAgICAgICAgbWludXRlczogZGVmYXVsdE1pbnV0ZXMsXHJcbiAgICAgICAgICBzZWNvbmRzOiBkZWZhdWx0U2Vjb25kcyxcclxuICAgICAgICAgIGhvdXJUeXBlOiB0aGlzLmdldEhvdXJUeXBlKGRlZmF1bHRIb3VycylcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIGFkdmFuY2VkOiB7XHJcbiAgICAgICAgZXhwcmVzc2lvbjogdGhpcy5nZXREZWZhdWx0QWR2YW5jZWRDcm9uRXhwcmVzc2lvbigpXHJcbiAgICAgIH0sXHJcbiAgICAgIHZhbGlkYXRpb246IHtcclxuICAgICAgICBpc1ZhbGlkOiB0cnVlLFxyXG4gICAgICAgIGVycm9yTWVzc2FnZTogJydcclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0T3JkaW5hbFN1ZmZpeCh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICBpZiAodmFsdWUubGVuZ3RoID4gMSkge1xyXG4gICAgICBjb25zdCBzZWNvbmRUb0xhc3REaWdpdCA9IHZhbHVlLmNoYXJBdCh2YWx1ZS5sZW5ndGggLSAyKTtcclxuICAgICAgaWYgKHNlY29uZFRvTGFzdERpZ2l0ID09PSAnMScpIHtcclxuICAgICAgICByZXR1cm4gJ3RoJztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGxhc3REaWdpdCA9IHZhbHVlLmNoYXJBdCh2YWx1ZS5sZW5ndGggLSAxKTtcclxuICAgIHN3aXRjaCAobGFzdERpZ2l0KSB7XHJcbiAgICAgIGNhc2UgJzEnOlxyXG4gICAgICAgIHJldHVybiAnc3QnO1xyXG4gICAgICBjYXNlICcyJzpcclxuICAgICAgICByZXR1cm4gJ25kJztcclxuICAgICAgY2FzZSAnMyc6XHJcbiAgICAgICAgcmV0dXJuICdyZCc7XHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgcmV0dXJuICd0aCc7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldFNlbGVjdE9wdGlvbnMoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBtb250aHM6IFV0aWxzLmdldFJhbmdlKDEsIDEyKSxcclxuICAgICAgbW9udGhXZWVrczogWycjMScsICcjMicsICcjMycsICcjNCcsICcjNScsICdMJ10sXHJcbiAgICAgIGRheXM6IFsnTU9OJywgJ1RVRScsICdXRUQnLCAnVEhVJywgJ0ZSSScsICdTQVQnLCAnU1VOJ10sXHJcbiAgICAgIG1pbnV0ZXM6IFV0aWxzLmdldFJhbmdlKDAsIDU5KSxcclxuICAgICAgZnVsbE1pbnV0ZXM6IFV0aWxzLmdldFJhbmdlKDAsIDU5KSxcclxuICAgICAgc2Vjb25kczogVXRpbHMuZ2V0UmFuZ2UoMCwgNTkpLFxyXG4gICAgICBob3VyczogVXRpbHMuZ2V0UmFuZ2UoMSwgMjMpLFxyXG4gICAgICBtb250aERheXM6IFV0aWxzLmdldFJhbmdlKDEsIDMxKSxcclxuICAgICAgbW9udGhEYXlzV2l0aExhc3RzOiBbLi4uVXRpbHMuZ2V0UmFuZ2UoMSwgMzEpLm1hcChTdHJpbmcpLCAnTCddLFxyXG4gICAgICBob3VyVHlwZXM6IFsnQU0nLCAnUE0nXVxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuIl19