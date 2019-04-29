import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprehensiveDashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: ComprehensiveDashboardComponent;
  let fixture: ComponentFixture<ComprehensiveDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComprehensiveDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprehensiveDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
