import { CommonModule, CurrencyPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { jqxSliderComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxslider';
import { NouisliderModule } from 'ng2-nouislider';

import { SharedModule } from '../shared/shared.module';
import { CurrencyInputDirective } from './../shared/directives/currency-input.directive';
import { GuideMeRoutingModule } from './/guide-me-routing.module';
import { CiAssessmentComponent } from './ci-assessment/ci-assessment.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { FinAssessmentComponent } from './fin-assessment/fin-assessment.component';
import { GetStartedFormComponent } from './get-started/get-started-form/get-started-form.component';
import { GetStartedComponent } from './get-started/get-started.component';
import { IncomeComponent } from './income/income.component';
import { InsureAssessmentComponent } from './insure-assessment/insure-assessment.component';
import { LiabilitiesComponent } from './liabilities/liabilities.component';
import { MyAssetsComponent } from './my-assets/my-assets.component';
import { ProfileComponent } from './profile/profile.component';
import { ProtectionNeedsComponent } from './protection-needs/protection-needs.component';
import { LtcAssessmentComponent } from './ltc-assessment/ltc-assessment.component';

@NgModule({
  imports: [
    CommonModule, GuideMeRoutingModule, ReactiveFormsModule, NgbModule.forRoot(),
    TranslateModule.forChild(SharedModule.getTranslateConfig('guide-me')),
    NouisliderModule,
    FormsModule
  ],
  declarations: [
    ProfileComponent,
    GetStartedComponent,
    GetStartedFormComponent,
    ProtectionNeedsComponent,
    IncomeComponent,
    ExpensesComponent,
    MyAssetsComponent,
    LiabilitiesComponent,
    CurrencyInputDirective,
    jqxSliderComponent,
    FinAssessmentComponent,
    InsureAssessmentComponent,
    CiAssessmentComponent,
    LtcAssessmentComponent
  ],
  providers: [CurrencyPipe]
})
export class GuideMeModule { }
