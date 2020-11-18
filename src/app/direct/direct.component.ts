import { Location } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  OnInit,
  Type,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
  ComponentRef,
  ChangeDetectorRef 
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, SubscriptionLike } from 'rxjs';

import { appConstants } from './../app.constants';
import { AppService } from './../app.service';
import { FooterService } from './../shared/footer/footer.service';
import { IPageComponent } from './../shared/interfaces/page-component.interface';
import { NavbarService } from './../shared/navbar/navbar.service';
import { SelectedPlansService } from './../shared/Services/selected-plans.service';
import { SeoServiceService } from './../shared/Services/seo-service.service';
import { StateStoreService } from './../shared/Services/state-store.service';
import { DirectResultsComponent } from './direct-results/direct-results.component';
import { DirectService } from './direct.service';
import { DirectState } from './direct.state';

const mobileThreshold = 567;

@Component({
  selector: 'app-direct',
  templateUrl: './direct.component.html',
  styleUrls: ['./direct.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class DirectComponent implements OnInit, AfterViewInit, IPageComponent, OnDestroy {
  @ViewChild('directResults', { read: ViewContainerRef }) container: ViewContainerRef;
  componentRef: ComponentRef<any>;
  pageTitle: string;

  routeSubscription: Subscription;
  locationSubscription: SubscriptionLike;
  state: DirectState = new DirectState();
  componentName: string;
  components = [];

  constructor(
    private router: Router, public navbarService: NavbarService,
    public footerService: FooterService, private directService: DirectService, private translate: TranslateService,
    public modal: NgbModal, private route: ActivatedRoute,
    private factoryResolver: ComponentFactoryResolver, private appService: AppService,
    private planService: SelectedPlansService, private stateStoreService: StateStoreService,
    private location: Location, private seoService: SeoServiceService, private changeDetector: ChangeDetectorRef) {

    /* ************** STATE HANDLING - START ***************** */
    this.componentName = DirectComponent.name;

    this.routeSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart && event.url !== '/direct') {
        this.stateStoreService.saveState(this.componentName, this.state);
      } else if (event instanceof NavigationEnd) {
        const url = this.router.parseUrl(event.url);
        const fragmentIndex = this.directService.resolveProductCategoryIndex(url.fragment);
        this.directService.setProdCategoryIndex(fragmentIndex);
      }
    });
    if (this.stateStoreService.has(this.componentName)) {
      this.state = this.stateStoreService.getState(this.componentName);
    } else {
      this.state = new DirectState();
    }

    this.locationSubscription = this.location.subscribe((popStateEvent: PopStateEvent) => {
      if (popStateEvent.type === 'popstate') {
        const eventSubscription = this.router.events.subscribe((event) => {
          if (event instanceof NavigationEnd && event.url === '/home') {
            this.stateStoreService.clearState(this.componentName);
            this.directService.setSelectedPlans([]);
            eventSubscription.unsubscribe();
          }
        });
      }
    });
    /* ************** STATE HANDLING - END ***************** */

    this.state.modalFreeze = false;
    if (window.innerWidth < mobileThreshold) {
      this.state.isMobileView = true;
    } else {
      this.state.isMobileView = false;
    }
    this.appService.setJourneyType(appConstants.JOURNEY_TYPE_DIRECT);
    this.translate.use('en');
    this.translate.get('COMMON').subscribe((result: string) => {
      this.pageTitle = this.translate.instant('PROFILE.TITLE');
      this.setPageTitle(this.pageTitle, null, false);
      this.directService.setModalFreeze(false);
      // Meta Tag and Title Methods
      this.seoService.setTitle(this.translate.instant('DIRECT_GET_STARTED.META.META_TITLE'));
      this.seoService.setBaseSocialMetaTags(this.translate.instant('DIRECT_GET_STARTED.META.META_TITLE'),
        this.translate.instant('DIRECT_GET_STARTED.META.META_DESCRIPTION'),
        this.translate.instant('DIRECT_GET_STARTED.META.META_KEYWORDS'));
    });
    this.directService.modalFreezeCheck.subscribe((freezeCheck) => this.state.modalFreeze = freezeCheck);
    this.showProductInfo();

    this.navbarService.unsubscribeBackPress();
    this.navbarService.setNavbarDirectGuided(true);
    this.footerService.setFooterVisibility(false);
    this.removeComponent(DirectResultsComponent);
  }

  ngOnInit() {
    const selectedPlans = this.planService.getSelectedPlan();
    const selectedComparePlans = this.directService.getSelectedPlans();
    if ((selectedPlans && selectedPlans.enquiryId) ||
      (selectedComparePlans && selectedComparePlans.hasOwnProperty('length') && selectedComparePlans.length > 0)) {
      if (this.state.isMobileView) {
        this.directService.setModalFreeze(true);
      }
      this.state.hideForm = true;
    }
  }

  ngAfterViewInit() {
    const selectedPlans = this.planService.getSelectedPlan();
    const selectedComparePlans = this.directService.getSelectedPlans();
    if ((selectedPlans && selectedPlans.enquiryId) ||
      (selectedComparePlans && selectedComparePlans.hasOwnProperty('length') && selectedComparePlans.length > 0)) {
      this.formSubmitCallback();
    }
    this.changeDetector.detectChanges();
  }

  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
    }

    if (this.routeSubscription instanceof Subscription) {
      this.routeSubscription.unsubscribe();
    }

    try {
      this.locationSubscription.unsubscribe();
    } catch (e) {

    }

  }

  setPageTitle(title: string, subTitle?: string, helpIcon?) {
    this.navbarService.setPageTitle(title, subTitle, helpIcon);
  }

  setProdInfoBtnVisibility(isVisible: boolean) {
    this.navbarService.setProdButtonVisibility(isVisible);
  }

  showProductInfo() {
  }

  formSubmitCallback() {
    this.state.showingResults = true;
    this.removeComponent(DirectResultsComponent);
    this.addComponent(DirectResultsComponent);
  }

  backPressed() {
    this.state.hideForm = false;
    this.navbarService.unsubscribeBackPress();
    this.state.showingResults = false;
    this.setPageTitle(this.pageTitle, null, false);
    this.removeComponent(DirectResultsComponent);
  }

  addComponent(componentClass: Type<any>) {
    // Create component dynamically inside the ng-template
    const componentFactory = this.factoryResolver.resolveComponentFactory(componentClass);
    this.componentRef = this.container.createComponent(componentFactory);
    this.componentRef.instance.isMobileView = this.state.isMobileView;
    this.componentRef.changeDetectorRef.detectChanges();
    // Push the component so that we can keep track of which components are created
    this.components.push(this.componentRef);
  }

  removeComponent(componentClass: Type<any>) {
    // Find the component
    const componentIndex = this.components.indexOf(this.componentRef);
    if (componentIndex !== -1) {
      // Remove component from both view and array
      this.componentRef.destroy();
      this.components.splice(componentIndex, 1);
    }
  }
}
