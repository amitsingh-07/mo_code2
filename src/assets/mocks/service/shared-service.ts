import { Observable } from 'rxjs';
import { of } from 'rxjs';

export function tokenGetterFn() {
    return '';
}

export const mockAuthService = {
    saveEnquiryId() {
        return true;
    },
    authenticate() {
        return of();
    },
    getSessionId() {
        return '123456';
    },
    isAuthenticated() {
        return false;
    },
    getEnquiryId() {
        return '123';
    }
};

export const mockCurrencyPipe = {
    transform(value) {
        return value;
    }
};

export const mockPortfolioService = {

    verifyPromoCode() {
        return of({
            responseMessage: {
                responseCode: 6005
            },
            objectList: [
                { enquiryId: 1 }
            ]
        });
    },
    getRiskProfile() {
        return {
            riskProfileId: 1,
            riskProfileName: 'Profile Name',
            htmlDescription: 'HTML Description'
        };
    },
    getPortfolioAllocationDetails(params) {
        return of({
            objectList: {
                investmentPeriod: 8,
                initialInvestment: 100.0,
                monthlyInvestment: 0.0,
            },
            responseMessage: {
                responseCode: 6000,
                responseDescription: 'Successful response'
            }
        });
    }
};

export class MockInvestmentAccountService {
    isSingaporeResident() {
        return true;
    }
    getOccupationList(): Observable<any> {
        return of({});
    }
    getCountriesFormDataByFilter(): any[] {
        return [];
    }
    getInvestmentAccountFormData() {
        return {};
    }
    getCountryFromNationalityCodeByFilter() {
        return '';
    }
    isCountrySingapore(country) {
        if (country) {
            return '';
        } else {
            return false;
        }
    }
    loadDDCRoadmap() {}
}

export const mockFooterService = {
    setFooterVisibility(isVisible: string): Observable<any> {
        return of(false);
    }
};

export class TestComponent {
}

export class mockInvestmentEngagementJourneyService {
    
}