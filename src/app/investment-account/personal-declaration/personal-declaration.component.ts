import { ERoadmapStatus } from 'src/app/shared/components/roadmap/roadmap.interface';

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { FooterService } from '../../shared/footer/footer.service';
import { HeaderService } from '../../shared/header/header.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../investment-account-routes.constants';
import { InvestmentAccountService } from '../investment-account-service';

@Component({
  selector: 'app-personal-declaration',
  templateUrl: './personal-declaration.component.html',
  styleUrls: ['./personal-declaration.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PersonalDeclarationComponent implements OnInit {
  sourceOfIncomeList: any;
  nationality: any;
  translator: any;
  pageTitle: string;
  personalDeclarationForm: FormGroup;
  personalDeclarationFormValues: any;
  constructor(
    public headerService: HeaderService,
    public navbarService: NavbarService,
    public footerService: FooterService,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private router: Router,
    private investmentAccountService: InvestmentAccountService,
    private modal: NgbModal,
    public readonly translate: TranslateService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe(() => {
      this.pageTitle = this.translate.instant('PERSONAL_DECLARATION.TITLE');
      this.translator = this.translate.instant('PERSONAL_DECLARATION');
      this.setPageTitle(this.pageTitle);
    });
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }
  selectSource(sourceObj) {
    this.personalDeclarationForm.controls['sourceOfIncome'].setValue(sourceObj);
  }
  getSourceList() {
    this.investmentAccountService.getAllDropDownList().subscribe((data) => {
      this.sourceOfIncomeList = data.objectList.investmentSource;
    },
    (err) => {
      this.investmentAccountService.showGenericErrorModal();
    });
  }
  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    this.footerService.setFooterVisibility(false);

    this.getSourceList();
    this.personalDeclarationFormValues = this.investmentAccountService.getPersonalDeclaration();
    this.personalDeclarationForm = new FormGroup({
      radioEmploye: new FormControl(this.personalDeclarationFormValues.ExistingEmploye),
      radioBeneficial: new FormControl(this.personalDeclarationFormValues.beneficial),
      radioPEP: new FormControl(this.personalDeclarationFormValues.pep),
      sourceOfIncome: new FormControl(
        this.personalDeclarationFormValues.sourceOfIncome,
        Validators.required
      )
    });
    this.investmentAccountService.loadInvestmentAccountRoadmap();
  }
  showHelpModalPep() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = this.translator.PEP;
    // tslint:disable-next-line:max-line-length
    ref.componentInstance.errorDescription = this.translator.PEP_DESC;
    return false;
  }
  // tslint:disable-next-line:no-identical-functions
  showHelpModalBeneficial() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = this.translator.BENEFICIAL;
    // tslint:disable-next-line:max-line-length
    ref.componentInstance.errorDescription = this.translator.BENEFICIAL_DESC;
    return false;
  }
  goToNext(form) {
    if (!form.valid) {
      this.markAllFieldsDirty(form);
      const error = this.investmentAccountService.getFormErrorList(form);
      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorTitle = error.title;
      ref.componentInstance.errorMessageList = error.errorMessages;
      return false;
    } else if (this.investmentAccountService.setPersonalDeclarationData(form.getRawValue())) {
      this.saveInvestmentAccount();
    }
  }

  saveInvestmentAccount() {
    this.investmentAccountService.saveInvestmentAccount().subscribe(
      (data) => {
        if (this.investmentAccountService.getMyInfoStatus()) {
          if (this.personalDeclarationForm.controls.radioBeneficial.value) {
            this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.UPLOAD_DOCUMENTS_BO]);
          } else {
            this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.ACKNOWLEDGEMENT]);
          }
        } else {
          this.router.navigate([INVESTMENT_ACCOUNT_ROUTE_PATHS.UPLOAD_DOCUMENTS]);
        }
      },
      (err) => {
        this.investmentAccountService.showGenericErrorModal();
      }
    );
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
  disableButton() {
    // tslint:disable-next-line:max-line-length
    if (
      this.personalDeclarationForm.controls.radioEmploye.value == null ||
      this.personalDeclarationForm.controls.radioBeneficial.value == null ||
      this.personalDeclarationForm.controls.radioPEP.value == null
    ) {
      return true;
    }
  }

  changeBoOption(value) {
  }
}
