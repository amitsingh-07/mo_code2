import { filter } from 'rxjs/operators';

import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { RegexConstants } from '../../../shared/utils/api.regex.constants';
import { ProfileIcons } from '../../investment-engagement-journey/recommendation/profileIcons';

@Component({
  selector: 'app-add-portfolio-name',
  templateUrl: './add-portfolio-name.component.html',
  styleUrls: ['./add-portfolio-name.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class AddPortfolioNameComponent implements OnInit {

  iconImage;
  characterLength;
  defaultPortfolioName;
  portfolioNameFormGroup: FormGroup;
  @Input() portfolio;
  @Output() createdPortfolioName = new EventEmitter<any>();
  @Output() portfolioNaming = new EventEmitter<any>();

  constructor(public activeModal: NgbActiveModal,
              private router: Router,
              private formBuilder: FormBuilder) { }
  ngOnInit() {
    this.iconImage = ProfileIcons[this.portfolio.riskProfile.id - 1]['icon'];

    // #this.router.events
    //   .pipe(filter((event) => event instanceof NavigationEnd))
    //   .subscribe(({ urlAfterRedirects }: NavigationEnd) => {
    //     // dismiss all bootstrap modal dialog
    //     this.activeModal.dismiss();
    //   });
    this.portfolioNameFormGroup = this.formBuilder.group({
      portfolioNaming: new FormControl(this.portfolio.riskProfile.name,
         [Validators.required, Validators.pattern(RegexConstants.AlphanumericWithSymbol)])
    });
  }
  portfolioName(value) {
    this.createdPortfolioName.emit(value);
    this.activeModal.close();
  }
  onKey(event) {
    this.characterLength = event.currentTarget.value.length;
    }
  getInlineErrorStatus(control) {
    return !control.pristine && !control.valid;
  }
  getDefaultPortfolioName() {
    const defaultPortfolioName = this.portfolio.riskProfile.type;
    return 'Suggestion:' + defaultPortfolioName + ' Portfolio';
  }

}
