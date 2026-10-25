export interface HistoricalItemRecord {
    importId: string;
    hCode: string;
    articleId: string;
    locationCode: string;
    status: string;
    articleName: string;
    twelveNcNumber: string;
    customerName: string;
    length: number | null;
    width: number | null;
    unit: string | null;
    categories: string[] | null;
}
