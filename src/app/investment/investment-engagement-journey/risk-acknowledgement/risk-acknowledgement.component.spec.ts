import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskAcknowledgementComponent } from './risk-acknowledgement.component';

describe('RiskAcknowledgementComponent', () => {
  let component: RiskAcknowledgementComponent;
  let fixture: ComponentFixture<RiskAcknowledgementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskAcknowledgementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskAcknowledgementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
