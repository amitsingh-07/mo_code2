import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { FooterService } from '../../shared/footer/footer.service';
import { NavbarService } from '../../shared/navbar/navbar.service';
import { SignUpService } from '../sign-up.service';

@Component({
  selector: 'app-corp-biz-signup-with-data',
  templateUrl: './corp-biz-signup-with-data.component.html',
  styleUrls: ['./corp-biz-signup-with-data.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CorpBizSignupWithDataComponent implements OnInit {

  corpBizMyInfoData: any;
  constructor(
    private modal: NgbModal,
    private router: Router,
    public navbarService: NavbarService,
    public footerService: FooterService,
    public readonly translate: TranslateService,
    private signUpService: SignUpService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
    });
    this.corpBizMyInfoData = {"fullName":"AMINA ABDUL RAHMAN","nricNumber":"M3456768Q","email":"myinfotesting@gmail.com","mobileNumber":"96499899","dob":{"year":1983,"month":3,"day":26},"gender":"female","isMyInfoEnabled":true,"disableAttributes":["fullName","nricNumber","dob","gender","fullName","nricNumber","dob","gender"]};
    // this.corpBizMyInfoData = signUpService.getAccountInfo();
  }

  ngOnInit(): void {
  }

  goToNext() {
    
  }
}
