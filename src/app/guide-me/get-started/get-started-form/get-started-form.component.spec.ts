import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetStartedFormComponent } from './get-started-form.component';

describe('GetStartedFormComponent', () => {
  let component: GetStartedFormComponent;
  let fixture: ComponentFixture<GetStartedFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetStartedFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetStartedFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
