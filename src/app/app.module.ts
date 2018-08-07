import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injector, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HelpModalComponent } from './guide-me/help-modal/help-modal.component';
import {
  LifeProtectionModalComponent
} from './guide-me/life-protection/life-protection-form/life-protection-modal/life-protection-modal.component';
import { HeaderComponent } from './shared/header/header.component';
import { ConsoleLoggerService } from './shared/logger/console-logger.service';
import { LoggerService } from './shared/logger/logger.service';
import { ErrorModalComponent } from './shared/modal/error-modal/error-modal.component';
import { LoaderComponent } from './shared/modal/loader/loader.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/app/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HelpModalComponent,
    LoaderComponent,
    ErrorModalComponent,
    LifeProtectionModalComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    AppRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],

  providers: [NgbActiveModal, { provide: LoggerService, useClass: ConsoleLoggerService },
    { provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent],
  entryComponents: [HelpModalComponent, LoaderComponent, ErrorModalComponent, LifeProtectionModalComponent]
})

export class AppModule {
  /**
   * Allows for retrieving singletons using `AppModule.injector.get(MyService)`
   * This is good to prevent injecting the service as constructor parameter.
   */
  static injector: Injector;
  constructor(injector: Injector) {
    AppModule.injector = injector;
  }
}
