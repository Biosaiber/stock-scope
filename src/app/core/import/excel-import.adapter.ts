import type { Item } from "../models/item.model";
import type { Article } from "../models/article.model";
import type { Location } from "../models/location.model";
import type { ExcelImportResult } from "./excel-import-result.model";

import type { ExcelLocationRow } from "./excel-location-row.model";


//Item
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

//Article
export function mapRowToArticle(
    row: ExcelLocationRow,
    articleId: string,
): Article {
    const categories = row.kinds
        ?.split(',')
        .map(category => category.trim())
        .filter(category => category.length > 0);

    return {
        id: articleId,
        articleName: row.description.trim(),
        twelveNcNumber: row.articleNrCustomer.trim(),
        customerName: row.customer.trim(),
        length: row.length,
        width: row.width,
        unit: row.unit.trim() || null,
        categories: categories?.length ? categories : null,
        relatedArticleIds: null,
    };

}

//Location
export function mapRowToLocation(
    row: ExcelLocationRow,
): Location {
    return {
        code: row.location.trim(),
        department: row.department.trim(),
        length: null,
        width: null,
        height: null,
        lastCheckedAt: null,
        capacity: null,
    };
}

//Import result
export function mapRowsToImportResult(
    rows: ExcelLocationRow[],
): ExcelImportResult {
    const articles = new Map<string, Article>();
    const locations = new Map<string, Location>();
    const items: Item[] = [];
    const seenHCodes = new Set<string>();

    for (const row of rows) {
        const articleId = row.description.trim();
        const locationCode = row.location.trim();
        const hCode = row.object.trim();

        if (!articleId) {
            throw new Error(`Missing article description for item "${row.object}".`);
        }

        if (!locationCode) {
            throw new Error(`Missing location for item "${row.object}".`);
        }

        if (!articles.has(articleId)) {
            articles.set(articleId, mapRowToArticle(row, articleId));
        }

        if (!locations.has(locationCode)) {
            locations.set(locationCode, mapRowToLocation(row));
        }
        if (!hCode) {
            throw new Error('Missing item H-code.');
        }

        if (seenHCodes.has(hCode)) {
            throw new Error(`Duplicate item H-code "${hCode}".`);
        }

        items.push(mapRowToItem(row, articleId));
        seenHCodes.add(hCode);
    }

    return {
        articles: Array.from(articles.values()),
        items,
        locations: Array.from(locations.values()),
    };
}


