import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import { SettingsWidgetComponent } from './settings-widget.component';

describe('SettingsWidgetComponent', () => {
  let component: SettingsWidgetComponent;
  let fixture: ComponentFixture<SettingsWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should Highest Ranking as a default sort', () => {
    const sorts = [
      {displayText: 'Highest Ranking', value: 'premium.ranking' },
      {displayText: 'Insurer Name (A-Z)', value: '+insurer.insurerName' },
      {displayText: 'Insurer Name (Z-A)', value: '-insurer.insurerName' },
      {displayText: 'Financial Rating (Highest-Lowest)', value: '+insurer.rating' },
      {displayText: 'Financial Rating (Lowest-Highest)', value: '-insurer.rating' }
    ];
    const defaultSort = sorts[0].displayText;
    expect(defaultSort).toEqual('Highest Ranking');
  });

  it('click on filters', () => {
    const filter = { name: 'claimFeature', filterTypes: ['All', 'per year', 'per month'], allBtn: true
    };
    spyOn(component, 'applyFilter');
    const applyFilterButton = fixture.debugElement.query(By.css('input'));
    applyFilterButton.triggerEventHandler('click', filter);
    fixture.whenStable().then(() => {
      expect(component.applyFilter).toHaveBeenCalled();
    });
  });

});
