import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeStaticPageComponent } from './welcome-static-page.component';

describe('WelcomeStaticPageComponent', () => {
  let component: WelcomeStaticPageComponent;
  let fixture: ComponentFixture<WelcomeStaticPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WelcomeStaticPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeStaticPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
