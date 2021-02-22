import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoCodeSelectComponent } from './promo-code-select.component';

describe('PromoCodeSelectComponent', () => {
  let component: PromoCodeSelectComponent;
  let fixture: ComponentFixture<PromoCodeSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromoCodeSelectComponent ]
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
