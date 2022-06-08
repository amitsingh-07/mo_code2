import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FooterService } from '../../shared/footer/footer.service';
import { NavbarService } from '../../shared/navbar/navbar.service';

@Component({
  selector: 'app-welcome-flow-cpf-life-payout',
  templateUrl: './welcome-flow-cpf-life-payout.component.html',
  styleUrls: ['./welcome-flow-cpf-life-payout.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WelcomeflowCpfLifePayoutComponent implements OnInit {
  showCpfLifePayout: boolean;

  constructor( 
    public footerService: FooterService,
    public navbarService: NavbarService,
    private translate: TranslateService) {
      this.translate.use('en');
     }

  ngOnInit(): void {
    this.navbarService.setNavbarMode(101);
    this.footerService.setFooterVisibility(false);
    this.showCpfLifePayout = false;
  }
  showPayout(){
    this.showCpfLifePayout = true;
  }

}

