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
    severity: 'error' | 'warning';

    code:
    | 'missing_value'
    | 'invalid_value'
    | 'duplicate_hcode'
    | 'conflicting_hcode'
    | 'wrong_department';

    rowNumber: number;
    relatedRowNumbers?: number[];
    hCode?: string;
    column: string;
    message: string;
}

type CellIssueOptions = {
    rowNumber: number;
    column: string;
    issues: ImportIssue[];
    hCode?: string;
    missingSeverity?: ImportIssue['severity'];
};

function addCellIssue(
    options: CellIssueOptions,
    code: 'missing_value' | 'invalid_value',
): void {
    const severity =
        code === 'missing_value'
            ? options.missingSeverity
            : options.column === 'object'
                ? 'error'
                : 'warning';

    if (!severity) {
        return;
    }

    options.issues.push({
        severity,
        code,
        rowNumber: options.rowNumber,
        hCode: options.hCode,
        column: options.column,
        message:
            code === 'missing_value'
                ? 'Missing value.'
                : 'Invalid value.',
    });
}

function isMissing(value: unknown): boolean {
    return (
        value === null ||
        value === undefined ||
        (typeof value === 'string' && value.trim() === '')
    );
}

function readText(
    value: unknown,
    options: CellIssueOptions,
): string | null {
    if (isMissing(value)) {
        addCellIssue(options, 'missing_value');
        return null;
    }

    if (typeof value !== 'string') {
        addCellIssue(options, 'invalid_value');
        return null;
    }

    return value.trim();
}

function readNumber(
    value: unknown,
    options: CellIssueOptions,
): number | null {
    if (isMissing(value)) {
        addCellIssue(options, 'missing_value');
        return null;
    }

    if (typeof value !== 'number' || !Number.isFinite(value)) {
        addCellIssue(options, 'invalid_value');
        return null;
    }

    if (value <= 0) {
        options.issues.push({
            severity: 'warning',
            code: 'invalid_value',
            rowNumber: options.rowNumber,
            hCode: options.hCode,
            column: options.column,
            message: `Expected a number greater than zero, received ${value}.`,
        });

        return null;
    }

    return value;
}

export function parseExcelLocationRow(
    cells: unknown[],
    rowNumber: number,
    issues: ImportIssue[],
): ExcelLocationRow | null {
    const object = readText(cells[3], {
        rowNumber,
        column: 'object',
        issues,
        missingSeverity: 'error',
    });

    const text = (
        index: number,
        column: string,
        missingSeverity?: ImportIssue['severity'],
    ): string | null =>
        readText(cells[index], {
            rowNumber,
            column,
            issues,
            hCode: object ?? undefined,
            missingSeverity,
        });

    const number = (
        index: number,
        column: string,
        missingSeverity?: ImportIssue['severity'],
    ): number | null =>
        readNumber(cells[index], {
            rowNumber,
            column,
            issues,
            hCode: object ?? undefined,
            missingSeverity,
        });

    const customer = text(0, 'customer');
    const description = text(1, 'description', 'warning');
    const articleNrCustomer = text(2, 'articleNrCustomer', 'warning');
    const objectDescription = text(4, 'object description');
    const department = text(5, 'department');
    const location = text(6, 'location', 'warning');
    const level = text(7, 'level');
    const length = number(8, 'length');
    const width = number(9, 'width');
    const unit = text(10, 'unit');
    const status = text(11, 'status', 'warning');
    const amount = number(12, 'amount', 'warning');
    const kinds = text(13, 'kinds');
    const entity = text(14, 'entity');

    if (department !== null && department !== 'BS (NL)') {
        issues.push({
            severity: 'error',
            code: 'wrong_department',
            rowNumber,
            hCode: object ?? undefined,
            column: 'department',
            message: `Expected "BS (NL)", received "${department}".`,
        });
    }

    if (object === null) {
        return null;
    }

    return {
        customer,
        description,
        articleNrCustomer,
        object,
        'object description': objectDescription,
        department,
        location,
        level,
        length,
        width,
        unit,
        status,
        amount,
        kinds,
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

    const groups = new Map<
        string,
        ExcelLocationReadResult['sourceRows']
    >();

    const normalize = (value: unknown): unknown =>
        typeof value === 'string' ? value.trim() : value;

    for (let index = 1; index < cells.length; index++) {
        const cellsInRow = cells[index];

        if (cellsInRow.every(isMissing)) {
            continue;
        }

        const sourceRow = {
            rowNumber: index + 1,
            cells: [...cellsInRow],
        };

        sourceRows.push(sourceRow);

        const object = normalize(cellsInRow[3]);

        if (typeof object !== 'string' || object === '') {
            // Collect all cell issues, including the blocking H-code error.
            parseExcelLocationRow(cellsInRow, sourceRow.rowNumber, issues);
            continue;
        }

        const group = groups.get(object);

        if (group) {
            group.push(sourceRow);
        } else {
            groups.set(object, [sourceRow]);
        }
    }

    if (sourceRows.length === 0) {
        throw new Error('Excel worksheet contains no data rows.');
    }

    for (const [hCode, group] of groups) {
        const first = group[0];
        const mergedCells = first.cells.map(normalize);
        const conflictingColumns = new Set<string>();

        for (const source of group.slice(1)) {
            for (let index = 0; index < EXPECTED_HEADERS.length; index++) {
                const current = mergedCells[index];
                const incoming = normalize(source.cells[index]);

                if (isMissing(current)) {
                    mergedCells[index] = incoming;
                } else if (!isMissing(incoming) && current !== incoming) {
                    conflictingColumns.add(EXPECTED_HEADERS[index]);
                }
            }
        }

        if (group.length > 1) {
            const hasConflict = conflictingColumns.size > 0;

            issues.push({
                severity: hasConflict ? 'error' : 'warning',
                code: hasConflict ? 'conflicting_hcode' : 'duplicate_hcode',
                rowNumber: first.rowNumber,
                relatedRowNumbers: group.slice(1).map(row => row.rowNumber),
                hCode,
                column: 'object',
                message: hasConflict
                    ? `Conflicting duplicate rows: ${group
                        .map(row => row.rowNumber)
                        .join(', ')}. Different values in: ${[
                            ...conflictingColumns,
                        ].join(', ')}.`
                    : `Duplicate rows: ${group
                        .map(row => row.rowNumber)
                        .join(', ')}. Combined into one item.`,
            });
        }

        // Validate every original department so merging cannot hide an error.
        for (const source of group.slice(1)) {
            const department = normalize(source.cells[5]);

            if (!isMissing(department) && department !== 'BS (NL)') {
                issues.push({
                    severity: 'error',
                    code: 'wrong_department',
                    rowNumber: source.rowNumber,
                    hCode,
                    column: 'department',
                    message: `Expected "BS (NL)", received "${String(department)}".`,
                });
            }
        }

        const parsedRow = parseExcelLocationRow(
            mergedCells,
            first.rowNumber,
            issues,
        );

        if (parsedRow !== null) {
            rows.push(parsedRow);
        }
    }

    return {
        rows,
        issues,
        sourceRows,
    };
}