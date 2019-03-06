import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { TopupAndWithDrawService } from '../topup-and-withdraw.service';
import { SignUpService } from 'src/app/sign-up/sign-up.service';

@Component({
  selector: 'app-add-bank-modal',
  templateUrl: './add-bank-modal.component.html',
  styleUrls: ['./add-bank-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddBankModalComponent implements OnInit {
  @Input() banks;
  @Input() fullName;
  @Output() saved: EventEmitter<any> = new EventEmitter();
  addBankForm: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private topupAndWithDrawService: TopupAndWithDrawService,
    private signUpService: SignUpService
  ) {}

  ngOnInit() {
    this.banks = this.signUpService.addMaxLengthInfoForAccountNo(this.banks);
    this.addBankForm = new FormGroup({
      accountHolderName: new FormControl({value: this.fullName, disabled: true}, [
        Validators.required,
        Validators.pattern(RegexConstants.SymbolAlphabets)
      ]),
      bank: new FormControl('', Validators.required),
      accountNo: new FormControl('', [
        Validators.required,
        Validators.pattern(RegexConstants.NumericOnly), 
        this.signUpService.validateAccNoMaxLength
      ])
    });
  }

  setDropDownValue(key, value) {
    this.addBankForm.controls[key].setValue(value);
    this.addBankForm.get('accountNo').updateValueAndValidity();
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
    return !control.pristine && !control.valid;
  }

  save(form) {
    if (!form.valid) {
      // INVALID FORM
      this.markAllFieldsDirty(form);
    } else {
      this.saved.emit(this.addBankForm.getRawValue());
    }
  }
}
