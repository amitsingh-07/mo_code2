import { GuideMeModule } from './guide-me.module';

describe('GuideMeModule', () => {
  let guideMeModule: GuideMeModule;

  beforeEach(() => {
    guideMeModule = new GuideMeModule();
  });

  it('should create an instance', () => {
    expect(guideMeModule).toBeTruthy();
  });
});
