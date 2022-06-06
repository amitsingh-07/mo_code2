import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FooterService } from '../../shared/footer/footer.service';
import { NavbarService } from '../../shared/navbar/navbar.service';

@Component({
  selector: 'app-start-planning',
  templateUrl: './start-planning.component.html',
  styleUrls: ['./start-planning.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StartPlanningComponent implements OnInit {

  constructor(public readonly translate: TranslateService,
              public footerService: FooterService,
              public navbarService: NavbarService) { 
    this.translate.use('en');
  }

  ngOnInit(): void {
    this.navbarService.setNavbarMode(101);
    this.footerService.setFooterVisibility(false);
  }

}
