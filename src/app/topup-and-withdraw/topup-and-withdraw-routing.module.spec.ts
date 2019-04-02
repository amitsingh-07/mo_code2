import { GuideMeRoutingModule } from './guide-me-routing.module';

describe('GuideMeRoutingModule', () => {
  let guideMeRoutingModule: GuideMeRoutingModule;

  beforeEach(() => {
    guideMeRoutingModule = new GuideMeRoutingModule();
  });

  it('should create an instance', () => {
    expect(guideMeRoutingModule).toBeTruthy();
  });
});
