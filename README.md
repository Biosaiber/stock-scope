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

The Locations page is the central place for browsing and reviewing warehouse locations.

StockScope uses one Locations page with different filter states instead of separate pages for different workflows.

The current filter and sorting state should be represented by query parameters.

Examples:

`/locations`

`/locations?status=review&sort=priority`

`/locations?status=handled`

This allows the same page to be opened from different parts of the application with the appropriate view already selected.

The page includes:

- reactive search by location code
- All, To Review and Handled views
- Review Reason filter
- minimum and maximum occupancy filter
- sorting
- location count

Review Reason filters should display the current number of matching locations.

Reasons with no current matches should remain visible but disabled.

Each location row should show:

- location code
- occupancy
- item count
- active reviews
- last checked

Hovering over the item count can provide a small preview of article names without opening the location.

Clicking a location opens the Location Detail page.

`Last Checked` represents the last time the location was physically inspected during Stock Control work.

A location can be marked as Checked independently from its review state.

For priority sorting, a location is ordered according to its highest-priority active review.

Current review priority from lowest to highest:

1. Low Occupancy
2. Nearly Full
3. Unexpected / Mixed Item
4. Wrong Status
5. Push Item
6. Full
7. Over Capacity

`View All` from the Dashboard's Locations to Review section opens the same Locations page with the To Review filter and priority sorting already applied.

Future versions may expand reactive search to find locations by article or barcode, for example `NEWAYS56`, `H343791` or `DUONXE-03`.

Future versions should also evaluate whether users should be able to manually add a location to review when an issue is discovered during physical Stock Control work.

---

## Location Detail

The Location Detail page represents one warehouse location and should provide immediate access to the information needed during Stock Control work.

The page should remain compact. The user should be able to open a location and quickly see its current state, active reviews and all items stored there without navigating through additional pages.

Selecting an individual H-code opens the Item Detail modal without leaving the current Location Detail context.

### Location Overview

The top of the page provides a compact overview of the location.

It should include:

- location code
- current occupancy
- total number of items
- number of active reviews
- articles currently present at the location
- last physical check
- capacity, when available

The active review count includes both location-level and item-level active reviews.

The article overview can show the article name together with the number of items, for example:

`FRENCKEN07 (27) · NEWAYS56 (15)`

The header should remain compact so that the item list is visible without unnecessary scrolling.

### Location Reviews

Location-level reviews are displayed directly below the location overview.

Examples include:

- Low Occupancy
- Nearly Full
- Full
- Over Capacity

Each review can be handled individually using `Mark as Handled`.

If the location has no active location-level reviews, this section is not displayed.

Item-level reviews are not repeated in this section. They are displayed directly next to the affected item in the item list.

### Items

The Location Detail page displays all individual items currently stored at the location.

The list is not limited to a preview. If a location contains 8, 22 or 46 items, all items should be available directly on the Location Detail page.

Each item row should include:

- item ID / H-code
- article
- status
- active review, when applicable
- `Handle` action for an active item-level review

For example:

| ID | Article | Status | Review |
| --- | --- | --- | --- |
| H145784 | FRENCKEN07 | Storage | — |
| H145785 | FRENCKEN07 | Storage | Push Item |
| H145786 | NEWAYS56 | Cleaning | Wrong Status |

Item-level reviews such as `Wrong Status`, `Unexpected / Mixed Item` and `Push Item` are therefore shown directly in the context of the affected item.

### Item Filters

The item list can be filtered without leaving the Location Detail page.

Phase 1 should support:

- item ID search
- article filter
- status filter
- `All / Reviews only`

Articles available at the current location can be shown as selectable checkboxes with their item counts.

For example:

`☑ FRENCKEN07 (12)`

`☑ NEWAYS56 (7)`

`☑ DUONXE-03 (3)`

All articles are selected by default.

The user can select or deselect individual articles to quickly narrow the item list.

The page should show the number of currently displayed items, for example:

`Showing 7 of 22 items`

