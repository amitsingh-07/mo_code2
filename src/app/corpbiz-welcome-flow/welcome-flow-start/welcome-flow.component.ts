import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FooterService } from '../../shared/footer/footer.service';
import { NavbarService } from '../../shared/navbar/navbar.service';

@Component({
  selector: 'app-welcome-flow',
  templateUrl: './welcome-flow.component.html',
  styleUrls: ['./welcome-flow.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WelcomeflowComponent implements OnInit {

  constructor(
    public footerService: FooterService,
    public navbarService: NavbarService,
    public readonly translate: TranslateService
  ) { 
    this.translate.use('en');
  }

  ngOnInit(): void {
    this.navbarService.setNavbarMode(101);
    this.footerService.setFooterVisibility(false);
  }

}
