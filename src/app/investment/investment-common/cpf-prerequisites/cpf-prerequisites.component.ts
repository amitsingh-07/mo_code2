import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { RegexConstants } from '../../../shared/utils/api.regex.constants';
import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS } from '../../investment-engagement-journey/investment-engagement-journey-routes.constants';
import { INVESTMENT_COMMON_CONSTANTS } from '../investment-common.constants';
import { ModelWithButtonComponent } from '../../../shared/modal/model-with-button/model-with-button.component';
import { SignUpService } from '../../../sign-up/sign-up.service';
import { InvestmentCommonService } from '../investment-common.service';
import { INVESTMENT_COMMON_ROUTE_PATHS } from '../investment-common-routes.constants';

@Component({
  selector: 'app-cpf-prerequisites',
  templateUrl: './cpf-prerequisites.component.html',
  styleUrls: ['./cpf-prerequisites.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CpfPrerequisitesComponent implements OnInit {

  pageTitle: string;
  preRequisitesForm: FormGroup;
  ckaInfo: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public navbarService: NavbarService,
    public footerService: FooterService,
    public readonly translate: TranslateService,
    public headerService: HeaderService,
    private modal: NgbModal,
    private signUpService: SignUpService,
    private investmentCommonService: InvestmentCommonService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('CPF_PREREQUISITES.TITLE');
      this.setPageTitle(this.pageTitle);
    });
  }

  ngOnInit(): void {
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  buildPreRequisitesForm() {
    this.preRequisitesForm = new FormGroup({
      cpfOperator: new FormControl('', Validators.required),
      cpfAccountNo: new FormControl('', Validators.required)
    });
  }

  selectSrsOperator(key, value) {
    this.preRequisitesForm.controls[key].setValue(value);
    this.preRequisitesForm.controls['cpfAccountNo'].setValue(null);
    this.addorRemoveAccNoValidator();
  }

  addorRemoveAccNoValidator() {
    const accNoControl = this.preRequisitesForm.get('cpfAccountNo');
    const selectedBank = this.preRequisitesForm.get('cpfOperator').value;
    if (selectedBank) {
      switch (selectedBank.name.toUpperCase()) {
        case INVESTMENT_COMMON_CONSTANTS.CPF_BANK_KEYS.DBS:
          accNoControl.setValidators(
            [Validators.required, Validators.pattern(RegexConstants.cpfOperatorMaskForValidation.DBS)]);
          break;
        case INVESTMENT_COMMON_CONSTANTS.CPF_BANK_KEYS.OCBC:
          accNoControl.setValidators(
            [Validators.required, Validators.pattern(RegexConstants.cpfOperatorMaskForValidation.OCBC)]);
          break;
        case INVESTMENT_COMMON_CONSTANTS.CPF_BANK_KEYS.UOB:
          accNoControl.setValidators(
            [Validators.required, Validators.pattern(RegexConstants.cpfOperatorMaskForValidation.UOB)]);
          break;
      }
      this.preRequisitesForm.updateValueAndValidity();
    }
  }

  goToNext() {
    this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.GET_STARTED_STEP1]);
  }

  startAssessment() {
    this.investmentCommonService.setCKARedirectFromLocation(INVESTMENT_COMMON_ROUTE_PATHS.CPF_PREREQUISITES);
    const ref = this.modal.open(ModelWithButtonComponent, { centered: true });
    ref.componentInstance.errorTitle = this.translate.instant(
      'OPEN_CKA.TITLE'
    );
    ref.componentInstance.errorMessage = this.translate.instant(
      'OPEN_CKA.DESC'
    );
    ref.componentInstance.primaryActionLabel = this.translate.instant(
      'OPEN_CKA.BTN-TEXT'
    );
    ref.componentInstance.primaryAction.subscribe(() => {
      this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.CKA_ASSESSMENT]);
    });
    ref.componentInstance.closeBtn = false;
  }

  getEditProfileData() {
    this.signUpService.getEditProfileInfo().subscribe((data) => {
      const responseMessage = data.responseMessage;
      if (responseMessage.responseCode === 6000) {
        if (data.objectList.ckaInformation) {
          this.ckaInfo = data.objectList.ckaInformation;
          if (this.ckaInfo && this.ckaInfo.cKAStatusMessage && this.ckaInfo.cKAStatusMessage === INVESTMENT_COMMON_CONSTANTS.CKA.CKA_PASSED_STATUS) {
            this.investmentCommonService.setCKAStatus(INVESTMENT_COMMON_CONSTANTS.CKA.CKA_PASSED_STATUS);
          }
        }
      }
    })
  };
}
