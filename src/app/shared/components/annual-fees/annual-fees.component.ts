import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ConfigService, IConfig } from './../../../config/config.service';

@Component({
  selector: 'app-annual-fees',
  templateUrl: './annual-fees.component.html',
  styleUrls: ['./annual-fees.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AnnualFeesComponent implements OnInit {
  @Input('feeDetails') feeDetails;
  isInvestmentEnabled = false;

  constructor(private configService: ConfigService) {
    this.configService.getConfig().subscribe((config: IConfig) => {
      this.isInvestmentEnabled = config.investmentEnabled;
    });
  }

  ngOnInit() {
    console.log(this.feeDetails);
  }

}
