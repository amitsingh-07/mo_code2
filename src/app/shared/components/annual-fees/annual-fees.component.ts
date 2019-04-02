import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-annual-fees',
  templateUrl: './annual-fees.component.html',
  styleUrls: ['./annual-fees.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AnnualFeesComponent implements OnInit {
  @Input('feeDetails') feeDetails;

  constructor() { }

  ngOnInit() {
    console.log(this.feeDetails);
  }

}
