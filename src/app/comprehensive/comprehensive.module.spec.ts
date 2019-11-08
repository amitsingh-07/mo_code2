import { ComprehensiveModule } from './comprehensive.module';

describe('ComprehensiveModule', () => {
  let comprehensiveModule: ComprehensiveModule;

  beforeEach(() => {
    comprehensiveModule = new ComprehensiveModule();
  });

  it('should create an instance', () => {
    expect(comprehensiveModule).toBeTruthy();
  });
});
