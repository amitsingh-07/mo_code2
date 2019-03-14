import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { IMySummaryModal } from '../comprehensive-types';
import { ConfigService } from './../../config/config.service';
import { NavbarService } from './../../shared/navbar/navbar.service';
import { ComprehensiveService } from './../comprehensive.service';

@Component({
  selector: 'app-dependant-selection',
  templateUrl: './dependant-selection.component.html',
  styleUrls: ['./dependant-selection.component.scss']
})
export class DependantSelectionComponent implements OnInit, OnDestroy {
  pageTitle: string;
  dependantSelectionForm: FormGroup;
  pageId: string;
  hasDependant: boolean;
  menuClickSubscription: Subscription;
  summaryModalDetails: IMySummaryModal;
  constructor(
    private cmpService: ComprehensiveService,
    private route: ActivatedRoute, private router: Router, public navbarService: NavbarService,
    private translate: TranslateService, private configService: ConfigService) {
    this.pageId = this.route.routeConfig.component.name;

    this.hasDependant = this.cmpService.hasDependant();

    this.configService.getConfig().subscribe((config: any) => {
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
      this.translate.get(config.common).subscribe((result: string) => {
        // meta tag and title
        this.pageTitle = this.translate.instant('CMP.COMPREHENSIVE_STEPS.STEP_1_TITLE');
        this.setPageTitle(this.pageTitle);

      });
    });
  }
  ngOnInit() {
    this.navbarService.setNavbarComprehensive(true);
    this.menuClickSubscription = this.navbarService.onMenuItemClicked.subscribe((pageId) => {
      if (this.pageId === pageId) {
        alert('Menu Clicked');
      }
    });
    this.buildMyDependantSelectionForm();
  }

  ngOnDestroy() {
    this.navbarService.unsubscribeMenuItemClick();
    this.menuClickSubscription.unsubscribe();
  }

  setPageTitle(title: string) {
    this.navbarService.setPageTitleWithIcon(title, { id: this.pageId, iconClass: 'navbar__menuItem--journey-map' });
  }

  buildMyDependantSelectionForm() {
    this.dependantSelectionForm = new FormGroup({
      dependantSelection: new FormControl(this.hasDependant, Validators.required)
    });
  }

  goToNext(dependantSelectionForm) {
    this.cmpService.setDependantSelection(dependantSelectionForm.value.dependantSelection);
    if (dependantSelectionForm.value.dependantSelection === 'true') {
      this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_DETAILS]);
    } else {
      const childrenEducationNonDependantModal = this.translate.instant('CMP.MODAL.CHILDREN_EDUCATION_MODAL.NO_DEPENDANTS');
      this.summaryModalDetails = { setTemplateModal: 1, dependantModelSel: false,
        contentObj: childrenEducationNonDependantModal, nonDependantDetails:
        this.translate.instant('CMP.MODAL.CHILDREN_EDUCATION_MODAL.NO_DEPENDANTS.NO_DEPENDANT'),
        nextPageURL: (COMPREHENSIVE_ROUTE_PATHS.STEPS) + '/2' };
      this.cmpService.openSummaryPopUpModal(this.summaryModalDetails);

    }

  }

}
