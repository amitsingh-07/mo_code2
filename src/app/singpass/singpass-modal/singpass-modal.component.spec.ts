import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SingpassModalComponent } from './singpass-modal.component';

describe('SingpassModalComponent', () => {
  let component: SingpassModalComponent;
  let fixture: ComponentFixture<SingpassModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SingpassModalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingpassModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
