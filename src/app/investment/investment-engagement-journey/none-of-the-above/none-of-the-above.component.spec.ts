import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoneOfTheAboveComponent } from './none-of-the-above.component';

describe('NoneOfTheAboveComponent', () => {
  let component: NoneOfTheAboveComponent;
  let fixture: ComponentFixture<NoneOfTheAboveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoneOfTheAboveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoneOfTheAboveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
