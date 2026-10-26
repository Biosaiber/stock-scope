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

