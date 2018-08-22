export interface IResultObject {
    icon: string;
    title: string;
    amount: string;
}

export interface IResultItem {
    id: number;
    title: string;
    content?: string;
    icon: string;
    yearsNeeded?: IResultItemEntry;
    annualIncome?: IResultItemEntry;
    inputValues: IResultItemEntry[];
    existingCoverage: IResultItemEntry;
    total: IResultItemEntry;
}

export interface IResultItemEntry {
    title: string;
    value: number;
}
