import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideMeService } from '../../guide-me.service';
import { ExistingCoverageModalComponent } from './existing-coverage-modal.component';

describe('ExistingCoverageModalComponent', () => {
  let component: ExistingCoverageModalComponent;
  let fixture: ComponentFixture<ExistingCoverageModalComponent>;
  let guideMeService: GuideMeService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExistingCoverageModalComponent ]
    })
    .compileComponents();
    guideMeService = TestBed.bind(GuideMeService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExistingCoverageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('life protection field validity', () => {
    const life_protection = component.existingCoverageForm.controls['LIFE_PROTECTION'];
    expect(life_protection.valid).toBeFalsy();
  });

  it('life protection field validity', () => {
    const life_protection = component.existingCoverageForm.controls['CRITICAL_ILLNESS'];
    expect(life_protection.valid).toBeFalsy();
  });

  it('life protection field validity', () => {
    const occupational = component.existingCoverageForm.controls['OCCUPATION_DISABILITY'];
    expect(life_protection.valid).toBeFalsy();
  });

  it('life protection field validity', () => {
    const life_protection = component.existingCoverageForm.controls['LONG_TERM_CARE'];
    expect(life_protection.valid).toBeFalsy();
  });

});
