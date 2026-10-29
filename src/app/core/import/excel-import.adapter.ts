import type { Item } from "../models/item.model";
import type { Article } from "../models/article.model";
import type { Location } from "../models/location.model";
import type { ExcelImportResult } from "./excel-import-result.model";

import type { ExcelLocationRow } from "./excel-location-row.model";


export function mapRowToItem(
    row: ExcelLocationRow,
    articleId: string,
): Item {
    return {
        hCode: row.object.trim(),
        articleId,
        locationCode: row.location?.trim() || null,
        status: row.status?.trim() || null,
    };
}

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
        articleName: row.description?.trim() || null,
        twelveNcNumber: row.articleNrCustomer?.trim() || null,
        customerName: row.customer?.trim() || null,
        length: row.length,
        width: row.width,
        unit: row.unit?.trim() || null,
        categories: categories?.length ? categories : null,
        relatedArticleIds: null,
    };
}

export function mapRowToLocation(
    row: ExcelLocationRow,
): Location {
    const code = row.location?.trim();

    if (!code) {
        throw new Error('Cannot create a location without a code.');
    }

    return {
        code,
        department: row.department?.trim() || null,
        length: null,
        width: null,
        height: null,
        lastCheckedAt: null,
        capacity: null,
    };
}

function getArticleKey(row: ExcelLocationRow): string {
    const article = mapRowToArticle(row, '');

    // Without a name and article number, keep the article item-specific.
    if (!article.articleName && !article.twelveNcNumber) {
        return `item-article:${row.object.trim()}`;
    }

    const categories = article.categories
        ? [...new Set(article.categories)].sort()
        : null;

    return `article:${JSON.stringify([
        article.articleName,
        article.twelveNcNumber,
        article.customerName,
        article.length,
        article.width,
        article.unit,
        categories,
    ])}`;
}

export function mapRowsToImportResult(
    rows: ExcelLocationRow[],
): ExcelImportResult {
    const articles = new Map<string, Article>();
    const locations = new Map<string, Location>();
    const items: Item[] = [];
    const seenHCodes = new Set<string>();

    for (const row of rows) {
        const hCode = row.object.trim();
        const locationCode = row.location?.trim() || null;

        if (!hCode) {
            throw new Error('Missing item H-code.');
        }

        if (seenHCodes.has(hCode)) {
            throw new Error(`Duplicate item H-code "${hCode}".`);
        }

        // Temporary identity per item until article grouping is implemented.
        const articleId = getArticleKey(row);

        if (!articles.has(articleId)) {
            articles.set(articleId, mapRowToArticle(row, articleId));
        }

        if (locationCode && !locations.has(locationCode)) {
            locations.set(locationCode, mapRowToLocation(row));
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