import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioNamingComponent } from './portfolio-naming.component';

describe('PortfolioNamingComponent', () => {
  let component: PortfolioNamingComponent;
  let fixture: ComponentFixture<PortfolioNamingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortfolioNamingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortfolioNamingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
