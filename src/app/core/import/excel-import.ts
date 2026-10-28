import { readExcelLocationRows } from "./excel-import.reader";
import { mapRowsToImportResult } from "./excel-import.adapter";
import type { ExcelImportResult } from "./excel-import-result.model";

export async function importExcel(
    file: File,
): Promise<ExcelImportResult> {
    const result = await readExcelLocationRows(file);

    if (result.issues.length > 0) {
        throw new Error(
            result.issues
                .map(issue =>
                    `Row ${issue.rowNumber}: ${issue.message} (${issue.column})`
                )
                .join('\n'),
        );
    }

    return mapRowsToImportResult(result.rows);
}