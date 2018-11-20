import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { HeaderService } from '../../shared/header/header.service';
import { BankDetailsComponent } from '../../shared/modal/bank-details/bank-details.component';
import { NavbarService } from '../../shared/navbar/navbar.service';
import {
  TOPUP_AND_WITHDRAW_ROUTE_PATHS
} from '../../topup-and-withdraw/topup-and-withdraw-routes.constants';
import { TopupAndWithDrawService } from '../../topup-and-withdraw/topup-and-withdraw.service';
import { InvestmentAccountService } from '../investment-account-service';

@Component({
  selector: 'app-fund-your-account',
  templateUrl: './fund-your-account.component.html',
  styleUrls: ['./fund-your-account.component.scss']
})
export class FundYourAccountComponent implements OnInit {

  uploadForm: FormGroup;
  pageTitle: string;
  formValues;
  isUserNationalitySingapore;
  activeTabIndex = 0;
  fundDetails;
  bankDetailsList;
  bankDetails;
  paynowDetails;

  constructor(
    public readonly translate: TranslateService,
    private formBuilder: FormBuilder,
    private router: Router,
    public headerService: HeaderService,
    private modal: NgbModal,
    public navbarService: NavbarService,
    public topupAndWithDrawService: TopupAndWithDrawService,
    public investmentAccountService: InvestmentAccountService) {
    this.translate.use('en');
    this.fundDetails = this.topupAndWithDrawService.getFundingDetails();

    this.translate.get('COMMON').subscribe((result: string) => {
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(2);
    this.getBankDetailsList();
    // this.topupFormValues = this.topupAndWithDrawService.getTopUp();
    this.fundDetails = this.topupAndWithDrawService.getFundingDetails();
    this.getTransferDetails();
    const pageTitle = this.getPageTitleByType(this.fundDetails.source, this.fundDetails.fundingType);
    this.setPageTitle(pageTitle);
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  getPageTitleByType(source, type) {
    let pageTitle;
    if (source === 'FUNDING') {
      pageTitle = this.translate.instant('Fund Your Account');
    } else if (source === 'TOPUP') {
      type === 'ONETIME' ?
        pageTitle = this.translate.instant('One-time Investment') : pageTitle = this.translate.instant('Monthly Investment');
    }
    return pageTitle;
  }

  getTransferDetails() {
    this.topupAndWithDrawService.getTransferDetails().subscribe((data) => {
      this.setBankPayNowDetails(data.objectList[0]);
    });
  }

  showBankDetails() {
    const ref = this.modal.open(BankDetailsComponent, { centered: true });
    ref.componentInstance.errorTitle = 'Select Your Bank';
    ref.componentInstance.errorDescription = 'You will be transferring funds from:';
    ref.componentInstance.bankDetailsLists = this.bankDetailsList;
    console.log(this.bankDetailsList);
    return false;

  }
  selectFundingMethod(index) {
    this.activeTabIndex = index;
  }

  getBankDetailsList() {
    this.investmentAccountService.getAllDropDownList().subscribe((data) => {
      this.bankDetailsList = data.objectList.bankList;
      console.log(this.bankDetailsList);
    });
  }
  setBankPayNowDetails(data) {
    this.bankDetails = data.filter((transferType) => transferType.institutionType === 'bank')[0];
    this.paynowDetails = data.filter((transferType) => transferType.institutionType === 'PayNow')[0];
  }

  goToNext() {
    this.router.navigate([TOPUP_AND_WITHDRAW_ROUTE_PATHS.TOPUP_REQUEST]);
  }

}
