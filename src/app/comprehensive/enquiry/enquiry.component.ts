import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfigService } from '../../config/config.service';
import {  COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';

@Component({
  selector: 'app-enquiry',
  templateUrl: './enquiry.component.html',
  styleUrls: ['./enquiry.component.scss']
})
export class EnquiryComponent implements OnInit {

  constructor(private configService: ConfigService, private translate: TranslateService , private router: Router) {
    this.configService.getConfig().subscribe((config: any) => {
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
      this.translate.get(config.common).subscribe((result: string) => {
        // meta tag and title
      });
    });
  }

  ngOnInit() {
  }
  goToNext() {
    this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.DASHBOARD]);
  }
}
