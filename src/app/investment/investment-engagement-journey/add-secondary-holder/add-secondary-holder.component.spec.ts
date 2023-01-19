import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSecondaryHolderComponent } from './add-secondary-holder.component';

describe('AddSecondaryHolderComponent', () => {
  let component: AddSecondaryHolderComponent;
  let fixture: ComponentFixture<AddSecondaryHolderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddSecondaryHolderComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSecondaryHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
