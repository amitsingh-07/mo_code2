

import { RiskAcknowledgementComponent } from './risk-acknowledgement.component';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

describe('RiskAcknowledgementComponent', () => {
  let component: RiskAcknowledgementComponent;
  let fixture: ComponentFixture<RiskAcknowledgementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RiskAcknowledgementComponent]
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
