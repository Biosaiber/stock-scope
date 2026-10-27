import { readExcelLocationRows } from "./excel-import.reader";
import { mapRowsToImportResult } from "./excel-import.adapter";
import type { ExcelImportResult } from "./excel-import-result.model";

export async function importExcel(
    file: File,
): Promise<ExcelImportResult> {
    const rows = await readExcelLocationRows(file);

    return mapRowsToImportResult(rows);
}