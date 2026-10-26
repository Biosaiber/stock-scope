import type { ReviewReason } from "./review.model";

export interface WarehouseSnapshot {
    importId: string;
    totalItemCount: number;
    occupancyPercent: number | null;
    activeReviewCount: number;
    activeReviewCountsByReason: Record<ReviewReason, number>;
    totalLocationCount: number;
    locationsWithCapacityCount: number;
    totalConfiguredCapacity: number;
    itemsInLocationsWithCapacityCount: number;
}