import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SrsTooltipComponent } from './srs-tooltip.component';

describe('SrsTooltipComponent', () => {
  let component: SrsTooltipComponent;
  let fixture: ComponentFixture<SrsTooltipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SrsTooltipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SrsTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
