import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialWellnessProgrammeComponent } from './financial-wellness-programme.component';

describe('FinancialWellnessProgrammeComponent', () => {
  let component: FinancialWellnessProgrammeComponent;
  let fixture: ComponentFixture<FinancialWellnessProgrammeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinancialWellnessProgrammeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialWellnessProgrammeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
