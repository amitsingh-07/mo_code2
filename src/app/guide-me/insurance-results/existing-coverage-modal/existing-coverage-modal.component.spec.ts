import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingCoverageModalComponent } from './existing-coverage-modal.component';

describe('ExistingCoverageModalComponent', () => {
  let component: ExistingCoverageModalComponent;
  let fixture: ComponentFixture<ExistingCoverageModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExistingCoverageModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExistingCoverageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
