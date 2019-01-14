export interface IPromotion {
    promoId: number;
    owner: string;
    title: string;
    img: string;
    desc: string;
    date_created: string;
    date_expiry: string;
    tag: any;
    external: boolean;
    url ?: string;
}
