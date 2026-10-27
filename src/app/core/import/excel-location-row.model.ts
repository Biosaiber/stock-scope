export interface ExcelLocationRow {
    customer: string;
    description: string;
    articleNrCustomer: string;
    object: string;
    'object description': string | null;
    department: string;
    location: string;
    level: string;
    length: number | null;
    width: number | null;
    unit: string;
    status: string | null;
    amount: number;
    kinds: string | null;
    entity: string;
}