import type { PushWorkflowType } from './push-article-config.model';

export type ReviewState = 'open' | 'waiting_for_verification' | 'resolved';

export type ReviewReason = 'push_item' | 'wrong_status' | 'unexpected_mixed_item' | 'low_occupancy' | 'nearly_full_occupancy' | 'full_occupancy' | 'over_capacity';

export type ReviewTarget = { type: 'item'; hCode: string } | { type: 'location'; locationCode: string };

export type ReviewEventSource = 'import' | 'user_action' | 'configuration_change';

export type ReviewResolutionReason = 'condition_cleared' | 'item_no_longer_present' | 'push_configuration_removed' | 'capacity_unavailable';

export interface Review {
    id: string;
    reason: ReviewReason;
    state: ReviewState;
    target: ReviewTarget;
    detectedAt: string;
    history: ReviewHistoryEvent[];
}
export interface ReviewHistoryEvent {
    fromState: ReviewState | null;
    toState: ReviewState;
    occurredAt: string;
    source: ReviewEventSource;
    importId: string | null;
    resolutionReason: ReviewResolutionReason | null;
    workflowChange: {
        from: PushWorkflowType;
        to: PushWorkflowType;
    } | null;
}