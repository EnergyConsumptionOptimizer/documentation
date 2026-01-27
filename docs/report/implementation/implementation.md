---
id: implementation
title: Implementation
position: 1
---

# Implementation

## Technologies Used

To realize the system, we used the **MEVN stack** (MongoDB, Express.js, Vue.js, Node.js).
Additionally, **Kotlin** and **InfluxDB** were employed to implement specific microservices where high performance or time-series data management was required.
Below is the detailed breakdown of the technologies used for each part of the system:

* **Gateway**
    * Reverse Proxy: Nginx
    * Deployment: Docker
* **Frontend**
    * Language: JavaScript
    * SPA Framework: Vue.js 3
    * Build Tool: Vite
    * Web Server: Nginx
    * HTTP Communication: Axios
    * Real-time Communication: Socket.io
    * State Management: Pinia
    * UI: PrimeVue, Tailwind CSS
    * Deployment: Docker
* **User Microservice**
    * Language: TypeScript
    * Backend: Node.js and Express
    * Persistence: MongoDB
    * Auth: JSON Web Token (JWT)
    * Deployment: Docker
* **Threshold Microservice**
    * Language: TypeScript
    * Backend: Node.js and Express
    * Real-time Communication: Socket.io
    * Persistence: MongoDB
    * Deployment: Docker
* **Smart Furniture Hookup Microservice**
    * Language: TypeScript
    * Backend: Node.js and Express
    * Persistence: MongoDB
    * Deployment: Docker
* **Map Microservice**
    * Language: Kotlin
    * Backend: JVM and Ktor
    * Persistence: MongoDB
    * Deployment: Docker
* **Forecast Microservice**
    * Language: Kotlin
    * Backend: JVM and Ktor
    * ML Library: Smile
    * Persistence: MongoDB
    * Deployment: Docker
* **Monitoring Microservice**
    * Language: TypeScript
    * Backend: Node.js and Express
    * Real-time Communication: Socket.io
    * Persistence: MongoDB and InfluxDB v2
    * Deployment: Docker
* **Alert Microservice**
    * Language: TypeScript
    * Backend: Node.js and Express
    * Persistence: MongoDB
    * Deployment: Docker

### Key Technologies details

#### Ktor
For the implementation of the Kotlin-based web servers, we utilized the native **Ktor** framework. Ktor allows for the creation of REST APIs in a modular and efficient manner, leveraging coroutines for the asynchronous management of HTTP requests.

#### InfluxDB v2
To manage and persist the measurements originating from the physical hookups, we selected a database optimized for time-series storage: **InfluxDB v2**. This choice was driven by both the need to handle high-frequency data streams and the capability to perform complex filtering, transformation, and aggregation operations directly at the database level using the functional scripting language **Flux**.

#### PrimeVue
To accelerate development timelines and ensure stylistic consistency, **PrimeVue** was adopted as the Vue.js component library. Particular attention was paid to accessibility; PrimeVue declares conformity with **WCAG 2.1 level AA**.

#### Smile ML
For the `forecast-service`, Kotlin was chosen to leverage the **Smile** library during the prediction phase. This combination allows machine learning algorithms to be executed efficiently within the JVM environment, resulting in better performance—for this specific use case—compared to typical Python-based solutions.

## Authentication
Regarding user authentification, the system implements a stateless mechanism relying on JSON Web Tokens (JWT) secured within **HttpOnly cookies**. This choice was made to mitigate Cross-Site Scripting (XSS) vulnerabilities, as the tokens are not accessible to client-side JavaScript.

**Server-Side Token Management**
We manage a dual-token lifecycle:

1. **Access Token:** Short-lived (approx. 1 hour) for immediate resource authorization.
2. **Refresh Token:** Long-lived (approx. 7 days) used to acquire new access tokens without requiring user re-credentials.

## Wave Lab
In order to test the platform, a Python application was developed to simulate smart plugs.  
This application consists of a FastAPI-based web server, used to simulate the endpoints described in the introduction,
and a script dedicated to starting the simulations, during which the active devices periodically send consumption data.

To connect a plug to the system, it is necessary to send a `PATCH` request to the endpoint associated with the plug, specifying the `endpoint_url` field.  
Once configured, the plugs respond by periodically sending requests of the following type:
```json
{
    realTimeConsumption": 2,
    "username": "marco",
    "timestamp": "2026-01-21 18:32:37.891223"
}
```
### Main Components
The system is composed of three main components:

