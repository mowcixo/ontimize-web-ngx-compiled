import { FormControl, ValidationErrors } from '@angular/forms';
export declare const TWELVE_HOUR_FORMAT_PATTERN = "^(([0-9]|([01]?[0-9])):([0-9]|([0-5][0-9])) *([AaPp][Mm])*)$";
export declare const TWENTY_FOUR_HOUR_FORMAT_PATTERN = "^([0-9]|([01]?[0-9]|2[0-3])):[0-9]|([0-5][0-9])$";
export declare class OValidators {
    static twelveHourFormatValidator(control: FormControl): ValidationErrors;
    static twentyFourHourFormatValidator(control: FormControl): ValidationErrors;
    static emailValidator(control: FormControl): ValidationErrors;
    static nifValidator(control: FormControl): ValidationErrors;
}
