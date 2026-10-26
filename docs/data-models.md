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