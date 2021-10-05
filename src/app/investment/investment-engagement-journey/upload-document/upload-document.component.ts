import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { LoaderService } from '../../../shared/components/loader/loader.service';
import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { ErrorModalComponent } from '../../../shared/modal/error-modal/error-modal.component';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { Util } from '../../../shared/utils/util';
import { InvestmentAccountCommon } from '../../investment-account/investment-account-common';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { INVESTMENT_ACCOUNT_CONSTANTS } from '../../investment-account/investment-account.constant';
import { InvestmentCommonService } from '../../investment-common/investment-common.service';
import { INVESTMENT_ENGAGEMENT_JOURNEY_ROUTES, INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS } from '../investment-engagement-journey-routes.constants';
import { InvestmentEngagementJourneyService } from '../investment-engagement-journey.service';
import { INVESTMENT_COMMON_ROUTE_PATHS } from '../../investment-common/investment-common-routes.constants';
import { INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS } from '../investment-engagement-journey.constants';
import { INVESTMENT_COMMON_CONSTANTS } from './../../../investment/investment-common/investment-common.constants';
import { MANAGE_INVESTMENTS_ROUTE_PATHS } from '../../manage-investments/manage-investments-routes.constants';
import { IToastMessage } from '../../manage-investments/manage-investments-form-data';
import { ManageInvestmentsService } from '../../manage-investments/manage-investments.service';

