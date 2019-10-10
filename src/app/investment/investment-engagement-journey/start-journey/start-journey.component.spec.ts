import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartJourneyComponent } from './start-journey.component';

describe('StartJourneyComponent', () => {
  let component: StartJourneyComponent;
  let fixture: ComponentFixture<StartJourneyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartJourneyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartJourneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
