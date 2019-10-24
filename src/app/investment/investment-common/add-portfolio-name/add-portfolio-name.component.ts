import { filter } from 'rxjs/operators';

import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { RegexConstants } from '../../../shared/utils/api.regex.constants';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { ProfileIcons } from '../../investment-engagement-journey/recommendation/profileIcons';
import { SuccessIcons } from './successIcon';
import { ManageInvestmentsService } from '../../manage-investments/manage-investments.service';
import { HeaderService } from '../../../shared/header/header.service';
import { NavbarService } from '../../../shared/navbar/navbar.service';
import { FooterService } from '../../../shared/footer/footer.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-portfolio-name',
  templateUrl: './add-portfolio-name.component.html',
  styleUrls: ['./add-portfolio-name.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AddPortfolioNameComponent implements OnInit {
  
  profileIcon;
  portfolioSuccessIcon;
  characterLength;
  portfolio;
  pageTitle: string;
  portfolioNameFormGroup: FormGroup;
  // @Input() riskProfileId;
  // @Input() defaultPortfolioName;
  // @Input() userPortfolioName;
  // @Input() showErrorMessage;
  // @Input() accountCreationStatus;
  // @Output() addPortfolioBtn = new EventEmitter<any>();

  constructor(public activeModal: NgbActiveModal,
    public headerService: HeaderService,
    public navbarService: NavbarService,
    public footerService: FooterService,
    public readonly translate: TranslateService,
    public investmentAccountService: InvestmentAccountService,
    public manageInvestmentsService: ManageInvestmentsService,
    private formBuilder: FormBuilder,
    private router: Router, ) {
    this.translate.get('COMMON').subscribe(() => {
      this.pageTitle = this.translate.instant('ACKNOWLEDGEMENT.TITLE');
      this.setPageTitle(this.pageTitle);
    });
  }
  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }
  ngOnInit() {
    this.navbarService.setNavbarMobileVisibility(true);
    this.navbarService.setNavbarMode(6);
    this.footerService.setFooterVisibility(false);

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(({ urlAfterRedirects }: NavigationEnd) => {
        this.activeModal.dismiss();
      });

    this.portfolio = this.manageInvestmentsService.getFundingDetails();
    this.profileIcon = ProfileIcons[1]['icon'];
    this.portfolioSuccessIcon = SuccessIcons[1]['icon'];
    this.portfolioNameFormGroup = this.formBuilder.group({
      portfolioName: new FormControl('Growth Portfolio',
        [Validators.pattern(RegexConstants.portfolioName)])
    });
  }

  addPortfolioName(form) {
    if (form.valid) {
      if (form.controls.portfolioName.value) {
        const portfolioTitleCase = form.controls.portfolioName.value.toLowerCase().split(' ')
          .map((name) => name.charAt(0).toUpperCase() + name.substring(1))
          .join(' ').trim().replace(/  +/g, ' ');
        //this.addPortfolioBtn.emit(portfolioTitleCase);
        this.activeModal.close();
      } else {
        //this.addPortfolioBtn.emit(null);
        this.activeModal.close();
      }
    }
  }

  showLength(event) {
    if (this.characterLength !== event.currentTarget.value.length) {
      //this.showErrorMessage = false;
    }
    this.characterLength = event.currentTarget.value.length;
  }
}
