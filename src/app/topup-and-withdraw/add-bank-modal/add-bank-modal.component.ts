import { Component, EventEmitter,HostListener, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { SignUpService } from 'src/app/sign-up/sign-up.service';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { TopupAndWithDrawService } from '../topup-and-withdraw.service';

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
    this.addBankForm = new FormGroup({
      accountHolderName: new FormControl(this.fullName, [
        Validators.required,
        Validators.pattern(RegexConstants.NameWithSymbol)
      ]),
      bank: new FormControl('', Validators.required),
      accountNo: new FormControl('', [
        Validators.required,
        this.signUpService.validateBankAccNo
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

  setContent(content: any, maxLength) {
    if (content !== undefined) {
      content = content.replace(/\n/g, '');
      content = content.substring(0, maxLength);
      this.addBankForm.controls.accountHolderName.setValue(content);
    }
  }

  validateContent(event: any, content: any, maxLength) {
    const selection = window.getSelection();
    if (content.length >= maxLength && selection.type !== 'Range') {
      event.preventDefault();
    }
    return (event.which !== 13);
  }

  @HostListener('input', ['$event'])
  onChange(event) {
    const id = event.target.id;
    if (id !== '') {
      const content = event.target.innerText;
      if (content.length >= 100) {
        const trimContent = content.substring(0, 100);
        this.addBankForm.controls.accountHolderName.setValue(trimContent);
      }
    }
  }
}
