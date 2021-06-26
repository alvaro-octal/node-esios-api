export interface IEsiosRecord {
    date: Date;
    hour: number;
    prices: IEsiosRecordPrices;
}

interface IEsiosRecordPrices {
    gen: number | undefined;
    noc: number | undefined;
    vhc: number | undefined;
    pcb: number | undefined;
    cym: number | undefined;
}
