import { Component, EventEmitter, OnInit, Output, ViewEncapsulation, Input } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { filter } from 'rxjs/operators';
import { FormControl, Validators } from '@angular/forms';
import { RegexConstants } from '../../utils/api.regex.constants';

@Component({
  selector: 'app-edit-mobile-number',
  templateUrl: './edit-mobile-number.component.html',
  styleUrls: ['./edit-mobile-number.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditMobileNumberComponent implements OnInit {

  @Output() updateMobileNumber: EventEmitter<any> = new EventEmitter();
  @Input() existingMobile: string;
  duplicateMobileNo = false;

  mobileNo = new FormControl('',
    [Validators.required, Validators.pattern(RegexConstants.MobileNumber)]);

  constructor(public activeModal: NgbActiveModal, private router: Router) { }

  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(({ urlAfterRedirects }: NavigationEnd) => {
        // dismiss all bootstrap modal dialog
        this.activeModal.dismiss();
      });
  }

  onMobileNoInputChange() {
    if (this.existingMobile === this.mobileNo.value.toString()) {
      this.duplicateMobileNo = true;
    } else {
      this.duplicateMobileNo = false;
    }
  }

  updateMobileNo() {
    this.updateMobileNumber.emit(this.mobileNo.value.toString());
  }
}
