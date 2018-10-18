import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { HeaderService } from '../../shared/header/header.service';

import { SIGN_UP_ROUTE_PATHS } from '../../sign-up/sign-up.routes.constants';



import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import {
  ModelWithButtonComponent
} from '../../shared/modal/model-with-button/model-with-button.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../investment-account-routes.constants';
import { InvestmentAccountService } from '../investment-account-service';
@Component({
  selector: 'app-upload-documents-later',
  templateUrl: './upload-documents-later.component.html',
  styleUrls: ['./upload-documents-later.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UploadDocumentsLaterComponent implements OnInit {

  constructor(
    public navbarService: NavbarService,
    public activeModal: NgbActiveModal,
    private router: Router,
    private formBuilder: FormBuilder,
    private investmentAccountService: InvestmentAccountService,
    private modal: NgbModal,
    public authService: AuthenticationService,
    public readonly translate: TranslateService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe(() => {
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(false);
    this.navbarService.setNavbarMode(1);
  }
  goToNext()  {
    this.router.navigate([SIGN_UP_ROUTE_PATHS.DASHBOARD]);

  }
}
