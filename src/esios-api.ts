import { IEsiosRecord } from './interfaces/interfaces';

import bent from 'bent';

export default class EsiosApi {
    static BASE_URL = 'https://api.esios.ree.es';

    public ready: Promise<EsiosApi>;

    private readonly client: bent.RequestFunction<bent.ValidResponse>;

    constructor(private key: string) {
        this.client = bent(EsiosApi.BASE_URL, 'json', {
            'x-api-key': key
        });

        this.ready = Promise.resolve(this);
    }

    public getClient(): bent.RequestFunction<bent.ValidResponse> {
        return this.client;
    }

    public getRecordsOfDay(date: Date): Promise<IEsiosRecord[]> {
        const day: string = date.toISOString().substring(0, 10);

        return new Promise((resolve, reject) => {
            this.client(`/archives/70/download_json?locale=es&date=${day}`).then((response: bent.ValidResponse) => {
                const data = response as Record<string, Array<Record<string, string>>>;

                if (typeof data === 'object' && data['PVPC']) {
                    const records: Array<IEsiosRecord> = data['PVPC'].map(
                        (row: Record<string, string>): IEsiosRecord => {
                            return {
                                date: date,
                                hour: parseInt(row['Hora'].substring(0, 2)),
                                prices: {
                                    gen: row['GEN'] ? parseFloat(row['GEN'].replace(',', '.')) : undefined,
                                    noc: row['NOC'] ? parseFloat(row['NOC'].replace(',', '.')) : undefined,
                                    vhc: row['VHC'] ? parseFloat(row['VHC'].replace(',', '.')) : undefined,
                                    pcb: row['PCB'] ? parseFloat(row['PCB'].replace(',', '.')) : undefined,
                                    cym: row['CYM'] ? parseFloat(row['CYM'].replace(',', '.')) : undefined
                                }
                            };
                        }
                    );
                    resolve(records);
                } else {
                    reject(new Error('no-response'));
                }
            });
        });
    }
}
