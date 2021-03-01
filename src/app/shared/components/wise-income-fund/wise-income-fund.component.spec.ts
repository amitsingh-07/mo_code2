import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WiseIncomeFundComponent } from './wise-income-fund.component';

describe('WiseIncomeFundComponent', () => {
  let component: WiseIncomeFundComponent;
  let fixture: ComponentFixture<WiseIncomeFundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WiseIncomeFundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WiseIncomeFundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
