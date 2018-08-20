import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceResultModalComponent } from './insurance-result-modal.component';

describe('InsuranceResultModalComponent', () => {
  let component: InsuranceResultModalComponent;
  let fixture: ComponentFixture<InsuranceResultModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsuranceResultModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceResultModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
