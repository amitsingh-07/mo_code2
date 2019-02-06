import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeesModalComponent } from './fees-modal.component';

describe('FeesModalComponent', () => {
  let component: FeesModalComponent;
  let fixture: ComponentFixture<FeesModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeesModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
