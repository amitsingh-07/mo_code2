import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ComprehensiveService } from '../../comprehensive/comprehensive.service';
import { FooterService } from '../../shared/footer/footer.service';
import { NavbarService } from '../../shared/navbar/navbar.service';

@Component({
  selector: 'app-cpf-life-payout',
  templateUrl: './cpf-life-payout.component.html',
  styleUrls: ['./cpf-life-payout.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CpfLifePayoutComponent implements OnInit {
  showCpfLifePayout: boolean = false;
  subscription: Subscription;

  constructor( 
    private footerService: FooterService,
    private navbarService: NavbarService,
    private translate: TranslateService,
    public comprehensiveService: ComprehensiveService) {
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

