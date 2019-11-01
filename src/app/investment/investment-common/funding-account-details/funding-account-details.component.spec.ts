import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundingAccountDetailsComponent } from './funding-account-details.component';

describe('FundingAccountDetailsComponent', () => {
  let component: FundingAccountDetailsComponent;
  let fixture: ComponentFixture<FundingAccountDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundingAccountDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundingAccountDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
