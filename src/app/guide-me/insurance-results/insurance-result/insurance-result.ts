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
    inputValues: IResultItemEntry[];
    existingCoverage: IResultItemEntry;
    total: IResultItemEntry;
}

export interface IResultItemEntry {
    title: string;
    value: number;
}
