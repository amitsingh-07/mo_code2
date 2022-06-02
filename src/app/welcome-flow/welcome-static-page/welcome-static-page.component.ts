import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FooterService } from 'src/app/shared/footer/footer.service';
import { NavbarService } from 'src/app/shared/navbar/navbar.service';

@Component({
  selector: 'app-welcome-static-page',
  templateUrl: './welcome-static-page.component.html',
  styleUrls: ['./welcome-static-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WelcomeStaticPageComponent implements OnInit {

  constructor(
    public footerService: FooterService,
    public navbarService: NavbarService,
  ) { }

  ngOnInit(): void {
    this.navbarService.setNavbarMode(101);
    this.footerService.setFooterVisibility(false);
  }

}
