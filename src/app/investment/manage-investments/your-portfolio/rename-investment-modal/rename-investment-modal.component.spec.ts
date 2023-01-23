import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenameInvestmentModalComponent } from './rename-investment-modal.component';

describe('RenameInvestmentModalComponent', () => {
  let component: RenameInvestmentModalComponent;
  let fixture: ComponentFixture<RenameInvestmentModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RenameInvestmentModalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenameInvestmentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
