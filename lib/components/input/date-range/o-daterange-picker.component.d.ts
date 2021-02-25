import { ChangeDetectorRef, ElementRef, EventEmitter, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as _moment from 'moment';
export declare enum SideEnum {
    left = "left",
    right = "right"
}
export declare class DaterangepickerComponent implements OnInit {
    private _ref;
    private _old;
    chosenLabel: string;
    calendarVariables: {
        left: any;
        right: any;
    };
    timepickerVariables: {
        left: any;
        right: any;
    };
    daterangepicker: {
        start: FormControl;
        end: FormControl;
    };
    applyBtn: {
        disabled: boolean;
    };
    startDate: _moment.Moment;
    endDate: _moment.Moment;
    dateLimit: number;
    sideEnum: typeof SideEnum;
    minDate: _moment.Moment;
    maxDate: _moment.Moment;
    autoApply: boolean;
    singleDatePicker: boolean;
    showDropdowns: boolean;
    showWeekNumbers: boolean;
    showISOWeekNumbers: boolean;
    linkedCalendars: boolean;
    autoUpdateInput: boolean;
    alwaysShowCalendars: boolean;
    maxSpan: boolean;
    timePicker: boolean;
    timePicker24Hour: boolean;
    timePickerIncrement: number;
    timePickerSeconds: boolean;
    showClearButton: boolean;
    firstMonthDayClass: string;
    lastMonthDayClass: string;
    emptyWeekRowClass: string;
    firstDayOfNextMonthClass: string;
    lastDayOfPreviousMonthClass: string;
    locale: any;
    _ranges: any;
    ranges: any;
    showCustomRangeLabel: boolean;
    showCancel: boolean;
    keepCalendarOpeningWithRange: boolean;
    showRangeLabelOnInput: boolean;
    chosenRange: string;
    rangesArray: Array<any>;
    isShown: boolean;
    inline: boolean;
    leftCalendar: any;
    rightCalendar: any;
    showCalInRanges: boolean;
    options: any;
    drops: string;
    opens: string;
    choosedDate: EventEmitter<object>;
    rangeClicked: EventEmitter<object>;
    datesUpdated: EventEmitter<object>;
    pickerContainer: ElementRef;
    constructor(_ref: ChangeDetectorRef);
    ngOnInit(): void;
    renderRanges(): void;
    renderTimePicker(side: SideEnum): void;
    renderCalendar(side: SideEnum): void;
    setStartDate(startDate: any): void;
    setEndDate(endDate: any): void;
    isInvalidDate(date: any): boolean;
    isCustomDate(date: any): boolean;
    updateView(): void;
    updateMonthsInView(): void;
    updateCalendars(): void;
    updateElement(): void;
    remove(): void;
    calculateChosenLabel(): void;
    clickApply(e?: any): void;
    clickCancel(e: any): void;
    monthChanged(monthEvent: any, side: SideEnum): void;
    yearChanged(yearEvent: any, side: SideEnum): void;
    timeChanged(timeEvent: any, side: SideEnum): void;
    monthOrYearChanged(month: number, year: number, side: SideEnum): void;
    clickPrev(side: SideEnum): void;
    clickNext(side: SideEnum): void;
    clickDate(e: any, side: SideEnum, row: number, col: number): void;
    clickRange(e: any, label: any): void;
    show(e?: any): void;
    hide(e?: any): void;
    handleInternalClick(e: any): void;
    updateLocale(locale: any): void;
    clear(): void;
    disableRange(range: any): any;
    private _getDateWithTime;
    private _buildLocale;
    private _buildCells;
    hasCurrentMonthDays(currentMonth: any, row: any): boolean;
}
