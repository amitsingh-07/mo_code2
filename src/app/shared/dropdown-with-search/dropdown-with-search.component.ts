import {
    Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation
} from '@angular/core';
import {
    ControlContainer, FormControl, FormGroup, FormGroupDirective, Validators
} from '@angular/forms';

@Component({
  selector: 'app-dropdown-with-search',
  templateUrl: './dropdown-with-search.component.html',
  styleUrls: ['./dropdown-with-search.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DropdownWithSearchComponent implements OnInit {
  randomNo: number;
  searchControlName: string;
  @Input('optionList') optionList;
  @Input('controlName') controlName;
  @Input('nestedControlName') nestedControlName;
  @Input('displayKey') displayKey;
  @Input('disabled') disabled;
  @Input('placement') placement;
  @Input('placeholderText') placeholderText;
  @Input('form') form;
  @Output() itemSelected = new EventEmitter<boolean>();
  isDropdownOpen = false;
  selectedValue;

  constructor(private parent: FormGroupDirective) {
  }

  ngOnInit() {
    this.form = this.form ? this.form : this.parent.form;
    this.randomNo = this.getRandomNo();
    this.searchControlName = 'searchQuery' + this.randomNo;
    this.form.addControl(this.searchControlName, new FormControl(''));

    if (!this.nestedControlName) {
      this.form.get(this.controlName).valueChanges.subscribe((value) => {
        if (value) {
          this.selectedValue = value[this.displayKey];
        }
      });
      this.form.get(this.controlName).updateValueAndValidity();
    } else { // Nested Control
      this.form.get(this.nestedControlName).get(this.controlName).valueChanges.subscribe((value) => {
        if (value) {
          this.selectedValue = value[this.displayKey];
        }
      });
      this.form.get(this.nestedControlName).get(this.controlName).updateValueAndValidity();
    }
  }

  emitSelected(option) {
    this.form.controls[this.searchControlName].setValue('');
    this.itemSelected.emit(option);
  }

  preventPropogation(event) {
    event.stopPropagation();
  }

  getRandomNo() {
    return Math.floor(1000 + Math.random() * 9000);
  }

  toggleDropdown(event) {
    this.isDropdownOpen = event;
  }

}
