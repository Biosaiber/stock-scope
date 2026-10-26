export interface Location {
    code: string;
    department: string; 
    length: number | null;
    width: number | null;
    height: number | null;
    lastCheckedAt: string | null;
    capacity: number | null;
}