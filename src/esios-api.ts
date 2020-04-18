import * as bent from 'bent';

import { IEsiosRecord } from './interfaces/interfaces';

export default class EsiosApi {
    static BASE_URL = 'https://api.esios.ree.es';

    public ready: Promise<EsiosApi>;

    private client: any;

    constructor(private key: string) {
        this.init(key);

        this.ready = Promise.resolve(this);
    }

    private init(key: string): void {
        this.client = bent(EsiosApi.BASE_URL, 'json');
    }

    public getClient(): any {
        return this.client;
    }

    public getRecordsOfDay(date: Date): Promise<Array<IEsiosRecord>> {
        const day: string = date.toISOString().substring(0, 10);

        let promise: Promise<Array<IEsiosRecord>> = new Promise((resolve, reject) => {
            this.client(`/archives/70/download_json?locale=es&date=${day}`).then((response: any) => {
                if (typeof response === 'object' && response['PVPC']) {
                    let records: Array<IEsiosRecord> = response['PVPC'].map(
                        (row: any): IEsiosRecord => {
                            let record: IEsiosRecord = {
                                date: date,
                                hour: parseInt(row['Hora'].substring(0, 2)),
                                prices: {
                                    gen: parseFloat(row['GEN'].replace(',', '.')),
                                    noc: parseFloat(row['NOC'].replace(',', '.')),
                                    vhc: parseFloat(row['VHC'].replace(',', '.'))
                                }
                            };

                            return record;
                        }
                    );
                    resolve(records);
                } else {
                    reject('no-response');
                }
            });
        });

        return promise;
    }
}
