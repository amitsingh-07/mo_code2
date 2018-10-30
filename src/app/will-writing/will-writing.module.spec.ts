import { WillWritingModule } from './will-writing.module';

describe('WillWritingModule', () => {
  let willWritingModule: WillWritingModule;

  beforeEach(() => {
    willWritingModule = new WillWritingModule();
  });

  it('should create an instance', () => {
    expect(willWritingModule).toBeTruthy();
  });
});