@Component({
  selector: 'app-upload-document',
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UploadDocumentComponent implements OnInit {

  uploadForm: FormGroup;
  uploadFormValues: any;
  pageTitle: string;
  editPageTitle: string;
  formValues: any;
  countries: any;
  isUserNationalitySingapore: any;
  defaultThumb: any;
  formData: FormData = new FormData();
  uploadDocumentList: any;
  nricDiv = false;
  dobDiv = false;
  passportDiv = false;
  uploadContent = false;
  routeParams: any;
  customerPortfolioId: any;
  navigationType: any;
  investmentAccountCommon: InvestmentAccountCommon = new InvestmentAccountCommon();
  constructor(
    public readonly translate: TranslateService,
    private formBuilder: FormBuilder,
    private router: Router,
    public headerService: HeaderService,
    private modal: NgbModal,
    public navbarService: NavbarService,
    public footerService: FooterService,
    public investmentAccountService: InvestmentAccountService,
    public investmentEngagementJourneyService: InvestmentEngagementJourneyService,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private investmentCommonService: InvestmentCommonService,
    public manageInvestmentsService: ManageInvestmentsService
  ) {
    this.navigationType =  this.investmentCommonService.setNavigationType(this.router.url, INVESTMENT_ENGAGEMENT_JOURNEY_ROUTES.EDIT_JA_UPLOAD_DOCUMENT,
      INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.NAVIGATION_TYPE.EDIT);
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('UPLOAD_DOCUMENTS.PAGE_TITLE');
      this.editPageTitle = this.translate.instant('UPLOAD_DOCUMENTS.EDIT_PAGE_TITLE');
      if (this.navigationType) {
        this.setPageTitle(this.editPageTitle);
      } else {
        this.setPageTitle(this.pageTitle);
      }
      this.defaultThumb = INVESTMENT_ACCOUNT_CONSTANTS.upload_documents.default_thumb;
    });
  }

  buildListForSingapore() {
    this.uploadDocumentList = INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.UPLOAD_SINGAPOREAN_DOC_LIST;
  }

  buildListForOtherCountry() {
    this.uploadDocumentList = INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.UPLOAD_NON_SINGAPOREAN_DOC_LIST;
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    this.footerService.setFooterVisibility(false);
    this.isUserNationalitySingapore = this.investmentEngagementJourneyService.isSingaporeResident();
    this.formValues = this.investmentEngagementJourneyService.getMinorSecondaryHolderData();
    this.investmentAccountService.loadInvestmentAccountRoadmap(true);
    this.uploadFormValues = this.isUserNationalitySingapore
      ? this.buildListForSingapore()
      : this.buildListForOtherCountry();

    this.uploadForm = new FormGroup({
      uploadDocument: new FormControl('', Validators.required)
    });
    this.route.paramMap.subscribe(params => {
      this.routeParams = params;
      if (this.routeParams && this.routeParams.get('customerPortfolioId')) {
        this.customerPortfolioId = this.routeParams.get('customerPortfolioId');
      }
    });
  }

  setDropDownValue(event, key) {
    this.uploadContent = true;
    setTimeout(() => {
      this.isUserNationalitySingapore
        ? this.buildFormForSingapore(event)
        : this.buildFormForOtherCountry(event);
    });
  }

  buildFormForSingapore(event) {
    if (event.value == INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.UPLOAD_TYPE.NRIC) {
      this.nricDiv = true;
      this.dobDiv = false;
      this.uploadForm.controls['uploadDocument'].setValue(event);
      this.uploadForm.removeControl('passportImage');
      this.uploadForm.removeControl('birthCertificateImage');
      this.uploadForm.addControl(
        'nricFrontImage', new FormControl(this.formValues.nricFrontImage, Validators.required)
      );
      this.uploadForm.addControl(
        'nricBackImage', new FormControl(this.formValues.nricBackImage, Validators.required)
      );
    }
    if (event.value == INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.UPLOAD_TYPE.BIRTH_CERTIFICATE) {
      this.dobDiv = true;
      this.nricDiv = false;
      this.passportDiv = false;
      this.uploadForm.controls['uploadDocument'].setValue(event);
      this.uploadForm.removeControl('nricFrontImage');
      this.uploadForm.removeControl('nricBackImage');
      this.uploadForm.removeControl('passportImage');
      this.uploadForm.addControl(
        'birthCertificateImage', new FormControl(this.formValues.birthCertificateImage, Validators.required)
      );
    }
  }

  buildFormForOtherCountry(event) {
    if (event.value == INVESTMENT_ENGAGEMENT_JOURNEY_CONSTANTS.UPLOAD_TYPE.PASSPORT) {
      this.passportDiv = true;
      this.uploadForm.controls['uploadDocument'].setValue(event);
      this.uploadForm.removeControl('nricFrontImage');
      this.uploadForm.removeControl('nricBackImage');
      this.uploadForm.removeControl('birthCertificateImage');
      this.uploadForm.addControl(
        'passportImage', new FormControl(this.formValues.passportImage, Validators.required)
      );
    }
  }

  getInlineErrorStatus(control) {
    return !control.pristine && !control.valid;
  }
  
  setNestedDropDownValue(key, value, nestedKey) {
    this.uploadForm.controls[nestedKey]['controls'][key].setValue(value);
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

  openFileDialog(elem) {
    if (!elem.files.length) {
      elem.click();
    }
  }

  fileSelected(control, controlname, fileElem, thumbElem?) {
    const response = this.investmentAccountCommon.fileSelected(
      this.formData,
      control,
      controlname,
      fileElem,
      thumbElem
    );
    if (!response.validFileSize) {
      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      const errorTitle = this.translate.instant(
        'UPLOAD_DOCUMENTS.MODAL.FILE_SIZE_EXCEEDED.TITLE'
      );
      const errorDesc = this.translate.instant(
        'UPLOAD_DOCUMENTS.MODAL.FILE_SIZE_EXCEEDED.MESSAGE'
      );
      ref.componentInstance.errorTitle = errorTitle;
      ref.componentInstance.errorDescription = errorDesc;
      control.setValue('');
    } else if (!response.validFileType) {
      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      const errorTitle = this.translate.instant(
        'UPLOAD_DOCUMENTS.MODAL.FILE_TYPE_MISMATCH.TITLE'
      );
      const errorDesc = this.translate.instant(
        'UPLOAD_DOCUMENTS.MODAL.FILE_TYPE_MISMATCH.MESSAGE'
      );
      ref.componentInstance.errorTitle = errorTitle;
      ref.componentInstance.errorDescription = errorDesc;
      control.setValue('');
    } else {
      const selFile = fileElem.target.files[0];
      control.setValue(selFile ? selFile.name : '');
    }
  }

  getPayloadKey(controlname) {
    return this.investmentAccountCommon.getPayloadKey(controlname);
  }

  uploadDocument() {
    this.loaderService.showLoader({
      title: this.translate.instant('UPLOAD_DOCUMENTS.MODAL.UPLOADING_LOADER.TITLE'),
      desc: this.translate.instant('UPLOAD_DOCUMENTS.MODAL.UPLOADING_LOADER.MESSAGE')
    });
    this.formData.append('jointAccountDetailsId', this.formValues.jaAccountId);
    this.investmentEngagementJourneyService.uploadDocument(this.formData).subscribe((response) => {
      this.loaderService.hideLoader();
      if (response) {
        this.redirectToNextPage();
      }
    },
      (err) => {
        this.loaderService.hideLoader();
        this.investmentAccountService.showGenericErrorModal();
      });
  }

  setThumbnail(thumbElem, file) {
    // Set Thumbnail
    this.investmentAccountCommon.setThumbnail(thumbElem, file);
  }

  getFileName(fileElem) {
    return this.investmentAccountCommon.getFileName(fileElem);
  }

  clearFileSelection(control, controlName, event, thumbElem?, fileElem?) {
    const payloadKey = this.getPayloadKey(controlName);
    this.formData.delete(payloadKey);
    this.investmentAccountCommon.clearFileSelection(control, event, thumbElem, fileElem);
  }

  goToNext(form) {
    if (form.valid) {
      this.uploadDocument();
    }
  }

  redirectToNextPage() {
    if (this.customerPortfolioId) {
      this.verifyFlowSubmission();
    } else if (!Util.isEmptyOrNull(this.navigationType)) {
      this.router.navigate([INVESTMENT_COMMON_ROUTE_PATHS.PORTFOLIO_SUMMARY]);
    }
    else {
      this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.SELECT_PORTFOLIO]);
    }
  }

  verifyFlowSubmission() {
    this.investmentEngagementJourneyService.verifyFlowSubmission(Number(this.customerPortfolioId), INVESTMENT_COMMON_CONSTANTS.JA_ACTION_TYPES.SUBMISSION).subscribe((response) => {
      this.loaderService.hideLoader();
      if (response) {
        const toastMessage: IToastMessage = {
          isShown: true,
          desc: this.translate.instant('TOAST_MESSAGES.VERIFY_SUBMISSION'),
        };
        this.manageInvestmentsService.setToastMessage(toastMessage);
        this.router.navigate([MANAGE_INVESTMENTS_ROUTE_PATHS.YOUR_INVESTMENT]);
      }
    },
      (err) => {
        this.loaderService.hideLoader();
        this.investmentAccountService.showGenericErrorModal();
      });
  }
}
