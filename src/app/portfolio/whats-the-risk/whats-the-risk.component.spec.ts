import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsTheRiskComponent } from './whats-the-risk.component';

describe('WhatsTheRiskComponent', () => {
  let component: WhatsTheRiskComponent;
  let fixture: ComponentFixture<WhatsTheRiskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhatsTheRiskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhatsTheRiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
