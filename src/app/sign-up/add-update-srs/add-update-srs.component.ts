

import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import 'rxjs/add/observable/forkJoin';
import { Observable } from 'rxjs/Observable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { InvestmentAccountService } from '../../investment/investment-account/investment-account-service';
import { LoaderService } from '../../shared/components/loader/loader.service';
import { FooterService } from '../../shared/footer/footer.service';
import { HeaderService } from '../../shared/header/header.service';
import { ErrorModalComponent } from '../../shared/modal/error-modal/error-modal.component';
import {
  IfastErrorModalComponent
} from '../../shared/modal/ifast-error-modal/ifast-error-modal.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { RegexConstants } from '../../shared/utils/api.regex.constants';
import { ManageInvestmentsService } from '../../investment/manage-investments/manage-investments.service';
import { SIGN_UP_CONFIG } from '../sign-up.constant';
import { SIGN_UP_ROUTE_PATHS } from '../sign-up.routes.constants';
import { SignUpService } from '../sign-up.service';
import { InvestmentEngagementJourneyService } from '../../investment/investment-engagement-journey/investment-engagement-journey.service';

import { ModelWithButtonComponent } from '../../shared/modal/model-with-button/model-with-button.component';






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
    //this.formValues = this.signUpService.getSrsDetails();
    this.srsDetail = this.signUpService.getSrsDetails();
    this.getSrsBankOperator();
    this.buildForm();
  }

  buildForm() {
    this.addUpdateSrsFrom = this.formBuilder.group({
      srsAccountHolderName: [this.srsDetail.srsAccountHolderName, [Validators.required, Validators.pattern(RegexConstants.NameWithSymbol)]],
      srsOperator: [ this.srsDetail && this.srsDetail.srsOperatorBank, [Validators.required]],
      srsAccount: [this.srsDetail && this.srsDetail.srsAccountNumber, [Validators.required]]
    });
  }



  getSrsBankOperator() {
    this.investmentAccountService.getAllDropDownList().subscribe((data) => {
      this.srsAgentBankList = data.objectList.srsAgentBank;
      console.log(this.srsAgentBankList);
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
  setAccountHolderName(accountHolderName: any) {
    if (accountHolderName !== undefined) {
      accountHolderName = accountHolderName.replace(/\n/g, '');
      this.addUpdateSrsFrom.controls.srsAccountHolderName.setValue(accountHolderName);
      return accountHolderName;
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

  applyChanges(form: any) {
    if (!form.valid) {
      Object.keys(form.controls).forEach((key) => {
        form.get(key).markAsDirty();
      });
      const error = this.signUpService.getFormErrorList(form);
      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorTitle = error.title;
      ref.componentInstance.errorMessageList = error.errorMessages;
      return false;
    } else {
      console.log(form.value);
      this.router.navigate([SIGN_UP_ROUTE_PATHS.EDIT_PROFILE]);
    }
  }
  getOperatorIdByName(operatorId, OperatorOptions) {
    if (operatorId && OperatorOptions) {
      const OperatorBank = OperatorOptions.filter(
        (prop) => prop.id === operatorId
      );
      return OperatorBank[0];
    } else {
      return '';
    }
  }

}
