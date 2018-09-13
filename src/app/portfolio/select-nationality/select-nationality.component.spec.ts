import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectNationalityComponent } from './select-nationality.component';

describe('SelectNationalityComponent', () => {
  let component: SelectNationalityComponent;
  let fixture: ComponentFixture<SelectNationalityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectNationalityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectNationalityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
