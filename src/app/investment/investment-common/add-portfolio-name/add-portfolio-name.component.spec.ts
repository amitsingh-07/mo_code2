import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPortfolioNameComponent } from './add-portfolio-name.component';

describe('AddPortfolioNameComponent', () => {
  let component: AddPortfolioNameComponent;
  let fixture: ComponentFixture<AddPortfolioNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPortfolioNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPortfolioNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
