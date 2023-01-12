import { filter } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-singpass-modal',
  templateUrl: './singpass-modal.component.html',
  styleUrls: ['./singpass-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SingpassModalComponent implements OnInit {
  @Input() title: any;
  @Input() msgOne: any;
  @Input() msgTwo: any;
  @Input() primaryActionLabel: any;
  @Output() primaryAction = new EventEmitter<any>();

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    public readonly translate: TranslateService) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
    });
  }

  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(({ urlAfterRedirects }: NavigationEnd) => {
        this.activeModal.dismiss();
      });
  }

  primaryActionSelected() {
    this.primaryAction.emit();
    this.activeModal.close();
  }

  navigate(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.activeModal.close();
    this.router.navigate(['/accounts/sign-up']);
  }

}
