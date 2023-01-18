import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioApplicationInprogressComponent } from './portfolio-application-inprogress.component';

describe('PortfolioApplicationInprogressComponent', () => {
  let component: PortfolioApplicationInprogressComponent;
  let fixture: ComponentFixture<PortfolioApplicationInprogressComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioApplicationInprogressComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortfolioApplicationInprogressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
