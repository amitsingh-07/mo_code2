import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBankModalComponent } from './add-bank-modal.component';

describe('AddBankModalComponent', () => {
  let component: AddBankModalComponent;
  let fixture: ComponentFixture<AddBankModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddBankModalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBankModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
