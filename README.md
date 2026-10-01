<p align="center">

&#x20; <img *src*="./assets/stockscope-banner.png" *alt*="StockScope – See what matters" *width*="100%">

</p>

<p align="center">

&#x20; <strong>Warehouse stock visualization and analysis application.</strong>

</p>

---

## About StockScope

I work with warehouse stock every day and often see the same problem:

the data already exists, but getting a simple and useful answer from it can take too much time.

The goal of StockScope is not to replace, duplicate or compete with the existing warehouse management system.

StockScope works as an additional layer on top of the warehouse data that already exists.

Its purpose is to make that data easier to see, understand and use, and to help turn it into useful operational information.

---

# Architecture

StockScope is a warehouse stock visualization and analysis application.

I work with warehouse stock every day and often see the same problem: the data already exists, but getting a simple and useful answer from it can take too much time.

The goal of StockScope is not to replace, duplicate or compete with the existing warehouse management system.

StockScope should work as an additional layer on top of the warehouse data that already exists.

Its purpose is to make that data easier to see, understand and use, and to help turn it into useful operational information.

---

## Development Roadmap

StockScope will be developed in three main phases.

****Phase 1 – Warehouse Visual**** &#x20;

****Phase 2 – Warehouse Intelligence**** &#x20;

****Phase 3 – Advanced Capacity, History & AI****

Each phase should produce something useful on its own.

---

### Phase 1 – Warehouse Visual

#### Goal

The first version should turn the existing Location Report into a clear visual overview of the warehouse.

The warehouse layout is still changing, so StockScope should not depend on having final location dimensions or a final warehouse map before development can start.

---

#### Data Import

The first version can use the existing Location Report.

Data flow:

****Location Report → Excel Import → Data Adapter → StockScope Models → Application****

StockScope should work with its own internal models.

If API access becomes available later, Excel can be replaced by an API adapter without rebuilding the main application.

Future flow:

****HQ API → API Adapter → StockScope Models → Application****

---

#### Data Snapshots

StockScope should start preserving warehouse snapshots as early as possible.

Each imported report can represent the state of the warehouse at a specific point in time.

These snapshots do not need to provide advanced historical analytics in Phase 1.

The purpose is to start building historical data that can be used by later versions of StockScope.

Possible information to preserve includes:

- import date and time

- total number of objects

- objects per location

- article quantities

- statuses

- location occupancy

- Push Items

Starting this early prevents useful historical information from being lost before the historical analysis features are developed.

---

#### Warehouse Overview

The main screen should visually show warehouse locations and useful information such as:

- current number of objects

- maximum configured capacity

- occupancy percentage

- available capacity

- status warnings

- Push Items

- other conditions requiring attention

Example:

****BS-F08 | 302 / 356 | 84.8%****

Selecting a location should open its details.

---

#### Warehouse Views

The Warehouse Overview should support two ways of looking at the same warehouse data.

##### Compact View

The Compact View should provide a structured overview of all warehouse locations.

Locations can be displayed as regular visual blocks or columns showing the most important information at a glance, such as:

- location code

- occupancy

- available capacity

- status warnings

- Push Items

- other conditions requiring attention

The purpose of this view is to quickly understand the current state of the warehouse without depending on the physical warehouse layout.

##### Map View

The Map View should represent locations using the real warehouse layout.

It should use the same StockScope data as the Compact View, but show locations in their approximate physical positions inside the warehouse.

This view should make it easier to understand where stock, warnings or available capacity are physically located.

Both views should lead to the same Location Detail.

Search and filters should work across both views.

The Compact View can be developed first because it does not depend on having a final warehouse layout.

The Map View can be added when the warehouse layout and location positions are sufficiently stable.

---

#### Location Detail

A single warehouse location can contain multiple objects and multiple article types.

This is especially important for locations containing tools, where several different articles may be stored in the same location.

A location detail should therefore be able to show multiple stock records, including:

- object numbers

- articles

- descriptions

- quantities

- statuses

- other relevant stock information

