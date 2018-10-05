import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { ngxZendeskWebwidgetService } from 'ngx-zendesk-webwidget';
import { FooterService } from './footer.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, AfterViewInit {
  showFooter = false;
  constructor(private footerService: FooterService, private cdr: ChangeDetectorRef,
              private _ngxZendeskWebwidgetService: ngxZendeskWebwidgetService) {
                _ngxZendeskWebwidgetService.activate();
              }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.footerService.currentFooterVisibility.subscribe((showFooter) => {
      this.showFooter = showFooter;
      this.cdr.detectChanges();
    });
  }

  openLiveChat() {
    this._ngxZendeskWebwidgetService.show();
  }

}
