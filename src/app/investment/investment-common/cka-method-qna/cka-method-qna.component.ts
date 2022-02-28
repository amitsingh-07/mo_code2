import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LoaderService } from '../../../shared/components/loader/loader.service';
import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { INVESTMENT_COMMON_CONSTANTS } from '../investment-common.constants';
import { InvestmentCommonService } from '../investment-common.service';
import { INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS } from '../../investment-engagement-journey/investment-engagement-journey-routes.constants';
import { Util } from '../../../shared/utils/util';
import { SIGN_UP_ROUTE_PATHS } from '../../../sign-up/sign-up.routes.constants';
import { RegexConstants } from '../../../shared/utils/api.regex.constants';

@Component({
  selector: 'app-cka-method-qna',
  templateUrl: './cka-method-qna.component.html',
  styleUrls: ['./cka-method-qna.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CkaMethodQnaComponent implements OnInit {

  ckaMethodName: any;
  pageTitle: string;
  methodMetaData: any;
  methodForm: FormGroup;
  institutionList: any;
  dropdownList1: any;
  dropdownList2: any;
  constructor(
    private route: ActivatedRoute,
    public headerService: HeaderService,
    public navbarService: NavbarService,
    public footerService: FooterService,
    public readonly translate: TranslateService,
    private router: Router,
    private formBuilder: FormBuilder,
    private investmentAccountService: InvestmentAccountService,
    private loaderService: LoaderService,
    private investmentCommonService: InvestmentCommonService
  ) {
    if (!Util.isEmptyOrNull(investmentCommonService.getCKAStatus()) && investmentCommonService.getCKAStatus() === INVESTMENT_COMMON_CONSTANTS.CKA.CKA_PASSED_STATUS) {
      router.navigate([SIGN_UP_ROUTE_PATHS.EDIT_PROFILE]);
    }
    this.buildMethodForm();
    this.translate.use('en');
    this.translate.get('COMMON').subscribe(() => {
      this.pageTitle = this.translate.instant('CKA.QNA.PAGE_TITLE');
      this.setPageTitle(this.pageTitle);
      this.route.paramMap.subscribe((params: any) => {
        if (params) {
          this.ckaMethodName = params.get('methodname');
          this.checkMethodName(this.ckaMethodName);
          this.methodForm.addControl('method', new FormControl(this.ckaMethodName));
        }
      });
    });
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  buildMethodForm() {
    this.methodForm = this.formBuilder.group({
      question1: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    this.footerService.setFooterVisibility(false);
  }

  loadMethodBasedText(methodName) {
    this.methodMetaData = {
      title: this.translate.instant('CKA.QNA.' + methodName + '.TITLE'),
      desc: this.translate.instant('CKA.QNA.' + methodName + '.DESC'),
      pageDesc: this.translate.instant('CKA.QNA.' + methodName + '.PAGE_DESC'),
      subTitle1: this.translate.instant('CKA.QNA.' + methodName + '.SUB_TITLE_1'),
      subTitle2: this.translate.instant('CKA.QNA.' + methodName + '.SUB_TITLE_2'),
      placeholder: this.translate.instant('CKA.QNA.' + methodName + '.PLACEHOLDER'),
      dropdown1placeholder: this.translate.instant('CKA.QNA.' + methodName + '.DROPDOWN1_PLACEHOLDER'),
      dropdown2placeholder: this.ckaMethodName !== INVESTMENT_COMMON_CONSTANTS.CKA.METHODS[2] ? this.translate.instant('CKA.QNA.' + methodName + '.DROPDOWN2_PLACEHOLDER') : null
    }
  }

  checkMethodName(method) {
    if (method === INVESTMENT_COMMON_CONSTANTS.CKA.METHODS[0]) {
      const group = `${INVESTMENT_COMMON_CONSTANTS.CKA.DROPDOWN_GROUPS.EDUCATIONAL.QUALIFICATION},${INVESTMENT_COMMON_CONSTANTS.CKA.DROPDOWN_GROUPS.EDUCATIONAL.INSTITUE}`
      this.loadMethodBasedText('EDUCATIONAL');
      this.getOptionList(group, method);
    } else if (method === INVESTMENT_COMMON_CONSTANTS.CKA.METHODS[1]) {
      const group = `${INVESTMENT_COMMON_CONSTANTS.CKA.DROPDOWN_GROUPS.PROFESSIONAL.QUALIFICATION},${INVESTMENT_COMMON_CONSTANTS.CKA.DROPDOWN_GROUPS.PROFESSIONAL.INSTITUTE}`
      this.loadMethodBasedText('PROFESSIONAL');
      this.getOptionList(group, method);
    } else if (method === INVESTMENT_COMMON_CONSTANTS.CKA.METHODS[3]) {
      const group = `${INVESTMENT_COMMON_CONSTANTS.CKA.DROPDOWN_GROUPS.WORK_EXPERIENCE.WORK_EXPERIENCE},${INVESTMENT_COMMON_CONSTANTS.CKA.DROPDOWN_GROUPS.WORK_EXPERIENCE.EMPLOYER}`
      this.loadMethodBasedText('WORK_EXPERIENCE');
      this.getOptionList(group, method);
    } else if (method === INVESTMENT_COMMON_CONSTANTS.CKA.METHODS[2]) {
      const group = INVESTMENT_COMMON_CONSTANTS.CKA.DROPDOWN_GROUPS.INV_EPERIENCE.UNLISTED
      this.loadMethodBasedText('INVESTMENT_EXPERIENCE');
      this.getOptionList(group, method);
    }
  }

  getOptionList(groupName, method) {
    this.showLoader();
    this.investmentAccountService.getArrayOfDropdownList(groupName).subscribe((result: any) => {
      this.loaderService.hideLoaderForced();
      if (result.objectList) {
        this.institutionList = result.objectList?.jointAccountMinorForeignerRelationship;
        if (method === INVESTMENT_COMMON_CONSTANTS.CKA.METHODS[0]) {
          this.dropdownList1 = Util.getUniqueList(result.objectList.ckaEducationQualification, 'name');
          this.dropdownList2 = Util.getUniqueList(result.objectList.ckaEducationInstitute, 'name');
        } else if (method === INVESTMENT_COMMON_CONSTANTS.CKA.METHODS[1]) {
          this.dropdownList1 = Util.getUniqueList(result.objectList.ckaFinancialQualification, 'name');
          this.dropdownList2 = Util.getUniqueList(result.objectList.ckaFinancialEducation, 'name');
        } else if (method === INVESTMENT_COMMON_CONSTANTS.CKA.METHODS[3]) {
          this.dropdownList1 = Util.getUniqueList(result.objectList.ckaWorkExperience, 'name');
          this.dropdownList2 = Util.getUniqueList(result.objectList.ckaWork, 'name');
        } else if (method === INVESTMENT_COMMON_CONSTANTS.CKA.METHODS[2]) {
          this.dropdownList1 = Util.getUniqueList(result.objectList.ckaInvestmentUnlisted, 'name');
        }
      }
    }, () => {
      this.loaderService.hideLoaderForced();
      this.investmentAccountService.showGenericErrorModal();
    });
  }
  selectedQuestion2(event, control) {
    this.methodForm.controls[control].setValue(event);
    this.addOrRemoveOthersTextbox(event);
  }
  
  selectedQuestion1(event, control) {
    this.methodForm.controls[control].setValue(event);
    if (this.ckaMethodName !== INVESTMENT_COMMON_CONSTANTS.CKA.METHODS[2]) {
      this.methodForm.addControl('question2', new FormControl('', Validators.required));
    } else {
      this.addOrRemoveOthersTextbox(event);
    }
  }

  addOrRemoveOthersTextbox(value) {
    if (value.name.toUpperCase() === INVESTMENT_COMMON_CONSTANTS.CKA.OTHERS) {
      this.methodForm.addControl('others', new FormControl('', [Validators.required, Validators.pattern(RegexConstants.NameWithSymbol)]));
    } else {
      this.methodForm.removeControl('others');
    }
  }

  submitQNAForm() {
    this.showLoader();
    this.investmentCommonService.saveCKAMethodQNA(this.methodForm.value).subscribe((resp: any) => {
      this.loaderService.hideLoaderForced();
      if (resp.responseMessage.responseCode >= 6000) {
        this.investmentCommonService.setCKAStatus(resp.objectList);
        this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.CKA_PASSED_SCREEN]);
      } else {
        if (resp && resp.objectList) {
          this.investmentCommonService.setCKAStatus(resp.objectList);
          this.investmentAccountService.showGenericErrorModal();
        }
      }
    }, () => {
      this.loaderService.hideLoaderForced();
      this.investmentAccountService.showGenericErrorModal();
    });
  }

  showLoader() {
    this.loaderService.showLoader({
      title: this.translate.instant('LOADER_MESSAGES.LOADING.TITLE'),
      desc: this.translate.instant('LOADER_MESSAGES.LOADING.MESSAGE'),
      autoHide: false
    });
  }
}
