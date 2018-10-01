import { AfterViewInit, Component, OnInit } from '@angular/core';

import { FooterService } from './footer.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, AfterViewInit {
  showFooter = true;
  constructor(private footerService: FooterService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.footerService.currentFooterVisibility.subscribe((showFooter) => {
      this.showFooter = showFooter;
    });
  }

}
