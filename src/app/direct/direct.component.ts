import {
  Component,
  ComponentFactoryResolver,
  OnInit,
  Type,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { HeaderService } from './../shared/header/header.service';
import { IPageComponent } from './../shared/interfaces/page-component.interface';
import { DirectResultsComponent } from './direct-results/direct-results.component';
import { DirectService } from './direct.service';

@Component({
  selector: 'app-direct',
  templateUrl: './direct.component.html',
  styleUrls: ['./direct.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class DirectComponent implements OnInit, IPageComponent {
  @ViewChild('directResults', { read: ViewContainerRef }) container: ViewContainerRef;
  components = [];

  modalFreeze: boolean;
  pageTitle: string;
  searchClicked = false;

  constructor(
    private router: Router, public headerService: HeaderService,
    private directService: DirectService, private translate: TranslateService,
    public modal: NgbModal, private route: ActivatedRoute,
    private factoryResolver: ComponentFactoryResolver) {
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

  formSubmitCallback() {
    this.addComponent(DirectResultsComponent);
  }

  addComponent(componentClass: Type<any>) {
    this.container.clear();
    // Create component dynamically inside the ng-template
    const componentFactory = this.factoryResolver.resolveComponentFactory(componentClass);
    this.container.createComponent(componentFactory);
  }
}