This makes it possible to move from seeing that a location has a problem to seeing exactly which objects or articles are causing it.

---

#### Manual Capacity

Until reliable location dimensions are available, maximum capacity can be configured manually.

For example:

****BS-F08 → Maximum 356****

If 302 objects are currently stored there, StockScope can calculate:

****302 / 356 → 84.8% occupied → 54 available****

The data model can already contain dimensions for future use even if they are not yet used in the calculation.

---

#### Status Visualization

Important or unusual statuses should be visible directly from the warehouse overview.

A location can show a small visual indicator when something inside requires attention.

Opening the location then shows the exact object and its status.

The purpose is to make exceptions easy to notice without filling the overview with unnecessary information.

---

#### Push Items

StockScope should support at least:

- Push Item Outbound

- Push Item ASML

For each Push Item it should be possible to see:

- item

- quantity

- location

- relevant status

- planned or expected sending day, when applicable

- note

- last modification

For example:

****NEWAYS56 | 6 pcs | BS-F08 | Thursday | Prepared for outbound****

The note or planned day provides useful operational context without turning StockScope into a planning system.

---

#### Basic Stock Control

Phase 1 should already provide a simple Stock Control view based on information available from the imported warehouse data.

It should help identify:

- unexpected statuses

- locations requiring attention

- available Push Items

- other basic stock exceptions that can be detected directly from the current data

The purpose is to help the stock controller focus on exceptions instead of manually checking everything.

More advanced Stock Control functions that depend on relationships between boxes and tools will be added in Phase 2.

---

### Phase 2 – Warehouse Intelligence

#### Goal

Phase 2 should move StockScope from simply displaying warehouse data to understanding relationships inside that data.

---

#### Complete Sets

StockScope should understand which boxes and tools create a complete set.

Relations need to support:

- ****ALL**** – every defined item is required

- ****ANY**** – one item from a group is sufficient

- ****ALL + ANY**** – mandatory items and alternative groups can exist together

StockScope should calculate how many complete sets are currently available and show where their components are located.

The components do not need to be stored in the same location.

---

#### Quantity-Based Set Calculation

The warehouse data does not always tell us which specific tool is physically paired with which specific box.

For example:

****10 boxes + 5 compatible tools = 5 possible complete sets****

StockScope therefore needs to support calculations based on quantities, not only direct object-to-object relationships.

---

#### Find New Sets

StockScope should compare:

****Empty Boxes + Loose Tools + Set Definitions → Possible New Sets****

The user should be able to see:

- which sets can be created

- how many can be created

- required components

- available quantities

- locations of those components

---

#### Advanced Stock Control

Phase 2 should extend the basic Stock Control functionality with information calculated from relationships between warehouse items.

It should add:

- possible new sets

- incomplete sets

- missing set components

- other unusual conditions discovered through set and relationship analysis

The idea remains simple:

Instead of asking:

>*&#x20;*****"What should I check?"****

StockScope should help answer:

>*&#x20;*****"These are the things worth checking."****

---

#### Basic Historical Comparison

Because StockScope has already started preserving warehouse snapshots, Phase 2 can begin using this data for simple comparisons.

This could include:

- total stock growth or decline

- changes in object quantities

- changes in location occupancy

- new or removed objects

- basic location changes

- basic status changes

The purpose at this stage is not to build advanced analytics.

It is to start using the historical data that StockScope has already collected.

---

### Phase 3 – Advanced Capacity, History & AI

#### Computed Capacity

Once reliable location and object dimensions are available, manual capacity can be replaced or supplemented by calculated capacity.

The calculation can use:

- location width / length / height

- box width / length / height

- quantity

StockScope can then calculate physical occupancy and available space more accurately.

Until then, manual capacity from Phase 1 remains the fallback.

---

#### Advanced Historical Analysis

Because warehouse snapshots are collected from the earlier phases, StockScope can gradually build a history of how the warehouse changes over time.

Later versions can use this data to analyse:

- new or removed objects

- location changes

- status changes

