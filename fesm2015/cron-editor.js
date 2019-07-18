import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, NgModule } from '@angular/core';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const Days = {
    'SUN': 'Sunday',
    'MON': 'Monday',
    'TUE': 'Tuesday',
    'WED': 'Wednesday',
    'THU': 'Thursday',
    'FRI': 'Friday',
    'SAT': 'Saturday'
};
/** @type {?} */
const MonthWeeks = {
    '#1': 'First',
    '#2': 'Second',
    '#3': 'Third',
    '#4': 'Fourth',
    '#5': 'Fifth',
    'L': 'Last'
};
/** @enum {number} */
const Months = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
};
Months[Months.January] = 'January';
Months[Months.February] = 'February';
Months[Months.March] = 'March';
Months[Months.April] = 'April';
Months[Months.May] = 'May';
Months[Months.June] = 'June';
Months[Months.July] = 'July';
Months[Months.August] = 'August';
Months[Months.September] = 'September';
Months[Months.October] = 'October';
Months[Months.November] = 'November';
Months[Months.December] = 'December';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
// @dynamic
class Utils {
    /**
     * This returns a range of numbers. Starts from 0 if 'startFrom' is not set
     * @param {?} startFrom
     * @param {?} until
     * @return {?}
     */
    static getRange(startFrom, until) {
        return Array.from({ length: (until + 1 - startFrom) }, (/**
         * @param {?} _
         * @param {?} k
         * @return {?}
         */
        (_, k) => k + startFrom));
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class CronEditorComponent {
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class TimePickerComponent {
    constructor() {
        this.change = new EventEmitter();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.hours = this.use24HourTime ? Utils.getRange(0, 23) : Utils.getRange(0, 12);
        this.minutes = Utils.getRange(0, 59);
        this.seconds = Utils.getRange(0, 59);
        this.hourTypes = ['AM', 'PM'];
    }
}
TimePickerComponent.decorators = [
    { type: Component, args: [{
                selector: 'cron-time-picker',
                template: "<!-- hour -->\r\n<select class=\"timeFormControl\" (change)=\"change.emit()\" [(ngModel)]=\"time.hours\" [disabled]=\"disabled\" [ngClass]=\"selectClass\">\r\n  <option *ngFor=\"let hour of hours\" [ngValue]=\"hour\">{{hour}}</option>\r\n</select>\r\n\r\n<!-- minute -->\r\n<select class=\"timeFormControl\" (change)=\"change.emit()\" [(ngModel)]=\"time.minutes\" [disabled]=\"disabled\" [ngClass]=\"selectClass\">\r\n  <option *ngFor=\"let minute of minutes\" [ngValue]=\"minute\">{{minute}}</option>\r\n</select>\r\n\r\n<!-- second -->\r\n<select class=\"timeFormControl\" (change)=\"change.emit()\" [(ngModel)]=\"time.seconds\" [disabled]=\"disabled\" *ngIf=\"!hideSeconds\"\r\n  [ngClass]=\"selectClass\">\r\n  <option *ngFor=\"let second of seconds\" [ngValue]=\"second\">{{second}}</option>\r\n</select>\r\n\r\n<!-- am/pm -->\r\n<select class=\"timeFormControl\" (change)=\"change.emit()\" [(ngModel)]=\"time.hourTypes\" [disabled]=\"disabled\" *ngIf=\"!use24HourTime\"\r\n  [ngClass]=\"selectClass\">\r\n  <option *ngFor=\"let hourType of hourTypes\" [ngValue]=\"hourType\">{{hourType}}</option>\r\n</select>",
                styles: [".timeFormControl{width:70px;display:inline}"]
            }] }
];
TimePickerComponent.propDecorators = {
    change: [{ type: Output }],
    disabled: [{ type: Input }],
    time: [{ type: Input }],
    selectClass: [{ type: Input }],
    use24HourTime: [{ type: Input }],
    hideSeconds: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class CronEditorModule {
}
CronEditorModule.decorators = [
    { type: NgModule, args: [{
                declarations: [CronEditorComponent, TimePickerComponent],
                imports: [CommonModule, FormsModule],
                exports: [CronEditorComponent]
            },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { CronEditorComponent, CronEditorModule, TimePickerComponent as ɵa };

//# sourceMappingURL=cron-editor.js.map