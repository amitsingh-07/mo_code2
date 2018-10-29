export interface IArticleEntry {
    artId: number;
    title: string;
    date: Date;
    author: string;
    tag: string[];
    art_pri_tag?: number;
}