Filters should work together and update the visible item list without leaving the page.

### Items Page Integration

Location Detail provides the item functionality needed for working with one specific location.

A separate Items page will provide a broader view for searching and filtering items across the warehouse.

The user can open the current Location Detail item results in the Items page while preserving the relevant filter context.

For example:

`/items?location=BS-A04`

or:

`/items?location=BS-A04&article=NEWAYS56`

This allows the user to move from a location-focused workflow into a broader item-focused workflow without losing context.

### Related Articles and Sets

Phase 1 does not calculate complete sets.

However, the Location Detail design should remain compatible with future relations between articles.

For example, if `WETZLAR901` represents a box and `WETZLAR902` represents a related tool, both articles are displayed normally in Phase 1.

A later phase can use their relationship to provide information such as:

`5 complete sets · 15 empty boxes`

The future Items page should also be able to display multiple related articles together through filters.

### Mark as Checked

`Mark as Checked` represents a physical Stock Control inspection of the location.

When the user marks a location as checked:

- the `Last Checked` timestamp is updated
- the physical check is recorded in location history

Marking a location as checked does not automatically handle or resolve its active reviews.

`Checked` therefore represents a physical inspection of the location, while `Handled` represents an action taken on a specific review.

### Location History

The Location Detail page provides a compact history section.

Phase 1 should include a simple occupancy trend based on stored snapshots, for example:

`76% → 82% → 94% → 103%`

The page can also show recent activity such as:

- Over Capacity detected
- Location physically checked
- Wrong Status resolved

The goal is to provide useful recent context without turning the Location Detail page into a full analytics page.

More advanced historical analysis belongs to the dedicated Trends functionality and later development phases.

### Navigation

When a user opens Location Detail from a filtered Locations view, returning to Locations should preserve the previous context whenever possible.

For example:

`/locations?status=review&sort=priority`

→ `BS-A04`

→ Back to Locations

The user should return to the same filtered and sorted Locations view instead of being returned to the default `All Locations` view.

This allows Stock Control work to continue without repeatedly rebuilding the same filters.

---


## Item Detail

Selecting an individual H-code opens the Item Detail in a modal.

A separate Item Detail page is not required for Phase 1.

The modal allows the user to inspect a specific warehouse object without leaving the current page or losing the current filters, sorting or scroll position.

The same Item Detail modal can be opened from:

- Location Detail
- Items Page

Closing the modal returns the user to the same context from which it was opened.

### Item Information

Phase 1 should include:

- H-code
- article
- customer
- customer article number
- current location
- location level
- current status
- dimensions, when available
- Call Off information, when applicable
- active item-level reviews
- article relations

The Location Report already provides additional item information such as
customer article number, length, width, unit and kinds.

The `kinds` value does not need to be displayed directly.

When the imported `kinds` data identifies an item as belonging to a Call Off
list, StockScope should extract and display the relevant Call Off information.

For example:

`35 Call Off List ASML, RTM - Supplier Network`

can be displayed as:

`Call Off: ASML`

If no Call Off information is present, the field should not be displayed.

When dimensions are available, they should be displayed in a compact form.

Example:

`1.60 × 1.20 m`

In Phase 1, dimensions are informational.

Later phases can reuse the same data for more advanced capacity calculations.

### Relations

Relations are an important part of the Item Detail.

When relation data is available, StockScope should show the related article or articles directly in the modal.

Existing HQ data contains relation-related information such as `articleSet`. The exact relation model and available source data should be investigated during implementation.

Phase 1 should focus on displaying available relation information.

Advanced relation logic belongs to Phase 2 and may include:

- ALL / ANY requirements
- AND / OR combinations
- multiple related articles
- complete set calculations
- missing set components
- set availability analysis

### Item Reviews

Item-level reviews should be displayed directly in the Item Detail modal.

Examples include:

- Wrong Status
- Unexpected / Mixed Item
- Push Item

When a review has been addressed physically, the user can use:

`Mark as Handled`

