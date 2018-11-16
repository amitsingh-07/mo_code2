import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TopupAndWithDrawService } from '../topup-and-withdraw.service';

@Component({
  selector: 'app-add-bank-modal',
  templateUrl: './add-bank-modal.component.html',
  styleUrls: ['./add-bank-modal.component.scss']
})
export class AddBankModalComponent implements OnInit {

  @Input() banks;
  @Output() saved: EventEmitter<any> = new EventEmitter();
  addBankForm: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private topupAndWithDrawService: TopupAndWithDrawService
    ) {

  }

  ngOnInit() {
    this.addBankForm = new FormGroup({
      accountHolderName: new FormControl('', Validators.required),
      bank: new FormControl('', Validators.required),
      accountNo: new FormControl('', Validators.required)
    });
  }

  setDropDownValue(key, value) {
    this.addBankForm.controls[key].setValue(value);
  }

  markAllFieldsDirty(form) {
    Object.keys(form.controls).forEach((key) => {
      if (form.get(key).controls) {
        Object.keys(form.get(key).controls).forEach((nestedKey) => {
          form.get(key).controls[nestedKey].markAsDirty();
        });
      } else {
        form.get(key).markAsDirty();
      }
    });
  }

  getInlineErrorStatus(control) {
    return (!control.pristine && !control.valid);
  }

  save(form) {
    if (!form.valid) { // INVALID FORM
      this.markAllFieldsDirty(form);
    } else {
      this.saved.emit(this.addBankForm.value);
    }
  }

}
