import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalizeYourRetirementComponent } from './personalize-your-retirement.component';

describe('PersonalizeYourRetirementComponent', () => {
  let component: PersonalizeYourRetirementComponent;
  let fixture: ComponentFixture<PersonalizeYourRetirementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalizeYourRetirementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalizeYourRetirementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
