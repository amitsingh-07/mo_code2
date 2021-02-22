import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoCodeListComponent } from './promo-code-list.component';

describe('PromoCodeListComponent', () => {
  let component: PromoCodeListComponent;
  let fixture: ComponentFixture<PromoCodeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromoCodeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromoCodeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
