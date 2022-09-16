import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FooterService } from '../../shared/footer/footer.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { MyInfoService } from '../../shared/Services/my-info.service';
import { GuideMeService } from '../guide-me.service';
import { GUIDE_ME_ROUTE_PATHS } from '../guide-me-routes.constants';

@Component({
  selector: 'app-insurance-myinfo-retrieval',
  templateUrl: './insurance-myinfo-retrieval.component.html',
  styleUrls: ['./insurance-myinfo-retrieval.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InsuranceMyinfoRetrievalComponent implements OnInit {
  myInfoAttriutes: any;
  insuranceMyInfoData: any;
  pageTitle: string;

  constructor(
    private router: Router,
    public navbarService: NavbarService,
    public footerService: FooterService,
    public readonly translate: TranslateService,
    private myInfoService: MyInfoService,
    private guideMeService: GuideMeService,
    private _location: Location,

  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
    });
    this.myInfoAttriutes = myInfoService.getMyInfoAttributes();
    this.insuranceMyInfoData = guideMeService;
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('MY_ASSETS.TITLE');
      this.setPageTitle(this.pageTitle);
    });
  }

  ngOnInit(): void {
    this.navbarService.setNavbarVisibility(true);
    this.footerService.setFooterVisibility(false);
    this.navbarService.setNavbarDirectGuided(true);
  }


  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  goToNext() {
    this.router.navigate([GUIDE_ME_ROUTE_PATHS.ASSETS]);
  }

  goBack() {
    this._location.back();
  }

}
