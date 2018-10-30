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

  edit(section) {
    switch (section) {
      case 'about-me':
        this.router.navigate([WILL_WRITING_ROUTE_PATHS.MY_ESTATE_DISTRIBUTION]);
        break;
      /*case 'my-family':
        break;
      case 'guardian':
        break;
      case 'beneficiary':
        break;
      case 'estate-distribution':
        break;
      case 'executor-trustee':
        break;*/
    }
  }

}
