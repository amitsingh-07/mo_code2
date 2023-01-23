import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoCodeLandingComponent } from './promo-code-landing.component';

describe('ProductDetailComponent', () => {
  let component: PromoCodeLandingComponent;
  let fixture: ComponentFixture<PromoCodeLandingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PromoCodeLandingComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromoCodeLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
