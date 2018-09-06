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

  it('critical Illness field validity', () => {
    const critical_illness = component.existingCoverageForm.controls['CRITICAL_ILLNESS'];
    expect(critical_illness.valid).toBeFalsy();
  });

  it('occupational disability field validity', () => {
    const occupational_disability = component.existingCoverageForm.controls['OCCUPATION_DISABILITY'];
    expect(occupational_disability.valid).toBeFalsy();
  });

  it('long term care field validity', () => {
    const long_Term_Care = component.existingCoverageForm.controls['LONG_TERM_CARE'];
    expect(long_Term_Care.valid).toBeFalsy();
  });

  it('testing the proceed button', async(() => {
    spyOn(component, 'save');
    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    fixture.whenStable().then(() => {
      expect(component.save).toHaveBeenCalled();
    });
  }));

});
