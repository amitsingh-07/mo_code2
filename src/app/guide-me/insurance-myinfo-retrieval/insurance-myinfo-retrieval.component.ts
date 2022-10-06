import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FooterService } from '../../shared/footer/footer.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { GuideMeService } from '../guide-me.service';
import { ConfigService } from './../../config/config.service';
import { GUIDE_ME_ROUTE_PATHS } from '../guide-me-routes.constants';
import { IMyInfoData } from './insurance-myinfo-retrieval.interface';

@Component({
  selector: 'app-insurance-myinfo-retrieval',
  templateUrl: './insurance-myinfo-retrieval.component.html',
  styleUrls: ['./insurance-myinfo-retrieval.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InsuranceMyinfoRetrievalComponent implements OnInit {
  private pageTitle: string;
  public myInfoData: IMyInfoData;
  //public cpfBalances: ICpfBalances;
  //public nric: string;

  constructor(
    private router: Router,
    public navbarService: NavbarService,
    public footerService: FooterService,
    public readonly translate: TranslateService,
    private guideMeService: GuideMeService,
    private configService: ConfigService
    
  ) {
    this.configService.getConfig().subscribe((config: any) => {
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
      this.translate.get(config.common).subscribe((result: string) => {
        this.pageTitle = this.translate.instant('MY_ASSETS.TITLE');
        this.setPageTitle(this.pageTitle);
      });
    });
  }

  ngOnInit(): void {
    this.navbarService.setNavbarDirectGuided(true);
    this.myInfoData = this.guideMeService.getMyInfoCpfbalances();
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  goToNext() {
    this.guideMeService.myinfoValueRetrieved$.next(true);
    this.router.navigate([GUIDE_ME_ROUTE_PATHS.ASSETS]);
  }

}
