import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideMeService } from '../guide-me.service';
import { InsuranceResultsComponent } from './insurance-results.component';

describe('InsuranceResultsComponent', () => {
  let component: InsuranceResultsComponent;
  let fixture: ComponentFixture<InsuranceResultsComponent>;
  let guideMeService: GuideMeService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsuranceResultsComponent ]
    })
    .compileComponents();
    guideMeService = TestBed.get(GuideMeService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Testing the add Existing covarage', async(() => {
    spyOn(component, 'openExistingCovarageModal');
    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    fixture.whenStable().then(() => {
      expect(component.goToNext).toHaveBeenCalled();
    });
  }));
});
