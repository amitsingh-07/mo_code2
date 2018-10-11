import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbDropdown, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { HeaderService } from '../../shared/header/header.service';
import { IPageComponent } from '../../shared/interfaces/page-component.interface';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import {
    ModelWithButtonComponent
} from '../../shared/modal/model-with-button/model-with-button.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../investment-account-routes.constants';
import { InvestmentAccountService } from '../investment-account-service';


@Component({
  selector: 'app-additional-declaration-step1',
  templateUrl: './additional-declaration-step1.component.html',
  styleUrls: ['./additional-declaration-step1.component.scss']
})
export class AdditionalDeclarationStep1Component implements OnInit {

  pageTitle: string;
  translator: any;
  addInfoForm: FormGroup;
  addInfoFormValues: any;
  constructor(
    public headerService: HeaderService,
    public navbarService: NavbarService,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private router: Router,
    private investmentAccountService: InvestmentAccountService,
    private modal: NgbModal,
    public readonly translate: TranslateService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe(() => {
      this.pageTitle = 'Additional Declarations';
      this.translator = this.translate.instant('PERSONAL_DECLARATION');
      //this.translator = this.translate.instant('TAX_INFO');
      this.setPageTitle(this.pageTitle);
    });
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(2);
   
    this.addInfoFormValues = this.investmentAccountService.getTaxInfo();
    this.addInfoForm = new FormGroup({
      radioPep: new FormControl (this.addInfoFormValues.haveTin, Validators.required),
      fName: new FormControl (this.addInfoFormValues.haveTin, Validators.required),
      lName: new FormControl (this.addInfoFormValues.haveTin, Validators.required),
      cName: new FormControl (this.addInfoFormValues.haveTin, Validators.required)
      });
    this.addInfoForm.controls.radioPep.setValue('yes');
  }
  showHelpModalPep() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = this.translator.PEP;
    // tslint:disable-next-line:max-line-length
    ref.componentInstance.errorDescription =  this.translator.PEP_DESC;
    return false;
  }
}
