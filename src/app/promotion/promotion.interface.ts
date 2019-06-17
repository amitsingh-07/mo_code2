export interface IPromotion {
    type: number;
    promoId: number;
    owner: string;
    title: string;
    thumbnail: string;
    banner ?: string;
    desc: string;
    date_created: string;
    date_expiry: string;
    tag: any;
    external: boolean;
    url ?: string;
    button_label ?: string;
    logo ?: string;
}
