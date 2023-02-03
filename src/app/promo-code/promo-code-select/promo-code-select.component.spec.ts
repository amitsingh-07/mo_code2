import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoCodeSelectComponent } from './promo-code-select.component';

describe('PromoCodeSelectComponent', () => {
  let component: PromoCodeSelectComponent;
  let fixture: ComponentFixture<PromoCodeSelectComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PromoCodeSelectComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromoCodeSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
