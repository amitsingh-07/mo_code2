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

import { appConstants } from './../app.constants';
import { AppService } from './../app.service';
import { FooterService } from './../shared/footer/footer.service';
import { IPageComponent } from './../shared/interfaces/page-component.interface';
import { NavbarService } from './../shared/navbar/navbar.service';
import { DirectResultsComponent } from './direct-results/direct-results.component';
import { DirectService } from './direct.service';

const mobileThreshold = 567;

@Component({
  selector: 'app-direct',
  templateUrl: './direct.component.html',
  styleUrls: ['./direct.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class DirectComponent implements OnInit, IPageComponent {
  @ViewChild('directResults', { read: ViewContainerRef }) container: ViewContainerRef;
  components = [];

  isMobileView: boolean;
  modalFreeze: boolean;
  pageTitle: string;
  showingResults = false;

  constructor(
    private router: Router, public navbarService: NavbarService,
    public footerService: FooterService, private directService: DirectService, private translate: TranslateService,
    public modal: NgbModal, private route: ActivatedRoute,
    private factoryResolver: ComponentFactoryResolver, private appService: AppService) {
    this.appService.setJourneyType(appConstants.JOURNEY_TYPE_DIRECT);
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('PROFILE.TITLE');
      this.setPageTitle(this.pageTitle, null, false);
      this.directService.setModalFreeze(false);
    });
    this.directService.modalFreezeCheck.subscribe((freezeCheck) => this.modalFreeze = freezeCheck);
    this.showProductInfo();
  }

  ngOnInit() {
    this.navbarService.setNavbarDirectGuided(true);
    this.footerService.setFooterVisibility(false);
    if (window.innerWidth < mobileThreshold) {
      this.isMobileView = true;
    } else {
      this.isMobileView = false;
    }
  }

  setPageTitle(title: string, subTitle?: string, helpIcon?) {
    this.navbarService.setPageTitle(title, null, helpIcon);
  }

  setProdInfoBtnVisibility(isVisible: boolean) {
    this.navbarService.setProdButtonVisibility(isVisible);
  }

  showProductInfo() {
    console.log('Show Product Info');
  }

  formSubmitCallback() {
    this.showingResults = true;
    this.removeComponent(DirectResultsComponent);
    this.addComponent(DirectResultsComponent);
  }

  addComponent(componentClass: Type<any>) {
    // Create component dynamically inside the ng-template
    const componentFactory = this.factoryResolver.resolveComponentFactory(componentClass);
    const component = this.container.createComponent(componentFactory);
    component.instance.isMobileView = this.isMobileView;

    // Push the component so that we can keep track of which components are created
    this.components.push(component);
  }

  removeComponent(componentClass: Type<any>) {
    // Find the component
    const component = this.components.find((thisComponent) => thisComponent.instance instanceof componentClass);
    const componentIndex = this.components.indexOf(component);

    if (componentIndex !== -1) {
      // Remove component from both view and array
      this.container.remove(this.container.indexOf(component));
      this.components.splice(componentIndex, 1);
    }
  }

  closeEditMode() {
    this.directService.setModalFreeze(false);
  }
}
