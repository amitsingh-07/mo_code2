import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateYourWillComponent } from './validate-your-will.component';

describe('ValidateYourWillComponent', () => {
  let component: ValidateYourWillComponent;
  let fixture: ComponentFixture<ValidateYourWillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidateYourWillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateYourWillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
