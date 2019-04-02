import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountUpdatedComponent } from './account-updated.component';

describe('AccountUpdatedComponent', () => {
  let component: AccountUpdatedComponent;
  let fixture: ComponentFixture<AccountUpdatedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountUpdatedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountUpdatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
