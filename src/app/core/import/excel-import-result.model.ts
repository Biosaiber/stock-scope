import type { Article } from "../models/article.model";
import type { Item } from "../models/item.model";
import type { Location } from "../models/location.model";

export interface ExcelImportResult {
    articles: Article[];
    items: Item[];
    locations: Location[];
}