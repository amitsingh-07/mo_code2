import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPortfolioStatusComponent } from './add-portfolio-status.component';

describe('AddPortfolioStatusComponent', () => {
  let component: AddPortfolioStatusComponent;
  let fixture: ComponentFixture<AddPortfolioStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPortfolioStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPortfolioStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
