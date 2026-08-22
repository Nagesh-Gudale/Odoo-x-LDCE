# GlobeTrotter

### Personalized Multi-City Travel Planning Platform

GlobeTrotter is a personalized travel planning application designed to make planning multi-city trips simple, interactive, and collaborative.

Users can create customized itineraries, organize travel stops, discover cities and activities, manage estimated expenses, visualize their journey, and share their travel plans with others.

---

## Problem Statement

Planning a multi-city trip often involves managing destinations, dates, activities, budgets, and travel schedules across multiple platforms.

GlobeTrotter brings these elements together into a single platform that allows travelers to:

* Create customized multi-city itineraries
* Organize cities and travel stops
* Assign dates and activities
* Discover destinations and things to do
* Estimate and track trip expenses
* Visualize trips through calendars and timelines
* Share itineraries with friends or publicly

The application is built around a **well-designed relational database** capable of managing complex travel data efficiently.

---

## Core Features

### Authentication

* User registration and login
* Email and password authentication
* Basic input validation
* Password recovery

### Dashboard

* Upcoming trips
* Recent trips
* Recommended destinations
* Budget highlights
* Quick trip creation

### Trip Planning

* Create and manage trips
* Add multiple cities/stops
* Set travel dates
* Reorder destinations
* Add activities to individual stops

### City Discovery

* Search cities
* Filter by country/region
* View destination information
* View popularity and cost indicators
* Save destinations

### Activity Discovery

* Browse activities
* Filter by category, cost, and duration
* View activity details
* Add activities to an itinerary

### Budget Management

* Estimated trip cost
* Expense categorization
* Daily expenditure
* Category-wise cost breakdown
* Budget monitoring
* Over-budget alerts

### Itinerary Visualization

* Day-wise itinerary
* Calendar view
* Timeline view
* Activity scheduling
* Activity reordering

### Sharing & Collaboration

* Share trips with other users
* Public itinerary links
* Read-only public itineraries
* Collaborative trip planning

### Profile & Preferences

* Manage profile
* Travel preferences
* Saved destinations
* Account settings

---

## Database

GlobeTrotter uses a **relational database** to manage users, trips, destinations, itineraries, activities, expenses, and sharing permissions.

The database design focuses on:

* Normalized relational structure
* Primary and foreign keys
* Referential integrity
* Data validation through constraints
* Efficient indexing
* Scalable querying
* User-specific travel data
* Proper handling of itinerary relationships

### Core Entities

```text
Users
  │
  ├── Trips
  │     │
  │     ├── Trip Stops ─── Cities
  │     │       │
  │     │       └── Activities
  │     │
  │     ├── Trip Days
  │     ├── Expenses
  │     └── Trip Shares
  │
  ├── Saved Cities
  └── User Preferences
```

The database schema will be maintained separately as the project evolves.

---

## Planned Architecture

```text
┌──────────────────────────┐
│      React Frontend      │
│   Responsive Web UI      │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│       FastAPI Backend    │
│       REST APIs          │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│       PostgreSQL         │
│     Relational Database  │
└──────────────────────────┘
             │
             ▼
┌──────────────────────────┐
│ External / Dynamic APIs   │
│ Destinations & Activities │
└──────────────────────────┘
```

---

## Technology Stack

### Frontend

* React
* Vite
* Tailwind CSS

### Backend

* FastAPI
* Python

### Database

* PostgreSQL

### Development

* Git
* GitHub
* REST APIs

> Technologies may be adapted during development based on the final implementation requirements.

---

## Project Structure

```text
GlobeTrotter/
│
├── frontend/
│
├── backend/
│
├── database/
│   ├── schema/
│   ├── migrations/
│   └── seed/
│
├── docs/
│
├── README.md
└── .gitignore
```

---

## Development Approach

Development will follow a database-first approach:

```text
Problem Analysis
      ↓
Database & ER Design
      ↓
Relational Schema
      ↓
Backend APIs
      ↓
Frontend
      ↓
Integration
      ↓
Testing & Validation
      ↓
UI & Performance Polish
```

The project will prioritize a **functional, reliable, and polished core experience** over unnecessary complexity.

---

## Team

**GlobeTrotter Hackathon Team**

* Nagesh Gudale
* Ishwari Nandargi
* Archita Thakur
* Pratik Rathod

---

## Hackathon

Built for the **Odoo Hackathon 2026**.

The project follows the hackathon requirements around dynamic data, responsive UI, robust validation, relational database design, version control, and practical technology choices.
