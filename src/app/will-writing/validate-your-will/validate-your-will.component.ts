import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { FooterService } from '../../shared/footer/footer.service';
import { WILL_WRITING_ROUTE_PATHS } from '../will-writing-routes.constants';
import { WillWritingApiService } from '../will-writing.api.service';

@Component({
  selector: 'app-validate-your-will',
  templateUrl: './validate-your-will.component.html',
  styleUrls: ['./validate-your-will.component.scss']
})
export class ValidateYourWillComponent implements OnInit {
  data;

  constructor(private translate: TranslateService,
              public footerService: FooterService,
              private router: Router,
              private willWritingApiService: WillWritingApiService) {
    this.translate.use('en');
  }

  ngOnInit() {
    this.footerService.setFooterVisibility(false);
  }

  editWill() {
    this.router.navigate([WILL_WRITING_ROUTE_PATHS.CONFIRMATION]);
  }

  downloadWill() {
    this.data = 'http://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf';
    this.brochure(this.data, 'brochure.pdf');
    // this.willWritingApiService.downloadWill().subscribe((data: any) => {
    //   console.log(data);
    //   this.brochure(data, 'brochure.pdf');
    // });
  }

  // tslint:disable-next-line:member-ordering
  brochure = (() => {
    const a = document.createElement('a');
    document.body.appendChild(a);
    return ((link, fileName) => {
      a.href = link;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(link);
    });
  })();

}
