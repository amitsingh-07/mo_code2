import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {NgbAccordionConfig} from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { FooterService } from '../shared/footer/footer.service';
import { NavbarService } from '../shared/navbar/navbar.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  providers: [NgbAccordionConfig],
  styleUrls: ['./faq.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FAQComponent implements OnInit {
  public pageTitle: string;

  constructor(private navbarService: NavbarService, private footerService: FooterService,
              public translate: TranslateService, private config: NgbAccordionConfig) {
                this.translate.use('en');
                this.translate.get('COMMON').subscribe((result: string) => {
                  this.pageTitle = this.translate.instant('FAQ.TITLE');
                });
                config.closeOthers = true;
                config.type = 'info';
              }

  ngOnInit() {
  }

}
