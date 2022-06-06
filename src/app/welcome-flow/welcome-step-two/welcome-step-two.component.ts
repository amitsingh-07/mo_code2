import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FooterService } from '../../shared/footer/footer.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { FormGroup, FormArray, FormBuilder, } from '@angular/forms';
@Component({
  selector: 'app-welcome-step-two',
  templateUrl: './welcome-step-two.component.html',
  styleUrls: ['./welcome-step-two.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WelcomeStepTwoComponent implements OnInit {
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
