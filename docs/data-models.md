# StockScope – Data Models

## Article

An Article describes a type of box or packaging.
Multiple physical items can use the same article.

Each item links to its article through `articleId`.
The article holds shared information, such as its name,
12NC number, customer and dimensions.

```ts
export interface Article {
    id: string;
    articleName: string;
    twelveNcNumber: string;
    customerName: string;
    length: number | null;
    width: number | null;
    unit: string | null;
    categories: string[] | null;
    relatedArticleIds: string[] | null;
}
```

### Rules

- Length and width are stored in metres.
- `null` means that a value is unknown or has not been set.
- `relatedArticleIds` links articles that belong together,
  for example a box and its matching lid.
- These links describe article relationships. They do not tell us
  which physical items form a set.

## Item

An Item is one physical box or piece of packaging.
It has its own code, stored as `hCode`.

It links to an article through `articleId` and to its current
location through `locationCode`.

```ts
export interface Item {
    hCode: string;
    articleId: string;
    locationCode: string;
    status: string;
}
```

### Rules

- `hCode` identifies one physical item. The code can start with H or R of F.
- Multiple items can use the same article.
- `locationCode` tells us where the item is in the latest confirmed report.
- `status` stores the status from the report as text.
- Item notes are stored separately in `ItemAnnotation`.
- Previous locations and statuses are kept in `HistoricalItemRecord`.

## Location

A Location is a place in the warehouse where items can be stored.
Each location has its own code and belongs to a department.

It holds the dimensions, capacity and the time of the last
completed physical check.

```ts
export interface Location {
    code: string;
    department: string;
    length: number | null;
    width: number | null;
    height: number | null;
    lastCheckedAt: string | null;
    capacity: number | null;
}
```

### Rules

- `code` identifies the location.
- Items link to the location through `locationCode`.
- Length, width and height are stored in metres.
- `capacity` is the number of items the location can hold.
  It must be greater than zero, or `null` when unknown.
- An empty location has zero items. This does not mean its capacity is zero.
- `lastCheckedAt` stores the time of the latest completed physical check.
  It is `null` if no check has been recorded.
- Clicking Checked creates a `LocationCheck` and updates `lastCheckedAt`.
  It does not change Review states.
- Historical capacity and occupancy are kept in `LocationSnapshot`.

## PushArticleConfig

PushArticleConfig marks an article for the push workflow.
It stores the workflow type, an optional sending day and a note.

The setting belongs to the article, so we do not need to configure
each physical item separately.

```ts
export type PushWorkflowType = 'ASML' | 'OUTBOUND';

export type PushDayType =
    | 'mon'
    | 'tue'
    | 'wed'
    | 'thu'
    | 'fri'
    | 'sat'
    | 'sun'
    | 'every-day'
    | null;

export interface PushArticleConfig {
    articleId: string;
    note: string | null;
    workflowType: PushWorkflowType;
    pushDay: PushDayType;
    updatedAt: string;
}
```

### Rules

- Each article can have one push configuration.
- `articleId` links the configuration to the article.
- `workflowType` selects the ASML or OUTBOUND workflow.
- `pushDay` gives the planned or expected sending day.
- `every-day` means the article is expected to be sent every day.
- `null` means no day has been set. The article is still a push article.
- The day and note give useful context. They do not create a shipping schedule.
- `updatedAt` stores the time of the latest configuration change.
- Items that meet the push conditions can have a `push_item` Review.
- Removing the configuration resolves its active `push_item` Reviews
  with the reason `push_configuration_removed`.
  Other Review reasons are not affected.

## ItemAnnotation

ItemAnnotation stores a note for one physical item.
It links to the item through `hCode`.

We keep the note separate from imported item data,
so a new report does not overwrite it.

```ts
export interface ItemAnnotation {
    hCode: string;
    note: string | null;
    noteUpdatedAt: string | null;
}
```

### Rules

- Each item can have one annotation record.
- `hCode` identifies the item the note belongs to.
- `note` is `null` when no note is stored.
- `noteUpdatedAt` stores the time when the note was last changed.
  It is `null` if the note has never been changed.
- Editing or clearing a note updates `noteUpdatedAt`.
- A new import does not overwrite or remove the annotation.
- The note belongs to the physical item, so it stays with it
  when the item moves to another location.

## LocationCheck

LocationCheck records when a physical check of a location was completed.

After checking the items, putting boxes back and leaving the location
tidy, the user clicks Checked before moving on.

```ts
export interface LocationCheck {
    id: string;
    locationCode: string;
    checkedAt: string;
}
```

### Rules

- Each click on Checked creates a new record with its own `id`.
- `locationCode` links the check to the location.
- `checkedAt` stores the date and time of the completed check.
- The same time is saved in `Location.lastCheckedAt`.
- Previous check records stay in the history.
- Checked does not change Review states.
- Handled is used separately for problems the user has acted on.
  These Reviews wait for verification by the next successful import.

## Review

A Review points out something that needs attention.
It can belong to one item or one location.

It keeps the reason, current state and a history of events.

