import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OcpDisabilityComponent } from './ocp-disability.component';

describe('OcpDisabilityComponent', () => {
  let component: OcpDisabilityComponent;
  let fixture: ComponentFixture<OcpDisabilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OcpDisabilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OcpDisabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render Occupational Disability title in a h2', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h2').textContent).toContain('Occupational Disability');
  }));
  it('should render Occupational Disability description in a h6', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    // tslint:disable-next-line:max-line-length
    expect(compiled.querySelector('h6').textContent).toContain('This coverage is especially crucial in the early to mid-phase of work life as any disability affecting your ability to work would drastically affect your goal to be financially independent.');
  }));
  it('testing the Retirement Age dropdown', async(() => {
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
  it('testing the Employee dropdown', async(() => {
    spyOn(component, 'selectEmployeeType');
    const dropdownButton = fixture.debugElement.nativeElement.querySelector('#dropdownBasic1 button');
    const dropdownItem = fixture.debugElement.nativeElement.querySelector('.dropdown-item');
    dropdownButton.click();
    fixture.whenStable().then(() => {
      dropdownItem.click();
      fixture.whenStable().then(() => {
        expect(component.selectEmployeeType).toHaveBeenCalled();
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
