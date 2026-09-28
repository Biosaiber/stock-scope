# StockScope – Architecture

StockScope is a warehouse stock visualization and analysis application.

I work with warehouse stock every day and often see the same problem: the data already exists, but getting a simple and useful answer from it can take too much time.

The goal of StockScope is not to replace the existing warehouse management system.

The goal is to take the warehouse data we already have and make it easier to see, understand and use.

---

# Development Roadmap

StockScope will be developed in three main phases.

- **Phase 1 – Warehouse Visual**
- **Phase 2 – Warehouse Intelligence**
- **Phase 3 – Advanced Capacity, History & AI**

Each phase should produce something useful on its own.

---

# Phase 1 – Warehouse Visual

## Goal

The first version should turn the existing Location Report into a clear visual overview of the warehouse.

The warehouse layout is still changing, so StockScope should not depend on having final location dimensions before development can start.

## Data Import

The first version can use the existing Location Report.

Data flow:

**Location Report → Excel Import → Data Adapter → StockScope Models → Application**

StockScope should work with its own internal models.

If API access becomes available later, Excel can be replaced by an API adapter without rebuilding the main application.

Future flow:

**HQ API → API Adapter → StockScope Models → Application**

## Warehouse Overview

The main screen should visually show warehouse locations and useful information such as:

- current number of objects
- maximum configured capacity
- occupancy percentage
- available capacity
- status warnings
- Push Items
- other conditions requiring attention

Example:

**BS-F08 | 302 / 356 | 84.8%**

Selecting a location should open its details.

## Location Detail

A location detail should show:

- object number
- article
- description
- quantity
- status
- other relevant stock information

This makes it possible to move from seeing that a location has a problem to seeing exactly which object is causing it.

## Manual Capacity

Until reliable location dimensions are available, maximum capacity can be configured manually.

For example:

**BS-F08 → Maximum 356**

If 302 objects are currently stored there, StockScope can calculate:

**302 / 356 → 84.8% occupied → 54 available**

The data model can already contain dimensions for future use even if they are not yet used in the calculation.

## Status Visualization

Important or unusual statuses should be visible directly from the warehouse overview.

A location can show a small visual indicator when something inside requires attention.

Opening the location then shows the exact object and its status.

The purpose is to make exceptions easy to notice without filling the overview with unnecessary information.

## Push Items

StockScope should support at least:

- **Push Item Outbound**
- **Push Item ASML**

For each Push Item it should be possible to see:

- item
- quantity
- location
- relevant status
- planned or expected sending day, when applicable or note
- last modification

For example:

**NEWAYS56 | 6 pcs | BS-F08 | Thursday | Prepared for outbound**

The note or planned day provide useful operational context without turning StockScope into a planning system.

---

# Phase 2 – Warehouse Intelligence

## Goal

Phase 2 should move StockScope from simply displaying warehouse data to understanding relationships inside that data.

## Complete Sets

StockScope should understand which boxes and tools create a complete set.

Relations need to support:

- **ALL** – every defined item is required
- **ANY** – one item from a group is sufficient
- **ALL + ANY** – mandatory items and alternative groups can exist together

StockScope should calculate how many complete sets are currently available and show where their components are located.

The components do not need to be stored in the same location.

## Quantity-Based Set Calculation

The warehouse data does not always tell us which specific tool is physically paired with which specific box.

For example:

**10 boxes + 5 compatible tools = 5 possible complete sets**

StockScope therefore needs to support calculations based on quantities, not only direct object-to-object relationships.

## Find New Sets

StockScope should compare:

**Empty Boxes + Loose Tools + Set Definitions → Possible New Sets**

The user should be able to see:

- which sets can be created
- how many can be created
- required components
- available quantities
- locations of those components

## Stock Control

StockScope should help the stock controller focus on exceptions instead of manually checking everything.

It could highlight:

- unexpected statuses
- locations requiring attention
- available Push Items
- possible new sets
- unusual stock conditions

The idea is simple:

Instead of asking **"What should I check?"**

StockScope should help answer **"These are the things worth checking."**

---

# Phase 3 – Advanced Capacity, History & AI

## Computed Capacity

Once reliable location and object dimensions are available, manual capacity can be replaced or supplemented by calculated capacity.

The calculation can use:

- location width / length / height
- box width / length / height
- quantity

StockScope can then calculate physical occupancy and available space more accurately.

