import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from './../shared/shared.module';

import { DirectResultsComponent } from './direct-results/direct-results.component';
import { DirectRoutingModule } from './direct-routing.module';
import { DirectComponent } from './direct.component';
import { ProductCategoryComponent } from './product-info/product-category/product-category.component';
import { ProductInfoComponent } from './product-info/product-info.component';

import { CriticalIllnessFormComponent } from './product-info/critical-illness-form/critical-illness-form.component';
import { LifeProtectionFormComponent } from './product-info/life-protection-form/life-protection-form.component';

@NgModule({
  imports: [
    CommonModule,
    DirectRoutingModule, NgbModule.forRoot(),
    TranslateModule.forChild(SharedModule.getTranslateConfig('direct')),
  ],
  declarations: [
    DirectResultsComponent, DirectComponent,
    ProductInfoComponent, ProductCategoryComponent,
    LifeProtectionFormComponent, CriticalIllnessFormComponent]
})
export class DirectModule { }
