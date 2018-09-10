import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CriticalIllnessFormComponent } from './critical-illness-form.component';

describe('CriticalIllnessFormComponent', () => {
  let component: CriticalIllnessFormComponent;
  let fixture: ComponentFixture<CriticalIllnessFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CriticalIllnessFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CriticalIllnessFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
