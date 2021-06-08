import { filter } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-referee',
  templateUrl: './referee.component.html',
  styleUrls: ['./referee.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class RefereeComponent implements OnInit {
  @Input() refereeInfo;
  @Input() cardCategory;
  @Output() closeAction = new EventEmitter<any>();
  @Output() comprehensiveAction = new EventEmitter<any>();
  @Output() investmentAction = new EventEmitter<any>();
  @Output() insuranceAction = new EventEmitter<any>();
  isActive = false;

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
  }

  closeIconAction() {
    this.closeAction.emit();
    this.activeModal.close();
  }

  comprehensive() {
    this.comprehensiveAction.emit();
    this.activeModal.close();
  }

  investment() {
    this.investmentAction.emit();
    this.activeModal.close()

  }
  insurance() {
    this.insuranceAction.emit();
    this.activeModal.close();
  }

  toggleDetails() {
    this.isActive = !this.isActive;
  }
}

