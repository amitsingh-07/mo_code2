import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordResultComponent } from './forgot-password-result.component';

describe('ForgotPasswordResultComponent', () => {
  let component: ForgotPasswordResultComponent;
  let fixture: ComponentFixture<ForgotPasswordResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgotPasswordResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
