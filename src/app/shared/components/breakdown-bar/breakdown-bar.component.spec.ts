import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BreakdownBarComponent } from './breakdown-bar.component';

describe('BreakdownBarComponent', () => {
  let component: BreakdownBarComponent;
  let fixture: ComponentFixture<BreakdownBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BreakdownBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreakdownBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
