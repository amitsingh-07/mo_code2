import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundingIntroComponent } from './funding-intro.component';

describe('FundingIntroComponent', () => {
  let component: FundingIntroComponent;
  let fixture: ComponentFixture<FundingIntroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundingIntroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundingIntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
