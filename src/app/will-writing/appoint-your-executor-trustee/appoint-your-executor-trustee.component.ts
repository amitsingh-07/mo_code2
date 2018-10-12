import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-appoint-your-executor-trustee',
  templateUrl: './appoint-your-executor-trustee.component.html',
  styleUrls: ['./appoint-your-executor-trustee.component.scss']
})
export class AppointYourExecutorTrusteeComponent implements OnInit {

  constructor(private translate: TranslateService) {
    this.translate.use('en');
  }

  ngOnInit() {
  }

}