Handled does not mean that StockScope has verified that the problem is resolved.

The review remains waiting for verification until a new warehouse report confirms whether the issue has disappeared or is still present.

### Item Image

An item or article image can be shown when existing image data is available.

Images are useful for visual identification, but they are not required for Phase 1.

The existing HQ system retrieves files through an API endpoint in the form:

`/file/{fileId}`

The mechanism that connects an article to its image file IDs still needs to be investigated.

StockScope should prefer using existing HQ images when available rather than introducing manual image uploads.

The Item Detail must remain fully usable when no image is available.

---

### Future Item Data Integration

Future versions of StockScope should evaluate additional item information available from the existing HQ system.

Potential integrations include:

- Scan History
- additional article relation data
- existing article images
- associated documents such as work instructions

Future Scan History should provide item scan history where available, including:

- scan user
- previous scans
- status changes
- location movement

This could help answer who scanned an item, when it was scanned, where it was previously located and what its previous status was.

These additional integrations are not required for Phase 1.

Phase 1 should remain functional using the Location Report as its primary data source.

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

## Items

Items will have their own main page accessible from the sidebar.

The Items page provides a global view of individual warehouse objects across all locations.

Each row represents one specific H-code.

The page should make it possible to find individual objects and compare items across multiple articles, locations, statuses and review states without navigating through individual locations first.

### Search

The Items page should provide a single reactive search field.

Phase 1 search should support:

- H-code
- article
- customer article number

Examples:

`H398913`

`ZEISS022`

`4022.674.1152x`

### Filters

The Items page should support multi-select filtering.

Phase 1 filters include:

- Article
- Location
- Status
- Review
- Size
- Call Off

Multiple values can be selected within the same filter.

Values inside one filter group use OR logic.

Different filter groups are combined using AND logic.

Example:

`(ZEISS021 OR ZEISS022) AND (BS-A01 OR BS-A04) AND Storage AND Large`

Active filters should remain visible and can be removed individually.

A `Clear All` action resets all active filters.

The page should also show how many items match the current filters.

Example:

`Showing 37 of 4,382 items`

### Size Filter

Size is an Article property.

The Location Report already provides:

- length
- width
- unit

Phase 1 should provide simple size filters:

- Small
- Medium
- Large

The exact boundaries between these categories should not be defined until the real article dimension data has been analyzed.

This avoids creating arbitrary size rules before understanding the actual warehouse data.

### Call Off

Call Off is an Article property rather than a property of an individual H-code.

When an Article belongs to a Call Off list, a small visual indicator should be displayed next to the Article in the Items table.

The indicator can provide additional information on hover.

Example:

`Call Off: ASML`

Call Off should also be available as a filter.

Selecting a Call Off filter shows all H-codes whose Article belongs to the selected Call Off.

A separate Call Off table column is not required.

### Items Table

Each table row represents one individual warehouse object.

Phase 1 should show:

- H-code
- article
- customer article number
- location
- status
- active review indicator

Selecting the H-code or item row opens the Item Detail modal.

Closing the modal returns the user to the same Items page context without losing filters, sorting or scroll position.

### Location Preview

The Location value in an item row should provide a quick preview on hover.

The preview can include:

- occupancy
- number of items
- number of active reviews
- last checked
- article counts

The preview is informational only and should not contain editing or review actions.

Selecting the Location opens its Location Detail page.

### Query Parameters

The Items page should use query parameters to represent filters and sorting where appropriate.

Examples:

`/items`

`/items?location=BS-A04`

`/items?location=BS-A04&article=NEWAYS56`

`/items?status=storage`

This allows other parts of StockScope to open the same Items page with useful filters already applied.

For example, `Open in Items Page` from Location Detail can open:

`/items?location=BS-A04`

The same Items page is therefore reused instead of creating separate pages for different item views.

### Article and Item Data

StockScope should distinguish between information belonging to an Article and information belonging to an individual warehouse object.

Article-level information can include:

