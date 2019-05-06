import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiyModalComponent } from './diy-modal.component';

describe('DiyModalComponent', () => {
  let component: DiyModalComponent;
  let fixture: ComponentFixture<DiyModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiyModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
