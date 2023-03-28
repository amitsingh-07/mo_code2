import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ToolTipModalComponent } from './tooltip-modal.component';

describe('TooltipModalComponent', () => {
  let component: ToolTipModalComponent;
  let fixture: ComponentFixture<ToolTipModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolTipModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolTipModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