- customer article number
- size
- Call Off
- relations
- image, when available

Individual H-code information can include:

- location
- level
- status
- active reviews

This distinction should be reflected later in the StockScope data models.

---

---

## Push Items

Push Items will not have a separate page in Phase 1.

The existing Items page will be reused with a Push Items quick filter.

This keeps the workflow simple and avoids duplicating item search, filtering and table functionality.

### Push Items Filter

The Items page should provide a quick filter for Push Items.

Selecting the filter shows individual H-codes whose Article is currently defined as a Push Article.

The Dashboard Push Items widget can use the same filtered Items view.

Example:

`/items?review=push-item`

The existing Items page filters remain available while the Push Items filter is active.

### Push Articles

In Phase 1, Push Item configuration belongs to the Article rather than to an individual H-code.

If an Article is configured as a Push Article, all individual H-codes belonging to that Article can be identified as Push Items.

Example:

`ICHOR06 → Push Article`

All H-codes with Article `ICHOR06` can therefore appear in the Push Items view.

This avoids manually configuring individual warehouse objects.

### Manage Push Articles

Push Articles should be managed through a modal opened from the Items page.

The modal provides a simple editable list of configured Push Articles.

Each entry can contain:

- Article
- expected sending day
- note
- last changed

Users should be able to:

- add a Push Article
- edit a Push Article
- remove a Push Article

A separate Push Items management page is not required.

### Expected Sending Day

Expected Sending Day represents an expected day of the week rather than a specific calendar date.

Examples:

- Monday
- Wednesday
- Friday

The field is optional because not every Push Article needs a regular sending day.

When an expected sending day is configured, StockScope can visually highlight Push Items when the sending day is approaching.

For example:

- one day before → sending soon
- expected sending day → expected today

This should be a visual priority indicator rather than a separate Review Reason.

The exact icon and visual styling can be decided during UI implementation.

### Notes

Each Push Article can optionally contain a short operational note.

Examples could include destination, priority or other useful context.

The note should provide operational information without turning StockScope into a planning system.

### Last Changed

StockScope should record when the Push Article configuration was last changed.

This makes it possible to understand how current the manually maintained Push Item information is.

### StockScope Business Data

Push Article configuration is StockScope-managed business data.

It should be stored independently from imported warehouse reports.

The Location Report describes the current physical warehouse state, including which H-codes and Articles exist and where they are located.

StockScope separately maintains information such as:

- whether an Article is a Push Article
- expected sending day
- note
- last changed

Importing a new Location Report should therefore not remove the Push Article configuration.

### Future Push Rules

Phase 1 uses a deliberately simple rule:

`Article → Push Article`

Future versions can extend this using Article Relations and Set Intelligence.

For example, a future Push Rule could require:

`ICHOR06 AND ICHOR07 → Complete Set → Push`

More advanced rules can later use the existing AND / OR relation logic.

This belongs to Phase 2 Warehouse Intelligence and should not complicate the Phase 1 Push Items workflow.

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

## Snapshots

Each successful Location Report import can create a warehouse snapshot.

A snapshot represents the warehouse state at a specific point in time.

Multiple snapshots can exist during the same day.

For example:

08:00 → Snapshot  
12:00 → Snapshot  
16:00 → Snapshot

All snapshots can remain stored.

For simple daily trends, StockScope uses:

- the latest available snapshot for the current day
- the final snapshot of previous days

This allows StockScope to preserve detailed import history while keeping the Phase 1 Trends view simple.

### Snapshot Data

A snapshot should preserve enough information to support Phase 1 historical trends.

This includes:

- timestamp
- warehouse occupancy
- total item count
- total active review count
- active review counts by Review Reason

Review counts should include both Location Reviews and Item Reviews.

Location Reviews:

- Low Occupancy
- Nearly Full
- Full
- Over Capacity

Item Reviews:

- Wrong Status
- Unexpected / Mixed Item
- Push Item

Historical snapshot values should not be recalculated when the current warehouse state changes.

