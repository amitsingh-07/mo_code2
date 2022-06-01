import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { FooterService } from '../../shared/footer/footer.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { CreateAccountMyinfoModalComponent } from '../create-account-myinfo-modal/create-account-myinfo-modal.component';

@Component({
  selector: 'app-corp-biz-signup',
  templateUrl: './corp-biz-signup.component.html',
  styleUrls: ['./corp-biz-signup.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CorpBizSignupComponent implements OnInit {

  constructor(
    private modal: NgbModal,
    private router: Router,
    public navbarService: NavbarService,
    public footerService: FooterService,
    public readonly translate: TranslateService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
    });
  }

  ngOnInit(): void {
  }

  goToNext() {

  }

  openModal(){
    const ref = this.modal.open(CreateAccountMyinfoModalComponent, { centered: true });
    ref.componentInstance.primaryActionLabel = "Let’s go!";
  }
}
