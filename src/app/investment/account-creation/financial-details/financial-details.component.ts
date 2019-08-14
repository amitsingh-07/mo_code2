import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { EngagementJourneyService } from '../../engagement-journey/engagement-journey.service';
import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { ErrorModalComponent } from '../../../shared/modal/error-modal/error-modal.component';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { ACCOUNT_CREATION_ROUTE_PATHS } from '../account-creation-routes.constants';
import { AccountCreationService } from '../account-creation-service';

@Component({
  selector: 'app-financial-details',
  templateUrl: './financial-details.component.html',
  styleUrls: ['./financial-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FinancialDetailsComponent implements OnInit {
  pageTitle: string;
  financialDetails: FormGroup;
  FinancialFormData;
  formValues;
  annualHouseHoldIncomeRange: any;
  numberOfHouseHoldMembers: string;
  annualHouseHoldIncomeRanges: any;
  numberOfHouseHoldMembersList = Array(11)
    .fill(0)
    .map((x, i) => i);

  constructor(
    public readonly translate: TranslateService,
    private formBuilder: FormBuilder,
    private router: Router,
    public headerService: HeaderService,
    public engagementJourneyService: EngagementJourneyService,
    public navbarService: NavbarService,
    public footerService: FooterService,
    private modal: NgbModal,
    public accountCreationService: AccountCreationService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('FINANCIAL_DETAILS.TITLE');
      this.setPageTitle(this.pageTitle);
    });
  }

  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    this.footerService.setFooterVisibility(false);
    this.getIncomeRangeList();
    this.FinancialFormData = this.engagementJourneyService.getMyFinancials();
    this.formValues = this.accountCreationService.getInvestmentAccountFormData();
    this.financialDetails = this.formBuilder.group({
      annualHouseHoldIncomeRange: [
        {
          value: this.formValues.annualHouseHoldIncomeRange,
          disabled: this.accountCreationService.isDisabled('annualHouseHoldIncomeRange')
        },
        Validators.required
      ],
      numberOfHouseHoldMembers: [
        this.formValues.numberOfHouseHoldMembers,
        Validators.required
      ]
    });
    this.accountCreationService.loadInvestmentAccountRoadmap();
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }
  getIncomeRangeList() {
    this.accountCreationService.getAllDropDownList().subscribe((data) => {
      this.annualHouseHoldIncomeRanges = data.objectList.incomeRange;
    },
    (err) => {
      this.accountCreationService.showGenericErrorModal();
    });
  }
  setAnnualHouseHoldIncomeRange(annualHouseHoldIncome) {
    this.financialDetails.controls['annualHouseHoldIncomeRange'].setValue(
      annualHouseHoldIncome
    );
  }
  setnumberOfHouseHoldMembers(HouseHoldMembers) {
    this.financialDetails.controls['numberOfHouseHoldMembers'].setValue(HouseHoldMembers);
  }
  getInlineErrorStatus(control) {
    return !control.pristine && !control.valid;
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
  goToNext(form) {
    if (!form.valid) {
      this.markAllFieldsDirty(form);
      const error = this.accountCreationService.getFormErrorList(form);
      const ref = this.modal.open(ErrorModalComponent, { centered: true });
      ref.componentInstance.errorTitle = error.title;
      ref.componentInstance.errorMessageList = error.errorMessages;
      return false;
    } else {
      this.accountCreationService.setFinancialFormData(form.getRawValue());
      this.router.navigate([ACCOUNT_CREATION_ROUTE_PATHS.TAX_INFO]);
    }
  }
  isDisabled() {
    return this.accountCreationService.isDisabled('annualHouseHoldIncomeRange');
  }

  getPlacement() {
    return this.formValues.isMyInfoEnabled ? 'bottom' : 'top';
  }
}
