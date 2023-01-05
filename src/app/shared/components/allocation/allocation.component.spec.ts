import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AllocationComponent } from './allocation.component';

describe('AllocationComponent', () => {
  let component: AllocationComponent;
  let fixture: ComponentFixture<AllocationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AllocationComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