- stock growth or decline

- occupancy changes

- frequently moved objects

- locations that are repeatedly emptied and filled

- boxes that have not moved for a long time

Some simple comparisons, such as total stock growth or decline, may already become available earlier.

Phase 3 should focus on deeper historical analysis, trends and patterns rather than beginning the collection of historical data.

---

#### AI Suggester

AI should be added only after StockScope has reliable data and analytics.

The purpose is not simply to add a chatbot.

AI should use information already calculated by StockScope and provide useful suggestions such as:

>*&#x20;*****"6 additional complete sets can currently be created."****

>*&#x20;*****"BS-F08 is approaching its capacity."****

>*&#x20;*****"These boxes have not moved for a long period."****

>*&#x20;*****"These Push Items are currently available."****

The normal StockScope business logic should remain deterministic.

AI should sit on top of that information and help identify useful patterns and possible actions.

---

## Future Personal Project – Scanner UI Experiment

HQ Pack already has a company-wide Scanner integrated with its warehouse systems.

I do not want to replace or compete with it.

This would be a separate personal project where I could experiment with a modern scan-first warehouse workflow based on my own warehouse experience.

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

****SCAN → SEE INFORMATION → ACT****

For a common location change:

****Scan Object → Show Info + Suggested Location → Scan Actual Location → Confirmation → Enter → Ready for Next Scan****

The suggested location is only guidance.

The worker still physically scans the actual destination location.

Other actions such as Change Status should be available immediately after scanning the object without requiring unnecessary navigation.

The interface should always clearly confirm what changed and then return directly to the ready-to-scan state.

As a small additional experiment, the time between the object scan and destination scan could also be used to estimate warehouse movement times.

This would remain a personal learning and portfolio project focused mainly on fast workflow and modern warehouse UI/UX.

---

## Expected Improvements

StockScope should not only make warehouse information easier to see.

Where possible, its impact should also be measurable.

Some expected improvements include:

- less time spent searching through reports

- faster identification of stock requiring attention

- faster access to location and object information

- easier identification of available Push Items

- faster understanding of warehouse occupancy

- less manual comparison of warehouse data

- faster identification of possible complete sets in later phases

Some of these improvements can be partially quantified.

For example, the time required to find specific information using the current workflow can be estimated and later compared with the same task performed using StockScope.

Historical warehouse reports can also be used as test data to compare how easily information can be extracted using the old workflow and StockScope.

Possible measurements could include:

- time required to find a specific object

- time required to inspect a location

- time required to identify an unexpected status

- time required to find available Push Items

- time required to determine warehouse occupancy

- time required to identify components for a complete set

The purpose is not to prove that every improvement can be reduced to a number.

The goal is to have a practical way to evaluate whether StockScope actually makes warehouse work faster and easier.

---

## Architecture Process

The development of StockScope follows eleven architectural steps:

1. ****Business Analysis****

2. ****User Flow****

3. ****Data Models****

4. ****Services & State****

5. ****Components****

6. ****Routing****

7. ****Implementation****

8. ****Validation****

9. ****Testing****

10. ****Data Flow Check****

11. ****Deployment & Production****

The three phases describe ****what StockScope will gradually become****.

The eleven architecture steps describe ****how it will be designed and built****.

---

# 1. Business Analysis

## Why I Started StockScope

I work with warehouse stock every day and one problem I keep running into is that we have a lot of data, but getting a simple answer from that data can take too much time.

The information is there.

We know what boxes we have, where they are located and what they contain.

But when we need to make a decision, we often have to search through the system, filter data or export it to Excel and put the information together ourselves.

StockScope started as an idea to make this information easier to see and, more importantly, easier to use.

---

## Problems I Want to Solve

### How many complete sets do we have?

Knowing how many individual boxes we have is not always enough.

A product or shipment can require several different boxes or tools to create one complete set.

StockScope should automatically calculate how many complete sets can currently be created.

---

### Can we build a set from stock spread across different locations?

The parts needed for a set do not necessarily have to be stored together.

