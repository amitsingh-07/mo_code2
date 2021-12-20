import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LoaderService } from '../../../shared/components/loader/loader.service';
import { SIGN_UP_ROUTE_PATHS } from '../../../sign-up/sign-up.routes.constants';
import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { INVESTMENT_COMMON_CONSTANTS } from '../investment-common.constants';
import { InvestmentCommonService } from '../investment-common.service';

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
    this.buildMethodForm();
    this.translate.use('en');
    this.translate.get('COMMON').subscribe(() => {
      this.pageTitle = this.translate.instant('CKA.QNA.PAGE_TITLE');
      this.setPageTitle(this.pageTitle);
      this.route.paramMap.subscribe((params: any) => {
        if (params) {
          this.ckaMethodName = params.get('methodname');
          this.checkMethodName(this.ckaMethodName);
        }
      });
    });
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  buildMethodForm() {
    this.methodForm = this.formBuilder.group({
      subject: new FormControl('', Validators.required),
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
      subTitle1: this.translate.instant('CKA.QNA.' + methodName + '.SUB_TITLE_1'),
      subTitle2: this.translate.instant('CKA.QNA.' + methodName + '.SUB_TITLE_2'),
      placeholder: this.translate.instant('CKA.QNA.' + methodName + '.PLACEHOLDER')
    }
  }

  checkMethodName(method) {
    if (method === INVESTMENT_COMMON_CONSTANTS.CKA.METHODS.EDUCATIONAL) {
      const group = `${INVESTMENT_COMMON_CONSTANTS.CKA.DROPDOWN_GROUPS.EDUCATIONAL.QUALIFICATION},${INVESTMENT_COMMON_CONSTANTS.CKA.DROPDOWN_GROUPS.EDUCATIONAL.QUALIFICATION}`
      this.loadMethodBasedText('EDUCATIONAL');
      this.getOptionList(group, method);
    } else if (method === INVESTMENT_COMMON_CONSTANTS.CKA.METHODS.PROFESSIONAL) {
      const group = `${INVESTMENT_COMMON_CONSTANTS.CKA.DROPDOWN_GROUPS.PROFESSIONAL.QUALIFICATION},${INVESTMENT_COMMON_CONSTANTS.CKA.DROPDOWN_GROUPS.PROFESSIONAL.INSTITUTE}`
      this.loadMethodBasedText('PROFESSIONAL');
      this.getOptionList(group, method);
    } else if (method === INVESTMENT_COMMON_CONSTANTS.CKA.METHODS.WORK_EXPERIENCE) {
      const group = `${INVESTMENT_COMMON_CONSTANTS.CKA.DROPDOWN_GROUPS.WORK_EXPERIENCE.WORK_EXPERIENCE},${INVESTMENT_COMMON_CONSTANTS.CKA.DROPDOWN_GROUPS.WORK_EXPERIENCE.EMPLOYER}`
      this.loadMethodBasedText('WORK_EXPERIENCE');
      this.getOptionList(group, method);
    } else if (method === INVESTMENT_COMMON_CONSTANTS.CKA.METHODS.INV_EPERIENCE) {
      const group = `${INVESTMENT_COMMON_CONSTANTS.CKA.DROPDOWN_GROUPS.INV_EPERIENCE.LISTED},${INVESTMENT_COMMON_CONSTANTS.CKA.DROPDOWN_GROUPS.INV_EPERIENCE.UNLISTED}`
      this.loadMethodBasedText('INVESTMENT_EXPERIENCE');
      this.getOptionList(group, method);
    }
  }

  getOptionList(groupName, method) {
    this.showLoader();
    this.investmentAccountService.getSpecificDropList(groupName).subscribe((result: any) => {
      this.loaderService.hideLoaderForced();
      if (result.objectList) {
        this.institutionList = result.objectList?.jointAccountMinorForeignerRelationship;
        if (method === INVESTMENT_COMMON_CONSTANTS.CKA.METHODS.EDUCATIONAL) {
          this.dropdownList1 = result.objectList.ckaEducationQualification;
          this.dropdownList2 = result.objectList.ckaEducationInstitute;
        } else if (method === INVESTMENT_COMMON_CONSTANTS.CKA.METHODS.PROFESSIONAL) {
          this.dropdownList1 = result.objectList.ckaFinancialQualification;
          this.dropdownList2 = result.objectList.ckaFinancialEducation
        } else if (method === INVESTMENT_COMMON_CONSTANTS.CKA.METHODS.WORK_EXPERIENCE) {
          this.dropdownList1 = result.objectList.ckaWorkExperience;
          this.dropdownList2 = result.objectList.ckaWork
        } else if (method === INVESTMENT_COMMON_CONSTANTS.CKA.METHODS.INV_EPERIENCE) {
          this.dropdownList1 = result.objectList.ckaInvestmentListed;
          this.dropdownList2 = result.objectList.ckaInvestmentUnlisted
        }
      }
    }, () => {
      this.loaderService.hideLoaderForced();
      this.investmentAccountService.showGenericErrorModal();
    });
  }
  selectedInstitution(event, control) {
    this.methodForm.controls[control].setValue(event);
    if (event.name.toUpperCase() === 'OTHERS') {
      this.methodForm.addControl('others', new FormControl('', Validators.required));
    }
  }
  selectedSubject(event, control) {
    this.methodForm.controls[control].setValue(event);
    if (this.ckaMethodName !== INVESTMENT_COMMON_CONSTANTS.CKA.METHODS.INV_EPERIENCE) {
      this.methodForm.addControl('institution', new FormControl('', Validators.required));
    }
  }

  submitQNAForm() {
    this.showLoader();
    this.investmentCommonService.saveCKAMethodQNA(null).subscribe((resp: any) => {
      this.loaderService.hideLoaderForced();
      if (resp.responseCode >= 6000) {
        this.router.navigate([SIGN_UP_ROUTE_PATHS.EDIT_PROFILE]);
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
