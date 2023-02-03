import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TransferInstructionsModalComponent } from './transfer-instructions-modal.component';

describe('TransferInstructionsModalComponent', () => {
  let component: TransferInstructionsModalComponent;
  let fixture: ComponentFixture<TransferInstructionsModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferInstructionsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferInstructionsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