StockScope should answer:

>*&#x20;*****Do we currently have everything needed to make the set, and where can I find it?****

---

### Where are our Push Items?

Push Items should be easy to find without searching through a large amount of stock data.

StockScope should show:

- what is available

- how much is available

- where it is located

- relevant status

- expected or planned sending day, when applicable

- useful operational notes

---

### What is stored in each location?

A warehouse location can contain multiple objects and multiple article types.

Selecting a location should immediately show its contents, quantities, statuses and other relevant stock information.

---

### How full is the warehouse?

StockScope should visualize location occupancy and available capacity.

Initially this can use manually configured capacity.

Later it can use physical location and object dimensions.

---

### What requires attention?

Instead of manually checking every location and every stock record, StockScope should help identify exceptions.

This can include:

- unexpected statuses

- locations requiring attention

- available Push Items

- other unusual stock conditions

Later versions can add more intelligent checks based on relationships between boxes, tools and complete sets.

---

## The First Goal

The first version of StockScope should answer simple practical questions:

- ****What do we have?****

- ****Where is it?****

- ****What is inside this location?****

- ****How full is this location?****

- ****Is something here requiring attention?****

- ****Which Push Items are available?****

Later versions should also answer:

- ****How many complete sets do we have?****

- ****Can we create additional sets?****

- ****Where are the required components?****

- ****How is the warehouse changing over time?****

The first step is simple:

>*&#x20;*****Take the warehouse data we already have and turn it into information we can actually use.****

---

# 2. User Flow

The User Flow is currently focused on Phase 1.

The goal is to define how StockScope will be used during daily Stock Control work while keeping the application easy to extend in later phases.

## Main Flow

The Phase 1 flow starts with the Location Report.

Location Report → Import → Validation → Snapshot → Dashboard

Each import creates a new snapshot of the warehouse data.

StockScope keeps its own application data, such as review states and user actions, separately from the imported report.

---

## Dashboard

The Dashboard provides a quick overview of the current warehouse state.

The Phase 1 Dashboard includes:

- current warehouse occupancy

- number of Push Items

- number of Locations to Review

- latest report date and time

- Locations to Review overview

- occupancy trend

- Push Items overview

- quick access to import a new Location Report

The Dashboard should show only the most useful information and provide navigation to more detailed views.

Some dashboard space can remain reserved for functionality introduced in later phases.

---

## Locations to Review

StockScope identifies locations that may require attention.

The Dashboard shows approximately the top 8 Locations to Review with a `View All` option.

A location can have multiple review reasons at the same time.

Phase 1 review reasons:

### Location-level

- ****Low Occupancy**** – for example ≤ 15%

- ****Nearly Full**** – for example ≥ 90%

- ****Full**** – 100%

- ****Over Capacity**** – above 100%

### Item-level

- ****Wrong Status**** – an item has a status that does not match the expected storage status

- ****Unexpected / Mixed Item**** – an item does not match the expected content or rules of the location

- ****Push Item**** – an item that should not remain stored and should be moved further in the process

The exact occupancy thresholds are business rules and can be adjusted later.

Each review reason should have its own visual indicator, such as a small colored dot, so different reasons can be recognized quickly.

---

## Locations

Locations will have their own main page accessible from the sidebar.

The Locations page contains all warehouse locations and provides filtering by:

- review status

- review reason

- occupancy

- location

- other relevant properties

`View All` from the Dashboard's Locations to Review section opens the same Locations page with the appropriate review filter already applied.

Selecting a location opens its Location Detail page.

---

## Location Detail

A Location Detail page represents one warehouse location.

It will provide access to:

- location information

- occupancy

- active review reasons

- items currently stored at the location

- review status

- location history

Selecting an individual item can open an Item Detail modal without leaving the Location Detail page.

The detailed design of the Location Detail page will be defined later in the User Flow process.

---

## Review Workflow

Reviews are not automatically considered resolved when a user performs an action.

A review can move through the following states:

Open → Handled → Waiting for Verification → Resolved

