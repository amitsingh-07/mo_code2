import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';

import { ComprehensiveRoutingModule } from './comprehensive-routing.module';
import { ComprehensiveStepsComponent } from './comprehensive-steps/comprehensive-steps.component';
import { ComprehensiveComponent } from './comprehensive/comprehensive.component';

import { DependantEducationListComponent } from './dependant-education-list/dependant-education-list.component';
import { DependantEducationComponent } from './dependant-education/dependant-education.component';
import { DependantSelectionComponent } from './dependant-selection/dependant-selection.component';
import { DependantsDetailsComponent } from './dependants-details/dependants-details.component';
import { EducationPreferenceComponent } from './education-preference/education-preference.component';
import { MyEarningsComponent } from './my-earnings/my-earnings.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
export function createTranslateLoader(http: HttpClient) {
  return new MultiTranslateHttpLoader(
    http,
    [
      { prefix: './assets/i18n/app/', suffix: '.json' },
      { prefix: './assets/i18n/comprehensive/', suffix: '.json' },
      { prefix: './assets/i18n/error/', suffix: '.json' }
    ]);
}

@NgModule({
  imports: [
    CommonModule, ReactiveFormsModule, NgbModule.forRoot(),
    ComprehensiveRoutingModule,
    NgbModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  declarations: [ComprehensiveComponent, ComprehensiveStepsComponent,
    DependantSelectionComponent, DependantsDetailsComponent, DependantEducationComponent,
    DependantEducationListComponent,
    EducationPreferenceComponent,
    MyEarningsComponent,
    MyProfileComponent]
})
export class ComprehensiveModule { }
