import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpfiaSuccessModalComponent } from './cpfia-success-modal.component';

describe('CpfiaSuccessModalComponent', () => {
  let component: CpfiaSuccessModalComponent;
  let fixture: ComponentFixture<CpfiaSuccessModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CpfiaSuccessModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpfiaSuccessModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
