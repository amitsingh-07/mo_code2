import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprehensiveComponent } from './comprehensive.component';

describe('ComprehensiveComponent', () => {
  let component: ComprehensiveComponent;
  let fixture: ComponentFixture<ComprehensiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComprehensiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprehensiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
