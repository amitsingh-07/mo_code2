import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountCreationErrorModalComponent } from './account-creation-error-modal.component';

describe('ErrorModalComponent', () => {
  let component: AccountCreationErrorModalComponent;
  let fixture: ComponentFixture<AccountCreationErrorModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccountCreationErrorModalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountCreationErrorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
