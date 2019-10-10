import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioExistComponent } from './portfolio-exist.component';

describe('PortfolioExistComponent', () => {
  let component: PortfolioExistComponent;
  let fixture: ComponentFixture<PortfolioExistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortfolioExistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortfolioExistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
