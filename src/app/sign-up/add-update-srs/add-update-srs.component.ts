

import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import 'rxjs/add/observable/forkJoin';
import { Observable } from 'rxjs/Observable';

import { InvestmentAccountService } from '../../investment/investment-account/investment-account-service';
import { InvestmentEngagementJourneyService } from '../../investment/investment-engagement-journey/investment-engagement-journey.service';
import { ManageInvestmentsService } from '../../investment/manage-investments/manage-investments.service';
import { LoaderService } from '../../shared/components/loader/loader.service';
import { FooterService } from '../../shared/footer/footer.service';
import { HeaderService } from '../../shared/header/header.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import {
  IfastErrorModalComponent
} from '../../shared/modal/ifast-error-modal/ifast-error-modal.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { SIGN_UP_CONFIG } from '../sign-up.constant';
import { SIGN_UP_ROUTE_PATHS } from '../sign-up.routes.constants';
import { SignUpService } from '../sign-up.service';

import { InvestmentCommonService } from 'src/app/investment/investment-common/investment-common.service';
import { ModelWithButtonComponent } from '../../shared/modal/model-with-button/model-with-button.component';
import { SrsSuccessModalComponent } from './srs-success-modal/srs-success-modal.component';

@Component({
  selector: 'app-add-update-srs',
  templateUrl: './add-update-srs.component.html',
  styleUrls: ['./add-update-srs.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddUpdateSrsComponent implements OnInit {
  pageTitle: string;
  addUpdateSrsFrom: FormGroup;
  formValues;
  investmentAccountFormValues;
  fundingMethods: any;
  srsAgentBankList;
  characterLength;
  srsBank;
  showMaxLength;
  fundingSubText;
  selectedFundingMethod;
  isSrsAccountAvailable = false;
  srsAccountDetails;
  queryParams;
  buttonTitle;
  srsDetails;
  srsDetail;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private footerService: FooterService,
    private route: ActivatedRoute,
    public headerService: HeaderService,
    public navbarService: NavbarService,
    private signUpService: SignUpService,
    private modal: NgbModal,
    public investmentAccountService: InvestmentAccountService,
    public manageInvestmentsService: ManageInvestmentsService,
    public readonly translate: TranslateService,
    public investmentEngagementJourneyService: InvestmentEngagementJourneyService,
    private investmentCommonService: InvestmentCommonService,
    private loaderService: LoaderService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe(() => {
    });
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    this.footerService.setFooterVisibility(false);
    this.queryParams = this.route.snapshot.queryParams;
    this.srsBank = this.queryParams.srsBank;
    this.translate.get('COMMON').subscribe(() => {
      if (this.srsBank === 'true') {
        this.pageTitle = this.translate.instant('Add SRS Account');
        this.buttonTitle = this.translate.instant('Add Now');
      } else {
        this.pageTitle = this.translate.instant('Update SRS Account');
        this.buttonTitle = this.translate.instant('Apply Changes');
      }
      this.setPageTitle(this.pageTitle);
    });
    this.footerService.setFooterVisibility(false);
    this.srsDetail = this.signUpService.getSrsDetails();
    this.getSrsBankOperator();
    this.buildForm();
  }

  buildForm() {
    this.addUpdateSrsFrom = this.formBuilder.group({
      srsAccountHolderName: [this.srsDetail.srsAccountHolderName, [Validators.required, Validators.pattern(RegexConstants.NameWithSymbol)]],
      srsOperator: [this.srsDetail && this.srsDetail.srsOperatorBank, [Validators.required]],
      srsAccount: [this.srsDetail && this.srsDetail.srsAccountNumber, [Validators.required]]
    });
  }

  getSrsBankOperator() {
    this.investmentAccountService.getAllDropDownList().subscribe((data) => {
      this.srsAgentBankList = data.objectList.srsAgentBank;
    },
      (err) => {
        this.investmentAccountService.showGenericErrorModal();
      });
  }

  selectSrsOperator(key, value) {
    this.addUpdateSrsFrom.controls[key].setValue(value);
  }

  maskConfig() {
    const config = {
      mask: RegexConstants.operatorMask.DBS
    };
    if (this.addUpdateSrsFrom.get('srsOperator').value) {
      const operator = this.addUpdateSrsFrom.get('srsOperator').value.name;
      if (operator) {
        switch (operator.toUpperCase()) {
          case 'DBS':
            config.mask = RegexConstants.operatorMask.DBS;
            break;
          case 'OCBC':
            config.mask = RegexConstants.operatorMask.OCBC;
            break;
          case 'UOB':
            config.mask = RegexConstants.operatorMask.UOB;
            break;
        }
      }
    }
    return config;
  }

  getAccNoLength() {
    if (this.addUpdateSrsFrom.get('srsOperator').value) {
      const accNo = this.addUpdateSrsFrom.get('srsAccount').value;
      if (accNo) {
        return accNo.match(/\d/g).join('').length;
      } else {
        return 0;
      }
    }
  }

  getAccNoMaxLength(value) {
    let accNoMaxLength;
    switch (this.addUpdateSrsFrom.get('srsOperator').value.name) {
      case 'DBS':
        accNoMaxLength = 14;
        break;
      case 'OCBC':
        accNoMaxLength = 12;
        break;
      case 'UOB':
        accNoMaxLength = 9;
        break;
    }
    return accNoMaxLength;
  }

  getInlineErrorStatus(control) {
    return !control.pristine && !control.valid;
  }

  addorRemoveAccNoValidator() {
    if (this.addUpdateSrsFrom.get('srsFundingDetails')) {
      const accNoControl = this.addUpdateSrsFrom.get('srsAccount');
      const selectedBank = this.addUpdateSrsFrom.get('srsOperator').value;
      if (selectedBank) {
        switch (selectedBank.name.toUpperCase()) {
          case 'DBS':
            accNoControl.setValidators(
              [Validators.required, Validators.pattern(RegexConstants.operatorMaskForValidation.DBS)]);
            break;
          case 'OCBC':
            accNoControl.setValidators(
              [Validators.required, Validators.pattern(RegexConstants.operatorMaskForValidation.OCBC)]);
            break;
          case 'UOB':
            accNoControl.setValidators(
              [Validators.required, Validators.pattern(RegexConstants.operatorMaskForValidation.UOB)]);
            break;
        }
      } else {
        accNoControl.setValidators([Validators.required]);
      }
      this.addUpdateSrsFrom.updateValueAndValidity();
    }
  }



  // #ALLOWING 100 CHARACTERS ACCOUNT HOLDER NAME
  setsrsAccountHolderName(srsAccountHolderName: any) {
    if (srsAccountHolderName !== undefined) {
      srsAccountHolderName = srsAccountHolderName.replace(/\n/g, '');
      this.addUpdateSrsFrom.controls.srsAccountHolderName.setValue(srsAccountHolderName);
      return srsAccountHolderName;
    }
  }

  onKeyPressEvent(event: any, content: any) {
    this.investmentAccountService.onKeyPressEvent(event, content);
  }

  @HostListener('input', ['$event'])
  onChange(event) {
    const id = event.target.id;
    if (id !== '') {
      const content = event.target.innerText;
      if (content.length >= 100) {
        const contentList = content.substring(0, 100);
        this.addUpdateSrsFrom.controls.srsAccountHolderName.setValue(contentList);
        const el = document.querySelector('#' + id);
        this.investmentAccountService.setCaratTo(el, 100, contentList);
      }
    }
  }

  updateSrsSaveCall(form: any) {
    if (!form.valid) {
      return false;
    } else {
      const formValue = form.getRawValue();
      const reqParams = {};
      const opertorId = this.getOperatorIdByName(formValue.srsOperator.name, this.srsAgentBankList);
      reqParams['srsDetails'] = {
        accountNumber: formValue.srsAccount ? formValue.srsAccount.replace(/[-]/g, '') : null,
        operatorId: opertorId ? opertorId : null
      };
      this.manageInvestmentsService.setSrsAccountDetails(null);
      this.showSRSSuccessModel();
      // this.investmentCommonService.saveSrsAccountDetails(reqParams, this.srsDetail.customerId).subscribe((data) => {
      //   this.manageInvestmentsService.setSrsAccountDetails(null);
      //   this.showSRSSuccessModel();
      // },
      //   (err) => {
      //     this.investmentAccountService.showGenericErrorModal();
      //   });
    }
  }

  showSRSSuccessModel() {
    const ref = this.modal.open(SrsSuccessModalComponent, { centered: true });
    ref.componentInstance.errorTitle = this.translate.instant('YOUR_PORTFOLIO.MODAL.RBL_MODAL.TITLE');
    ref.componentInstance.errorMessage = this.translate.instant('YOUR_PORTFOLIO.MODAL.RBL_MODAL.Message');
    ref.componentInstance.selected.subscribe(() => {
      console.log('Nav Back');
      this.router.navigate([SIGN_UP_ROUTE_PATHS.EDIT_PROFILE]);
    });
    ref.componentInstance.topUp.subscribe(() => {
      console.log('Top UP');
      this.router.navigate([SIGN_UP_ROUTE_PATHS.TOPUP]);
    });
  }

  getOperatorIdByName(operatorName, OperatorOptions) {
    if (operatorName && OperatorOptions) {
      const OperatorBank = OperatorOptions.filter(
        (prop) => prop.name === operatorName
      );
      console.log(OperatorBank);
      return OperatorBank[0].id;
    } else {
      return '';
    }
  }

  showCustomErrorModal(title, desc) {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = title;
    ref.componentInstance.errorMessage = desc;
  }

  showIfastErrorModal(errorList) {
    const errorTitle = this.translate.instant(
      'IFAST_ERROR_TITLE'
    );
    const ref = this.modal.open(IfastErrorModalComponent, { centered: true });
    ref.componentInstance.errorTitle = errorTitle;
    ref.componentInstance.errorList = errorList;
  }

}
