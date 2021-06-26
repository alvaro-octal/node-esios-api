import EsiosApi from '../src/esios-api';

import { IEsiosRecord } from '../src/interfaces/interfaces';

let esios: EsiosApi;

const key = process.env.ESIOS_API_KEY || 'no-api-key';

/**
 * Create instance test
 */
describe('Instantiable test', () => {
    it('EsiosApi is instantiable', () => {
        esios = new EsiosApi(key);

        expect(esios).toBeInstanceOf(EsiosApi);
    });
});

/**
 * Check if the EsiosApi has been initialised
 */
describe('EsiosApi has been initialised test', () => {
    it('EsiosApi has been initialised', () => {
        const client = esios.getClient();

        expect(client).not.toBeUndefined();
    });
});

/**
 * Get records of date test
 */
describe('Get records of date test', () => {
    it('Api does return records for a valid date before 2021-06-01', () => {
        const date: Date = new Date('2020-01-01');

        return esios.getRecordsOfDay(date).then((records: Array<IEsiosRecord>) => {
            expect(records).toHaveLength(24);

            records.forEach((record: IEsiosRecord) => {
                expect(record).toMatchObject({
                    date: expect.any(Date),
                    hour: expect.any(Number),
                    prices: {
                        gen: expect.any(Number),
                        noc: expect.any(Number),
                        vhc: expect.any(Number)
                    }
                });

                expect(record.date).toBeInstanceOf(Date);
                expect(record.date).toEqual(date);
                expect(record.hour).toBeGreaterThanOrEqual(0);
                expect(record.hour).toBeLessThanOrEqual(23);
                expect(record.prices).toBeInstanceOf(Object);
                expect(record.prices).toHaveProperty('gen');
                expect(record.prices).toHaveProperty('noc');
                expect(record.prices).toHaveProperty('vhc');
                expect(record.prices.gen).toBeGreaterThanOrEqual(0);
                expect(record.prices.noc).toBeGreaterThanOrEqual(0);
                expect(record.prices.vhc).toBeGreaterThanOrEqual(0);
                expect(record.prices.pcb).toBeUndefined();
                expect(record.prices.cym).toBeUndefined();
            });
        });
    });

    it('Api does return records for a valid date after 2021-06-01', () => {
        const date: Date = new Date('2021-06-15');

        return esios.getRecordsOfDay(date).then((records: Array<IEsiosRecord>) => {
            expect(records).toHaveLength(24);

            records.forEach((record: IEsiosRecord) => {
                expect(record).toMatchObject({
                    date: expect.any(Date),
                    hour: expect.any(Number),
                    prices: {
                        pcb: expect.any(Number),
                        cym: expect.any(Number)
                    }
                });

                expect(record.date).toBeInstanceOf(Date);
                expect(record.date).toEqual(date);
                expect(record.hour).toBeGreaterThanOrEqual(0);
                expect(record.hour).toBeLessThanOrEqual(23);
                expect(record.prices).toBeInstanceOf(Object);
                expect(record.prices).toHaveProperty('gen');
                expect(record.prices).toHaveProperty('noc');
                expect(record.prices).toHaveProperty('vhc');
                expect(record.prices).toHaveProperty('pcb');
                expect(record.prices).toHaveProperty('cym');
                expect(record.prices.gen).toBeUndefined();
                expect(record.prices.noc).toBeUndefined();
                expect(record.prices.vhc).toBeUndefined();
                expect(record.prices.pcb).toBeGreaterThanOrEqual(0);
                expect(record.prices.cym).toBeGreaterThanOrEqual(0);
            });
        });
    });

    it('Api does not return records for a future date', () => {
        const date: Date = new Date();

        date.setDate(date.getDate() + 7);

        return esios
            .getRecordsOfDay(date)
            .then((records: Array<IEsiosRecord>) => {
                expect(records).toHaveLength(0);
            })
            .catch((error: Error) => {
                expect(error.message).toEqual('no-response');
            });
    });

    it('Api does not return records of date', () => {
        const date: Date = new Date('2010-01-01');

        return esios
            .getRecordsOfDay(date)
            .then((records: Array<IEsiosRecord>) => {
                expect(records).toHaveLength(0);
            })
            .catch((error: Error) => {
                expect(error.message).toEqual('no-response');
            });
    });
});
