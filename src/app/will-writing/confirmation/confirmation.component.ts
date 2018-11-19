import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { FooterService } from '../../shared/footer/footer.service';
import { WillWritingFormData } from '../will-writing-form-data';
import { WILL_WRITING_ROUTE_PATHS } from '../will-writing-routes.constants';
import { IBeneficiary } from '../will-writing-types';
import { WillWritingApiService } from '../will-writing.api.service';
import { WILL_WRITING_CONFIG } from '../will-writing.constants';
import { WillWritingService } from '../will-writing.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {
  pageTitle: string;
  step: string;

  willWritingFormData: WillWritingFormData = new WillWritingFormData();
  willWritingRoutePaths = WILL_WRITING_ROUTE_PATHS;
  willWritingConfig = WILL_WRITING_CONFIG;
  willEstateDistribution = { spouse: [], children: [], others: [] };
  willBeneficiary: IBeneficiary[];

  constructor(
    private translate: TranslateService,
    private willWritingService: WillWritingService,
    public footerService: FooterService,
    private willWritingApiService: WillWritingApiService,
    private router: Router) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.step = this.translate.instant('WILL_WRITING.COMMON.STEP_4');
      this.pageTitle = this.translate.instant('WILL_WRITING.CONFIRMATION.TITLE');
    });
  }

  ngOnInit() {
    this.willWritingService.setFromConfirmPage(false);
    this.willWritingFormData = this.willWritingService.getWillWritingFormData();
    const estateDistribution = this.willWritingFormData.beneficiary.filter((beneficiary) => beneficiary.selected === true);
    this.willBeneficiary = estateDistribution;
    for (const beneficiary of estateDistribution) {
      if (beneficiary.relationship === WILL_WRITING_CONFIG.SPOUSE) {
        this.willEstateDistribution.spouse.push(beneficiary);
      } else if (beneficiary.relationship === WILL_WRITING_CONFIG.CHILD) {
        this.willEstateDistribution.children.push(beneficiary);
      } else {
        this.willEstateDistribution.others.push(beneficiary);
      }
    }
    this.footerService.setFooterVisibility(false);
  }

  edit(url) {
    this.willWritingService.setFromConfirmPage(true);
    this.router.navigate([url]);
  }

  goNext() {
    if (this.willWritingService.isUserLoggedIn()) {
      this.willWritingApiService.updateWill().subscribe((data) => {
        if (data.responseMessage && data.responseMessage.responseCode >= 6000) {
          this.router.navigate([WILL_WRITING_ROUTE_PATHS.VALIDATE_YOUR_WILL]);
        }
      });
    } else {
      this.router.navigate([WILL_WRITING_ROUTE_PATHS.SIGN_UP]);
    }
  }

}
