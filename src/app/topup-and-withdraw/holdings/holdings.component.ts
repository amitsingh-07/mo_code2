import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { FooterService } from '../../shared/footer/footer.service';
import { HeaderService } from '../../shared/header/header.service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { TopupAndWithDrawService } from '../topup-and-withdraw.service';

@Component({
  selector: 'app-holdings',
  templateUrl: './holdings.component.html',
  styleUrls: ['./holdings.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HoldingsComponent implements OnInit {
  pageTitle: string;
  holidings;

  constructor(
    public readonly translate: TranslateService,
    public headerService: HeaderService,
    private formBuilder: FormBuilder,
    public authService: AuthenticationService,
    private router: Router,
    public navbarService: NavbarService,
    public footerService: FooterService,
    private modal: NgbModal,
    public topupAndWithDrawService: TopupAndWithDrawService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('HOLDINGS.TITLE');
      this.setPageTitle(this.pageTitle);
    });
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }
  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(103);
    this.footerService.setFooterVisibility(false);
    this.holidings = this.topupAndWithDrawService.getHoldingValues();
  }
}
