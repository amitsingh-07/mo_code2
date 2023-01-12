import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';

import { SharedModule } from '../shared/shared.module';
import { SingPassComponent } from './singpass.component';
import { SingpassModalComponent } from './singpass-modal/singpass-modal.component';

export function createTranslateLoader(http: HttpClient) {
    return new MultiTranslateHttpLoader(
        http,
        [
            { prefix: './assets/i18n/app/', suffix: '.json' },
            { prefix: './assets/i18n/sign-up/', suffix: '.json' }
        ]);
}

@NgModule({
    imports: [
        CommonModule,
        NgbModule,
        SharedModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        })
    ],
    exports: [SingPassComponent],
    declarations: [
        SingPassComponent,
        SingpassModalComponent
    ],
    entryComponents: [],
    providers: []
})

export class SingPassModule { }
