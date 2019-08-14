import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskWillingnessComponent } from './risk-willingness.component';

describe('RiskWillingnessComponent', () => {
  let component: RiskWillingnessComponent;
  let fixture: ComponentFixture<RiskWillingnessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskWillingnessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskWillingnessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
