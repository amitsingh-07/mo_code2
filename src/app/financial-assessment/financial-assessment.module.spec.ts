import { FinancialAssessmentModule } from './financial-assessment.module';

describe('FinancialAssessmentModule', () => {
  let financialAssessmentModule: FinancialAssessmentModule;

  beforeEach(() => {
    financialAssessmentModule = new FinancialAssessmentModule();
  });

  it('should create an instance', () => {
    expect(financialAssessmentModule).toBeTruthy();
  });
});
