import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundingMethodComponent } from './funding-method.component';

describe('FundingMethodComponent', () => {
  let component: FundingMethodComponent;
  let fixture: ComponentFixture<FundingMethodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundingMethodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundingMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
