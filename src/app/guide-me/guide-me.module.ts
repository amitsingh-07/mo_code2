import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GuideMeRoutingModule } from './/guide-me-routing.module';
import { GetStartedFormComponent } from './get-started/get-started-form/get-started-form.component';
import { GetStartedComponent } from './get-started/get-started.component';
import { ProfileComponent } from './profile/profile.component';
import { ProtectionNeedsComponent } from './protection-needs/protection-needs.component';
import { IncomeComponent } from './income/income.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { AssetsComponent } from './assets/assets.component';
import { LiabilitiesComponent } from './liabilities/liabilities.component';

@NgModule({
  imports: [CommonModule, GuideMeRoutingModule, ReactiveFormsModule, NgbModule.forRoot() ],
  declarations: [ProfileComponent, GetStartedComponent, GetStartedFormComponent, ProtectionNeedsComponent, IncomeComponent, ExpensesComponent, AssetsComponent, LiabilitiesComponent]
})
export class GuideMeModule {}
