import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FooterService } from '../../shared/footer/footer.service';
import { NavbarService } from '../../shared/navbar/navbar.service';

@Component({
  selector: 'app-get-start',
  templateUrl: './get-start.component.html',
  styleUrls: ['./get-start.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WelcomeflowComponent implements OnInit {

  constructor(
    private footerService: FooterService,
    private navbarService: NavbarService,
    private readonly translate: TranslateService
  ) { 
    this.translate.use('en');
  }

  ngOnInit(): void {
    this.navbarService.setNavbarMode(101);
    this.footerService.setFooterVisibility(false);
  }

}
