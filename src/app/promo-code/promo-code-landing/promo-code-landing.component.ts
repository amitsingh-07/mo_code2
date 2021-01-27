import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NavbarService } from './../../shared/navbar/navbar.service';

@Component({
  selector: 'app-promo-code-landing',
  templateUrl: './promo-code-landing.component.html',
  styleUrls: ['./promo-code-landing.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PromoCodeLandingComponent implements OnInit {

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
    private router: Router) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.setNavbarServices('Investment Promo Codes');
    });
  }

  setNavbarServices(title: string) {
    this.navbarService.setPageTitle(title);
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(104);
  }

  ngOnInit() {
    this.formGrp = this.formBuilder.group({
      promoCode: ['', [Validators.required]]
    });

    this.promoArray.push({name: 'Safra Member (MOSAF20)', validity: 'DD MTH YYYY', status: 'Active'},
    {name: 'FairPrice Special (MOFP5V)', validity: 'DD MTH YYYY', status: 'Applied'},
    {name: 'NTUC Income (MOINC20)', validity: 'DD MTH YYYY', status: 'Inactive'});
  }

}
