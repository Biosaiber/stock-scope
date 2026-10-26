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