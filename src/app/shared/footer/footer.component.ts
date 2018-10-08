import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { FooterService } from './footer.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, AfterViewInit {
  showFooter = false;
  constructor(private footerService: FooterService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.footerService.currentFooterVisibility.subscribe((showFooter) => {
      this.showFooter = showFooter;
      this.cdr.detectChanges();
    });
  }

}
