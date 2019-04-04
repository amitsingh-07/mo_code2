import { Component, OnInit } from '@angular/core';
import { NavbarService } from '../../navbar/navbar.service';

@Component({
  selector: 'app-investment-title-bar',
  templateUrl: './investment-title-bar.component.html',
  styleUrls: ['./investment-title-bar.component.scss']
})
export class InvestmentTitleBarComponent implements OnInit {

  pageTitle: string;
  pageSuperTitle = '';

  constructor(private navbarService: NavbarService) { }

  ngOnInit() {
    this.navbarService.currentPageTitle.subscribe((title) => {
      this.pageTitle = title;
    });
  this.navbarService.investmentPageSuperTitle.subscribe((subTitle) => {
    this.pageSuperTitle = subTitle;
  });
  }

}
