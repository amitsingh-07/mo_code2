import { HttpClient } from '@angular/common/http';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';

import { AppModule } from '../../app.module';

export function CustomTranslateLoader(moduleName: string) {
    const http = AppModule.injector.get(HttpClient);
    return new MultiTranslateHttpLoader(
        http,
        [
            { prefix: './assets/i18n/app/', suffix: '.json' },
            { prefix: './assets/i18n/' + moduleName + '/', suffix: '.json' },
        ]);
}
