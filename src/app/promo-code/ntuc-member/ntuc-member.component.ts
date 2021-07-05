import {
  Component, EventEmitter, HostListener, Input, OnInit, Output, ViewEncapsulation
} from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RegexConstants } from 'src/app/shared/utils/api.regex.constants';
import { SignUpService } from '../../sign-up/sign-up.service';

@Component({
  selector: 'app-ntuc-member',
  templateUrl: './ntuc-member.component.html',
  styleUrls: ['./ntuc-member.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NtucMemberComponent implements OnInit {
  ntucMumberForm: FormGroup;
  @Output() ntucMember: EventEmitter<any> = new EventEmitter();
  dobFormat: any;
  constructor(
    public activeModal: NgbActiveModal,
    private signUpService: SignUpService
  ) {
  }
  ngOnInit() {
    const userInfo = this.signUpService.getUserProfileInfo();
    debugger;
    const dob = this.constructDate(userInfo.dateOfBirth);
    this.ntucMumberForm = new FormGroup({
      mobileNumber: new FormControl(userInfo.mobileNumber),
      dob: new FormControl(dob),
      nricOrFin: new FormControl('', [Validators.required, Validators.pattern(RegexConstants.nricOrFinLastFourCharacters)])

    });
  }

  constructDate(dob) {
    this.dobFormat = dob;
    if (dob) {
      const dateArr = dob.split('-');
      if (dateArr.length === 3) {
        this.dobFormat = dateArr[2] + '/' + dateArr[1] + '/' + dateArr[0];
      }
    }
    return this.dobFormat;
  }
  goToCheckOut(form) {
    this.ntucMember.emit(form.getRawValue());
  }
}
