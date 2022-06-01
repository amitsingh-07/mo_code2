import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-create-account-myinfo-modal',
  templateUrl: './create-account-myinfo-modal.component.html',
  styleUrls: ['./create-account-myinfo-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreateAccountMyinfoModalComponent implements OnInit {

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    public readonly translate: TranslateService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
    });
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(({ urlAfterRedirects }: NavigationEnd) => {
        // dismiss all bootstrap modal dialog
        this.activeModal.dismiss();
      });
  }

}
