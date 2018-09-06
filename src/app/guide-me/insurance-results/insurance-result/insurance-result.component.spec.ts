import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideMeService } from '../../guide-me.service';
import { InsuranceResultComponent } from './insurance-result.component';

describe('InsuranceResultComponent', () => {
  let component: InsuranceResultComponent;
  let fixture: ComponentFixture<InsuranceResultComponent>;
  let guideMeService: GuideMeService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsuranceResultComponent ]
    })
    .compileComponents();
    guideMeService = TestBed.get(GuideMeService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('checking when the month is enabled', () => {
    expect(component.isMonthEnabled).toBeTruthy();
  });

  it('checking when the view Details button is Enabled', () => {
    expect(component.viewDetailsBtn).toBeFalsy();
  });

  it('Testing the View Details', async(() => {
    spyOn(component, 'viewDetails');
    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    fixture.whenStable().then(() => {
      expect(component.viewDetails).toHaveBeenCalled();
    });
  }));
});