- `main.py`: runs a FastAPI web server used to mock the smart furniture hookup.
  It exposes endpoints to request device information and to configure the monitoring endpoint to which consumption data will be sent.

- `run_simulation.py`: simulates the behavior of the smart furniture hookup by periodically sending data for active nodes.
  The simulation uses a fixed consumption rate and allows basic configuration of the simulation parameters, e.g. associate a username
to a smart furniture hookup.
- `wavelab.py`: provides a Command Line Interface (CLI) to interact with the system.
  It allows users to change the status of a node and retrieve information about the current state of the system.

> **Note**  
> This is a personal project developed solely for the purpose of testing the system.  As such, it does not follow production-level
> best practices and lacks features such as CI/CD pipelines, containerization, and other supporting tools.
## Forecast
The core logic resides in `RandomForestForecast.kt`. The system utilizes the **Smile** (Statistical Machine Intelligence and Learning Engine) library, leveraging the JVM's performance for mathematical operations. The chosen algorithm is a **Random Forest Regressor**, selected for its robustness against overfitting and ability to handle non-linear relationships in time-series data.

The implementation employs a **Sliding Window** strategy to transform the time-series forecasting problem into a supervised learning problem.
Key hyperparameters used in the model include approximately 100 trees and a maximum depth of 20, balancing computational cost with prediction accuracy.

## Socket.io
To implement WebSocket-based communication, Socket.IO was chosen. Socket.IO is a library that enables real-time, bidirectional,
and event-based communication between the browser and the server.

A security middleware has been added to the Socket.IO namespaces. This middleware interacts with the frontend client to validate
connections and ensure that only authorized clients can establish and maintain secure socket connections.

Three main communication channels have been designed between the Monitoring Service and the various system components:
- `realTimeNamespace`: used by the frontend to obtain real-time data synchronized across multiple clients.
- `utilityConsumptionsNamespace`: used by the frontend to retrieve time series of consumption data.
- `utilityMetersNamespace`: used by the Threshold Service to retrieve various consumption counters.

### Strong Typing (TypeScript)

Socket.io TypeScript generics are used to define strongly typed communication interfaces.

<details>
<summary>Socket example</summary>

```Typescript
// Socket
export type UtilityConsumptionsSocket = Socket<
  UtilityConsumptionsClientEvents,
  UtilityConsumptionsServersEvents
>;

// client events
export type UtilityConsumptionsClientEvents =
SubscribeUtilityConsumptionsEvent & EditUtilityConsumptionsQueryEvent;

export interface SubscribeUtilityConsumptionsEvent {
    subscribe: (queries: UtilityConsumptionsQueryDTO[]) => void;
}

export interface EditUtilityConsumptionsQueryEvent {
    editQuery: (queries: UtilityConsumptionsQueryDTO) => void;
}

// server events
export interface ErrorEvent {
    error: (error: string) => void;
}

export interface UtilityConsumptionsUpdateEvent {
    utilityConsumptionsUpdate: (
        data: UtilityConsumptionsQueryResultDTO[],
    ) => void;
}

export interface UtilityConsumptionsQueryUpdateEvent {
    utilityConsumptionsQueryUpdate: (
        data: UtilityConsumptionsQueryResultDTO,
    ) => void;
}
```

</details>

## Server-Sent Events (SSE)
We use **Server-Sent Events (SSE)** to deliver system alerts in real-time. This protocol was chosen because it is lighter and simpler than WebSockets for one-way communication.

**Client Implementation Strategy:** 
Instead of using standard libraries, we implemented a custom client using the native **Fetch API**. This decision addresses specific limitations of the alternatives:

1. **Why not `Axios`?**
   Axios is designed to buffer the entire response in memory. For an infinite data stream, this causes memory leaks and performance issues. The `Fetch` API allows us to read the response as a **stream**, processing data chunk-by-chunk without filling the memory.
2. **Why not `EventSource`?**
   The standard `EventSource` API is too rigid for our needs. It does not support custom HTTP headers (limiting security flexibility) and forces its own reconnection logic. By using `fetch`, we have full control over the **retry strategy**.

**Message Parsing & Resilience**
The client reads the raw byte stream using a `TextDecoder` and splits incoming data by the standard double-newline separator (`\n\n`) to identify messages.
To ensure stability, the `alertStore` manages the connection state, handling clean shutdowns via `AbortController` and orchestrating reconnection attempts if the network fails.

