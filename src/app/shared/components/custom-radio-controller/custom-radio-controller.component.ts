import { Component, EventEmitter, forwardRef, Input, OnInit, Output, Provider } from '@angular/core';
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
export class CustomRadioControllerComponent implements OnInit, ControlValueAccessor {
  @Input('radioLabelValue') radioLabelValue;
  @Input('flexRowMarPadClass') flexRowMarPadClass;
  @Input('name') name;
  formControl = new FormControl('', [Validators.required]);
  _onChange: any = () => {};
  _onTouch: any = () => {};
  @Output() valueChangedEvent = new EventEmitter();
  _defaultLabelStyleClass = '';

  @Input()
  set defaultLabelStyleClass(val: string) {
    this._defaultLabelStyleClass = val;
  }

  constructor() { }

  ngOnInit(): void {
    this.formControl.valueChanges.subscribe(val => {
      this._onChange(val);
      this.valueChangedEvent.emit(val);
    })
  }

  writeValue(val: any): void {
    val && this.formControl.setValue(val, {emitEvent: false});
  }

  registerOnChange(fn) {
    this._onChange = fn;
  }

  registerOnTouched(fn) {
    this._onTouch = fn;
  }

}
