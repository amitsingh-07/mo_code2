import { LoggerService } from './shared/logger/logger.service';
import { ConsoleLoggerService } from './shared/logger/console-logger.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [{provide: LoggerService, useClass: ConsoleLoggerService}],
  bootstrap: [AppComponent]
})
export class AppModule { }
