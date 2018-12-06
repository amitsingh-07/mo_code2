export interface IArticleEntry {
    artId: number;
    title: string;
    summary: string;
    keywords: string;
    date: Date;
    author: string;
    tag: string[];
    art_pri_tag?: number;
}
