

import { PortfolioExistComponent } from './portfolio-exist.component';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

describe('PortfolioExistComponent', () => {
  let component: PortfolioExistComponent;
  let fixture: ComponentFixture<PortfolioExistComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PortfolioExistComponent]
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
