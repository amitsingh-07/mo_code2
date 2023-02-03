import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DropdownWithSearchComponent } from './dropdown-with-search.component';

describe('DropdownWithSearchComponent', () => {
  let component: DropdownWithSearchComponent;
  let fixture: ComponentFixture<DropdownWithSearchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DropdownWithSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownWithSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
