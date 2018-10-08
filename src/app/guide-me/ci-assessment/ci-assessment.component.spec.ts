import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CiAssessmentComponent } from './ci-assessment.component';

describe('CiAssessmentComponent', () => {
  let component: CiAssessmentComponent;
  let fixture: ComponentFixture<CiAssessmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CiAssessmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CiAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render CIAssessment title in a h2', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h2').textContent).toContain('Critical Illness');
  }));
  it('should render CIAssessment description in a h6', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    // tslint:disable-next-line:max-line-length
    expect(compiled.querySelector('h6').textContent).toContain('This coverage replaces your income during recovery period (about 2-5 years) while you are unable to work. A person usually requires Critical Illness coverage till their intended retirement age.');
  }));
  it('testing the dropdown', async(() => {
    spyOn(component, 'selectRetirementAge');
    const dropdownButton = fixture.debugElement.nativeElement.querySelector('#RetirementAgeDropDown button');
    const dropdownItem = fixture.debugElement.nativeElement.querySelector('.dropdown-item');
    dropdownButton.click();
    fixture.whenStable().then(() => {
      dropdownItem.click();
      fixture.whenStable().then(() => {
        expect(component.selectRetirementAge).toHaveBeenCalled();
      });
    });
  }));
  it('testing the proceed button', async(() => {
    spyOn(component, 'goToNext');
    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    fixture.whenStable().then(() => {
      expect(component.goToNext).toHaveBeenCalled();
    });
  }));
});
