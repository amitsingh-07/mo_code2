import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';

import { PromotionEnableGuard } from './promotion-enable-guard';
import { PromotionLandingComponent } from './promotion-landing/promotion-landing.component';
import { InsureLinkComponent } from './promotion-page/insure-link/insure-link.component';
import { PromotionPageComponent } from './promotion-page/promotion-page.component';
import { PromotionRoutingModule } from './promotion-routing.module';
import { BundleEnquiryComponent } from './promotion-page/bundle-enquiry/bundle-enquiry.component';

export function createTranslateLoader(http: HttpClient) {
    return new MultiTranslateHttpLoader(
        http,
        [
            { prefix: './assets/i18n/app/', suffix: '.json' },
            { prefix: './assets/i18n/promotions/', suffix: '.json' },
            { prefix: './assets/i18n/error/', suffix: '.json' }
        ]);
}

@NgModule({
    imports: [
        CommonModule,
        PromotionRoutingModule,
        NgbModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        })
    ],
    declarations: [
        PromotionLandingComponent,
        PromotionPageComponent,
        InsureLinkComponent,
        BundleEnquiryComponent,
    ],
    providers: [PromotionEnableGuard]
})

export class PromotionModule { }
