/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Output, EventEmitter, Input } from '@angular/core';
import Utils from '../Utils';
var TimePickerComponent = /** @class */ (function () {
    function TimePickerComponent() {
        this.change = new EventEmitter();
    }
    /**
     * @return {?}
     */
    TimePickerComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.hours = this.use24HourTime ? Utils.getRange(0, 23) : Utils.getRange(0, 12);
        this.minutes = Utils.getRange(0, 59);
        this.seconds = Utils.getRange(0, 59);
        this.hourTypes = ['AM', 'PM'];
    };
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
    return TimePickerComponent;
}());
export { TimePickerComponent };
if (false) {
    /** @type {?} */
    TimePickerComponent.prototype.change;
    /** @type {?} */
    TimePickerComponent.prototype.disabled;
    /** @type {?} */
    TimePickerComponent.prototype.time;
    /** @type {?} */
    TimePickerComponent.prototype.selectClass;
    /** @type {?} */
    TimePickerComponent.prototype.use24HourTime;
    /** @type {?} */
    TimePickerComponent.prototype.hideSeconds;
    /** @type {?} */
    TimePickerComponent.prototype.hours;
    /** @type {?} */
    TimePickerComponent.prototype.minutes;
    /** @type {?} */
    TimePickerComponent.prototype.seconds;
    /** @type {?} */
    TimePickerComponent.prototype.hourTypes;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZS1waWNrZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vY3Jvbi1lZGl0b3IvIiwic291cmNlcyI6WyJsaWIvdGltZS1waWNrZXIvdGltZS1waWNrZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFVLE1BQU0sRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRS9FLE9BQU8sS0FBSyxNQUFNLFVBQVUsQ0FBQztBQUU3QjtJQUFBO1FBTW1CLFdBQU0sR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO0lBa0IvQyxDQUFDOzs7O0lBTlEsc0NBQVE7OztJQUFmO1FBQ0UsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDaEYsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNyQyxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDaEMsQ0FBQzs7Z0JBdkJGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsa0JBQWtCO29CQUM1Qix1bUNBQTJDOztpQkFFNUM7Ozt5QkFFRSxNQUFNOzJCQUNOLEtBQUs7dUJBQ0wsS0FBSzs4QkFDTCxLQUFLO2dDQUNMLEtBQUs7OEJBQ0wsS0FBSzs7SUFhUiwwQkFBQztDQUFBLEFBeEJELElBd0JDO1NBbkJZLG1CQUFtQjs7O0lBQzlCLHFDQUE2Qzs7SUFDN0MsdUNBQWtDOztJQUNsQyxtQ0FBMEI7O0lBQzFCLDBDQUFvQzs7SUFDcEMsNENBQXVDOztJQUN2QywwQ0FBcUM7O0lBRXJDLG9DQUF1Qjs7SUFDdkIsc0NBQXlCOztJQUN6QixzQ0FBeUI7O0lBQ3pCLHdDQUEyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmltcG9ydCBVdGlscyBmcm9tICcuLi9VdGlscyc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2Nyb24tdGltZS1waWNrZXInLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi90aW1lLXBpY2tlci5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJy4vdGltZS1waWNrZXIuY29tcG9uZW50LmNzcyddXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBUaW1lUGlja2VyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICBAT3V0cHV0KCkgcHVibGljIGNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICBASW5wdXQoKSBwdWJsaWMgZGlzYWJsZWQ6IGJvb2xlYW47XHJcbiAgQElucHV0KCkgcHVibGljIHRpbWU6IGFueTtcclxuICBASW5wdXQoKSBwdWJsaWMgc2VsZWN0Q2xhc3M6IHN0cmluZztcclxuICBASW5wdXQoKSBwdWJsaWMgdXNlMjRIb3VyVGltZTogYm9vbGVhbjtcclxuICBASW5wdXQoKSBwdWJsaWMgaGlkZVNlY29uZHM6IGJvb2xlYW47XHJcblxyXG4gIHB1YmxpYyBob3VyczogbnVtYmVyW107XHJcbiAgcHVibGljIG1pbnV0ZXM6IG51bWJlcltdO1xyXG4gIHB1YmxpYyBzZWNvbmRzOiBudW1iZXJbXTtcclxuICBwdWJsaWMgaG91clR5cGVzOiBzdHJpbmdbXTtcclxuXHJcbiAgcHVibGljIG5nT25Jbml0KCkge1xyXG4gICAgdGhpcy5ob3VycyA9IHRoaXMudXNlMjRIb3VyVGltZSA/IFV0aWxzLmdldFJhbmdlKDAsIDIzKSA6IFV0aWxzLmdldFJhbmdlKDAsIDEyKTtcclxuICAgIHRoaXMubWludXRlcyA9IFV0aWxzLmdldFJhbmdlKDAsIDU5KTtcclxuICAgIHRoaXMuc2Vjb25kcyA9IFV0aWxzLmdldFJhbmdlKDAsIDU5KTtcclxuICAgIHRoaXMuaG91clR5cGVzID0gWydBTScsICdQTSddO1xyXG4gIH1cclxufVxyXG4iXX0=