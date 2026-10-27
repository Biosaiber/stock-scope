import type { Item } from "../models/item.model";
import type { Article } from "../models/article.model";
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






