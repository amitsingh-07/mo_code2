import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-referral-reward-details',
  templateUrl: './referral-reward-details.component.html',
  styleUrls: ['./referral-reward-details.component.scss']
})
export class ReferralRewardDetailsComponent implements OnInit { 
  isCollapsed = true;
  constructor() { }

  ngOnInit(): void {
  
  }
  toggle(event) {
    this.isCollapsed = !this.isCollapsed;
  }
}
