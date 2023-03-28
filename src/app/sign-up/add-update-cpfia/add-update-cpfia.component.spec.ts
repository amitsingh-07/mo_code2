import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateCpfiaComponent } from './add-update-cpfia.component';

describe('AddUpdateCpfiaComponent', () => {
  let component: AddUpdateCpfiaComponent;
  let fixture: ComponentFixture<AddUpdateCpfiaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddUpdateCpfiaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateCpfiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
