import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-distribute-your-estate',
  templateUrl: './distribute-your-estate.component.html',
  styleUrls: ['./distribute-your-estate.component.scss']
})
export class DistributeYourEstateComponent implements OnInit {

  constructor(private translate: TranslateService) {
    this.translate.use('en');
  }

  ngOnInit() {
  }

}