Until then, manual capacity from Phase 1 remains the fallback.

## Historical Data

StockScope can later store regular warehouse snapshots.

Comparing snapshots can show:

- new or removed objects
- location changes
- status changes
- stock growth or decline
- occupancy changes
- frequently moved objects
- locations that are repeatedly emptied and filled
- boxes that have not moved for a long time

## AI Suggester

AI should be added only after StockScope has reliable data and analytics.

The purpose is not simply to add a chatbot.

AI should use information already calculated by StockScope and provide useful suggestions such as:

> "6 additional complete sets can currently be created."

> "BS-F08 is approaching its capacity."

> "These boxes have not moved for a long period."

> "These Push Items are currently available."

The normal StockScope business logic should remain deterministic.

AI should sit on top of that information and help identify useful patterns and possible actions.

---

# Future Personal Project – Scanner UI Experiment

HQ Pack already has a company-wide Scanner integrated with its warehouse systems.

I do not want to replace or compete with it.

This would be a separate personal project where I could experiment with a modern **scan-first warehouse workflow** based on my own warehouse experience.

The default screen should always be ready for scanning while functions such as Stock Control, Batch Scanning or Search remain easily accessible.

After scanning an object, the scanner should immediately show:

- name / article
- status
- current location
- quantity in stock
- suggested location, when available
- note or warning
- available actions
- More Details

The basic principle would be:

**SCAN → SEE INFORMATION → ACT**

For a common location change:

**Scan Object → Show Info + Suggested Location → Scan Actual Location → Confirmation → Enter → Ready for Next Scan**

The suggested location is only guidance. The worker still physically scans the actual destination location.

Other actions such as **Change Status** should be available immediately after scanning the object without requiring unnecessary navigation.

The interface should always clearly confirm what changed and then return directly to the ready-to-scan state.

As a small additional experiment, the time between the object scan and destination scan could also be used to estimate warehouse movement times.

This would remain a personal learning and portfolio project focused mainly on fast workflow and modern warehouse UI/UX.

---

# Architecture Process

The development of StockScope follows eleven architectural steps:

1. **Business Analysis**
2. **User Flow**
3. **Data Models**
4. **Services & State**
5. **Components**
6. **Routing**
7. **Implementation**
8. **Validation**
9. **Testing**
10. **Data Flow Check**
11. **Deployment & Production**

The three phases describe **what StockScope will gradually become**.

The eleven architecture steps describe **how it will be designed and built**.

---

# 1. Business Analysis

## Why I Started StockScope

I work with warehouse stock every day and one problem I keep running into is that we have a lot of data, but getting a simple answer from that data can take too much time.

The information is there. We know what boxes we have, where they are located and what they contain. But when we need to make a decision, we often have to search through the system, filter data or export it to Excel and put the information together ourselves.

StockScope started as an idea to make this information easier to see and, more importantly, easier to use.

## Problems I Want to Solve

### How many complete sets do we have?

Knowing how many individual boxes we have is not always enough.

A product or shipment can require several different boxes or tools to create one complete set.

StockScope should automatically calculate how many complete sets can currently be created.

### Can we build a set from stock spread across different locations?

The parts needed for a set do not necessarily have to be stored together.

StockScope should answer:

**Do we currently have everything needed to make the set, and where can I find it?**

### Where are our Push Items?

Push Items should be easy to find without searching through a large amount of stock data.

StockScope should show what is available, how much is available, where it is located and any useful planning information or note.

### What is stored in each location?

Selecting a location should immediately show its contents, quantities and relevant stock information.

### How full is the warehouse?

StockScope should visualize location occupancy and available capacity.

Initially this can use manually configured capacity.

Later it can use physical location and object dimensions.

---

## The First Goal

The first version of StockScope should answer simple practical questions:

- **What do we have?**
- **Where is it?**
- **What is inside this location?**
- **How full is this location?**
- **Is something here requiring attention?**
- **Which Push Items are available?**

Later versions should also answer:

- **How many complete sets do we have?**
- **Can we create additional sets?**
- **Where are the required components?**

The first step is simple:

> **Take the warehouse data we already have and turn it into information we can actually use.**

---

# 2. User Flow

# 3. Data Models

# 4. Services & State

# 5. Components

# 6. Routing

# 7. Implementation

# 8. Validation

# 9. Testing

# 10. Data Flow Check

# 11. Deployment & Production