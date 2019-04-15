export interface IRoadmap {
    title: string;
    items: IRoadmapItem[];
    notStartedClass: string;
    inProgressClass: string;
    completedClass: string;
}

export interface IRoadmapItem {
    title: string;
    path: string[];
    status: ERoadmapStatus;
}

export enum ERoadmapStatus {
    NOT_STARTED = 'not-started',
    IN_PROGRESS = 'in-progress',
    COMPLETED = 'completed'
}