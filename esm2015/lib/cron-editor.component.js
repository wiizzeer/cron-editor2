/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Days, MonthWeeks, Months } from './enums';
import Utils from './Utils';
export class CronEditorComponent {
    constructor() {
        // the name is an Angular convention, @Input variable name + "Change" suffix
        this.cronChange = new EventEmitter();
        this.selectOptions = this.getSelectOptions();
    }
    /**
     * @return {?}
     */
    get cron() { return this.localCron; }
    /**
     * @param {?} value
     * @return {?}
     */
    set cron(value) {
        this.localCron = value;
        this.cronChange.emit(this.localCron);
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (this.options.removeSeconds) {
            this.options.hideSeconds = true;
        }
        this.state = this.getDefaultState();
        this.handleModelChange(this.cron);
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        /** @type {?} */
        const newCron = changes['cron'];
        if (newCron && !newCron.firstChange) {
            this.handleModelChange(this.cron);
        }
    }
    /**
     * @param {?} tab
     * @return {?}
     */
    setActiveTab(tab) {
        if (!this.disabled) {
            this.activeTab = tab;
            this.regenerateCron();
        }
    }
    /**
     * @param {?} day
     * @return {?}
     */
    dayDisplay(day) {
        return Days[day];
    }
    /**
     * @param {?} monthWeekNumber
     * @return {?}
     */
    monthWeekDisplay(monthWeekNumber) {
        return MonthWeeks[monthWeekNumber];
    }
    /**
     * @param {?} month
     * @return {?}
     */
    monthDisplay(month) {
        return Months[month];
    }
    /**
     * @param {?} month
     * @return {?}
     */
    monthDayDisplay(month) {
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
            return `${month}${this.getOrdinalSuffix(month)} day`;
        }
    }
    /**
     * @return {?}
     */
    regenerateCron() {
        this.isDirty = true;
        switch (this.activeTab) {
            case 'minutes':
                this.cron = `0/${this.state.minutes.minutes} * 1/1 * ?`;
                if (!this.options.removeSeconds) {
                    this.cron = `${this.state.minutes.seconds} ${this.cron}`;
                }
                if (!this.options.removeYears) {
                    this.cron = `${this.cron} *`;
                }
                break;
            case 'hourly':
                this.cron = `${this.state.hourly.minutes} 0/${this.state.hourly.hours} 1/1 * ?`;
                if (!this.options.removeSeconds) {
                    this.cron = `${this.state.hourly.seconds} ${this.cron}`;
                }
                if (!this.options.removeYears) {
                    this.cron = `${this.cron} *`;
                }
                break;
            case 'daily':
                switch (this.state.daily.subTab) {
                    case 'everyDays':
                        // tslint:disable-next-line:max-line-length
                        this.cron = `${this.state.daily.everyDays.minutes} ${this.hourToCron(this.state.daily.everyDays.hours, this.state.daily.everyDays.hourType)} 1/${this.state.daily.everyDays.days} * ?`;
                        if (!this.options.removeSeconds) {
                            this.cron = `${this.state.daily.everyDays.seconds} ${this.cron}`;
                        }
                        if (!this.options.removeYears) {
                            this.cron = `${this.cron} *`;
                        }
                        break;
                    case 'everyWeekDay':
                        // tslint:disable-next-line:max-line-length
                        this.cron = `${this.state.daily.everyWeekDay.minutes} ${this.hourToCron(this.state.daily.everyWeekDay.hours, this.state.daily.everyWeekDay.hourType)} ? * MON-FRI`;
                        if (!this.options.removeSeconds) {
                            this.cron = `${this.state.daily.everyWeekDay.seconds} ${this.cron}`;
                        }
                        if (!this.options.removeYears) {
                            this.cron = `${this.cron} *`;
                        }
                        break;
                    default:
                        throw new Error('Invalid cron daily subtab selection');
                }
                break;
            case 'weekly':
                /** @type {?} */
                const days = this.selectOptions.days
                    .reduce((/**
                 * @param {?} acc
                 * @param {?} day
                 * @return {?}
                 */
                (acc, day) => this.state.weekly[day] ? acc.concat([day]) : acc), [])
                    .join(',');
                this.cron = `${this.state.weekly.minutes} ${this.hourToCron(this.state.weekly.hours, this.state.weekly.hourType)} ? * ${days}`;
                if (!this.options.removeSeconds) {
                    this.cron = `${this.state.weekly.seconds} ${this.cron}`;
                }
                if (!this.options.removeYears) {
                    this.cron = `${this.cron} *`;
                }
                break;
            case 'monthly':
                switch (this.state.monthly.subTab) {
                    case 'specificDay':
                        /** @type {?} */
                        const day = this.state.monthly.runOnWeekday ? `${this.state.monthly.specificDay.day}W` : this.state.monthly.specificDay.day;
                        // tslint:disable-next-line:max-line-length
                        this.cron = `${this.state.monthly.specificDay.minutes} ${this.hourToCron(this.state.monthly.specificDay.hours, this.state.monthly.specificDay.hourType)} ${day} 1/${this.state.monthly.specificDay.months} ?`;
                        if (!this.options.removeSeconds) {
                            this.cron = `${this.state.monthly.specificDay.seconds} ${this.cron}`;
                        }
                        if (!this.options.removeYears) {
                            this.cron = `${this.cron} *`;
                        }
                        break;
                    case 'specificWeekDay':
                        // tslint:disable-next-line:max-line-length
                        this.cron = `${this.state.monthly.specificWeekDay.minutes} ${this.hourToCron(this.state.monthly.specificWeekDay.hours, this.state.monthly.specificWeekDay.hourType)} ? ${this.state.monthly.specificWeekDay.startMonth}/${this.state.monthly.specificWeekDay.months} ${this.state.monthly.specificWeekDay.day}${this.state.monthly.specificWeekDay.monthWeek}`;
                        if (!this.options.removeSeconds) {
                            this.cron = `${this.state.monthly.specificWeekDay.seconds} ${this.cron}`;
                        }
                        if (!this.options.removeYears) {
                            this.cron = `${this.cron} *`;
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
                        const day = this.state.yearly.runOnWeekday ? `${this.state.yearly.specificMonthDay.day}W` : this.state.yearly.specificMonthDay.day;
                        // tslint:disable-next-line:max-line-length
                        this.cron = `${this.state.yearly.specificMonthDay.minutes} ${this.hourToCron(this.state.yearly.specificMonthDay.hours, this.state.yearly.specificMonthDay.hourType)} ${day} ${this.state.yearly.specificMonthDay.month} ?`;
                        if (!this.options.removeSeconds) {
                            this.cron = `${this.state.yearly.specificMonthDay.seconds} ${this.cron}`;
                        }
                        if (!this.options.removeYears) {
                            this.cron = `${this.cron} *`;
                        }
                        break;
                    case 'specificMonthWeek':
                        // tslint:disable-next-line:max-line-length
                        this.cron = `${this.state.yearly.specificMonthWeek.minutes} ${this.hourToCron(this.state.yearly.specificMonthWeek.hours, this.state.yearly.specificMonthWeek.hourType)} ? ${this.state.yearly.specificMonthWeek.month} ${this.state.yearly.specificMonthWeek.day}${this.state.yearly.specificMonthWeek.monthWeek}`;
                        if (!this.options.removeSeconds) {
                            this.cron = `${this.state.yearly.specificMonthWeek.seconds} ${this.cron}`;
                        }
                        if (!this.options.removeYears) {
                            this.cron = `${this.cron} *`;
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
    }
    /**
     * @private
     * @param {?} hour
     * @return {?}
     */
    getAmPmHour(hour) {
        return this.options.use24HourTime ? hour : (hour + 11) % 12 + 1;
    }
    /**
     * @private
     * @param {?} hour
     * @return {?}
     */
    getHourType(hour) {
        return this.options.use24HourTime ? undefined : (hour >= 12 ? 'PM' : 'AM');
    }
    /**
     * @private
     * @param {?} hour
     * @param {?} hourType
     * @return {?}
     */
    hourToCron(hour, hourType) {
        if (this.options.use24HourTime) {
            return hour;
        }
        else {
            return hourType === 'AM' ? (hour === 12 ? 0 : hour) : (hour === 12 ? 12 : hour + 12);
        }
    }
    /**
     * @private
     * @param {?} cron
     * @return {?}
     */
    handleModelChange(cron) {
        if (this.isDirty) {
            this.isDirty = false;
            return;
        }
        else {
            this.isDirty = false;
        }
        this.validate(cron);
        /** @type {?} */
        let cronSeven = cron;
        if (this.options.removeSeconds) {
            cronSeven = `0 ${cron}`;
        }
        if (this.options.removeYears) {
            cronSeven = `${cronSeven} *`;
        }
        const [seconds, minutes, hours, dayOfMonth, month, dayOfWeek] = cronSeven.split(' ');
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
            const parsedHours = Number(hours);
            this.state.daily.everyDays.hours = this.getAmPmHour(parsedHours);
            this.state.daily.everyDays.hourType = this.getHourType(parsedHours);
            this.state.daily.everyDays.minutes = Number(minutes);
            this.state.daily.everyDays.seconds = Number(seconds);
        }
        else if (cronSeven.match(/\d+ \d+ \d+ \? \* MON-FRI \*/)) {
            this.activeTab = 'daily';
            this.state.daily.subTab = 'everyWeekDay';
            /** @type {?} */
            const parsedHours = Number(hours);
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
            weekDay => this.state.weekly[weekDay] = false));
            dayOfWeek.split(',').forEach((/**
             * @param {?} weekDay
             * @return {?}
             */
            weekDay => this.state.weekly[weekDay] = true));
            /** @type {?} */
            const parsedHours = Number(hours);
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
            const parsedHours = Number(hours);
            this.state.monthly.specificDay.hours = this.getAmPmHour(parsedHours);
            this.state.monthly.specificDay.hourType = this.getHourType(parsedHours);
            this.state.monthly.specificDay.minutes = Number(minutes);
            this.state.monthly.specificDay.seconds = Number(seconds);
        }
        else if (cronSeven.match(/\d+ \d+ \d+ \? \d+\/\d+ (MON|TUE|WED|THU|FRI|SAT|SUN)((#[1-5])|L) \*/)) {
            /** @type {?} */
            const day = dayOfWeek.substr(0, 3);
            /** @type {?} */
            const monthWeek = dayOfWeek.substr(3);
            this.activeTab = 'monthly';
            this.state.monthly.subTab = 'specificWeekDay';
            this.state.monthly.specificWeekDay.monthWeek = monthWeek;
            this.state.monthly.specificWeekDay.day = day;
            if (month.indexOf('/') !== -1) {
                this.state.monthly.specificWeekDay.months = Number(month.substring(2));
                this.state.monthly.specificWeekDay.startMonth = Number(month.split('/')[0]);
            }
            /** @type {?} */
            const parsedHours = Number(hours);
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
            const parsedHours = Number(hours);
            this.state.yearly.specificMonthDay.hours = this.getAmPmHour(parsedHours);
            this.state.yearly.specificMonthDay.hourType = this.getHourType(parsedHours);
            this.state.yearly.specificMonthDay.minutes = Number(minutes);
            this.state.yearly.specificMonthDay.seconds = Number(seconds);
        }
        else if (cronSeven.match(/\d+ \d+ \d+ \? \d+ (MON|TUE|WED|THU|FRI|SAT|SUN)((#[1-5])|L) \*/)) {
            /** @type {?} */
            const day = dayOfWeek.substr(0, 3);
            /** @type {?} */
            const monthWeek = dayOfWeek.substr(3);
            this.activeTab = 'yearly';
            this.state.yearly.subTab = 'specificMonthWeek';
            this.state.yearly.specificMonthWeek.monthWeek = monthWeek;
            this.state.yearly.specificMonthWeek.day = day;
            this.state.yearly.specificMonthWeek.month = Number(month);
            /** @type {?} */
            const parsedHours = Number(hours);
            this.state.yearly.specificMonthWeek.hours = this.getAmPmHour(parsedHours);
            this.state.yearly.specificMonthWeek.hourType = this.getHourType(parsedHours);
            this.state.yearly.specificMonthWeek.minutes = Number(minutes);
            this.state.yearly.specificMonthWeek.seconds = Number(seconds);
        }
        else {
            this.activeTab = 'advanced';
            this.state.advanced.expression = cron;
        }
    }
    /**
     * @private
     * @param {?} cron
     * @return {?}
     */
    validate(cron) {
        this.state.validation.isValid = false;
        this.state.validation.errorMessage = '';
        if (!cron) {
            this.state.validation.errorMessage = 'Cron expression cannot be null';
            return;
        }
        /** @type {?} */
        const cronParts = cron.split(' ');
        /** @type {?} */
        let expected = 5;
        if (!this.options.removeSeconds) {
            expected++;
        }
        if (!this.options.removeYears) {
            expected++;
        }
        if (cronParts.length !== expected) {
            this.state.validation.errorMessage = `Invalid cron expression, there must be ${expected} segments`;
            return;
        }
        this.state.validation.isValid = true;
        return;
    }
    /**
     * @private
     * @return {?}
     */
    getDefaultAdvancedCronExpression() {
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
    }
    /**
     * @private
     * @return {?}
     */
    getDefaultState() {
        const [defaultHours, defaultMinutes, defaultSeconds] = this.options.defaultTime.split(':').map(Number);
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
    }
    /**
     * @private
     * @param {?} value
     * @return {?}
     */
    getOrdinalSuffix(value) {
        if (value.length > 1) {
            /** @type {?} */
            const secondToLastDigit = value.charAt(value.length - 2);
            if (secondToLastDigit === '1') {
                return 'th';
            }
        }
        /** @type {?} */
        const lastDigit = value.charAt(value.length - 1);
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
    }
    /**
     * @private
     * @return {?}
     */
    getSelectOptions() {
        return {
            months: Utils.getRange(1, 12),
            monthWeeks: ['#1', '#2', '#3', '#4', '#5', 'L'],
            days: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
            minutes: Utils.getRange(0, 59),
            fullMinutes: Utils.getRange(0, 59),
            seconds: Utils.getRange(0, 59),
            hours: Utils.getRange(1, 23),
            monthDays: Utils.getRange(1, 31),
            monthDaysWithLasts: [...Utils.getRange(1, 31).map(String), 'L'],
            hourTypes: ['AM', 'PM']
        };
    }
}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3Jvbi1lZGl0b3IuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vY3Jvbi1lZGl0b3IvIiwic291cmNlcyI6WyJsaWIvY3Jvbi1lZGl0b3IuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFVLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUE0QixNQUFNLGVBQWUsQ0FBQztBQUd6RyxPQUFPLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFDbkQsT0FBTyxLQUFLLE1BQU0sU0FBUyxDQUFDO0FBTzVCLE1BQU0sT0FBTyxtQkFBbUI7SUFMaEM7O1FBZ0JZLGVBQVUsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBR25DLGtCQUFhLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFzZ0JqRCxDQUFDOzs7O0lBaGhCQyxJQUFhLElBQUksS0FBYSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDOzs7OztJQUN0RCxJQUFJLElBQUksQ0FBQyxLQUFhO1FBQ3BCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN2QyxDQUFDOzs7O0lBWU0sUUFBUTtRQUNiLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUU7WUFDOUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1NBQ2pDO1FBRUQsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7UUFFcEMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNwQyxDQUFDOzs7OztJQUVNLFdBQVcsQ0FBQyxPQUFzQjs7Y0FDakMsT0FBTyxHQUFHLE9BQU8s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QUFrQjs7Ozs7SUFFbEIsd0NBQTBCOzs7OztJQUMxQixzQ0FBeUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBTaW1wbGVDaGFuZ2VzLCBPbkNoYW5nZXMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ3Jvbk9wdGlvbnMgfSBmcm9tICcuL0Nyb25PcHRpb25zJztcclxuXHJcbmltcG9ydCB7IERheXMsIE1vbnRoV2Vla3MsIE1vbnRocyB9IGZyb20gJy4vZW51bXMnO1xyXG5pbXBvcnQgVXRpbHMgZnJvbSAnLi9VdGlscyc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2Nyb24tZWRpdG9yJyxcclxuICB0ZW1wbGF0ZVVybDogJy4vY3Jvbi1lZGl0b3IuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWycuL2Nyb24tZWRpdG9yLmNvbXBvbmVudC5jc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgQ3JvbkVkaXRvckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcclxuICBASW5wdXQoKSBwdWJsaWMgZGlzYWJsZWQ6IGJvb2xlYW47XHJcbiAgQElucHV0KCkgcHVibGljIG9wdGlvbnM6IENyb25PcHRpb25zO1xyXG5cclxuICBASW5wdXQoKSBnZXQgY3JvbigpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5sb2NhbENyb247IH1cclxuICBzZXQgY3Jvbih2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICB0aGlzLmxvY2FsQ3JvbiA9IHZhbHVlO1xyXG4gICAgdGhpcy5jcm9uQ2hhbmdlLmVtaXQodGhpcy5sb2NhbENyb24pO1xyXG4gIH1cclxuXHJcbiAgLy8gdGhlIG5hbWUgaXMgYW4gQW5ndWxhciBjb252ZW50aW9uLCBASW5wdXQgdmFyaWFibGUgbmFtZSArIFwiQ2hhbmdlXCIgc3VmZml4XHJcbiAgQE91dHB1dCgpIGNyb25DaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIHB1YmxpYyBhY3RpdmVUYWI6IHN0cmluZztcclxuICBwdWJsaWMgc2VsZWN0T3B0aW9ucyA9IHRoaXMuZ2V0U2VsZWN0T3B0aW9ucygpO1xyXG4gIHB1YmxpYyBzdGF0ZTogYW55O1xyXG5cclxuICBwcml2YXRlIGxvY2FsQ3Jvbjogc3RyaW5nO1xyXG4gIHByaXZhdGUgaXNEaXJ0eTogYm9vbGVhbjtcclxuXHJcbiAgcHVibGljIG5nT25Jbml0KCkge1xyXG4gICAgaWYgKHRoaXMub3B0aW9ucy5yZW1vdmVTZWNvbmRzKSB7XHJcbiAgICAgIHRoaXMub3B0aW9ucy5oaWRlU2Vjb25kcyA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zdGF0ZSA9IHRoaXMuZ2V0RGVmYXVsdFN0YXRlKCk7XHJcblxyXG4gICAgdGhpcy5oYW5kbGVNb2RlbENoYW5nZSh0aGlzLmNyb24pO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcclxuICAgIGNvbnN0IG5ld0Nyb24gPSBjaGFuZ2VzWydjcm9uJ107XHJcbiAgICBpZiAobmV3Q3JvbiAmJiAhbmV3Q3Jvbi5maXJzdENoYW5nZSkge1xyXG4gICAgICB0aGlzLmhhbmRsZU1vZGVsQ2hhbmdlKHRoaXMuY3Jvbik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc2V0QWN0aXZlVGFiKHRhYjogc3RyaW5nKSB7XHJcbiAgICBpZiAoIXRoaXMuZGlzYWJsZWQpIHtcclxuICAgICAgdGhpcy5hY3RpdmVUYWIgPSB0YWI7XHJcbiAgICAgIHRoaXMucmVnZW5lcmF0ZUNyb24oKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBkYXlEaXNwbGF5KGRheTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIHJldHVybiBEYXlzW2RheV07XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgbW9udGhXZWVrRGlzcGxheShtb250aFdlZWtOdW1iZXI6IG51bWJlcik6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gTW9udGhXZWVrc1ttb250aFdlZWtOdW1iZXJdO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIG1vbnRoRGlzcGxheShtb250aDogbnVtYmVyKTogc3RyaW5nIHtcclxuICAgIHJldHVybiBNb250aHNbbW9udGhdO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIG1vbnRoRGF5RGlzcGxheShtb250aDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIGlmIChtb250aCA9PT0gJ0wnKSB7XHJcbiAgICAgIHJldHVybiAnTGFzdCBEYXknO1xyXG4gICAgfSBlbHNlIGlmIChtb250aCA9PT0gJ0xXJykge1xyXG4gICAgICByZXR1cm4gJ0xhc3QgV2Vla2RheSc7XHJcbiAgICB9IGVsc2UgaWYgKG1vbnRoID09PSAnMVcnKSB7XHJcbiAgICAgIHJldHVybiAnRmlyc3QgV2Vla2RheSc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gYCR7bW9udGh9JHt0aGlzLmdldE9yZGluYWxTdWZmaXgobW9udGgpfSBkYXlgO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIHJlZ2VuZXJhdGVDcm9uKCkge1xyXG4gICAgdGhpcy5pc0RpcnR5ID0gdHJ1ZTtcclxuXHJcbiAgICBzd2l0Y2ggKHRoaXMuYWN0aXZlVGFiKSB7XHJcbiAgICAgIGNhc2UgJ21pbnV0ZXMnOlxyXG4gICAgICAgIHRoaXMuY3JvbiA9IGAwLyR7dGhpcy5zdGF0ZS5taW51dGVzLm1pbnV0ZXN9ICogMS8xICogP2A7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5vcHRpb25zLnJlbW92ZVNlY29uZHMpIHtcclxuICAgICAgICAgIHRoaXMuY3JvbiA9IGAke3RoaXMuc3RhdGUubWludXRlcy5zZWNvbmRzfSAke3RoaXMuY3Jvbn1gO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMucmVtb3ZlWWVhcnMpIHtcclxuICAgICAgICAgIHRoaXMuY3JvbiA9IGAke3RoaXMuY3Jvbn0gKmA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdob3VybHknOlxyXG4gICAgICAgIHRoaXMuY3JvbiA9IGAke3RoaXMuc3RhdGUuaG91cmx5Lm1pbnV0ZXN9IDAvJHt0aGlzLnN0YXRlLmhvdXJseS5ob3Vyc30gMS8xICogP2A7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5vcHRpb25zLnJlbW92ZVNlY29uZHMpIHtcclxuICAgICAgICAgIHRoaXMuY3JvbiA9IGAke3RoaXMuc3RhdGUuaG91cmx5LnNlY29uZHN9ICR7dGhpcy5jcm9ufWA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5yZW1vdmVZZWFycykge1xyXG4gICAgICAgICAgdGhpcy5jcm9uID0gYCR7dGhpcy5jcm9ufSAqYDtcclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ2RhaWx5JzpcclxuICAgICAgICBzd2l0Y2ggKHRoaXMuc3RhdGUuZGFpbHkuc3ViVGFiKSB7XHJcbiAgICAgICAgICBjYXNlICdldmVyeURheXMnOlxyXG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXHJcbiAgICAgICAgICAgIHRoaXMuY3JvbiA9IGAke3RoaXMuc3RhdGUuZGFpbHkuZXZlcnlEYXlzLm1pbnV0ZXN9ICR7dGhpcy5ob3VyVG9Dcm9uKHRoaXMuc3RhdGUuZGFpbHkuZXZlcnlEYXlzLmhvdXJzLCB0aGlzLnN0YXRlLmRhaWx5LmV2ZXJ5RGF5cy5ob3VyVHlwZSl9IDEvJHt0aGlzLnN0YXRlLmRhaWx5LmV2ZXJ5RGF5cy5kYXlzfSAqID9gO1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMucmVtb3ZlU2Vjb25kcykge1xyXG4gICAgICAgICAgICAgIHRoaXMuY3JvbiA9IGAke3RoaXMuc3RhdGUuZGFpbHkuZXZlcnlEYXlzLnNlY29uZHN9ICR7dGhpcy5jcm9ufWA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghdGhpcy5vcHRpb25zLnJlbW92ZVllYXJzKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5jcm9uID0gYCR7dGhpcy5jcm9ufSAqYDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIGNhc2UgJ2V2ZXJ5V2Vla0RheSc6XHJcbiAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTptYXgtbGluZS1sZW5ndGhcclxuICAgICAgICAgICAgdGhpcy5jcm9uID0gYCR7dGhpcy5zdGF0ZS5kYWlseS5ldmVyeVdlZWtEYXkubWludXRlc30gJHt0aGlzLmhvdXJUb0Nyb24odGhpcy5zdGF0ZS5kYWlseS5ldmVyeVdlZWtEYXkuaG91cnMsIHRoaXMuc3RhdGUuZGFpbHkuZXZlcnlXZWVrRGF5LmhvdXJUeXBlKX0gPyAqIE1PTi1GUklgO1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMucmVtb3ZlU2Vjb25kcykge1xyXG4gICAgICAgICAgICAgIHRoaXMuY3JvbiA9IGAke3RoaXMuc3RhdGUuZGFpbHkuZXZlcnlXZWVrRGF5LnNlY29uZHN9ICR7dGhpcy5jcm9ufWA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghdGhpcy5vcHRpb25zLnJlbW92ZVllYXJzKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5jcm9uID0gYCR7dGhpcy5jcm9ufSAqYDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjcm9uIGRhaWx5IHN1YnRhYiBzZWxlY3Rpb24nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ3dlZWtseSc6XHJcbiAgICAgICAgY29uc3QgZGF5cyA9IHRoaXMuc2VsZWN0T3B0aW9ucy5kYXlzXHJcbiAgICAgICAgICAucmVkdWNlKChhY2MsIGRheSkgPT4gdGhpcy5zdGF0ZS53ZWVrbHlbZGF5XSA/IGFjYy5jb25jYXQoW2RheV0pIDogYWNjLCBbXSlcclxuICAgICAgICAgIC5qb2luKCcsJyk7XHJcbiAgICAgICAgdGhpcy5jcm9uID0gYCR7dGhpcy5zdGF0ZS53ZWVrbHkubWludXRlc30gJHt0aGlzLmhvdXJUb0Nyb24odGhpcy5zdGF0ZS53ZWVrbHkuaG91cnMsIHRoaXMuc3RhdGUud2Vla2x5LmhvdXJUeXBlKX0gPyAqICR7ZGF5c31gO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5yZW1vdmVTZWNvbmRzKSB7XHJcbiAgICAgICAgICB0aGlzLmNyb24gPSBgJHt0aGlzLnN0YXRlLndlZWtseS5zZWNvbmRzfSAke3RoaXMuY3Jvbn1gO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMucmVtb3ZlWWVhcnMpIHtcclxuICAgICAgICAgIHRoaXMuY3JvbiA9IGAke3RoaXMuY3Jvbn0gKmA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdtb250aGx5JzpcclxuICAgICAgICBzd2l0Y2ggKHRoaXMuc3RhdGUubW9udGhseS5zdWJUYWIpIHtcclxuICAgICAgICAgIGNhc2UgJ3NwZWNpZmljRGF5JzpcclxuICAgICAgICAgICAgY29uc3QgZGF5ID0gdGhpcy5zdGF0ZS5tb250aGx5LnJ1bk9uV2Vla2RheSA/IGAke3RoaXMuc3RhdGUubW9udGhseS5zcGVjaWZpY0RheS5kYXl9V2AgOiB0aGlzLnN0YXRlLm1vbnRobHkuc3BlY2lmaWNEYXkuZGF5O1xyXG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXHJcbiAgICAgICAgICAgIHRoaXMuY3JvbiA9IGAke3RoaXMuc3RhdGUubW9udGhseS5zcGVjaWZpY0RheS5taW51dGVzfSAke3RoaXMuaG91clRvQ3Jvbih0aGlzLnN0YXRlLm1vbnRobHkuc3BlY2lmaWNEYXkuaG91cnMsIHRoaXMuc3RhdGUubW9udGhseS5zcGVjaWZpY0RheS5ob3VyVHlwZSl9ICR7ZGF5fSAxLyR7dGhpcy5zdGF0ZS5tb250aGx5LnNwZWNpZmljRGF5Lm1vbnRoc30gP2A7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5yZW1vdmVTZWNvbmRzKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5jcm9uID0gYCR7dGhpcy5zdGF0ZS5tb250aGx5LnNwZWNpZmljRGF5LnNlY29uZHN9ICR7dGhpcy5jcm9ufWA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghdGhpcy5vcHRpb25zLnJlbW92ZVllYXJzKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5jcm9uID0gYCR7dGhpcy5jcm9ufSAqYDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIGNhc2UgJ3NwZWNpZmljV2Vla0RheSc6XHJcbiAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTptYXgtbGluZS1sZW5ndGhcclxuICAgICAgICAgICAgdGhpcy5jcm9uID0gYCR7dGhpcy5zdGF0ZS5tb250aGx5LnNwZWNpZmljV2Vla0RheS5taW51dGVzfSAke3RoaXMuaG91clRvQ3Jvbih0aGlzLnN0YXRlLm1vbnRobHkuc3BlY2lmaWNXZWVrRGF5LmhvdXJzLCB0aGlzLnN0YXRlLm1vbnRobHkuc3BlY2lmaWNXZWVrRGF5LmhvdXJUeXBlKX0gPyAke3RoaXMuc3RhdGUubW9udGhseS5zcGVjaWZpY1dlZWtEYXkuc3RhcnRNb250aH0vJHt0aGlzLnN0YXRlLm1vbnRobHkuc3BlY2lmaWNXZWVrRGF5Lm1vbnRoc30gJHt0aGlzLnN0YXRlLm1vbnRobHkuc3BlY2lmaWNXZWVrRGF5LmRheX0ke3RoaXMuc3RhdGUubW9udGhseS5zcGVjaWZpY1dlZWtEYXkubW9udGhXZWVrfWA7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5yZW1vdmVTZWNvbmRzKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5jcm9uID0gYCR7dGhpcy5zdGF0ZS5tb250aGx5LnNwZWNpZmljV2Vla0RheS5zZWNvbmRzfSAke3RoaXMuY3Jvbn1gO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5yZW1vdmVZZWFycykge1xyXG4gICAgICAgICAgICAgIHRoaXMuY3JvbiA9IGAke3RoaXMuY3Jvbn0gKmA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY3JvbiBtb250aGx5IHN1YnRhYiBzZWxlY3Rpb24nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ3llYXJseSc6XHJcbiAgICAgICAgc3dpdGNoICh0aGlzLnN0YXRlLnllYXJseS5zdWJUYWIpIHtcclxuICAgICAgICAgIGNhc2UgJ3NwZWNpZmljTW9udGhEYXknOlxyXG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXHJcbiAgICAgICAgICAgIGNvbnN0IGRheSA9IHRoaXMuc3RhdGUueWVhcmx5LnJ1bk9uV2Vla2RheSA/IGAke3RoaXMuc3RhdGUueWVhcmx5LnNwZWNpZmljTW9udGhEYXkuZGF5fVdgIDogdGhpcy5zdGF0ZS55ZWFybHkuc3BlY2lmaWNNb250aERheS5kYXk7XHJcbiAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTptYXgtbGluZS1sZW5ndGhcclxuICAgICAgICAgICAgdGhpcy5jcm9uID0gYCR7dGhpcy5zdGF0ZS55ZWFybHkuc3BlY2lmaWNNb250aERheS5taW51dGVzfSAke3RoaXMuaG91clRvQ3Jvbih0aGlzLnN0YXRlLnllYXJseS5zcGVjaWZpY01vbnRoRGF5LmhvdXJzLCB0aGlzLnN0YXRlLnllYXJseS5zcGVjaWZpY01vbnRoRGF5LmhvdXJUeXBlKX0gJHtkYXl9ICR7dGhpcy5zdGF0ZS55ZWFybHkuc3BlY2lmaWNNb250aERheS5tb250aH0gP2A7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5yZW1vdmVTZWNvbmRzKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5jcm9uID0gYCR7dGhpcy5zdGF0ZS55ZWFybHkuc3BlY2lmaWNNb250aERheS5zZWNvbmRzfSAke3RoaXMuY3Jvbn1gO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5yZW1vdmVZZWFycykge1xyXG4gICAgICAgICAgICAgIHRoaXMuY3JvbiA9IGAke3RoaXMuY3Jvbn0gKmA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICBjYXNlICdzcGVjaWZpY01vbnRoV2Vlayc6XHJcbiAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTptYXgtbGluZS1sZW5ndGhcclxuICAgICAgICAgICAgdGhpcy5jcm9uID0gYCR7dGhpcy5zdGF0ZS55ZWFybHkuc3BlY2lmaWNNb250aFdlZWsubWludXRlc30gJHt0aGlzLmhvdXJUb0Nyb24odGhpcy5zdGF0ZS55ZWFybHkuc3BlY2lmaWNNb250aFdlZWsuaG91cnMsIHRoaXMuc3RhdGUueWVhcmx5LnNwZWNpZmljTW9udGhXZWVrLmhvdXJUeXBlKX0gPyAke3RoaXMuc3RhdGUueWVhcmx5LnNwZWNpZmljTW9udGhXZWVrLm1vbnRofSAke3RoaXMuc3RhdGUueWVhcmx5LnNwZWNpZmljTW9udGhXZWVrLmRheX0ke3RoaXMuc3RhdGUueWVhcmx5LnNwZWNpZmljTW9udGhXZWVrLm1vbnRoV2Vla31gO1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMucmVtb3ZlU2Vjb25kcykge1xyXG4gICAgICAgICAgICAgIHRoaXMuY3JvbiA9IGAke3RoaXMuc3RhdGUueWVhcmx5LnNwZWNpZmljTW9udGhXZWVrLnNlY29uZHN9ICR7dGhpcy5jcm9ufWA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghdGhpcy5vcHRpb25zLnJlbW92ZVllYXJzKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5jcm9uID0gYCR7dGhpcy5jcm9ufSAqYDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjcm9uIHllYXJseSBzdWJ0YWIgc2VsZWN0aW9uJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdhZHZhbmNlZCc6XHJcbiAgICAgICAgdGhpcy5jcm9uID0gdGhpcy5zdGF0ZS5hZHZhbmNlZC5leHByZXNzaW9uO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjcm9uIGFjdGl2ZSB0YWIgc2VsZWN0aW9uJyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldEFtUG1Ib3VyKGhvdXI6IG51bWJlcikge1xyXG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucy51c2UyNEhvdXJUaW1lID8gaG91ciA6IChob3VyICsgMTEpICUgMTIgKyAxO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRIb3VyVHlwZShob3VyOiBudW1iZXIpIHtcclxuICAgIHJldHVybiB0aGlzLm9wdGlvbnMudXNlMjRIb3VyVGltZSA/IHVuZGVmaW5lZCA6IChob3VyID49IDEyID8gJ1BNJyA6ICdBTScpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBob3VyVG9Dcm9uKGhvdXI6IG51bWJlciwgaG91clR5cGU6IHN0cmluZykge1xyXG4gICAgaWYgKHRoaXMub3B0aW9ucy51c2UyNEhvdXJUaW1lKSB7XHJcbiAgICAgIHJldHVybiBob3VyO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIGhvdXJUeXBlID09PSAnQU0nID8gKGhvdXIgPT09IDEyID8gMCA6IGhvdXIpIDogKGhvdXIgPT09IDEyID8gMTIgOiBob3VyICsgMTIpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBoYW5kbGVNb2RlbENoYW5nZShjcm9uOiBzdHJpbmcpIHtcclxuICAgIGlmICh0aGlzLmlzRGlydHkpIHtcclxuICAgICAgdGhpcy5pc0RpcnR5ID0gZmFsc2U7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuaXNEaXJ0eSA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudmFsaWRhdGUoY3Jvbik7XHJcblxyXG4gICAgbGV0IGNyb25TZXZlbiA9IGNyb247XHJcbiAgICBpZiAodGhpcy5vcHRpb25zLnJlbW92ZVNlY29uZHMpIHtcclxuICAgICAgY3JvblNldmVuID0gYDAgJHtjcm9ufWA7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMub3B0aW9ucy5yZW1vdmVZZWFycykge1xyXG4gICAgICBjcm9uU2V2ZW4gPSBgJHtjcm9uU2V2ZW59ICpgO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IFtzZWNvbmRzLCBtaW51dGVzLCBob3VycywgZGF5T2ZNb250aCwgbW9udGgsIGRheU9mV2Vla10gPSBjcm9uU2V2ZW4uc3BsaXQoJyAnKTtcclxuXHJcbiAgICBpZiAoY3JvblNldmVuLm1hdGNoKC9cXGQrIDBcXC9cXGQrIFxcKiAxXFwvMSBcXCogXFw/IFxcKi8pKSB7XHJcbiAgICAgIHRoaXMuYWN0aXZlVGFiID0gJ21pbnV0ZXMnO1xyXG5cclxuICAgICAgdGhpcy5zdGF0ZS5taW51dGVzLm1pbnV0ZXMgPSBOdW1iZXIobWludXRlcy5zdWJzdHJpbmcoMikpO1xyXG4gICAgICB0aGlzLnN0YXRlLm1pbnV0ZXMuc2Vjb25kcyA9IE51bWJlcihzZWNvbmRzKTtcclxuICAgIH0gZWxzZSBpZiAoY3JvblNldmVuLm1hdGNoKC9cXGQrIFxcZCsgMFxcL1xcZCsgMVxcLzEgXFwqIFxcPyBcXCovKSkge1xyXG4gICAgICB0aGlzLmFjdGl2ZVRhYiA9ICdob3VybHknO1xyXG5cclxuICAgICAgdGhpcy5zdGF0ZS5ob3VybHkuaG91cnMgPSBOdW1iZXIoaG91cnMuc3Vic3RyaW5nKDIpKTtcclxuICAgICAgdGhpcy5zdGF0ZS5ob3VybHkubWludXRlcyA9IE51bWJlcihtaW51dGVzKTtcclxuICAgICAgdGhpcy5zdGF0ZS5ob3VybHkuc2Vjb25kcyA9IE51bWJlcihzZWNvbmRzKTtcclxuICAgIH0gZWxzZSBpZiAoY3JvblNldmVuLm1hdGNoKC9cXGQrIFxcZCsgXFxkKyAxXFwvXFxkKyBcXCogXFw/IFxcKi8pKSB7XHJcbiAgICAgIHRoaXMuYWN0aXZlVGFiID0gJ2RhaWx5JztcclxuXHJcbiAgICAgIHRoaXMuc3RhdGUuZGFpbHkuc3ViVGFiID0gJ2V2ZXJ5RGF5cyc7XHJcbiAgICAgIHRoaXMuc3RhdGUuZGFpbHkuZXZlcnlEYXlzLmRheXMgPSBOdW1iZXIoZGF5T2ZNb250aC5zdWJzdHJpbmcoMikpO1xyXG4gICAgICBjb25zdCBwYXJzZWRIb3VycyA9IE51bWJlcihob3Vycyk7XHJcbiAgICAgIHRoaXMuc3RhdGUuZGFpbHkuZXZlcnlEYXlzLmhvdXJzID0gdGhpcy5nZXRBbVBtSG91cihwYXJzZWRIb3Vycyk7XHJcbiAgICAgIHRoaXMuc3RhdGUuZGFpbHkuZXZlcnlEYXlzLmhvdXJUeXBlID0gdGhpcy5nZXRIb3VyVHlwZShwYXJzZWRIb3Vycyk7XHJcbiAgICAgIHRoaXMuc3RhdGUuZGFpbHkuZXZlcnlEYXlzLm1pbnV0ZXMgPSBOdW1iZXIobWludXRlcyk7XHJcbiAgICAgIHRoaXMuc3RhdGUuZGFpbHkuZXZlcnlEYXlzLnNlY29uZHMgPSBOdW1iZXIoc2Vjb25kcyk7XHJcbiAgICB9IGVsc2UgaWYgKGNyb25TZXZlbi5tYXRjaCgvXFxkKyBcXGQrIFxcZCsgXFw/IFxcKiBNT04tRlJJIFxcKi8pKSB7XHJcbiAgICAgIHRoaXMuYWN0aXZlVGFiID0gJ2RhaWx5JztcclxuXHJcbiAgICAgIHRoaXMuc3RhdGUuZGFpbHkuc3ViVGFiID0gJ2V2ZXJ5V2Vla0RheSc7XHJcbiAgICAgIGNvbnN0IHBhcnNlZEhvdXJzID0gTnVtYmVyKGhvdXJzKTtcclxuICAgICAgdGhpcy5zdGF0ZS5kYWlseS5ldmVyeVdlZWtEYXkuaG91cnMgPSB0aGlzLmdldEFtUG1Ib3VyKHBhcnNlZEhvdXJzKTtcclxuICAgICAgdGhpcy5zdGF0ZS5kYWlseS5ldmVyeVdlZWtEYXkuaG91clR5cGUgPSB0aGlzLmdldEhvdXJUeXBlKHBhcnNlZEhvdXJzKTtcclxuICAgICAgdGhpcy5zdGF0ZS5kYWlseS5ldmVyeVdlZWtEYXkubWludXRlcyA9IE51bWJlcihtaW51dGVzKTtcclxuICAgICAgdGhpcy5zdGF0ZS5kYWlseS5ldmVyeVdlZWtEYXkuc2Vjb25kcyA9IE51bWJlcihzZWNvbmRzKTtcclxuICAgIH0gZWxzZSBpZiAoY3JvblNldmVuLm1hdGNoKC9cXGQrIFxcZCsgXFxkKyBcXD8gXFwqIChNT058VFVFfFdFRHxUSFV8RlJJfFNBVHxTVU4pKCwoTU9OfFRVRXxXRUR8VEhVfEZSSXxTQVR8U1VOKSkqIFxcKi8pKSB7XHJcbiAgICAgIHRoaXMuYWN0aXZlVGFiID0gJ3dlZWtseSc7XHJcbiAgICAgIHRoaXMuc2VsZWN0T3B0aW9ucy5kYXlzLmZvckVhY2god2Vla0RheSA9PiB0aGlzLnN0YXRlLndlZWtseVt3ZWVrRGF5XSA9IGZhbHNlKTtcclxuICAgICAgZGF5T2ZXZWVrLnNwbGl0KCcsJykuZm9yRWFjaCh3ZWVrRGF5ID0+IHRoaXMuc3RhdGUud2Vla2x5W3dlZWtEYXldID0gdHJ1ZSk7XHJcbiAgICAgIGNvbnN0IHBhcnNlZEhvdXJzID0gTnVtYmVyKGhvdXJzKTtcclxuICAgICAgdGhpcy5zdGF0ZS53ZWVrbHkuaG91cnMgPSB0aGlzLmdldEFtUG1Ib3VyKHBhcnNlZEhvdXJzKTtcclxuICAgICAgdGhpcy5zdGF0ZS53ZWVrbHkuaG91clR5cGUgPSB0aGlzLmdldEhvdXJUeXBlKHBhcnNlZEhvdXJzKTtcclxuICAgICAgdGhpcy5zdGF0ZS53ZWVrbHkubWludXRlcyA9IE51bWJlcihtaW51dGVzKTtcclxuICAgICAgdGhpcy5zdGF0ZS53ZWVrbHkuc2Vjb25kcyA9IE51bWJlcihzZWNvbmRzKTtcclxuICAgIH0gZWxzZSBpZiAoY3JvblNldmVuLm1hdGNoKC9cXGQrIFxcZCsgXFxkKyAoXFxkK3xMfExXfDFXKSAxXFwvXFxkKyBcXD8gXFwqLykpIHtcclxuICAgICAgdGhpcy5hY3RpdmVUYWIgPSAnbW9udGhseSc7XHJcbiAgICAgIHRoaXMuc3RhdGUubW9udGhseS5zdWJUYWIgPSAnc3BlY2lmaWNEYXknO1xyXG5cclxuICAgICAgaWYgKGRheU9mTW9udGguaW5kZXhPZignVycpICE9PSAtMSkge1xyXG4gICAgICAgIHRoaXMuc3RhdGUubW9udGhseS5zcGVjaWZpY0RheS5kYXkgPSBkYXlPZk1vbnRoLmNoYXJBdCgwKTtcclxuICAgICAgICB0aGlzLnN0YXRlLm1vbnRobHkucnVuT25XZWVrZGF5ID0gdHJ1ZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnN0YXRlLm1vbnRobHkuc3BlY2lmaWNEYXkuZGF5ID0gZGF5T2ZNb250aDtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5zdGF0ZS5tb250aGx5LnNwZWNpZmljRGF5Lm1vbnRocyA9IE51bWJlcihtb250aC5zdWJzdHJpbmcoMikpO1xyXG4gICAgICBjb25zdCBwYXJzZWRIb3VycyA9IE51bWJlcihob3Vycyk7XHJcbiAgICAgIHRoaXMuc3RhdGUubW9udGhseS5zcGVjaWZpY0RheS5ob3VycyA9IHRoaXMuZ2V0QW1QbUhvdXIocGFyc2VkSG91cnMpO1xyXG4gICAgICB0aGlzLnN0YXRlLm1vbnRobHkuc3BlY2lmaWNEYXkuaG91clR5cGUgPSB0aGlzLmdldEhvdXJUeXBlKHBhcnNlZEhvdXJzKTtcclxuICAgICAgdGhpcy5zdGF0ZS5tb250aGx5LnNwZWNpZmljRGF5Lm1pbnV0ZXMgPSBOdW1iZXIobWludXRlcyk7XHJcbiAgICAgIHRoaXMuc3RhdGUubW9udGhseS5zcGVjaWZpY0RheS5zZWNvbmRzID0gTnVtYmVyKHNlY29uZHMpO1xyXG4gICAgfSBlbHNlIGlmIChjcm9uU2V2ZW4ubWF0Y2goL1xcZCsgXFxkKyBcXGQrIFxcPyBcXGQrXFwvXFxkKyAoTU9OfFRVRXxXRUR8VEhVfEZSSXxTQVR8U1VOKSgoI1sxLTVdKXxMKSBcXCovKSkge1xyXG4gICAgICBjb25zdCBkYXkgPSBkYXlPZldlZWsuc3Vic3RyKDAsIDMpO1xyXG4gICAgICBjb25zdCBtb250aFdlZWsgPSBkYXlPZldlZWsuc3Vic3RyKDMpO1xyXG4gICAgICB0aGlzLmFjdGl2ZVRhYiA9ICdtb250aGx5JztcclxuICAgICAgdGhpcy5zdGF0ZS5tb250aGx5LnN1YlRhYiA9ICdzcGVjaWZpY1dlZWtEYXknO1xyXG4gICAgICB0aGlzLnN0YXRlLm1vbnRobHkuc3BlY2lmaWNXZWVrRGF5Lm1vbnRoV2VlayA9IG1vbnRoV2VlaztcclxuICAgICAgdGhpcy5zdGF0ZS5tb250aGx5LnNwZWNpZmljV2Vla0RheS5kYXkgPSBkYXk7XHJcblxyXG4gICAgICBpZiAobW9udGguaW5kZXhPZignLycpICE9PSAtMSkge1xyXG4gICAgICAgIHRoaXMuc3RhdGUubW9udGhseS5zcGVjaWZpY1dlZWtEYXkubW9udGhzID0gTnVtYmVyKG1vbnRoLnN1YnN0cmluZygyKSk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZS5tb250aGx5LnNwZWNpZmljV2Vla0RheS5zdGFydE1vbnRoID0gTnVtYmVyKG1vbnRoLnNwbGl0KCcvJylbMF0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBwYXJzZWRIb3VycyA9IE51bWJlcihob3Vycyk7XHJcbiAgICAgIHRoaXMuc3RhdGUubW9udGhseS5zcGVjaWZpY1dlZWtEYXkuaG91cnMgPSB0aGlzLmdldEFtUG1Ib3VyKHBhcnNlZEhvdXJzKTtcclxuICAgICAgdGhpcy5zdGF0ZS5tb250aGx5LnNwZWNpZmljV2Vla0RheS5ob3VyVHlwZSA9IHRoaXMuZ2V0SG91clR5cGUocGFyc2VkSG91cnMpO1xyXG4gICAgICB0aGlzLnN0YXRlLm1vbnRobHkuc3BlY2lmaWNXZWVrRGF5Lm1pbnV0ZXMgPSBOdW1iZXIobWludXRlcyk7XHJcbiAgICAgIHRoaXMuc3RhdGUubW9udGhseS5zcGVjaWZpY1dlZWtEYXkuc2Vjb25kcyA9IE51bWJlcihzZWNvbmRzKTtcclxuICAgIH0gZWxzZSBpZiAoY3JvblNldmVuLm1hdGNoKC9cXGQrIFxcZCsgXFxkKyAoXFxkK3xMfExXfDFXKSBcXGQrIFxcPyBcXCovKSkge1xyXG4gICAgICB0aGlzLmFjdGl2ZVRhYiA9ICd5ZWFybHknO1xyXG4gICAgICB0aGlzLnN0YXRlLnllYXJseS5zdWJUYWIgPSAnc3BlY2lmaWNNb250aERheSc7XHJcbiAgICAgIHRoaXMuc3RhdGUueWVhcmx5LnNwZWNpZmljTW9udGhEYXkubW9udGggPSBOdW1iZXIobW9udGgpO1xyXG5cclxuICAgICAgaWYgKGRheU9mTW9udGguaW5kZXhPZignVycpICE9PSAtMSkge1xyXG4gICAgICAgIHRoaXMuc3RhdGUueWVhcmx5LnNwZWNpZmljTW9udGhEYXkuZGF5ID0gZGF5T2ZNb250aC5jaGFyQXQoMCk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZS55ZWFybHkucnVuT25XZWVrZGF5ID0gdHJ1ZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLnN0YXRlLnllYXJseS5zcGVjaWZpY01vbnRoRGF5LmRheSA9IGRheU9mTW9udGg7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IHBhcnNlZEhvdXJzID0gTnVtYmVyKGhvdXJzKTtcclxuICAgICAgdGhpcy5zdGF0ZS55ZWFybHkuc3BlY2lmaWNNb250aERheS5ob3VycyA9IHRoaXMuZ2V0QW1QbUhvdXIocGFyc2VkSG91cnMpO1xyXG4gICAgICB0aGlzLnN0YXRlLnllYXJseS5zcGVjaWZpY01vbnRoRGF5LmhvdXJUeXBlID0gdGhpcy5nZXRIb3VyVHlwZShwYXJzZWRIb3Vycyk7XHJcbiAgICAgIHRoaXMuc3RhdGUueWVhcmx5LnNwZWNpZmljTW9udGhEYXkubWludXRlcyA9IE51bWJlcihtaW51dGVzKTtcclxuICAgICAgdGhpcy5zdGF0ZS55ZWFybHkuc3BlY2lmaWNNb250aERheS5zZWNvbmRzID0gTnVtYmVyKHNlY29uZHMpO1xyXG4gICAgfSBlbHNlIGlmIChjcm9uU2V2ZW4ubWF0Y2goL1xcZCsgXFxkKyBcXGQrIFxcPyBcXGQrIChNT058VFVFfFdFRHxUSFV8RlJJfFNBVHxTVU4pKCgjWzEtNV0pfEwpIFxcKi8pKSB7XHJcbiAgICAgIGNvbnN0IGRheSA9IGRheU9mV2Vlay5zdWJzdHIoMCwgMyk7XHJcbiAgICAgIGNvbnN0IG1vbnRoV2VlayA9IGRheU9mV2Vlay5zdWJzdHIoMyk7XHJcbiAgICAgIHRoaXMuYWN0aXZlVGFiID0gJ3llYXJseSc7XHJcbiAgICAgIHRoaXMuc3RhdGUueWVhcmx5LnN1YlRhYiA9ICdzcGVjaWZpY01vbnRoV2Vlayc7XHJcbiAgICAgIHRoaXMuc3RhdGUueWVhcmx5LnNwZWNpZmljTW9udGhXZWVrLm1vbnRoV2VlayA9IG1vbnRoV2VlaztcclxuICAgICAgdGhpcy5zdGF0ZS55ZWFybHkuc3BlY2lmaWNNb250aFdlZWsuZGF5ID0gZGF5O1xyXG4gICAgICB0aGlzLnN0YXRlLnllYXJseS5zcGVjaWZpY01vbnRoV2Vlay5tb250aCA9IE51bWJlcihtb250aCk7XHJcbiAgICAgIGNvbnN0IHBhcnNlZEhvdXJzID0gTnVtYmVyKGhvdXJzKTtcclxuICAgICAgdGhpcy5zdGF0ZS55ZWFybHkuc3BlY2lmaWNNb250aFdlZWsuaG91cnMgPSB0aGlzLmdldEFtUG1Ib3VyKHBhcnNlZEhvdXJzKTtcclxuICAgICAgdGhpcy5zdGF0ZS55ZWFybHkuc3BlY2lmaWNNb250aFdlZWsuaG91clR5cGUgPSB0aGlzLmdldEhvdXJUeXBlKHBhcnNlZEhvdXJzKTtcclxuICAgICAgdGhpcy5zdGF0ZS55ZWFybHkuc3BlY2lmaWNNb250aFdlZWsubWludXRlcyA9IE51bWJlcihtaW51dGVzKTtcclxuICAgICAgdGhpcy5zdGF0ZS55ZWFybHkuc3BlY2lmaWNNb250aFdlZWsuc2Vjb25kcyA9IE51bWJlcihzZWNvbmRzKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuYWN0aXZlVGFiID0gJ2FkdmFuY2VkJztcclxuICAgICAgdGhpcy5zdGF0ZS5hZHZhbmNlZC5leHByZXNzaW9uID0gY3JvbjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgdmFsaWRhdGUoY3Jvbjogc3RyaW5nKTogdm9pZCB7XHJcbiAgICB0aGlzLnN0YXRlLnZhbGlkYXRpb24uaXNWYWxpZCA9IGZhbHNlO1xyXG4gICAgdGhpcy5zdGF0ZS52YWxpZGF0aW9uLmVycm9yTWVzc2FnZSA9ICcnO1xyXG5cclxuICAgIGlmICghY3Jvbikge1xyXG4gICAgICB0aGlzLnN0YXRlLnZhbGlkYXRpb24uZXJyb3JNZXNzYWdlID0gJ0Nyb24gZXhwcmVzc2lvbiBjYW5ub3QgYmUgbnVsbCc7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjcm9uUGFydHMgPSBjcm9uLnNwbGl0KCcgJyk7XHJcblxyXG4gICAgbGV0IGV4cGVjdGVkID0gNTtcclxuXHJcbiAgICBpZiAoIXRoaXMub3B0aW9ucy5yZW1vdmVTZWNvbmRzKSB7XHJcbiAgICAgIGV4cGVjdGVkKys7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMucmVtb3ZlWWVhcnMpIHtcclxuICAgICAgZXhwZWN0ZWQrKztcclxuICAgIH1cclxuXHJcbiAgICBpZiAoY3JvblBhcnRzLmxlbmd0aCAhPT0gZXhwZWN0ZWQpIHtcclxuICAgICAgdGhpcy5zdGF0ZS52YWxpZGF0aW9uLmVycm9yTWVzc2FnZSA9IGBJbnZhbGlkIGNyb24gZXhwcmVzc2lvbiwgdGhlcmUgbXVzdCBiZSAke2V4cGVjdGVkfSBzZWdtZW50c2A7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnN0YXRlLnZhbGlkYXRpb24uaXNWYWxpZCA9IHRydWU7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldERlZmF1bHRBZHZhbmNlZENyb25FeHByZXNzaW9uKCk6IHN0cmluZyB7XHJcbiAgICBpZiAodGhpcy5vcHRpb25zLnJlbW92ZVNlY29uZHMgJiYgIXRoaXMub3B0aW9ucy5yZW1vdmVZZWFycykge1xyXG4gICAgICByZXR1cm4gJzE1IDEwIEwtMiAqID8gMjAxOSc7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMucmVtb3ZlU2Vjb25kcyAmJiB0aGlzLm9wdGlvbnMucmVtb3ZlWWVhcnMpIHtcclxuICAgICAgcmV0dXJuICcwIDE1IDEwIEwtMiAqID8nO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLm9wdGlvbnMucmVtb3ZlU2Vjb25kcyAmJiB0aGlzLm9wdGlvbnMucmVtb3ZlWWVhcnMpIHtcclxuICAgICAgcmV0dXJuICcxNSAxMCBMLTIgKiA/JztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gJzAgMTUgMTAgTC0yICogPyAyMDE5JztcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0RGVmYXVsdFN0YXRlKCkge1xyXG4gICAgY29uc3QgW2RlZmF1bHRIb3VycywgZGVmYXVsdE1pbnV0ZXMsIGRlZmF1bHRTZWNvbmRzXSA9IHRoaXMub3B0aW9ucy5kZWZhdWx0VGltZS5zcGxpdCgnOicpLm1hcChOdW1iZXIpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgIG1pbnV0ZXM6IHtcclxuICAgICAgICBtaW51dGVzOiAxLFxyXG4gICAgICAgIHNlY29uZHM6IDBcclxuICAgICAgfSxcclxuICAgICAgaG91cmx5OiB7XHJcbiAgICAgICAgaG91cnM6IDEsXHJcbiAgICAgICAgbWludXRlczogMCxcclxuICAgICAgICBzZWNvbmRzOiAwXHJcbiAgICAgIH0sXHJcbiAgICAgIGRhaWx5OiB7XHJcbiAgICAgICAgc3ViVGFiOiAnZXZlcnlEYXlzJyxcclxuICAgICAgICBldmVyeURheXM6IHtcclxuICAgICAgICAgIGRheXM6IDEsXHJcbiAgICAgICAgICBob3VyczogdGhpcy5nZXRBbVBtSG91cihkZWZhdWx0SG91cnMpLFxyXG4gICAgICAgICAgbWludXRlczogZGVmYXVsdE1pbnV0ZXMsXHJcbiAgICAgICAgICBzZWNvbmRzOiBkZWZhdWx0U2Vjb25kcyxcclxuICAgICAgICAgIGhvdXJUeXBlOiB0aGlzLmdldEhvdXJUeXBlKGRlZmF1bHRIb3VycylcclxuICAgICAgICB9LFxyXG4gICAgICAgIGV2ZXJ5V2Vla0RheToge1xyXG4gICAgICAgICAgaG91cnM6IHRoaXMuZ2V0QW1QbUhvdXIoZGVmYXVsdEhvdXJzKSxcclxuICAgICAgICAgIG1pbnV0ZXM6IGRlZmF1bHRNaW51dGVzLFxyXG4gICAgICAgICAgc2Vjb25kczogZGVmYXVsdFNlY29uZHMsXHJcbiAgICAgICAgICBob3VyVHlwZTogdGhpcy5nZXRIb3VyVHlwZShkZWZhdWx0SG91cnMpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB3ZWVrbHk6IHtcclxuICAgICAgICBNT046IHRydWUsXHJcbiAgICAgICAgVFVFOiBmYWxzZSxcclxuICAgICAgICBXRUQ6IGZhbHNlLFxyXG4gICAgICAgIFRIVTogZmFsc2UsXHJcbiAgICAgICAgRlJJOiBmYWxzZSxcclxuICAgICAgICBTQVQ6IGZhbHNlLFxyXG4gICAgICAgIFNVTjogZmFsc2UsXHJcbiAgICAgICAgaG91cnM6IHRoaXMuZ2V0QW1QbUhvdXIoZGVmYXVsdEhvdXJzKSxcclxuICAgICAgICBtaW51dGVzOiBkZWZhdWx0TWludXRlcyxcclxuICAgICAgICBzZWNvbmRzOiBkZWZhdWx0U2Vjb25kcyxcclxuICAgICAgICBob3VyVHlwZTogdGhpcy5nZXRIb3VyVHlwZShkZWZhdWx0SG91cnMpXHJcbiAgICAgIH0sXHJcbiAgICAgIG1vbnRobHk6IHtcclxuICAgICAgICBzdWJUYWI6ICdzcGVjaWZpY0RheScsXHJcbiAgICAgICAgcnVuT25XZWVrZGF5OiBmYWxzZSxcclxuICAgICAgICBzcGVjaWZpY0RheToge1xyXG4gICAgICAgICAgZGF5OiAnMScsXHJcbiAgICAgICAgICBtb250aHM6IDEsXHJcbiAgICAgICAgICBob3VyczogdGhpcy5nZXRBbVBtSG91cihkZWZhdWx0SG91cnMpLFxyXG4gICAgICAgICAgbWludXRlczogZGVmYXVsdE1pbnV0ZXMsXHJcbiAgICAgICAgICBzZWNvbmRzOiBkZWZhdWx0U2Vjb25kcyxcclxuICAgICAgICAgIGhvdXJUeXBlOiB0aGlzLmdldEhvdXJUeXBlKGRlZmF1bHRIb3VycylcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNwZWNpZmljV2Vla0RheToge1xyXG4gICAgICAgICAgbW9udGhXZWVrOiAnIzEnLFxyXG4gICAgICAgICAgZGF5OiAnTU9OJyxcclxuICAgICAgICAgIHN0YXJ0TW9udGg6IDEsXHJcbiAgICAgICAgICBtb250aHM6IDEsXHJcbiAgICAgICAgICBob3VyczogdGhpcy5nZXRBbVBtSG91cihkZWZhdWx0SG91cnMpLFxyXG4gICAgICAgICAgbWludXRlczogZGVmYXVsdE1pbnV0ZXMsXHJcbiAgICAgICAgICBzZWNvbmRzOiBkZWZhdWx0U2Vjb25kcyxcclxuICAgICAgICAgIGhvdXJUeXBlOiB0aGlzLmdldEhvdXJUeXBlKGRlZmF1bHRIb3VycylcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHllYXJseToge1xyXG4gICAgICAgIHN1YlRhYjogJ3NwZWNpZmljTW9udGhEYXknLFxyXG4gICAgICAgIHJ1bk9uV2Vla2RheTogZmFsc2UsXHJcbiAgICAgICAgc3BlY2lmaWNNb250aERheToge1xyXG4gICAgICAgICAgbW9udGg6IDEsXHJcbiAgICAgICAgICBkYXk6ICcxJyxcclxuICAgICAgICAgIGhvdXJzOiB0aGlzLmdldEFtUG1Ib3VyKGRlZmF1bHRIb3VycyksXHJcbiAgICAgICAgICBtaW51dGVzOiBkZWZhdWx0TWludXRlcyxcclxuICAgICAgICAgIHNlY29uZHM6IGRlZmF1bHRTZWNvbmRzLFxyXG4gICAgICAgICAgaG91clR5cGU6IHRoaXMuZ2V0SG91clR5cGUoZGVmYXVsdEhvdXJzKVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc3BlY2lmaWNNb250aFdlZWs6IHtcclxuICAgICAgICAgIG1vbnRoV2VlazogJyMxJyxcclxuICAgICAgICAgIGRheTogJ01PTicsXHJcbiAgICAgICAgICBtb250aDogMSxcclxuICAgICAgICAgIGhvdXJzOiB0aGlzLmdldEFtUG1Ib3VyKGRlZmF1bHRIb3VycyksXHJcbiAgICAgICAgICBtaW51dGVzOiBkZWZhdWx0TWludXRlcyxcclxuICAgICAgICAgIHNlY29uZHM6IGRlZmF1bHRTZWNvbmRzLFxyXG4gICAgICAgICAgaG91clR5cGU6IHRoaXMuZ2V0SG91clR5cGUoZGVmYXVsdEhvdXJzKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgYWR2YW5jZWQ6IHtcclxuICAgICAgICBleHByZXNzaW9uOiB0aGlzLmdldERlZmF1bHRBZHZhbmNlZENyb25FeHByZXNzaW9uKClcclxuICAgICAgfSxcclxuICAgICAgdmFsaWRhdGlvbjoge1xyXG4gICAgICAgIGlzVmFsaWQ6IHRydWUsXHJcbiAgICAgICAgZXJyb3JNZXNzYWdlOiAnJ1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRPcmRpbmFsU3VmZml4KHZhbHVlOiBzdHJpbmcpIHtcclxuICAgIGlmICh2YWx1ZS5sZW5ndGggPiAxKSB7XHJcbiAgICAgIGNvbnN0IHNlY29uZFRvTGFzdERpZ2l0ID0gdmFsdWUuY2hhckF0KHZhbHVlLmxlbmd0aCAtIDIpO1xyXG4gICAgICBpZiAoc2Vjb25kVG9MYXN0RGlnaXQgPT09ICcxJykge1xyXG4gICAgICAgIHJldHVybiAndGgnO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbGFzdERpZ2l0ID0gdmFsdWUuY2hhckF0KHZhbHVlLmxlbmd0aCAtIDEpO1xyXG4gICAgc3dpdGNoIChsYXN0RGlnaXQpIHtcclxuICAgICAgY2FzZSAnMSc6XHJcbiAgICAgICAgcmV0dXJuICdzdCc7XHJcbiAgICAgIGNhc2UgJzInOlxyXG4gICAgICAgIHJldHVybiAnbmQnO1xyXG4gICAgICBjYXNlICczJzpcclxuICAgICAgICByZXR1cm4gJ3JkJztcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICByZXR1cm4gJ3RoJztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0U2VsZWN0T3B0aW9ucygpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIG1vbnRoczogVXRpbHMuZ2V0UmFuZ2UoMSwgMTIpLFxyXG4gICAgICBtb250aFdlZWtzOiBbJyMxJywgJyMyJywgJyMzJywgJyM0JywgJyM1JywgJ0wnXSxcclxuICAgICAgZGF5czogWydNT04nLCAnVFVFJywgJ1dFRCcsICdUSFUnLCAnRlJJJywgJ1NBVCcsICdTVU4nXSxcclxuICAgICAgbWludXRlczogVXRpbHMuZ2V0UmFuZ2UoMCwgNTkpLFxyXG4gICAgICBmdWxsTWludXRlczogVXRpbHMuZ2V0UmFuZ2UoMCwgNTkpLFxyXG4gICAgICBzZWNvbmRzOiBVdGlscy5nZXRSYW5nZSgwLCA1OSksXHJcbiAgICAgIGhvdXJzOiBVdGlscy5nZXRSYW5nZSgxLCAyMyksXHJcbiAgICAgIG1vbnRoRGF5czogVXRpbHMuZ2V0UmFuZ2UoMSwgMzEpLFxyXG4gICAgICBtb250aERheXNXaXRoTGFzdHM6IFsuLi5VdGlscy5nZXRSYW5nZSgxLCAzMSkubWFwKFN0cmluZyksICdMJ10sXHJcbiAgICAgIGhvdXJUeXBlczogWydBTScsICdQTSddXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG4iXX0=