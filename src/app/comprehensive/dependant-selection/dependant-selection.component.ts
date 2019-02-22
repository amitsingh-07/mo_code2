import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { ConfigService } from './../../config/config.service';
import { NavbarService } from './../../shared/navbar/navbar.service';
import { ComprehensiveService } from './../comprehensive.service';

@Component({
  selector: 'app-dependant-selection',
  templateUrl: './dependant-selection.component.html',
  styleUrls: ['./dependant-selection.component.scss']
})
export class DependantSelectionComponent implements OnInit {
  pageTitle: string;
  dependantSelectionForm: FormGroup;
  pageId: string;
  hasDependant: string;

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
    this.navbarService.onMenuItemClicked.subscribe((pageId) => {
      if (this.pageId === pageId) {
        alert('Menu Clicked');
      }
    });
    this.buildMyDependantSelectionForm();
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
    if (dependantSelectionForm.value.dependantSelection === 'yes') {
      this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_DETAILS]);
    } else {

    }

  }

}