```ts
import type { PushWorkflowType } from './push-article-config.model';

export type ReviewState =
    | 'open'
    | 'waiting_for_verification'
    | 'resolved';

export type ReviewReason =
    | 'push_item'
    | 'wrong_status'
    | 'unexpected_mixed_item'
    | 'low_occupancy'
    | 'nearly_full_occupancy'
    | 'full_occupancy'
    | 'over_capacity';

export type ReviewTarget =
    | { type: 'item'; hCode: string }
    | { type: 'location'; locationCode: string };

export type ReviewEventSource =
    | 'import'
    | 'user_action'
    | 'configuration_change';

export type ReviewResolutionReason =
    | 'condition_cleared'
    | 'item_no_longer_present'
    | 'push_configuration_removed'
    | 'capacity_unavailable';

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
```

### States

- `open`: the issue has been detected and has not been marked Handled.
- `waiting_for_verification`: the user clicked Handled.
  We are waiting for a successful import to check the result.
- `resolved`: the condition no longer applies or can no longer be checked.

Both `open` and `waiting_for_verification` count as active Reviews.

### Lifecycle

- Only one active Review can exist for the same target and reason.
- Clicking Handled changes `open` to `waiting_for_verification`.
- If the next successful import still shows the same condition,
  the existing Review and its state stay unchanged.
- If the condition disappears, the Review becomes `resolved`.
- If the problem returns after resolution, a new Review is created
  with a new `id`. The previous Review stays in the history.
- An item Review stays with its `hCode` when the item moves.
- Clicking Checked on a location does not change its Reviews.

### Resolution reasons

| Reason | Meaning |
| --- | --- |
| `condition_cleared` | The condition no longer applies. |
| `item_no_longer_present` | The item is missing from a new complete report for the same warehouse. |
| `push_configuration_removed` | The article's push configuration was removed. |
| `capacity_unavailable` | The location's capacity is no longer available, so occupancy cannot be checked. |

An item missing from a report does not prove that it was shipped.
It only tells us that it is no longer present in that report.

### Occupancy rules

| Occupancy | Review reason |
| --- | --- |
| 0% to 15%, including both limits | `low_occupancy` |
| Above 15% and below 90% | No occupancy Review |
| 90% to below 100% | `nearly_full_occupancy` |
| Exactly 100% | `full_occupancy` |
| Above 100% | `over_capacity` |

- Empty locations with a known capacity also get `low_occupancy`.
- Unknown capacity means no occupancy Review can be created.
- Limits are checked before rounding the displayed percentage.
- The low and nearly full limits are kept in configuration
  so they can be adjusted later.

### Event history

- `detectedAt` stores when this Review was first detected.
- The first event has `fromState: null` and `toState: 'open'`.
- Each event records its time and source.
- `importId` identifies the import that caused the event.
  It is `null` for events caused by user actions or configuration changes.
- `resolutionReason` is filled when the Review is resolved.
  Otherwise, it is `null`.
- If a push workflow changes and the item still meets the push conditions,
  the Review keeps its `id` and state.
  An event records the old and new workflow in `workflowChange`.
- For a workflow change event, `fromState` and `toState` are the same.
- `workflowChange` is `null` for other events.
- Previous events are kept unchanged.

## Import

An Import records one report successfully added to StockScope.
It keeps the file name, report date, confirmation time
and a reference to the original Excel file.

```ts
export interface Import {
    id: string;
    fileName: string;
    reportDate: string;
    confirmedAt: string;
    fileHash: string;
    archiveFileKey: string;
}
```

### Rules

- `id` identifies the import.
- `fileName` stores the original file name.
- `reportDate` stores the date the report describes,
  in `YYYY-MM-DD` format.
- `confirmedAt` stores when the import was successfully confirmed,
  as an ISO timestamp.
- The report date and confirmation time can be different.
- Multiple reports can be imported on the same day.

### File hash

- `fileHash` is a fingerprint calculated from the file's contents.
- It helps detect the same file uploaded again,
  even if the file has been renamed.
- The hash does not store the file or explain what changed.
- A new Excel export can have a different hash even when warehouse
  data is unchanged, because file metadata may be different.

### Original file

- The original Excel file must be archived as part of the import.
- `archiveFileKey` tells the application where to find it.
- If archiving fails, the import cannot be completed.

### All-or-nothing

- Validation and preview happen before confirmation.
- A successful import applies all its changes together.
- If the import fails or the user cancels it,
  current data, Reviews and history stay unchanged.
- Historical item records and snapshots link to this import
  through `importId`.
- After confirmation, these historical records and snapshots
  are not rewritten.

## HistoricalItemRecord

HistoricalItemRecord keeps an item's data from one confirmed import.

An item can move or change status later.
This record keeps its location, status and article details
as they were in that report.

```ts
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
```

### Rules

- `importId` links the record to its confirmed import.
- `hCode` identifies the physical item.
- The combination of `importId` and `hCode` must be unique.
  One item has only one record in each import.
- Location, status and article details are copied from that import.
- Length and width are stored in metres.
- Later changes to Item or Article do not change this record.
- The report date and confirmation time are available through
  `importId`, so we do not store them again here.
- Item notes and configured article relationships are not copied
  into this record.
- Records stay in the history even if the item is no longer
  present in a later report.