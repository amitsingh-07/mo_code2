export interface IProgressTrackerData {
    title: string;
    subTitle?: string;
    properties?: IProgressTrackerProperties;
    items: IProgressTrackerItem[];
}

export interface IProgressTrackerProperties {
    disabled?: boolean;
}

export class IProgressTrackerItem {
    title: string;
    expanded = false;
    completed = false;
    customStyle?: string;
    subItems: IProgressTrackerSubItem[];
}

export interface IProgressTrackerSubItem {
    pageName: string;
    title: string;
    value: string;
    completed: boolean;
    list?: IProgressTrackerSubItemList[];
}

export interface IProgressTrackerSubItemList {
    title: string;
    value: string;
}
