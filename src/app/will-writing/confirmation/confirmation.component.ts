import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { WillWritingFormData } from '../will-writing-form-data';
import { WILL_WRITING_ROUTE_PATHS } from '../will-writing-routes.constants';
import { WillWritingService } from '../will-writing.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {
  pageTitle: string;
  step: string;

  willWritingFormData: WillWritingFormData = new WillWritingFormData();
  willWritingRoutePaths = WILL_WRITING_ROUTE_PATHS;

  constructor(private translate: TranslateService, private willWritingService: WillWritingService, private router: Router) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.step = this.translate.instant('WILL_WRITING.COMMON.STEP_4');
      this.pageTitle = this.translate.instant('WILL_WRITING.CONFIRMATION.TITLE');
    });
  }

  ngOnInit() {
    this.willWritingFormData = this.willWritingService.getWillWritingFormData();
  }

  edit(url) {
    this.router.navigate([url]);
  }

}
