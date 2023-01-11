import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LoginCreateAccountModelComponent } from './login-create-account-model.component';

describe('LoginCreateAccountModelComponent', () => {
  let component: LoginCreateAccountModelComponent;
  let fixture: ComponentFixture<LoginCreateAccountModelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginCreateAccountModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginCreateAccountModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
