# jee.ply 🚌

### Your Cebu City PUJ Commute Planner

**jee.ply** is a Cebu City-focused public transportation web application designed to help commuters plan routes using **Public Utility Jeeps (PUJs)**, buses, and the **Cebu Bus Rapid Transit (BRT)** system.

Instead of relying solely on generic navigation, jee.ply focuses on the realities of commuting in Cebu City by providing localized transportation routes, landmarks, estimated fares, travel times, and connections between different modes of public transportation.

---

## 📌 Overview

Getting around Cebu City can involve multiple jeepney routes, transfers, landmarks, and transportation modes. Determining which jeep to take, where to transfer, and how much the trip may cost can be difficult, especially for students, visitors, and commuters unfamiliar with the city's transportation network.

**jee.ply aims to simplify this process.**

Users provide their:

* 📍 Starting location
* 🎯 Destination

The system then helps determine a suitable public transportation route, including the necessary jeepney or bus routes and transfers.

---

## ✨ Features

### 🗺️ Route Planning

Enter a starting point and destination to find a suggested public transportation route.

The system can provide:

* Recommended PUJ routes
* Transfer points
* Route sequence
* Estimated travel distance
* Estimated travel time
* Transportation modes used

### 🚌 Cebu PUJ Routes

jee.ply is designed around Cebu City's local PUJ network, allowing routes to be represented using Cebu-specific transportation information.

This makes the application more useful for local commuters than a generic route planner.

### 🚍 BRT Integration

The project is designed to accommodate the **Cebu Bus Rapid Transit (BRT)** system.

BRT routes can be incorporated alongside PUJ routes to support trips involving:

```text
PUJ → BRT → PUJ
```

This is particularly useful for **first-mile and last-mile connections**, where commuters may need a PUJ to reach or leave a BRT station.

### 💰 Fare Estimation

The application can provide an estimated transportation cost based on the selected route and transportation modes.

### ⏱️ Travel Time Estimation

Users can receive an estimated travel time based on:

* Route distance
* Transportation mode
* Number of transfers
* Traffic conditions, when available

### 📍 Cebu Landmarks

Local landmarks can be used as route references to make directions easier to understand.

For example:

```text
University → Fuente Osmeña → Colon → Destination
```

rather than relying exclusively on street names.

### 🚦 Traffic-Aware Routing

Future versions can incorporate GPS and traffic information to improve travel-time estimates and route recommendations.

---

## 🎯 Target Users

jee.ply is primarily designed for:

* Cebu City commuters
* Students
* Daily PUJ passengers
* First-time visitors to Cebu City
* Residents unfamiliar with specific PUJ routes
* Commuters transitioning between PUJs and BRT

---

## 🧭 Example

A commuter wants to travel from:

```text
Cebu IT Park
      ↓
Colon
```

jee.ply could provide a route such as:

```text
📍 Cebu IT Park
       ↓
🚌 PUJ Route
       ↓
📍 Transfer Point
       ↓
🚌 PUJ Route
       ↓
🎯 Colon
```

Alongside the route, the application may display:

```text
Estimated Distance: 6.2 km
Estimated Travel Time: 35 min
Estimated Fare: ₱20+
Transfers: 1
```

*Actual values depend on the route data and available transportation information.*

---

## 🏗️ Project Architecture

The application is intended to follow a simple web application architecture:

```text
┌─────────────────────────┐
│        Frontend         │
│                         │
│  Route Search Interface │
│  Map / Route Display    │
│  Fare & ETA Information │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│       Application       │
│         Logic           │
│                         │
│ Route Calculation       │
│ Transportation Matching │
│ Fare Estimation         │
│ ETA Calculation         │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│      Route Dataset      │
│                         │
│ PUJ Routes              │
│ BRT Routes              │
│ Landmarks               │
│ Fare Information        │
└─────────────────────────┘
```

---

## 🛠️ Technology

The exact implementation may evolve as the project develops, but jee.ply is designed as a web-based application.

### Frontend

* HTML
* CSS
* JavaScript

### Mapping & Location

Potential integrations include:

* Mapping APIs
* GPS/location services
* Geographic datasets

### Backend

A backend can be used to handle:

* Route data
* Transportation information
* Fare calculations
* Location processing
* API requests

---

## 🎨 Design

jee.ply uses a clean and approachable visual identity inspired by Cebu's transportation environment.

### Color Palette

| Color        | Hex       |
| ------------ | --------- |
| Primary Navy | `#19215F` |
| Off White    | `#FFFDFA` |
| Warm Cream   | `#FDF4E5` |
| Dark Gray    | `#3D3F4A` |

Borders can use a subtle black transparency:

```css
rgba(0, 0, 0, 0.1)
```

The interface is intended to prioritize **clarity and usability**, especially for users checking routes while commuting.

---

## 📂 Project Structure

A possible project structure:

```text
jee.ply/
│
├── index.html
│
├── css/
│   └── style.css
│
├── js/
│   ├── app.js
│   ├── routes.js
│   └── map.js
│
├── data/
│   ├── puj-routes.json
│   ├── brt-routes.json
│   └── landmarks.json
│
├── assets/
│   ├── images/
│   └── icons/
│
└── README.md
```

---

## 🚀 Future Development

jee.ply can be expanded into a more comprehensive Cebu transportation platform.

Potential improvements include:

### Real-Time Traffic

Integrate traffic information to improve ETA calculations and identify slower routes.

### GPS Location

Allow users to automatically use their current location as their starting point.

### Real-Time Transportation Data

Future versions could incorporate available live transportation information.

### Advanced Route Optimization

Compare multiple possible routes based on:

* Travel time
* Fare
* Number of transfers
* Walking distance
* Transportation modes

### BRT + PUJ Multimodal Routing

Provide seamless routes combining:

```text
Walking → PUJ → BRT → PUJ → Walking
```

### Offline Route Data

Store essential Cebu transportation data locally so basic route information remains available even with limited connectivity.

---

## ⚠️ Data Disclaimer

Transportation information can change due to:

* Route changes
* Road closures
* Traffic conditions
* Fare adjustments
* Construction
* Government transportation policies
* Changes to BRT operations

Therefore, route, fare, and travel-time information provided by jee.ply should be treated as **estimates** and verified against current transportation conditions when necessary.

---

## 🎓 Project Purpose

jee.ply was created as a technology project focused on applying software development and geographic information to a **real-world transportation problem in Cebu City**.

The project explores how localized digital tools can make public transportation information easier to understand and access for everyday commuters.

---

## 📜 License

This project is intended for educational and development purposes.

A license can be added once the project's distribution and contribution terms are finalized.

---

## 👨‍💻 Development

**jee.ply**

*Cebu City Public Transportation Route Planner*

Built with the goal of making Cebu commuting a little easier, one route at a time. 🚌
