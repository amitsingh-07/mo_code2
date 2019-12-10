import { Injectable } from '@angular/core';

import { IFinancialWellnessProgramme } from './financial-wellness-programme/financial-wellness-programme.interface';

@Injectable({
    providedIn: 'root'
})
export class CorporateService {
    constructor() { }
    getCorporate(): IFinancialWellnessProgramme {
        const getCorporate = {} as IFinancialWellnessProgramme;
        return getCorporate;
    }
}