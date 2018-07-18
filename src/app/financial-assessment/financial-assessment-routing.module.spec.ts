import { FinancialAssessmentRoutingModule } from './financial-assessment-routing.module';

describe('AppRoutingModule', () => {
  let financialAssessmentRoutingModule: FinancialAssessmentRoutingModule;

  beforeEach(() => {
    financialAssessmentRoutingModule = new FinancialAssessmentRoutingModule();
  });

  it('should create an instance', () => {
    expect(financialAssessmentRoutingModule).toBeTruthy();
  });
});
