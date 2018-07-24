import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CurrencyInputDirective } from './../shared/directives/currency-input.directive';
import { GuideMeRoutingModule } from './/guide-me-routing.module';
import { AssetsComponent } from './assets/assets.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { GetStartedFormComponent } from './get-started/get-started-form/get-started-form.component';
import { GetStartedComponent } from './get-started/get-started.component';
import { IncomeComponent } from './income/income.component';
import { LiabilitiesComponent } from './liabilities/liabilities.component';
import { ProfileComponent } from './profile/profile.component';
import { ProtectionNeedsComponent } from './protection-needs/protection-needs.component';

@NgModule({
  imports: [CommonModule, GuideMeRoutingModule, ReactiveFormsModule, NgbModule.forRoot() ],
  declarations: [
    ProfileComponent,
    GetStartedComponent,
    GetStartedFormComponent,
    ProtectionNeedsComponent,
    IncomeComponent,
    ExpensesComponent,
    AssetsComponent,
    LiabilitiesComponent,
    CurrencyInputDirective
  ]
})
export class GuideMeModule {}
