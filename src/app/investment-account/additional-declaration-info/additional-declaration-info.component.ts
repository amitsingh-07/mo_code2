import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { FooterService } from '../../shared/footer/footer.service';
import { HeaderService } from '../../shared/header/header.service';
import { AuthenticationService } from '../../shared/http/auth/authentication.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
@Component({
  selector: 'app-additional-declaration-info',
  templateUrl: './additional-declaration-info.component.html',
  styleUrls: ['./additional-declaration-info.component.scss']
})
export class AdditionalDeclarationInfoComponent implements OnInit {
  pageTitle: string;
  constructor(
    public readonly translate: TranslateService,
    public authService: AuthenticationService,
    private router: Router,
    public navbarService: NavbarService,
    public headerService: HeaderService,
    public footerService: FooterService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
    });
  }
  ngOnInit() {
    this.navbarService.setNavbarDirectGuided(false);
    this.footerService.setFooterVisibility(false);
  }
  goNext() {
}
}
