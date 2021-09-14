import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { LoaderService } from '../../../shared/components/loader/loader.service';
import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { ErrorModalComponent } from '../../../shared/modal/error-modal/error-modal.component';
import {
    ModelWithButtonComponent
} from '../../../shared/modal/model-with-button/model-with-button.component';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { Util } from 'src/app/shared/utils/util';
import { InvestmentAccountCommon } from '../../investment-account/investment-account-common';
import { INVESTMENT_ACCOUNT_ROUTE_PATHS } from '../../investment-account/investment-account-routes.constants';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { INVESTMENT_ACCOUNT_CONSTANTS } from '../../investment-account/investment-account.constant';
import { InvestmentCommonService } from '../../investment-common/investment-common.service';
import { INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS } from '../investment-engagement-journey-routes.constants';
import { InvestmentEngagementJourneyService } from '../investment-engagement-journey.service';
import { INVESTMENT_COMMON_ROUTE_PATHS } from '../../investment-common/investment-common-routes.constants';

@Component({
  selector: 'app-upload-document',
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UploadDocumentComponent implements OnInit {

  uploadForm: FormGroup;
  uploadFormValues:any;
  pageTitle: string;
  formValues: any;
  countries: any;
  isUserNationalitySingapore: any;
  defaultThumb: any;
  formData: FormData = new FormData();
  uploadDocumentList: any;
  nricDiv=false;
  dobDiv=false;
  passportDiv=false;
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
    public investmentEngagementJourneyService : InvestmentEngagementJourneyService,
    private loaderService: LoaderService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('UPLOAD_DOCUMENTS.TITLE');
      this.setPageTitle(this.pageTitle);
      this.defaultThumb = INVESTMENT_ACCOUNT_CONSTANTS.upload_documents.default_thumb;
    });

    
  }
  buildListForSingapore(){
    this.uploadDocumentList = [{"name":"NRIC","value":"NRIC"},{"name":"dateofBirth","value":"dateofBirth"}];
  }

  buildListForOtherCountry(){
    this.uploadDocumentList = [{"name":"Passport","value":"Passport"}];
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
    
    //this.addOrRemoveMailingAddressproof();
    this.investmentAccountService.loadInvestmentAccountRoadmap(true);

    this.uploadFormValues = this.isUserNationalitySingapore
      ? this.buildListForSingapore()
      : this.buildListForOtherCountry();

    this.uploadForm = new FormGroup({
      uploadDocument: new FormControl('', Validators.required)
    });
  }

  setDropDownValue(event, key) {
    console.log(event,'eventevent')
    this.isUserNationalitySingapore
      ? this.buildFormForSingapore(event)
      : this.buildFormForOtherCountry(event);
    setTimeout(() => {
    }, 100);
    console.log(this.uploadForm,'uploadForm');
  }

  buildFormForSingapore(event) {
    if(event.value == 'NRIC'){
      this.nricDiv=true;
      this.dobDiv=false;
      this.uploadForm.controls['uploadDocument'].setValue(event);
      this.uploadForm.addControl(
      'nricFrontImage', new FormControl(this.formValues.nricFrontImage,Validators.required)
     );
      this.uploadForm.addControl(
      'nricBackImage', new FormControl(this.formValues.nricBackImage,Validators.required)
     );
  }
  if(event.value == 'dateofBirth'){
    this.dobDiv=true;
    this.nricDiv=false;
    this.uploadForm.controls['uploadDocument'].setValue(event);
    this.uploadForm.addControl(
      'dateofBirthImage', new FormControl(this.formValues.dateofBirthImage,Validators.required)
     );
  }
}

  buildFormForOtherCountry(event) {
    if(event.value == 'Passport'){
      this.passportDiv=true;
      this.uploadForm.controls['uploadDocument'].setValue(event);
       this.uploadForm.addControl(
      'passportImage', new FormControl(this.formValues.passportImage,Validators.required)
     );
  }
  }
  addOrRemoveMailingAddressproof() {
    if (!this.formValues.isMailingAddressSame) {
      this.uploadForm.addControl(
        'mailAdressProof',
        new FormControl('', Validators.required)
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

  showProofOfMailingDetails() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    const errorTitle = this.translate.instant(
      'UPLOAD_DOCUMENTS.MODAL.MAILING_ADDRESS_PROOF.TITLE'
    );
    const errorDesc = this.translate.instant(
      'UPLOAD_DOCUMENTS.MODAL.MAILING_ADDRESS_PROOF.MESSAGE'
    );
    ref.componentInstance.errorTitle = errorTitle;
    ref.componentInstance.errorDescription = errorDesc;
  }

  // tslint:disable-next-line:no-identical-functions
  showProofOfResDetails() {
    const ref = this.modal.open(ErrorModalComponent, { centered: true });
    const errorTitle = this.translate.instant(
      'UPLOAD_DOCUMENTS.MODAL.RES_ADDRESS_PROOF.TITLE'
    );
    const errorDesc = this.translate.instant(
      'UPLOAD_DOCUMENTS.MODAL.RES_ADDRESS_PROOF.MESSAGE'
    );
    ref.componentInstance.errorTitle = errorTitle;
    ref.componentInstance.errorDescription = errorDesc;
  }

  goToNext(form) {
    if (form.valid) {
      this.uploadDocument();
    }
  }

  redirectToNextPage() {
   this.router.navigate([INVESTMENT_ENGAGEMENT_JOURNEY_ROUTE_PATHS.SELECT_PORTFOLIO]);
    
  }

}
