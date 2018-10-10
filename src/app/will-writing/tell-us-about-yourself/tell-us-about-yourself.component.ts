import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-tell-us-about-yourself',
  templateUrl: './tell-us-about-yourself.component.html',
  styleUrls: ['./tell-us-about-yourself.component.scss']
})
export class TellUsAboutYourselfComponent implements OnInit {

  constructor(private translate: TranslateService) { 
    this.translate.use('en');
  }

  ngOnInit() {
  }

}
