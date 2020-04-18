export interface IEsiosRecord {
    date: Date;
    hour: number;
    prices: IEsiosRecordPrices;
}

interface IEsiosRecordPrices {
    gen: number;
    noc: number;
    vhc: number;
}
