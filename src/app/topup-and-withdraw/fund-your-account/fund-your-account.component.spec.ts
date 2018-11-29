import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundYourAccountComponent } from './fund-your-account.component';

describe('FundYourAccountComponent', () => {
  let component: FundYourAccountComponent;
  let fixture: ComponentFixture<FundYourAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundYourAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundYourAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
