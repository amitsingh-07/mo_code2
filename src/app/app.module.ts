import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Injector, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HelpModalComponent } from './guide-me/help-modal/help-modal.component';
import { HeaderComponent } from './shared/header/header.component';
import { ConsoleLoggerService } from './shared/logger/console-logger.service';
import { LoggerService } from './shared/logger/logger.service';
import { ErrorModalComponent } from './shared/modal/error-modal/error-modal.component';
import { LoaderComponent } from './shared/modal/loader/loader.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HelpModalComponent,
    LoaderComponent,
    ErrorModalComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    AppRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    HttpModule
  ],

  providers: [NgbActiveModal, { provide: LoggerService, useClass: ConsoleLoggerService },
              {provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent],
  entryComponents: [HelpModalComponent, LoaderComponent, ErrorModalComponent]
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
