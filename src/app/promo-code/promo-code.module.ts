import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';

import { SharedModule } from '../shared/shared.module';
import { PromoCodeLandingComponent } from './promo-code-landing/promo-code-landing.component';
import { PromoCodeListComponent } from './promo-code-list/promo-code-list.component';
import { PromoDetailsComponent } from './promo-details/promo-details.component';
import { PromoCodeSelectComponent } from './promo-code-select/promo-code-select.component';
import { PromoCodeModalComponent } from './promo-code-modal/promo-code-modal.component';

// import { PaymentModalComponent } from './payment-modal/payment-modal.component';
import { PromoCodeRoutingModule } from './promo-code-routing.module';

export function createTranslateLoader(http: HttpClient) {
    return new MultiTranslateHttpLoader(
        http,
        [
            { prefix: './assets/i18n/app/', suffix: '.json' },
            { prefix: './assets/i18n/payment/', suffix: '.json' }
        ]);
}

@NgModule({
    imports: [
        CommonModule,
        PromoCodeRoutingModule,
        NgbModule,
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        })
    ],
    exports: [PromoCodeListComponent, PromoDetailsComponent, PromoCodeSelectComponent, PromoCodeModalComponent],
    declarations: [
        PromoCodeLandingComponent,
        PromoCodeListComponent,
        PromoDetailsComponent,
        PromoCodeSelectComponent,
        PromoCodeModalComponent
    ],
    entryComponents: [],
    providers: []
})

export class PromoCodeModule { }
