import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-my-estate-distribution',
  templateUrl: './my-estate-distribution.component.html',
  styleUrls: ['./my-estate-distribution.component.scss']
})
export class MyEstateDistributionComponent implements OnInit {

  constructor(private translate: TranslateService) {
    this.translate.use('en');
  }

  ngOnInit() {
  }

}
