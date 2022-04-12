import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FooterService } from '../../shared/footer/footer.service';
import { NavbarService } from '../../shared/navbar/navbar.service';

@Component({
  selector: 'app-corp-login',
  templateUrl: './corp-login.component.html',
  styleUrls: ['./corp-login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CorpLoginComponent implements OnInit {

  constructor(private translate: TranslateService,
    private navbarService: NavbarService,
    private footerService: FooterService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
    });
  }

  ngOnInit(): void {
    this.navbarService.setNavbarVisibility(true);
    this.navbarService.setNavbarMode(101);
    this.footerService.setFooterVisibility(false);
  }

}
