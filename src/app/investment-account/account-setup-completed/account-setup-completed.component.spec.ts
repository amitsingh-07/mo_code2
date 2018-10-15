import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSetupCompletedComponent } from './account-setup-completed.component';

describe('AccountSetupCompletedComponent', () => {
  let component: AccountSetupCompletedComponent;
  let fixture: ComponentFixture<AccountSetupCompletedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountSetupCompletedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountSetupCompletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
