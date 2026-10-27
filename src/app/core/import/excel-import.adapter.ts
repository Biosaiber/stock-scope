import type { Item } from "../models/item.model";
import type { ExcelLocationRow } from "./excel-location-row.model";

export function mapRowToItem(
    row: ExcelLocationRow,
    articleId: string, 
): Item {
    const status = row.status?.trim();

    if (!status) {
        throw new Error(`Missing status for item "${row.object}".`);
    }

    return {
        hCode: row.object.trim(),
        articleId,
        locationCode: row.location.trim(),
        status,
    };
}