A user can mark an individual review as `Handled`.

This action is stored by StockScope and is not overwritten by a new Excel import.

The next imported snapshot verifies the review.

If the problem no longer exists:

Handled → Resolved

If the problem is still detected:

Handled → Open Again

Reviews belong to the specific problem, not automatically to the entire location.

This allows one location to contain several independent reviews with different states.

---

## Review History

StockScope keeps review actions and results in its own application data.

This allows the application to remember that a review was previously handled even after another Location Report is imported.

A simple history can record events such as:

- review detected

- marked as handled

- verified as resolved

- detected again

Resolved reviews no longer need to appear in the active Locations to Review list but remain available in history.

The Dashboard can also show a simple overview such as:

Locations to Review: 24 &#x20;

18 Open · 6 Handled

---

## Snapshots and Trends

Each Location Report import creates a warehouse snapshot.

Multiple snapshots can exist during the same day.

For simple daily trends, StockScope uses:

- the latest available snapshot for the current day

- the final snapshot of previous days

This allows Phase 1 to provide basic trends without requiring advanced analytics.

For example:

29 Sep → 61% &#x20;

30 Sep → 64% &#x20;

Today → 68%

The same snapshot data can later support trends such as the number of Locations to Review.

A small trend can be displayed on the Dashboard.

Selecting `View Trends` opens the dedicated Trends page.

Advanced historical analysis remains part of later development phases.

---

## Phase 1 Navigation

The initial main navigation is:

- Dashboard

- Locations

- Push Items

- Trends

- Import Data

The navigation should remain simple and can be extended when functionality from later phases is introduced.

---

## Phase 1 User Flow

Import Location Report &#x20;

→ Validate and create snapshot &#x20;

→ Dashboard &#x20;

→ Locations to Review &#x20;

→ View All / Locations &#x20;

→ Filter locations &#x20;

→ Location Detail &#x20;

→ Review specific issue &#x20;

→ Mark as Handled &#x20;

→ Import new Location Report &#x20;

→ Verify review &#x20;

→ Resolved or Open Again &#x20;

→ History

---

# 3. Data Models

---

# 4. Services & State

---

# 5. Components

## UI Design System

StockScope should use a small and consistent design system instead of styling individual components independently.

The design system should eventually define reusable rules for:

- spacing

- typography

- colors

- status indicators

- buttons

- cards

- tables

- location blocks

- warnings

- responsive layout

Reusable Angular components and shared design tokens should be preferred over repeating component-specific CSS.

The specific styling technology does not need to be decided yet.

---

# 6. Routing

---

# 7. Implementation

---

# 8. Validation

---

# 9. Testing

---

# 10. Data Flow Check

---

# 11. Deployment & Production

---

# Personal Notes

## What is a Data Adapter?

A Data Adapter is a layer between external data and the internal StockScope models.

For example, the Location Report may contain data using names, columns and structures defined by the existing warehouse system.

StockScope should not make the whole application depend directly on that structure.

Instead:

****Location Report → Excel Import → Data Adapter → StockScope Models → Application****

The Data Adapter reads the imported warehouse data and translates it into the internal structure expected by StockScope.

For example:

****External Excel data****

`Location = BS-F08` &#x20;

`Article Description = NEWAYS56` &#x20;

`Qty = 6`

can be transformed into a StockScope object with properties defined by our own models.

The rest of the application then works with the StockScope model instead of directly with the Excel structure.

---

## What is an API Adapter?

An API Adapter has the same responsibility.

The difference is the source of the data.

Instead of receiving data from an imported Excel report:

****HQ API → API Adapter → StockScope Models → Application****

The API Adapter translates the data returned by the API into the same StockScope models.

This means the main application does not need to care whether the data originally came from Excel or an API.

Today:

****Excel → Data Adapter → StockScope****

Later:

****API → API Adapter → StockScope****

The source changes.

The StockScope application does not need to be rebuilt around a completely different data structure.

That is the main reason for having the adapter layer.