import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideMeService } from '../guide-me.service';
import { LiabilitiesComponent } from './liabilities.component';

describe('LiabilitiesComponent', () => {
  let component: LiabilitiesComponent;
  let fixture: ComponentFixture<LiabilitiesComponent>;
  let guideMeService: GuideMeService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiabilitiesComponent ]
    })
    .compileComponents();
    guideMeService = TestBed.bind(GuideMeService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiabilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('property lone field validity', () => {
    const property = component.liabilitiesForm.controls['propertyLoan'];
    expect(property.valid).toBeFalsy();
  });

  it('car lone field validity', () => {
    const car = component.liabilitiesForm.controls['carLoan'];
    expect(car.valid).toBeFalsy();
  });

  it('other lone field validity', () => {
    const other = component.liabilitiesForm.controls['otherLoan'];
    expect(other.valid).toBeFalsy();
  });

  it('testing the proceed button', async(() => {
    spyOn(component, 'goToNext');
    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    fixture.whenStable().then(() => {
      expect(component.goToNext).toHaveBeenCalled();
    });
  }));
});
