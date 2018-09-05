import { Component, OnInit } from '@angular/core';
import { GuideMeService } from '../guide-me.service';

@Component({
  selector: 'app-compare-plans',
  templateUrl: './compare-plans.component.html',
  styleUrls: ['./compare-plans.component.scss']
})
export class ComparePlansComponent implements OnInit {
  plansdata: any[] = [];
  constructor(public guideMeService: GuideMeService) {
   }

  ngOnInit() {
    this.plansdata = this.guideMeService.getPlanDetails();
  }

}
