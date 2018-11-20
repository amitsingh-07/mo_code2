import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewYourDetailsComponent } from './review-your-details.component';

describe('ReviewYourDetailsComponent', () => {
  let component: ReviewYourDetailsComponent;
  let fixture: ComponentFixture<ReviewYourDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewYourDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewYourDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render step-title in a intro-block__content__heading', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('intro-block__content__heading').textContent).toContain('Step 4');
  }));
  it('should render start-title in a intro-block__content__title', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('intro-block__content__title').textContent).toContain('Review Your Details');
  }));
  it('should render sub-title in a intro-block__content__sub-title', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    // tslint:disable-next-line:max-line-length
    expect(compiled.querySelector('intro-block__content__sub-title').textContent).toContain('In the next step, please check that all details provided are accurate.');
  }));
  it('testing the proceed button', async(() => {
    spyOn(component, 'goToNext');
    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    fixture.whenStable().then(() => {
      expect(component.goToNext).toHaveBeenCalled();
    });
  }));
});
