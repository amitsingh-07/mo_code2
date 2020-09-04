import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';

import { CheckoutComponent } from './checkout/checkout.component';
import { PaymentModalComponent } from './payment-modal/payment-modal.component';
import { PaymentRoutingModule } from './payment-routing.module';
import { PaymentStatusComponent } from './payment-status/payment-status.component';

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
        PaymentRoutingModule,
        NgbModule,
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
        CheckoutComponent,
        PaymentStatusComponent,
        PaymentModalComponent
    ],
    entryComponents: [PaymentModalComponent],
    providers: []
})

export class PaymentModule { }
