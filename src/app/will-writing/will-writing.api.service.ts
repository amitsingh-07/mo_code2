import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { padNumber } from '@ng-bootstrap/ng-bootstrap/util/util';
import { AppService } from '../app.service';
import { ApiService } from '../shared/http/api.service';
import { AuthenticationService } from '../shared/http/auth/authentication.service';
import { IWill, IwillProfile, IWillProfileMembers } from './will-writing-types';
import { WILL_WRITING_CONFIG } from './will-writing.constants';
import { WillWritingService } from './will-writing.service';

@Injectable({
    providedIn: 'root'
})
export class WillWritingApiService {

    private relationship: any = new Map([
        ['parent', 'P'],
        ['sibling', 'SBL'],
        ['parent-in-law', 'PIL'],
        ['friend', 'F'],
        ['relative', 'R'],
        ['spouse', 'S'],
        ['child', 'C'],
    ]);

    private maritalStatus: any = new Map([
        ['single', 'S'],
        ['married', 'M'],
        ['divorced', 'D'],
        ['widowed', 'W']
    ]);

    private gender: any = new Map([
        ['male', 'M'],
        ['female', 'F']
    ]);

    constructor(
        private appService: AppService,
        private authService: AuthenticationService,
        private http: HttpClient,
        private apiService: ApiService,
        private willWritingService: WillWritingService
    ) {
    }

    getProfileList() {
        return this.apiService.getProfileList();
    }

    verifyPromoCode(promoCodeData) {
        const promoCode = {
            promoCode: promoCodeData,
            sessionId: this.authService.getSessionId(),
        };
        return this.apiService.verifyPromoCode(promoCode);
    }

    checkProfileMembers(uin, list) {
        return list.filter((data) =>
            data.uin === uin
        );
    }

