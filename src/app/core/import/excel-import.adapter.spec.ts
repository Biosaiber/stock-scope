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

  it('should reject a missing status', () => {
    const rows = [createRow({ status: null })];

    expect(() => mapRowsToImportResult(rows))
      .toThrowError('Missing status for item "H001".');
  });
});