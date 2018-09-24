import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { HeaderService } from './../shared/header/header.service';
import { DirectService } from './direct.service';

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { IPageComponent } from './../shared/interfaces/page-component.interface';
import { ProductInfoComponent } from './product-info/product-info.component';

@Component({
  selector: 'app-direct',
  templateUrl: './direct.component.html',
  styleUrls: ['./direct.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class DirectComponent implements OnInit, IPageComponent {
  modalFreeze: boolean;
  pageTitle: string;
  constructor(
    private router: Router, public headerService: HeaderService,
    private directService: DirectService, private translate: TranslateService,
    public modal: NgbModal, private route: ActivatedRoute ) {
      this.translate.use('en');
      this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('PROFILE.TITLE');
      this.setPageTitle(this.pageTitle, null, false);
      });
      this.directService.modalFreezeCheck.subscribe((freezeCheck) => this.modalFreeze = freezeCheck);
      this.showProductInfo();
    }

  ngOnInit() { }

  setPageTitle(title: string, subTitle?: string, helpIcon?) {
    this.headerService.setPageTitle(title, null, helpIcon);
  }

  setProdInfoBtnVisibility(isVisible: boolean) {
    this.headerService.setProdButtonVisibility(isVisible);
  }

  showProductInfo() {
    console.log('Show Product Info');
  }

  searchPlans() {
  }
}
