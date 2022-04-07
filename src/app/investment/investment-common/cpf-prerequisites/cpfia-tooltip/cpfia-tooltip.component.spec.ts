import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpfiaTooltipComponent } from './cpfia-tooltip.component';

describe('CpfiaTooltipComponent', () => {
  let component: CpfiaTooltipComponent;
  let fixture: ComponentFixture<CpfiaTooltipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpfiaTooltipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpfiaTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
