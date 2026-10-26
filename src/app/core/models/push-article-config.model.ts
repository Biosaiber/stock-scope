export type PushWorkflowType = 'ASML' | 'OUTBOUND';

export type PushDayType = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun' | 'every-day'| null;

export interface PushArticleConfig {
    articleId: string;
    note: string | null;
    workflowType: PushWorkflowType;
    pushDay: PushDayType;
    updatedAt: string; 
}