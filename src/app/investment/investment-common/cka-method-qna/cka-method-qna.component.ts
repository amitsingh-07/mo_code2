import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FooterService } from '../../../shared/footer/footer.service';
import { HeaderService } from '../../../shared/header/header.service';
import { NavbarService } from '../../../shared/navbar/navbar.service';

@Component({
  selector: 'app-cka-method-qna',
  templateUrl: './cka-method-qna.component.html',
  styleUrls: ['./cka-method-qna.component.scss']
})
export class CkaMethodQnaComponent implements OnInit {

  ckaMethodName: any;
  pageTitle: string;
  constructor(
    private route: ActivatedRoute,
    public headerService: HeaderService,
    public navbarService: NavbarService,
    public footerService: FooterService,
    public readonly translate: TranslateService
  ) {
    this.translate.use('en');
    this.translate.get('COMMON').subscribe(() => {
      this.pageTitle = this.translate.instant('CKA.CKA_PAGE_TITLE');
      this.setPageTitle(this.pageTitle);
    });
    this.route.paramMap.subscribe((params: any) => {
      if (params && params.methodname) {
        this.ckaMethodName = params.methodname;
      }
    });
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitle(title);
  }

  ngOnInit(): void {
  }

}
