import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateSrsComponent } from './add-update-srs.component';

describe('AddUpdateSrsComponent', () => {
  let component: AddUpdateSrsComponent;
  let fixture: ComponentFixture<AddUpdateSrsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateSrsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateSrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
