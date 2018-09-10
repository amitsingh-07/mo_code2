import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectResultsComponent } from './direct-results.component';

describe('DirectResultsComponent', () => {
  let component: DirectResultsComponent;
  let fixture: ComponentFixture<DirectResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DirectResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
