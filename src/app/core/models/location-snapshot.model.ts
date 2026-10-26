import type { ReviewReason } from './review.model';

export interface LocationSnapshot {
    importId: string;
    locationCode: string;
    capacity: number | null;
    itemCount: number;
    occupancyPercent: number | null;
    activeReviewCount: number;
    activeReviewCountsByReason: Record<ReviewReason, number>;
}