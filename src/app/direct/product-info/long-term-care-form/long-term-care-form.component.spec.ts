import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LongTermCareFormComponent } from './long-term-care-form.component';

describe('LongTermCareFormComponent', () => {
  let component: LongTermCareFormComponent;
  let fixture: ComponentFixture<LongTermCareFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LongTermCareFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LongTermCareFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
