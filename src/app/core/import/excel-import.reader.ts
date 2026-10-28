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

export interface ImportIssue {
    rowNumber: number;
    column: string;
    message: string;
}

function readRequiredText(
    value: unknown,
    column: string,
    rowNumber: number,
    issues: ImportIssue[],
): string | null {
    if (typeof value !== 'string' || value.trim() === '') {
        issues.push({
            rowNumber,
            column,
            message: 'Missing or invalid text.',
        });

        return null;
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
    issues: ImportIssue[],
): ExcelLocationRow | null {
    const customer = readRequiredText(cells[0], 'customer', rowNumber, issues);
    const description = readRequiredText(cells[1], 'description', rowNumber, issues);
    const articleNrCustomer = readRequiredText(
        cells[2], 'articleNrCustomer', rowNumber, issues,
    );
    const object = readRequiredText(cells[3], 'object', rowNumber, issues);
    const department = readRequiredText(cells[5], 'department', rowNumber, issues);
    const location = readRequiredText(cells[6], 'location', rowNumber, issues);
    const level = readRequiredText(cells[7], 'level', rowNumber, issues);
    const unit = readRequiredText(cells[10], 'unit', rowNumber, issues);
    const entity = readRequiredText(cells[14], 'entity', rowNumber, issues);

    if (
        customer === null ||
        description === null ||
        articleNrCustomer === null ||
        object === null ||
        department === null ||
        location === null ||
        level === null ||
        unit === null ||
        entity === null
    ) {
        return null;
    }

    return {
        customer,
        description,
        articleNrCustomer,
        object,
        'object description': readOptionalText(
            cells[4], 'object description', rowNumber,
        ),
        department,
        location,
        level,
        length: readOptionalNumber(cells[8], 'length', rowNumber),
        width: readOptionalNumber(cells[9], 'width', rowNumber),
        unit,
        status: readOptionalText(cells[11], 'status', rowNumber),
        amount: readRequiredNumber(cells[12], 'amount', rowNumber),
        kinds: readOptionalText(cells[13], 'kinds', rowNumber),
        entity,
    };
}

export interface ExcelLocationReadResult {
  rows: ExcelLocationRow[];
  issues: ImportIssue[];
  sourceRows: {
    rowNumber: number;
    cells: unknown[];
  }[];
}

export async function readExcelLocationRows(
  file: File,
): Promise<ExcelLocationReadResult> {
  const cells = await readExcelCells(file);
  const rows: ExcelLocationRow[] = [];
  const issues: ImportIssue[] = [];
  const sourceRows: ExcelLocationReadResult['sourceRows'] = [];

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

    const rowNumber = index + 1;

    sourceRows.push({
      rowNumber,
      cells: [...row],
    });

    const parsedRow = parseExcelLocationRow(row, rowNumber, issues);

    if (parsedRow !== null) {
      rows.push(parsedRow);
    }
  }

  if (sourceRows.length === 0) {
    throw new Error('Excel worksheet contains no data rows.');
  }

  return {
    rows,
    issues,
    sourceRows,
  };
}