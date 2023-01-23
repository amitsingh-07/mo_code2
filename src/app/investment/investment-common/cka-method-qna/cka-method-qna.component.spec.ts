import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CkaMethodQnaComponent } from './cka-method-qna.component';

describe('CkaMethodQnaComponent', () => {
  let component: CkaMethodQnaComponent;
  let fixture: ComponentFixture<CkaMethodQnaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CkaMethodQnaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CkaMethodQnaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
