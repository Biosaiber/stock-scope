import { mapRowsToImportResult } from './excel-import.adapter';
import type { ExcelLocationRow } from './excel-location-row.model';

function createRow(
    overrides: Partial<ExcelLocationRow> = {},
): ExcelLocationRow {
    return {
        customer: 'Test Customer',
        description: 'TEST-01',
        articleNrCustomer: '1234.567.89012',
        object: 'H001',
        'object description': null,
        department: 'BS (NL)',
        location: 'BS-A01',
        level: 'A',
        length: 1.5,
        width: 1,
        unit: 'm',
        status: 'Storage',
        amount: 1,
        kinds: null,
        entity: 'TEST',
        ...overrides,
    };
}

describe('Excel import adapter', () => {
    it('should share an article and location between two items', () => {
        const rows = [
            createRow({ object: 'H001' }),
            createRow({ object: 'H002' }),
        ];

        const result = mapRowsToImportResult(rows);

        expect(result.articles.length).toBe(1);
        expect(result.locations.length).toBe(1);
        expect(result.items.length).toBe(2);

        expect(result.items.map(item => item.hCode))
            .toEqual(['H001', 'H002']);

        expect(
            result.items.every(
                item => item.articleId === result.articles[0].id,
            ),
        ).toBe(true);

        expect(
            result.items.every(
                item => item.locationCode === result.locations[0].code,
            ),
        ).toBe(true);
    });

    it('should reject duplicate H-codes', () => {
        const rows = [
            createRow({ object: 'H001' }),
            createRow({ object: ' H001 ' }),
        ];

        expect(() => mapRowsToImportResult(rows))
            .toThrowError('Duplicate item H-code "H001".');
    });

    it('should import an item with a missing status as null', () => {
        const rows = [createRow({ status: null })];

        const result = mapRowsToImportResult(rows);

        expect(result.items.length).toBe(1);
        expect(result.items[0].status).toBeNull();
    });
    it('should preserve an item with missing article data and location', () => {
        const result = mapRowsToImportResult([
            createRow({
                customer: null,
                description: null,
                articleNrCustomer: null,
                location: null,
                status: null,
                length: null,
                width: null,
                unit: null,
            }),
        ]);

        expect(result.items.length).toBe(1);
        expect(result.items[0].hCode).toBe('H001');
        expect(result.items[0].locationCode).toBeNull();
        expect(result.items[0].status).toBeNull();
        expect(result.locations.length).toBe(0);

        expect(result.articles[0].articleName).toBeNull();
        expect(result.articles[0].twelveNcNumber).toBeNull();
        expect(result.articles[0].customerName).toBeNull();
        expect(result.articles[0].length).toBeNull();
        expect(result.articles[0].width).toBeNull();
    });

    it('should keep articles with different dimensions separate', () => {
        const result = mapRowsToImportResult([
            createRow({ object: 'H001', width: 1 }),
            createRow({ object: 'H002', width: 2 }),
        ]);

        expect(result.articles.length).toBe(2);
        expect(result.items[0].articleId)
            .not.toBe(result.items[1].articleId);

        const widths = result.items.map(item =>
            result.articles.find(article => article.id === item.articleId)?.width,
        );

        expect(widths).toEqual([1, 2]);
    });

    it('should not merge unidentified articles from different items', () => {
        const result = mapRowsToImportResult([
            createRow({
                object: 'H001',
                description: null,
                articleNrCustomer: null,
            }),
            createRow({
                object: 'H002',
                description: null,
                articleNrCustomer: null,
            }),
        ]);

        expect(result.articles.length).toBe(2);
        expect(result.items[0].articleId)
            .not.toBe(result.items[1].articleId);
    });

    it('should reject a missing H-code', () => {
        expect(() =>
            mapRowsToImportResult([
                createRow({ object: '   ' }),
            ]),
        ).toThrowError('Missing item H-code.');
    });
});