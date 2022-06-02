import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { FooterService } from '../../shared/footer/footer.service';
import { NavbarService } from '../../shared/navbar/navbar.service';

@Component({
  selector: 'app-corp-biz-signup-with-data',
  templateUrl: './corp-biz-signup-with-data.component.html',
  styleUrls: ['./corp-biz-signup-with-data.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CorpBizSignupWithDataComponent implements OnInit {

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
}