## Influx Queries
To support more complex queries, Flux query builders have been implemented to optimally manage filters.
These builders allow:
- Filtering by `utilityType` (mandatory);
- Time-based filtering by specifying start and end timestamps;
- Filtering by user, by specifying a `username`;
- Filtering by zone, by specifying a `zoneID`;
- Setting a granularity level.

<details>
<summary>Query builder example</summary>


```typescript
// Example: query to retrieve a consumption time series

async findUtilityConsumptions(
  utilityType: UtilityType,
  filter?: TimeSeriesFilter,
  tagsFilter?: TagsFilter,
): Promise<UtilityConsumptionPoint[]> {
    const query = ConsumptionSeriesQueryBuilder.forBucket(
    this.influxDB.getBucket(),
    )
        .withUtility(utilityType)
        .withStart(filter?.from)
        .withStop(filter?.to)
        .withUser(tagsFilter?.username)
        .withZone(tagsFilter?.zoneID)
        .withWindow(filter?.granularity)
        .build();

    const result: ConsumptionPointModel[] =
      await this.influxDB.queryAsync(query);
    
    return result.map((point) => ({
        value: point._value,
        timestamp: new Date(point._time),
    }));
}

/*
Result example:

import "timezone"
option location = timezone.location(name: "Europe/Rome")

from(bucket: "monitoring")
  |> range(start: 2026-01-20T23:00:00.000Z)
  |> filter(fn: (r) =>
    r._measurement == "ELECTRICITY" and
    r._field == "value" and
    r.USERNAME == "marco" and
    r.ZONE_ID == "2887cb54-0fdc-400b-80d3-b6187c90ad4a"
  )
  |> window(every: 1h, createEmpty: true)
  |> group(columns: ["SMART_FURNITURE_HOOKUP_ID", "_start", "_stop"])
  |> integral(unit: 1h)
  |> group(columns: ["_start"])
  |> sum(column: "_value")
  |> duplicate(column: "_start", as: "_time")
  |> window(every: inf)
  |> keep(columns: ["_time", "_value"])
 */

```
</details>

## Onboarding
To set up the system, an onboarding phase was implemented. This process consists of the following steps:
1. Set up the floor plan
2. Create zones (_optional_)
3. Connect and place smart furniture hookups
4. Add household users (_optional_)
5. Configure thresholds (_optional_)

All of these steps are performed in the frontend and do not add any data to the system until the onboarding phase is completed.

## Testing
To maintain system stability and ensure a good quality product, we adopt a testing strategy focused on two main categories: **Unit Testing** and **API Testing**.
We selected the native testing frameworks best suited for each ecosystem:

* **TypeScript Microservices:** **Vitest** as the test runner, combined with **Supertest** to simulate HTTP requests for API testing.
* **Kotlin Microservices:** **Kotest** using the **Ktor `testApplication`** engine to perform API tests.

### Unit Testing
Unit tests focus on non-trivial code across all the layers.

### API Testing
API tests verify the interaction with the microservices from an external perspective.
* **Typescript:** Tests use **Supertest** to send requests to the Express application, validating status codes and JSON payloads without needing a running server port.
* **Kotlin:** Tests utilize the **Ktor Client** within a test engine context to verify route handling and response serialization.

<details>
<summary>API Test example</summary>

```typescript
import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";

describe("POST /", () => {
    it("should create household user when admin provides valid data", async () => {
      const res = await request(app)
        .post(url)
        .set("Cookie", admin.authHeader)
        .send(mockHouseholdUserEmma);

      expect(res.status).toBe(201);
      expect(res.body.username).toBe(mockHouseholdUserEmma.username);
    });

    it("should return 400 when no data is provided", async () => {
      await request(app).post(url).set("Cookie", admin.authHeader).expect(400);
    });

    it("should return 403 when non-admin tries to create account", async () => {
      await request(app)
        .post(url)
        .set("Cookie", mark.authHeader)
        .send(mockHouseholdUserEmma)
        .expect(403);
    });

    it("should return 409 when username already exists", async () => {
      await request(app)
        .post(url)
        .set("Cookie", admin.authHeader)
        .send(mockHouseholdUserMark)
        .expect(409);
    });
});
```

</details>


### Code Quality
To ensure maintainability and consistency across the codebase, static analysis tools have been integrated into the development workflow:
* **Prettier (Typescript) / **Ktlint** (Kotlin) :** Enforces consistent code formatting.
* **ESLint** (TypeScript) / **Detekt** (Kotlin): Analyzes code to catch potential errors and enforce best practices.
