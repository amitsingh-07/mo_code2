import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundingInstructionsComponent } from './funding-instructions.component';

describe('FundingInstructionsComponent', () => {
  let component: FundingInstructionsComponent;
  let fixture: ComponentFixture<FundingInstructionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundingInstructionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundingInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
