import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestModalComponent } from './invest-modal.component';

describe('InvestModalComponent', () => {
  let component: InvestModalComponent;
  let fixture: ComponentFixture<InvestModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [InvestModalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
