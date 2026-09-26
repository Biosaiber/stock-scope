# StockScope – Architecture

This document describes the architecture and development process of StockScope.

The project is divided into 11 main steps. Each step represents one part of the process, from understanding the warehouse problem to building, testing and eventually deploying the application.

---

## Architecture Overview

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

---

# 1. Business Analysis

## Why I started StockScope

I work with warehouse stock every day and one problem I keep running into is that we have a lot of data, but getting a simple answer from that data can take too much time.

The information is there. We know what boxes we have, where they are located and what they contain. But when we need to make a decision, we often have to search through the system, filter data or export it to Excel and put the information together ourselves.

StockScope started as an idea to make this information easier to see and, more importantly, easier to use.

---

## Problems I want to solve

### How many complete sets do we have?

Knowing how many individual boxes we have is not always enough.

A product or shipment can require several different boxes or tools to create one complete set.

I want StockScope to be able to answer a simple question:

> **How many complete sets can we make from the stock we currently have?**

For example:

- enough of one box for **20 sets**
- enough of another box for **15 sets**
- enough tools for only **8 sets**

In that case, we can currently make **8 complete sets**.

Instead of checking every item separately, StockScope should calculate this automatically.

---

### Can we build a set from stock that is spread across different locations?

The parts needed for a set do not necessarily have to be stored together.

Some boxes can be in one location, tools in another location and other required items somewhere else in the warehouse.

The important question is not only:

> **Where is this item?**

but also:

> **Do we currently have everything we need to make the set, and where can I find it?**

StockScope should bring this information together.

---

### Where are our Push Items?

Some items are already ready to move forward and do not need additional warehouse processing.

These Push Items should be easy to find.

Instead of searching through a large amount of stock data, I want a simple list showing:

- which Push Items are currently available
- how many are available
- where they are located

This would give the warehouse a quick overview of stock that can potentially be sent further immediately.

---

### What is actually stored in each location?

Warehouse locations can contain many different boxes and products.

StockScope should make it possible to select a location and immediately see:

- its contents
- quantities
- relevant stock information

without having to search through a large report.

---

### How full is the warehouse?

Another problem is understanding warehouse capacity.

Looking at individual stock records does not give a good overview of how the warehouse is being used.

StockScope should visualize warehouse locations and their occupancy so we can quickly see:

- which locations are full
- which locations still have capacity
- which areas of the warehouse are heavily used
- where free space is available

The goal is to turn warehouse capacity from something hidden inside data into something we can actually see.

---

## The first goal

The first version of StockScope is not intended to replace the existing warehouse management system.

It should work with the data that already exists and provide a better way to understand it.

The first version should help answer practical questions such as:

- **What do we have?**
- **Where is it?**
- **How many complete sets can we make?**
- **Do we have all the parts required for a set?**
- **Where are those parts located?**
- **Which Push Items are ready to move?**
- **How much warehouse capacity are we currently using?**

If StockScope can answer these questions quickly, it already solves a real problem.

---

## Later possibilities

Once the basic system works and enough historical data is available, StockScope could become more than a visualization tool.

A future version could analyse how stock changes over time and detect patterns that are difficult to notice manually.

For example, it could identify:

- locations that are constantly full
- items that have not moved for a long time
- unusual stock movements
- areas where capacity problems are starting to appear

AI could eventually be added on top of this data to provide suggestions rather than just information.

Instead of only showing what is happening, StockScope could start suggesting things like:

> **"These items could form 6 complete sets."**

> **"These locations are approaching their capacity."**

> **"These boxes have not moved for a long period and may be worth checking."**

> **"These Push Items are available and could potentially be moved forward."**

That is something for a later version.

The first step is much simpler:

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