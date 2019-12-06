import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialLiteracyTeamComponent } from './financial-literacy-team.component';

describe('FinancialLiteracyTeamComponent', () => {
  let component: FinancialLiteracyTeamComponent;
  let fixture: ComponentFixture<FinancialLiteracyTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinancialLiteracyTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialLiteracyTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
