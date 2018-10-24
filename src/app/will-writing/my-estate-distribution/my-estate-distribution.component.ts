import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { WILL_WRITING_ROUTE_PATHS } from '../will-writing-routes.constants';
import { WillWritingService } from './../will-writing.service';

@Component({
  selector: 'app-my-estate-distribution',
  templateUrl: './my-estate-distribution.component.html',
  styleUrls: ['./my-estate-distribution.component.scss']
})
export class MyEstateDistributionComponent implements OnInit {
  private pageTitle: string;
  private step: string;

  estateDistList: any[] = [];
  beneficiaryList: any[] = [];
  remainingPercentage = 100;
  value = '';
  showForm = false;
  divider: number;
  distPercentageSum = 0;
  firstReset = false;
  currentDist;
  errorMsg;
  constructor(private translate: TranslateService,
              private willWritingService: WillWritingService,
              private router: Router) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.step = this.translate.instant('WILL_WRITING.COMMON.STEP_2');
      this.pageTitle = this.translate.instant('WILL_WRITING.MY_ESTATE_DISTRIBUTION.TITLE');
      this.errorMsg = this.translate.instant('WILL_WRITING.MY_ESTATE_DISTRIBUTION.ERROR_MODAL');
    });
  }

  // tslint:disable-next-line:cognitive-complexity
  ngOnInit() {
    if (this.willWritingService.getBeneficiaryInfo().length > 0) {
      this.beneficiaryList = this.willWritingService.getBeneficiaryInfo();
      this.estateDistList = this.beneficiaryList.filter((checked) => checked.selected === true);
      if (this.willWritingService.isBeneficiaryAdded) {
      this.divider = (this.remainingPercentage / this.estateDistList.length);
      for (const percent of this.estateDistList) {
        percent.distPercentage = Math.floor(this.divider);
        if (this.estateDistList.indexOf(percent) === this.estateDistList.length - 1) {
          if (this.estateDistList.length === 3) {
            percent.distPercentage += 1;
          } else if (this.estateDistList.length === 6) {
            percent.distPercentage += 4;
          } else if (this.estateDistList.length === 7) {
            percent.distPercentage += 2;
          } else {
            return false;
          }
        }
      }
      }
    }
    this.calculateRemPercentage();
  }

  calculateRemPercentage() {
    for (const percent of this.estateDistList) {
      this.remainingPercentage = (this.remainingPercentage - percent.distPercentage);
    }
    return this.remainingPercentage;
  }

  // tslint:disable-next-line:cognitive-complexity
  updateDistPercentage(index: number, event) {
    const filteredList = this.estateDistList.filter((filtered) => filtered.distPercentage === 0).length;
    for (const percent of this.estateDistList) {
      this.estateDistList[index].distPercentage = Math.floor(event.target.value);
      if (!this.firstReset) {
        if (filteredList < 1) {
          for (const percentage of this.estateDistList) {
            if (this.estateDistList.indexOf(percentage) === index) {
              this.estateDistList[index].distPercentage = Math.floor(event.target.value);
              this.firstReset = true;
            } else {
              percentage.distPercentage = 0;
            }
          }
        }
      }
      this.distPercentageSum += percent.distPercentage;
    }
    if (this.distPercentageSum > 100) {
      this.currentDist = this.estateDistList[index].distPercentage;
      setTimeout(() => this.estateDistList[index].distPercentage = 0, 0);
      this.willWritingService.openToolTipModal(this.errorMsg.EXCEED_PERCENTAGE, '');
      this.distPercentageSum = 0;
      for (const percent of this.estateDistList) {
        this.distPercentageSum += percent.distPercentage;
      }
    }
    this.remainingPercentage = 100 - this.distPercentageSum;
    if (this.remainingPercentage < 0) {
      this.remainingPercentage = 100 - (this.distPercentageSum - this.currentDist);
    }
    this.distPercentageSum = 0;

  }

  save() {
    const arrLength = this.estateDistList.filter((greater) => greater.distPercentage < 1).length;
    if (arrLength > 0 && this.remainingPercentage === 0) {
      this.willWritingService.openToolTipModal(this.errorMsg.MAX_PERCENTAGE, '');
      return false;
    } else if (arrLength < 1 && this.remainingPercentage !== 0) {
      this.willWritingService.openToolTipModal(this.errorMsg.ADJUST_PERCENTAGE, '');
      return false;
    // tslint:disable-next-line:no-duplicated-branches
    } else if (arrLength > 0 && this.remainingPercentage !== 0) {
      this.willWritingService.openToolTipModal(this.errorMsg.ADJUST_PERCENTAGE, '');
      return false;
    }
    const unFilteredArray = this.beneficiaryList.filter((checked) => checked.selected === false);
    for (const currentObject of unFilteredArray) {
      this.estateDistList.push(currentObject);
    }
    this.willWritingService.setBeneficiaryInfo(this.estateDistList);
    this.willWritingService.isBeneficiaryAdded = false;
    return true;
  }

  goToNext() {
    if (this.save()) {
      this.router.navigate([WILL_WRITING_ROUTE_PATHS.APPOINT_EXECUTOR_TRUSTEE]);
    }
  }

}
