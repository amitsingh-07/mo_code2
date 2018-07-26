import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { HeaderComponent } from './header/header.component';
import { LoaderComponent } from './modal/loader/loader.component';
import { CustomTranslateLoader } from './translate/custom-translate-loader';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [HeaderComponent, LoaderComponent, TranslateModule]
})
export class SharedModule {

  public static getTranslateConfig(moduleName: string) {
    return {
      loader: {
        provide: TranslateLoader,
        useFactory: (() => CustomTranslateLoader(moduleName)),
        deps: [HttpClient]
      },
      isolate: true
    };
  }
}
