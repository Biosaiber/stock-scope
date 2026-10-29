import { utils, write } from 'xlsx';
import { readExcelLocationRows, validateExcelHeaders } from './excel-import.reader';

const HEADERS = [
    'customer',
    'description',
    'articleNrCustomer',
    'object',
    'object description',
    'department',
    'location',
    'level',
    'length',
    'width',
    'unit',
    'status',
    'amount',
    'kinds',
    'entity',
];

function createCells(): unknown[] {
    return [
        'Test Customer',
        'TEST-01',
        '1234.567.89012',
        'H001',
        null,
        'BS (NL)',
        'BS-A01',
        'A',
        1.5,
        1,
        'm',
        'Storage',
        1,
        null,
        'NL-EIN-01',
    ];
}

function createExcelFile(rows: unknown[][]): File {
    const worksheet = utils.aoa_to_sheet([HEADERS, ...rows]);
    const workbook = utils.book_new();

    utils.book_append_sheet(workbook, worksheet, 'Locations');

    const buffer = write(workbook, {
        bookType: 'xlsx',
        type: 'array',
    });

    return new File([buffer], 'test-report.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
}

describe('Excel import reader', () => {
    it('should import identical duplicates once and report both rows', async () => {
        const result = await readExcelLocationRows(
            createExcelFile([createCells(), createCells()]),
        );

        expect(result.rows.length).toBe(1);
        expect(result.sourceRows.length).toBe(2);

        expect(result.issues).toContain(
            jasmine.objectContaining({
                severity: 'warning',
                code: 'duplicate_hcode',
                hCode: 'H001',
                rowNumber: 2,
                relatedRowNumbers: [3],
            }),
        );

        expect(result.issues.some(issue => issue.severity === 'error'))
            .toBeFalse();
    });

    it('should fill missing values regardless of duplicate row order', async () => {
        const incomplete = createCells();
        incomplete[11] = null;

        for (const rows of [
            [incomplete, createCells()],
            [createCells(), incomplete],
        ]) {
            const result = await readExcelLocationRows(
                createExcelFile(rows),
            );

            expect(result.rows.length).toBe(1);
            expect(result.rows[0].status).toBe('Storage');
            expect(result.sourceRows.length).toBe(2);

            expect(result.issues).toContain(
                jasmine.objectContaining({
                    severity: 'warning',
                    code: 'duplicate_hcode',
                }),
            );

            expect(result.issues.some(issue => issue.severity === 'error'))
                .toBeFalse();
        }
    });

    it('should report conflicting duplicate locations as an error', async () => {
        const second = createCells();
        second[6] = 'BS-A02';

        const result = await readExcelLocationRows(
            createExcelFile([createCells(), second]),
        );

        const conflict = result.issues.find(
            issue => issue.code === 'conflicting_hcode',
        );

        expect(conflict).toEqual(
            jasmine.objectContaining({
                severity: 'error',
                hCode: 'H001',
                rowNumber: 2,
                relatedRowNumbers: [3],
            }),
        );

        expect(conflict?.message).toContain('location');
        expect(result.sourceRows[0].cells[6]).toBe('BS-A01');
        expect(result.sourceRows[1].cells[6]).toBe('BS-A02');
    });

    it('should preserve an incomplete item with warnings', async () => {
        const cells = createCells();

        cells[0] = null;  // customer: no warning
        cells[1] = null;  // description: warning
        cells[6] = null;  // location: warning
        cells[11] = null; // status: warning

        const result = await readExcelLocationRows(
            createExcelFile([cells]),
        );

        expect(result.rows.length).toBe(1);
        expect(result.rows[0].customer).toBeNull();
        expect(result.rows[0].description).toBeNull();
        expect(result.rows[0].location).toBeNull();
        expect(result.rows[0].status).toBeNull();

        expect(result.issues.map(issue => issue.column).sort())
            .toEqual(['description', 'location', 'status']);

        expect(result.issues.every(issue => issue.severity === 'warning'))
            .toBeTrue();
    });

    it('should report a missing H-code as a blocking error', async () => {
        const cells = createCells();
        cells[3] = '   ';

        const result = await readExcelLocationRows(
            createExcelFile([cells]),
        );

        expect(result.rows.length).toBe(0);
        expect(result.sourceRows.length).toBe(1);

        expect(result.issues).toContain(
            jasmine.objectContaining({
                severity: 'error',
                code: 'missing_value',
                column: 'object',
                rowNumber: 2,
            }),
        );
    });

    it('should report a different department as a blocking error', async () => {
        const cells = createCells();
        cells[5] = 'RUN (NL)';

        const result = await readExcelLocationRows(
            createExcelFile([cells]),
        );

        expect(result.issues).toContain(
            jasmine.objectContaining({
                severity: 'error',
                code: 'wrong_department',
                hCode: 'H001',
                column: 'department',
            }),
        );
    });

    it('should reject an unexpected report header', () => {
        const headers = [...HEADERS];
        headers[3] = 'wrong-column';

        expect(() => validateExcelHeaders(headers))
            .toThrowError('Invalid header in column 4: expected "object".');
    });

});