A snapshot represents what StockScope detected at that point in time.

For example:

Monday:

`Push Items: 14`

Tuesday:

`Push Items: 9`

Even if some of Monday's Push Item reviews are later resolved, the Monday snapshot should still preserve the historical value of 14.

---

## Trends

The Trends page provides a simple historical overview of how the warehouse changes over time.

Phase 1 focuses on three main trends:

- Warehouse Occupancy
- Total Items
- Reviews

The goal is to provide useful operational history without turning Phase 1 into a complex analytics system.

### Time Period

Users should be able to change the displayed period.

Initial options can include:

- 7 days
- 30 days
- 90 days

### Warehouse Occupancy

Warehouse Occupancy shows how the overall warehouse occupancy changes over time.

The chart uses historical snapshot data.

For example:

`61% → 64% → 63% → 67% → 68%`

The page can also show:

- current value
- value at the beginning of the selected period
- change over the selected period

### Total Items

Total Items shows how the total number of individual warehouse objects changes over time.

Each concrete H-code counts as one item.

For example:

`4,210 → 4,238 → 4,301 → 4,276 → 4,382`

This provides a simple indication of whether the physical stock in the warehouse is increasing or decreasing.

### Reviews

The Reviews trend shows the number of active reviews recorded in each snapshot.

It includes both Location Reviews and Item Reviews.

Location Reviews include:

- Low Occupancy
- Nearly Full
- Full
- Over Capacity

Item Reviews include:

- Wrong Status
- Unexpected / Mixed Item
- Push Item

Users should be able to filter the Reviews trend by Review Reason.

Multiple Review Reasons can be selected when useful.

For example, selecting only `Push Item` shows the historical number of active Push Item reviews.

Selecting multiple reasons shows the combined trend for the selected Review Reasons.

### Handled and Resolved Reviews

`Handled` and `Resolved` represent different events.

`Handled` means that a user explicitly indicated that they addressed a review.

`Resolved` means that the review condition no longer exists according to newer warehouse data.

A review does not need to be manually marked as Handled before it can become Resolved.

For example, a location can have Low Occupancy in one snapshot.

No user marks the review as Handled.

Later warehouse activity fills the location.

The next report no longer meets the Low Occupancy condition.

The review can therefore become:

`Resolved by warehouse data change`

The same principle applies to Item Reviews.

For example, if a Push Item is present in one report but is no longer in the warehouse in the next report, its review can become Resolved automatically.

The historical snapshot still preserves that the Push Item existed previously.

### Review Verification

A review marked as Handled should remain waiting for verification until newer warehouse data is available.

The normal flow can be:

`OPEN → HANDLED / WAITING FOR VERIFICATION → RESOLVED`

If the condition is still present after the next import, the review can become active again.

Reviews can also follow:

`OPEN → RESOLVED`

when the condition disappears through normal warehouse activity without a manual Handled action.

This distinction allows StockScope to separate user actions from changes detected directly in warehouse data.

### Wrong Status Context

Wrong Status detection should not depend only on the item's status value.

The item's current location and warehouse context must also be considered.

For example:

`AfterCleaning + Transfer to BS`

should not automatically create a Wrong Status review.

An item with `Transfer to BS` can already be included in the Best warehouse report while still being in the incoming transfer process.

However:

`AfterCleaning + real BS storage location`

can create a Wrong Status review if that status is not valid for storage at that location.

For example:

`AfterCleaning + BS-A03 → Wrong Status`

The exact valid combinations of status and location should be defined later as Review Engine business rules.

### Dashboard Integration

A small trend overview can be displayed on the Dashboard.

Selecting `View Trends` opens the dedicated Trends page.

The full Trends page provides the longer historical view and filtering options.

### Future Analytics

More advanced warehouse analytics are outside the Phase 1 Trends scope.

Future versions can evaluate metrics such as:

- frequently moved items
- location churn
- long-term inactive items
- article growth
- set trends
- capacity trends
- AI-assisted warehouse insights

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