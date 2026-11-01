export interface Article {
    id: string;
    articleName: string | null;
    twelveNcNumber: string | null;
    customerName: string | null;
    length: number | null;
    width: number | null;
    unit: string | null;
    categories: string[] | null;
    relatedArticleIds: string[] | null;
}