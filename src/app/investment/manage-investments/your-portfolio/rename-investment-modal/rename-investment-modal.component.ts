import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-rename-investment-modal',
  templateUrl: './rename-investment-modal.component.html',
  styleUrls: ['./rename-investment-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RenameInvestmentModalComponent implements OnInit {

  @Input() imgType = 1;
  @Input() userPortfolioName: string;
  @Input() showErrorMessage: boolean;
  @Input() warningIcon: any;
  @Input() lockIcon: any;
  @Output() renamePortfolioBtn = new EventEmitter<any>();
  renameForm: FormGroup;
  characterLength: number;

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    public readonly translate: TranslateService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
    });
  }

  ngOnInit() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(({ urlAfterRedirects }: NavigationEnd) => {
        this.activeModal.dismiss();
      });
    this.renameForm = new FormGroup({
      investName: new FormControl(this.userPortfolioName,
        [Validators.required])
    });
  }

  renamePortfolio(renameForm) {
    const portfolioTitleCase = renameForm.controls.investName.value.toLowerCase().split(' ')
      .map((name) => name.charAt(0).toUpperCase() + name.substring(1))
      .join(' ').trim().replace(/  +/g, ' ');
    this.renamePortfolioBtn.emit(portfolioTitleCase);
    this.activeModal.close();
  }

  showLength(event) {
    if (this.characterLength !== event.currentTarget.value.length) {
      this.showErrorMessage = false;
    }
    this.characterLength = event.currentTarget.value.length;
  }
}
