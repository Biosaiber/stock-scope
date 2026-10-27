import type { ExcelLocationRow } from './excel-location-row.model';
import { read, utils } from 'xlsx';

const EXPECTED_HEADERS = [
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
] as const;

export async function readExcelCells(
    file: File,
): Promise<unknown[][]> {
    const buffer = await file.arrayBuffer();
    const workbook = read(buffer);

    const sheetName = workbook.SheetNames[0];

    if (!sheetName) {
        throw new Error('Excel file contains no worksheets.');
    }

    const worksheet = workbook.Sheets[sheetName];

    if (!worksheet) {
        throw new Error(`Worksheet "${sheetName}" could not be read.`);
    }

    const rows = utils.sheet_to_json<unknown[]>(worksheet, {
        header: 1,
        raw: true,
        defval: null,
        blankrows: true,
    });

    if (rows.length === 0) {
        throw new Error('Excel worksheet is empty.');
    }

    validateExcelHeaders(rows[0]);
    return rows;
}

export function validateExcelHeaders(
    headers: unknown[],
): void {
    if (headers.length !== EXPECTED_HEADERS.length) {
        throw new Error(
            `Expected ${EXPECTED_HEADERS.length} columns, received ${headers.length}.`,
        );
    }

    EXPECTED_HEADERS.forEach((expected, index) => {
        const actual = headers[index];

        if (typeof actual !== 'string' || actual.trim() !== expected) {
            throw new Error(
                `Invalid header in column ${index + 1}: expected "${expected}".`,
            );
        }
    });
}

function readRequiredText(
    value: unknown,
    column: string,
    rowNumber: number,
): string {
    if (typeof value !== 'string' || value.trim() === '') {
        throw new Error(
            `Row ${rowNumber}: missing or invalid text in "${column}".`,
        );
    }

    return value.trim();
}

function readOptionalText(
    value: unknown,
    column: string,
    rowNumber: number,
): string | null {
    if (value === null || value === undefined) {
        return null;
    }

    if (typeof value !== 'string') {
        throw new Error(
            `Row ${rowNumber}: invalid text in "${column}".`,
        );
    }

    return value.trim() || null;
}

function readRequiredNumber(
    value: unknown,
    column: string,
    rowNumber: number,
): number {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
        throw new Error(
            `Row ${rowNumber}: missing or invalid number in "${column}".`,
        );
    }

    return value;
}

function readOptionalNumber(
    value: unknown,
    column: string,
    rowNumber: number,
): number | null {
    if (
        value === null ||
        value === undefined ||
        (typeof value === 'string' && value.trim() === '')
    ) {
        return null;
    }

    return readRequiredNumber(value, column, rowNumber);
}

export function parseExcelLocationRow(
    cells: unknown[],
    rowNumber: number,
): ExcelLocationRow {
    return {
        customer: readRequiredText(cells[0], 'customer', rowNumber),
        description: readRequiredText(cells[1], 'description', rowNumber),
        articleNrCustomer: readRequiredText(cells[2], 'articleNrCustomer', rowNumber),
        object: readRequiredText(cells[3], 'object', rowNumber),
        'object description': readOptionalText(
            cells[4],
            'object description',
            rowNumber,
        ),
        department: readRequiredText(cells[5], 'department', rowNumber),
        location: readRequiredText(cells[6], 'location', rowNumber),
        level: readRequiredText(cells[7], 'level', rowNumber),
        length: readOptionalNumber(cells[8], 'length', rowNumber),
        width: readOptionalNumber(cells[9], 'width', rowNumber),
        unit: readRequiredText(cells[10], 'unit', rowNumber),
        status: readOptionalText(cells[11], 'status', rowNumber),
        amount: readRequiredNumber(cells[12], 'amount', rowNumber),
        kinds: readOptionalText(cells[13], 'kinds', rowNumber),
        entity: readRequiredText(cells[14], 'entity', rowNumber),
    };
}

export async function readExcelLocationRows(
    file: File,
): Promise<ExcelLocationRow[]> {
    const cells = await readExcelCells(file);
    const rows: ExcelLocationRow[] = [];

    for (let index = 1; index < cells.length; index++) {
        const row = cells[index];

        const isEmpty = row.every(
            value =>
                value === null ||
                value === undefined ||
                (typeof value === 'string' && value.trim() === ''),
        );

        if (isEmpty) {
            continue;
        }

        rows.push(parseExcelLocationRow(row, index + 1));
    }

    if (rows.length === 0) {
        throw new Error('Excel worksheet contains no data rows.');
    }
    
    return rows;
}