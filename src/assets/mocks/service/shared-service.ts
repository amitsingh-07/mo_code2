import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';

export function tokenGetterFn() {
    return '';
}

export const mockAuthService = {
    saveEnquiryId() {
        return true;
    },
    authenticate() {
        return Observable.of();
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
        return Observable.of({
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
        return Observable.of({
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

export const mockInvestmentAccountService = {

};

export const mockFooterService = {
    setFooterVisibility(isVisible: string): Observable<any> {
        return Observable.of(false);
    }
};

export class TestComponent {
}
