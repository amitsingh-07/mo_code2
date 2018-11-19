import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointYourExecutorTrusteeComponent } from './appoint-your-executor-trustee.component';

describe('AppointYourExecutorTrusteeComponent', () => {
  let component: AppointYourExecutorTrusteeComponent;
  let fixture: ComponentFixture<AppointYourExecutorTrusteeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppointYourExecutorTrusteeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointYourExecutorTrusteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render step-title in a intro-block__content__heading', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('intro-block__content__heading').textContent).toContain('Step 3');
  }));
  it('should render start-title in a intro-block__content__title', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('intro-block__content__title').textContent).toContain('Appoint Your Executor & Trustee');
  }));
  it('should render sub-title in a intro-block__content__sub-title', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    // tslint:disable-next-line:max-line-length
    expect(compiled.querySelector('intro-block__content__sub-title').textContent).toContain('In the next step, you will appoint someone to manage and carry out the wishes of your will.');
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
