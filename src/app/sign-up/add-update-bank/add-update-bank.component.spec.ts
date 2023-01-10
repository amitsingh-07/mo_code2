import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateBankComponent } from './add-update-bank.component';

describe('AddUpdateBankComponent', () => {
  let component: AddUpdateBankComponent;
  let fixture: ComponentFixture<AddUpdateBankComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddUpdateBankComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
