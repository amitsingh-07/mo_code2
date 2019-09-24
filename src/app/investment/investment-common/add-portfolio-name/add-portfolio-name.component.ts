import { filter } from 'rxjs/operators';

import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { RegexConstants } from '../../../shared/utils/api.regex.constants';
import { InvestmentAccountService } from '../../investment-account/investment-account-service';
import { ProfileIcons } from '../../investment-engagement-journey/recommendation/profileIcons';
import { SuccessIcons } from './successIcon';

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
  portfolioNameFormGroup: FormGroup;
  @Input() riskProfileId;
  @Input() defaultPortfolioName;
  @Input() userPortfolioName;
  @Input() showErrorMessage;
  @Input() accountCreationStatus;
  @Output() addPortfolioBtn = new EventEmitter<any>();

  constructor(public activeModal: NgbActiveModal,
              public investmentAccountService: InvestmentAccountService,
              private formBuilder: FormBuilder,
              private router: Router, ) { }
  ngOnInit() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(({ urlAfterRedirects }: NavigationEnd) => {
        this.activeModal.dismiss();
      });
    this.profileIcon = ProfileIcons[this.riskProfileId - 1]['icon'];
    this.portfolioSuccessIcon = SuccessIcons[this.riskProfileId - 1]['icon'];
    this.portfolioNameFormGroup = this.formBuilder.group({
      portfolioName: new FormControl(this.userPortfolioName,
        [Validators.pattern(RegexConstants.portfolioName)])
    });
  }

  addPortfolioName(form) {
    if (form.valid) {
      this.addPortfolioBtn.emit(form.controls.portfolioName.value);
      this.activeModal.close();
    }
  }

  showLength(event) {
    this.characterLength = event.currentTarget.value.length;
  }
}
