import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.scss']
})
export class IntroductionComponent implements OnInit {

  constructor(private translate: TranslateService) {
    this.translate.use('en');
   }

  ngOnInit() {
  }

}
