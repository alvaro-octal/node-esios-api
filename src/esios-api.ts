import { IEsiosRecord } from './interfaces/interfaces';

import bent from 'bent';

export class EsiosApi {
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
                                    gen: parseFloat(row['GEN'].replace(',', '.')),
                                    noc: parseFloat(row['NOC'].replace(',', '.')),
                                    vhc: parseFloat(row['VHC'].replace(',', '.'))
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
