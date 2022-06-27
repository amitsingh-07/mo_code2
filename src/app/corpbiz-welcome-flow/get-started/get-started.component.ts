import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { FooterService } from '../../shared/footer/footer.service';
import { NavbarService } from '../../shared/navbar/navbar.service';

@Component({
  selector: 'app-get-started',
  templateUrl: './get-started.component.html',
  styleUrls: ['./get-started.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GetStartedComponent implements OnInit {
  subscription: Subscription;  
  
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
    this.subscription = this.navbarService.preventBackButton().subscribe();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
