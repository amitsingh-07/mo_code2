import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferWithdrawalModalComponent } from './transfer-withdrawal-modal.component';

describe('TransferWithdrawalModalComponent', () => {
  let component: TransferWithdrawalModalComponent;
  let fixture: ComponentFixture<TransferWithdrawalModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferWithdrawalModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferWithdrawalModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
