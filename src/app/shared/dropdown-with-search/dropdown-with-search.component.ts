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
  form: FormGroup;
  randomNo: number;
  searchControlName: string;
  @Input('optionList') optionList;
  @Input('controlName') controlName;
  @Input('displayKey') displayKey;
  @Input('disabled') disabled;
  @Input('placement') placement;
  @Input('placeholderText') placeholderText;
  @Output() itemSelected = new EventEmitter<boolean>();
  isDropdownOpen = false;

  constructor(private parent: FormGroupDirective) {
  }

  ngOnInit() {
    this.form = this.parent.form;
    this.randomNo = this.getRandomNo();
    this.searchControlName = 'searchQuery' + this.randomNo;
    this.form.addControl(this.searchControlName, new FormControl(''));
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
