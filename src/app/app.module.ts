import 'hammerjs';

import { CurrencyPipe, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { Injector, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { jqxSliderComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxslider';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { appConstants } from './app.constants';
import { CallBackComponent } from './call-back/call-back.component';
import { HelpModalComponent } from './guide-me/help-modal/help-modal.component';
import {
  ExistingCoverageModalComponent
} from './guide-me/insurance-results/existing-coverage-modal/existing-coverage-modal.component';
import {
  RestrictAlphabetsDirective
} from './guide-me/insurance-results/existing-coverage-modal/restrict-alphabets.directive';
import {
  InsuranceResultModalComponent
} from './guide-me/insurance-results/insurance-result-modal/insurance-result-modal.component';
import {
  LifeProtectionModalComponent
} from './guide-me/life-protection/life-protection-form/life-protection-modal/life-protection-modal.component';
import { MobileModalComponent } from './guide-me/mobile-modal/mobile-modal.component';
import { CreateAccountModelComponent } from './guide-me/recommendations/create-account-model/create-account-model.component';
import { HammerConfig } from './hammer.config';
import { NumberOnlyDirective } from './shared/directives/number-only.directive';
import { HeaderComponent } from './shared/header/header.component';
import { AuthenticationService } from './shared/http/auth/authentication.service';
import { JwtInterceptor } from './shared/http/auth/jwt.interceptor';
import { CustomErrorHandlerService } from './shared/http/custom-error-handler.service';
import { RequestCache } from './shared/http/http-cache.service';
import { ConsoleLoggerService } from './shared/logger/console-logger.service';
import { LoggerService } from './shared/logger/logger.service';
import { ErrorModalComponent } from './shared/modal/error-modal/error-modal.component';
import { LoaderComponent } from './shared/modal/loader/loader.component';
import { ModelWithButtonComponent } from './shared/modal/model-with-button/model-with-button.component';
import { ToolTipModalComponent } from './shared/modal/tooltip-modal/tooltip-modal.component';
import { SharedModule } from './shared/shared.module';
import { Formatter } from './shared/utils/formatter.util';
import { SettingsWidgetComponent } from './shared/widgets/settings-widget/settings-widget.component';

export function createTranslateLoader(http: HttpClient) {
  return new MultiTranslateHttpLoader(
    http,
    [
      { prefix: './assets/i18n/app/', suffix: '.json' }
    ]);
}

export function tokenGetterFn() {
  return sessionStorage.getItem(appConstants.APP_JWT_TOKEN_KEY);
}

@NgModule({
  declarations: [
    AppComponent,
    HelpModalComponent,
    MobileModalComponent,
    LoaderComponent,
    ErrorModalComponent,
    ToolTipModalComponent,
    ModelWithButtonComponent,
    LifeProtectionModalComponent,
    InsuranceResultModalComponent,
    CreateAccountModelComponent,
    ExistingCoverageModalComponent,
    RestrictAlphabetsDirective,
    jqxSliderComponent,
    HeaderComponent,
    NumberOnlyDirective,
    CallBackComponent,
    SettingsWidgetComponent
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
    }),
    SharedModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetterFn
      }
    })
  ],
  providers: [NgbActiveModal, AuthenticationService, CustomErrorHandlerService, RequestCache,
    { provide: LoggerService, useClass: ConsoleLoggerService },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: HammerConfig
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
      deps: [AuthenticationService, RequestCache, CustomErrorHandlerService, Router]
    }, Formatter, CurrencyPipe],
  bootstrap: [AppComponent],
  entryComponents: [HelpModalComponent, LoaderComponent, ErrorModalComponent, ToolTipModalComponent, ModelWithButtonComponent,
    LifeProtectionModalComponent, MobileModalComponent,
    InsuranceResultModalComponent, CreateAccountModelComponent, ExistingCoverageModalComponent]
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
