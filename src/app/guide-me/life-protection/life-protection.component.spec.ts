import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { createTranslateLoader } from '../../app.module';
import { LifeProtectionComponent } from './life-protection.component';

const TRANSLATIONS_APP_EN = require('../../../assets/i18n/app/en.json');
const TRANSLATIONS_GUIDE_ME_EN = require('../../../assets/i18n/guide-me/en.json');

fdescribe('LifeProtectionComponent', () => {
  let translate: TranslateService;
  let http: HttpTestingController;
  let component: LifeProtectionComponent;
  let fixture: ComponentFixture<LifeProtectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LifeProtectionComponent],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: createTranslateLoader,
            deps: [HttpClient]
          }
        })
      ],
      providers: [TranslateService]
    })
      .compileComponents();
    translate = TestBed.get(TranslateService);
    http = TestBed.get(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LifeProtectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fit('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load translations', async(() => {
    spyOn(translate, 'getBrowserLang').and.returnValue('en');
    const compiled = this.fixture.debugElement.nativeElement;

    // the DOM should be empty for now since the translations haven't been rendered yet
    expect(compiled.querySelector('h2').textContent).toEqual('');

    http.expectOne('../../../assets/i18n/app/en.json').flush(TRANSLATIONS_APP_EN);
    http.expectOne('../../../assets/i18n/guide-me/en.json').flush(TRANSLATIONS_GUIDE_ME_EN);

    // Finally, assert that there are no outstanding requests.
    http.verify();

    fixture.detectChanges();
    // the content should be translated to english now
    expect(compiled.querySelector('h2').textContent).toEqual(TRANSLATIONS_GUIDE_ME_EN.LIFE_PROTECTION.TITLE);

    // Finally, assert that there are no outstanding requests.
    http.verify();

    // the content has not changed yet
    expect(compiled.querySelector('h6').textContent).toEqual(TRANSLATIONS_GUIDE_ME_EN.LIFE_PROTECTION.DESCRIPTION);

    fixture.detectChanges();
  }));
});
