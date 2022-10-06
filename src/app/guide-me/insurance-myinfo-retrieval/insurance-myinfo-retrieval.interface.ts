export interface IMyInfoData {
    uin: string;
    cpfbalances: ICpfBalances;
}

export interface ICpfBalances {
    oa: number,
    ma: number,
    sa: number,
    ra: number,
}