import { IEsiosRecord } from './interfaces/interfaces';

import bent, { RequestFunction, ValidResponse } from 'bent';

export default class EsiosApi {
    static BASE_URL = 'https://api.esios.ree.es';

    public ready: Promise<EsiosApi>;

    private client: bent.RequestFunction<bent.ValidResponse>;

    constructor(private key: string) {
        this.client = bent(EsiosApi.BASE_URL, 'json', {
            Authorization: `Token token="${key}"`
        });

        this.ready = Promise.resolve(this);
    }

    public getClient(): bent.RequestFunction<bent.ValidResponse> {
        return this.client;
    }

    public getRecordsOfDay(date: Date): Promise<Array<IEsiosRecord>> {
        const day: string = date.toISOString().substring(0, 10);

        const promise: Promise<Array<IEsiosRecord>> = new Promise((resolve, reject) => {
            this.client(`/archives/70/download_json?locale=es&date=${day}`).then((response: bent.ValidResponse) => {
                const data = response as Record<string, Array<Record<string, string>>>;

                if (typeof data === 'object' && data['PVPC']) {
                    const records: Array<IEsiosRecord> = data['PVPC'].map(
                        (row: Record<string, string>): IEsiosRecord => {
                            const record: IEsiosRecord = {
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
                    reject(new Error('no-response'));
                }
            });
        });

        return promise;
    }
}