    willRequestPayload(customeId?: string): IWill {
        const will = Object.assign([], this.willWritingService.getWillWritingFormData());
        const willProfile: IwillProfile = {
            customerId: customeId ? customeId : this.appService.getCustomerId(),
            enquiryId: will.enquiryId,
            uin: will.aboutMe.uin,
            name: will.aboutMe.name,
            genderCode: this.gender.get(will.aboutMe.gender),
            maritalStatusCode: this.maritalStatus.get(will.aboutMe.maritalStatus),
            noOfChildren: will.aboutMe.noOfChildren,
            promoCode: will.promoCode
        };

        const willProfileMembers: IWillProfileMembers[] = [];

        if (will.aboutMe.maritalStatus === WILL_WRITING_CONFIG.MARRIED) {
            const beneficiary: any = this.willWritingService.checkBeneficiary(will.spouse[0].uin)[0];
            willProfileMembers.push({
                uin: will.spouse[0].uin,
                name: will.spouse[0].name,
                relationshipCode: this.relationship.get(will.spouse[0].relationship),
                isFamily: 'Y',
                isBeneficiary: beneficiary ? 'Y' : 'N',
                isGuardian: 'Y',
                isAltGuardian: 'N',
                isTrusteee: 'Y',
                isAltTrusteee: 'N',
                distribution: beneficiary.length > 1 ? beneficiary.distPercentage : 0
            });
        }

        if (will.aboutMe.noOfChildren > 0) {
            for (const children of will.children) {
                const beneficiary = this.willWritingService.checkBeneficiary(children.uin);
                willProfileMembers.push({
                    uin: children.uin,
                    name: children.name,
                    dob: children.dob['year'] + '' + padNumber(children.dob['month']) + '' + padNumber(children.dob['day']),
                    relationshipCode: this.relationship.get(children.relationship),
                    isFamily: 'Y',
                    isBeneficiary: beneficiary ? 'Y' : 'N',
                    isGuardian: 'N',
                    isAltGuardian: 'N',
                    isTrusteee: 'N',
                    isAltTrusteee: 'N',
                    distribution: beneficiary.length ? beneficiary[0].distPercentage : 0
                });
            }
        }

        const beneficiaryList = will.beneficiary.filter((data) =>
            data.selected === true && data.relationship !== WILL_WRITING_CONFIG.SPOUSE && data.relationship !== WILL_WRITING_CONFIG.CHILD
        );

        will.guardian = will.guardian ? will.guardian : [];

        const guardianList = will.guardian.filter((data) =>
            data.relationship !== WILL_WRITING_CONFIG.SPOUSE
        );

        const execTrusteeList = will.execTrustee.filter((data) =>
            data.relationship !== WILL_WRITING_CONFIG.SPOUSE
        );

        for (const beneficiary of beneficiaryList) {
            const guardian = this.checkProfileMembers(beneficiary.uin, guardianList);
            const execTrustee = this.checkProfileMembers(beneficiary.uin, execTrusteeList);
            willProfileMembers.push({
                uin: beneficiary.uin,
                name: beneficiary.name,
                relationshipCode: this.relationship.get(beneficiary.relationship),
                isFamily: 'N',
                isBeneficiary: 'Y',
                isGuardian: guardian.length > 0 ? guardian[0].isAlt ? 'N' : 'Y' : 'N',
                isAltGuardian: guardian.length > 0 ? guardian[0].isAlt ? 'Y' : 'N' : 'N',
                isTrusteee: execTrustee.length > 0 ? execTrustee[0].isAlt ? 'N' : 'Y' : 'N',
                isAltTrusteee: execTrustee.length > 0 ? execTrustee[0].isAlt ? 'Y' : 'N' : 'N',
                distribution: beneficiary.distPercentage
            });
        }

        for (const guardian of guardianList) {
            if (this.checkProfileMembers(guardian.uin, willProfileMembers).length === 0) {
                const execTrustee = this.checkProfileMembers(guardian.uin, execTrusteeList);
                willProfileMembers.push({
                    uin: guardian.uin,
                    name: guardian.name,
                    relationshipCode: this.relationship.get(guardian.relationship),
                    isFamily: 'N',
                    isBeneficiary: 'N',
                    isGuardian: guardian.isAlt ? 'N' : 'Y',
                    isAltGuardian: guardian.isAlt ? 'Y' : 'N',
                    isTrusteee: execTrustee.length > 0 ? execTrustee[0].isAlt ? 'N' : 'Y' : 'N',
                    isAltTrusteee: execTrustee.length > 0 ? execTrustee[0].isAlt ? 'Y' : 'N' : 'N',
                    distribution: 0
                });
            }
        }

        for (const execTrustee of execTrusteeList) {
            if (this.checkProfileMembers(execTrustee.uin, willProfileMembers).length === 0) {
                willProfileMembers.push({
                    uin: execTrustee.uin,
                    name: execTrustee.name,
                    relationshipCode: this.relationship.get(execTrustee.relationship),
                    isFamily: 'N',
                    isBeneficiary: 'N',
                    isGuardian: 'N',
                    isAltGuardian: 'N',
                    isTrusteee: execTrustee.isAlt ? 'N' : 'Y',
                    isAltTrusteee: execTrustee.isAlt ? 'Y' : 'N',
                    distribution: 0
                });
            }
        }
        return {
            willProfile: willProfile,
            willProfileMembers: willProfileMembers
        };
    }

    createWill(customeId?: string) {
        const payload: IWill = this.willRequestPayload(customeId);
        return this.apiService.createWill(payload);
    }

    updateWill() {
        const payload: IWill = this.willRequestPayload();
        return this.apiService.updateWill(payload);
    }

    getWill() {
        const payload = {
            customerId: this.appService.getCustomerId()
        };
        return this.apiService.getWill(payload);
    }

    downloadWill() {
        const payload = {
            customerId: this.appService.getCustomerId()
        };
        return this.apiService.downloadWill(payload);
    }
}
