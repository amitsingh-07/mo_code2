import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopBarWithClearButtonComponent } from './top-bar-with-clear-button.component';

describe('TopBarWithClearButtonComponent', () => {
  let component: TopBarWithClearButtonComponent;
  let fixture: ComponentFixture<TopBarWithClearButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopBarWithClearButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopBarWithClearButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
