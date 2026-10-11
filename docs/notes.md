# Personal Notes

## What is a Data Adapter?

A Data Adapter is a layer between external data and the internal StockScope models.

For example, the Location Report may contain data using names, columns and structures defined by the existing warehouse system.

StockScope should not make the whole application depend directly on that structure.

Instead:

**Location Report → Excel Import → Data Adapter → StockScope Models → Application**

The Data Adapter reads the imported warehouse data and translates it into the internal structure expected by StockScope.

For example:

**External Excel data**

`Location = BS-F08`

`Article Description = NEWAYS56`

`Qty = 6`

can be transformed into a StockScope object with properties defined by our own models.

The rest of the application then works with the StockScope model instead of directly with the Excel structure.

---

## What is an API Adapter?

An API Adapter has the same responsibility.

The difference is the source of the data.

Instead of receiving data from an imported Excel report:

**HQ API → API Adapter → StockScope Models → Application**

The API Adapter translates the data returned by the API into the same StockScope models.

This means the main application does not need to care whether the data originally came from Excel or an API.

Today:

**Excel → Data Adapter → StockScope**

Later:

**API → API Adapter → StockScope**

The source changes.

The StockScope application does not need to be rebuilt around a completely different data structure.

That is the main reason for having the adapter layer.
