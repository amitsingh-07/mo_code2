import { Component, EventEmitter, forwardRef, Input, Output, Provider } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';

export const DEFAULT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CustomRadioControllerComponent),
  multi: true
};

@Component({
  selector: 'app-custom-radio-controller',
  templateUrl: './custom-radio-controller.component.html',
  styleUrls: ['./custom-radio-controller.component.scss'],
  providers: [DEFAULT_VALUE_ACCESSOR]
})
export class CustomRadioControllerComponent implements ControlValueAccessor {
  @Input('radioLabelValue') radioLabelValue;
  @Input('flexRowMarPadClass') flexRowMarPadClass;
  _disabled = false;
  @Input('name') name;
  @Input('flexColumns') flexColumns = 'flex-col-6';
  formControl = new FormControl('', [Validators.required]);
  _onChange: any = () => {};
  _onTouch: any = () => {};
  @Output() valueChangedEvent = new EventEmitter();
  _defaultLabelStyleClass = '';

  @Input()
  set defaultLabelStyleClass(val: string) {
    this._defaultLabelStyleClass = val;
  }

  @Input()
  set disabled(val: boolean) {
    this._disabled = val;
    if (val) {
      this.formControl.disable();
    } else {
        this.formControl.enable();
    }
  }

  constructor() { }

  valueChanged() {
    const fControlValue = this.formControl.value;
    this._onChange(fControlValue);
    this.valueChangedEvent.emit(fControlValue);
  }

  writeValue(val: any): void {
    this.formControl.setValue(val, {emitEvent: false});
  }

  registerOnChange(fn) {
    this._onChange = fn;
  }

  registerOnTouched(fn) {
    this._onTouch = fn;
  }

  get disabled(): boolean {
    return this._disabled;
  }

}
