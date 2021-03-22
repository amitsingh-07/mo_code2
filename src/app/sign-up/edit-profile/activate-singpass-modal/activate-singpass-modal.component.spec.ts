import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivateSingpassModalComponent } from './activate-singpass-modal.component';

describe('ActivateSingpassModalComponent', () => {
  let component: ActivateSingpassModalComponent;
  let fixture: ComponentFixture<ActivateSingpassModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivateSingpassModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivateSingpassModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
