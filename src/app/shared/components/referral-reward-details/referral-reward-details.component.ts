import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-referral-reward-details',
  templateUrl: './referral-reward-details.component.html',
  styleUrls: ['./referral-reward-details.component.scss']
})
export class ReferralRewardDetailsComponent implements OnInit { 
  isCollapsed = true;
  noteArray;
  constructor(
    public readonly translate: TranslateService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => { });
   }

  ngOnInit() {
    this.noteArray = this.translate.instant('REFERRAL_REWARD_DETAILS.NOTE');
  }
  toggle(event) {
    this.isCollapsed = !this.isCollapsed;
  }
}
