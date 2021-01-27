import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NavbarService } from './../../shared/navbar/navbar.service';
import { PromoDetailsComponent } from './../promo-details/promo-details.component';

@Component({
  selector: 'app-promo-code-list',
  templateUrl: './promo-code-list.component.html',
  styleUrls: ['./promo-code-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PromoCodeListComponent implements OnInit {

  formGrp: FormGroup;

  showClearBtn: boolean = false;
  showSpinner: boolean = false;
  promoCodeValidated: boolean = false;

  showError: boolean = false;

  promoArray = [];

  constructor(
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal, public translate: TranslateService,
    public navbarService: NavbarService,
    private router: Router, private modal: NgbModal) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      // this.navbarService.setPageTitle('Promo Code');
    });
  }

  ngOnInit() {
    this.formGrp = this.formBuilder.group({
      promoCode: ['', [Validators.required]]
    });

    this.promoArray.push({name: 'Safra Member (MOSAF20)', validity: 'DD MTH YYYY', status: 'Active'},
    {name: 'FairPrice Special (MOFP5V)', validity: 'DD MTH YYYY', status: 'Applied'},
    {name: 'NTUC Income (MOINC20)', validity: 'DD MTH YYYY', status: 'Inactive'});
  }

  onKeyupEvent(event, key) {
    if (event.target.value) {
      const enterEmail = event.target.value.replace(/\s/g, '');
      if (key === 'promoCode' && !this.showSpinner) {
        this.showClearBtn = true;
      } else {
        this.showClearBtn = false;
      }
    } else {
      if (key === 'promoCode') {
        this.showClearBtn = false;
      }
    }
  }

  applyPromoCode(event) {
    if (this.formGrp.controls['promoCode'].value) {
      // Show the spinner
      this.formGrp.controls['promoCode'].setErrors(null);
      this.showClearBtn = false;
      this.showSpinner = true;
      // Success/Failure scenario
      if (this.formGrp.controls['promoCode'].value === 'MOSAF20') {
        this.showSpinner = false;
        this.showClearBtn = true;
        // this.promoCodeValidated = true;
        this.showDetails();
      } else {
        setTimeout(() => {
          this.showSpinner = false;
          this.showClearBtn = true;
          this.showError = true;
          this.formGrp.controls['promoCode'].setErrors({ invalidPromoCode: true });
        }, 1200);
      }
    }
    event.stopPropagation();
    event.preventDefault();
  }

  clearPromoCode(event) {
    this.formGrp.controls['promoCode'].setValue('');
    this.showError = false;
    this.showClearBtn = false;
    event.stopPropagation();
    event.preventDefault();
  }

  showDetails() {
    const modalRef = this.modal.open(PromoDetailsComponent, { centered: true });
  }

}
