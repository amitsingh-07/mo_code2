import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributeYourEstateComponent } from './distribute-your-estate.component';

describe('DistributeYourEstateComponent', () => {
  let component: DistributeYourEstateComponent;
  let fixture: ComponentFixture<DistributeYourEstateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistributeYourEstateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributeYourEstateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render step-title in a intro-block__content__heading', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('intro-block__content__heading').textContent).toContain('Step 2');
  }));
  it('should render start-title in a intro-block__content__title', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('intro-block__content__title').textContent).toContain('Distribute Your Estate');
  }));
  it('should render sub-title in a intro-block__content__sub-title', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    // tslint:disable-next-line:max-line-length
    expect(compiled.querySelector('intro-block__content__sub-title').textContent).toContain('In the next step, you will decide who inherits which portion of your estate.');
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
