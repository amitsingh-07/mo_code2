import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { COMPREHENSIVE_ROUTE_PATHS } from '../comprehensive-routes.constants';
import { ConfigService } from './../../config/config.service';
import { NavbarService } from './../../shared/navbar/navbar.service';

@Component({
  selector: 'app-dependant-selection',
  templateUrl: './dependant-selection.component.html',
  styleUrls: ['./dependant-selection.component.scss']
})
export class DependantSelectionComponent implements OnInit {
  pageTitle: string;
  dependantSelectionForm: FormGroup;
  constructor(private route: ActivatedRoute, private router: Router, public navbarService: NavbarService,
              private translate: TranslateService, private configService: ConfigService) {
    this.configService.getConfig().subscribe((config: any) => {
      this.translate.setDefaultLang(config.language);
      this.translate.use(config.language);
      this.translate.get(config.common).subscribe((result: string) => {
        // meta tag and title
        this.pageTitle = this.translate.instant('DEPENDANT_DETAILS.TITLE');

      });
    });
  }

  ngOnInit() {

    this.navbarService.setNavbarDirectGuided(true);
    this.dependantSelectionForm = new FormGroup({
      dependantSelection: new FormControl('', Validators.required)
    });
  }
  goToNext(dependantSelectionForm) {
    if ( dependantSelectionForm.value.dependantSelection === 'dependantYes') {
      this.router.navigate([COMPREHENSIVE_ROUTE_PATHS.DEPENDANT_DETAILS]);
    }

  }

}
