import { IPromotion } from './../promotion.interface';

export interface IPromoCategory {
    title: string;
    subTitle: string;
    promotions: IPromotion[];
    id: number;
}
