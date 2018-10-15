import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-review-your-details',
  templateUrl: './review-your-details.component.html',
  styleUrls: ['./review-your-details.component.scss']
})
export class ReviewYourDetailsComponent implements OnInit {

  constructor(private translate: TranslateService) {
    this.translate.use('en');
  }

  ngOnInit() {
  }

}
