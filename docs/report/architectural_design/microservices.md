---
title: Microservices
sidebar_position: 3
---

# Microservices

After defining all use cases, the complete set of features for each context, and how services communicate with one another,
this section presents the microservices design of the system.

# User service

<details>
<summary>RESTful API endpoints</summary>

**Authentication**
  * `POST /api/auth/login`: Authenticate a user with username and password.
  * `POST /api/auth/logout`: Clear authentication cookies and logout the user.
  * `POST /api/auth/refresh`: Refresh the access token using the refresh token from cookies.
  * `GET /api/auth/verify`: Verify the current user's authentication status.

**Users**
  * `GET /api/users/{id}`: Retrieve a user by their unique identifier.
  * `PATCH /api/users/{id}/password`: Update the password for a specific user (requires ownership or admin role).

**Household Users**
* `GET /api/household-users`: Retrieve a list of all household users.
* `POST /api/household-users`: Create a new household user (requires admin role).
* `PATCH /api/household-users/{id}/username`: Update the username for a specific household user (requires ownership or admin role).
* `DELETE /api/household-users/{id}`: Delete a specific household user (requires admin role).

**Admin**
* `POST /api/admin/reset-password`: Reset the admin password using a reset code.

**Internal - Authentication**
* `GET /api/internal/auth/verify`: Internal endpoint to verify authentication status.
* `GET /api/internal/auth/verify-admin`: Internal endpoint to verify admin authentication status.

**Internal - Users**
* `GET /api/internal/users/{username}`: Internal endpoint to retrieve a user by their username.

[RESTful API endpoints doc](/api/user)
</details>

# Smart Furniture Hookup service
<details>
<summary>RESTful API endpoints</summary>

**Smart Furniture Hookups**
* `GET /api/smart-furniture-hookups`: Retrieve a list of all registered smart furniture hookups.
* `POST /api/smart-furniture-hookups`: Register a new smart furniture hookup device.
* `GET /api/smart-furniture-hookups/{id}`: Get the configuration details for a specific hookup by ID.
* `PATCH /api/smart-furniture-hookups/{id}`: Update the name or endpoint of an existing hookup.
* `DELETE /api/smart-furniture-hookups/{id}`: Remove a smart furniture hookup from the system.

**Internal**
* `GET /api/internal/smart-furniture-hookups/{id}`: Retrieve hookup details by ID.

[RESTful API endpoints doc](/api/hookup)
</details>

# Map service
<details>
<summary>RESTful API endpoints</summary>

**House Map**
* `GET /api/house-map`: Retrieve the complete house map (Floor plan + Zones + Smart Furniture Hookups).


**Floor Plan**
* `GET /api/floor-plan`: Retrieve the current SVG floor plan.
* `POST /api/floor-plan`: Upload the SVG floor plan.


**Zones**
* `GET /api/zones`: List all defined zones (Room boundaries).
* `POST /api/zones`: Define a new polygon zone.
* `GET /api/zones/{id}`: Get details of a specific zone.
* `PATCH /api/zones/{id}`: Modify zone boundaries or metadata.
* `DELETE /api/zones/{id}`: Remove a zone.


**Smart Furniture Hookups**
* `GET /api/smart-furniture-hookups`: List all physical smart furniture hookup points.
* `POST /api/smart-furniture-hookups`: Create a new smart furniture hookup point.
* `GET /api/smart-furniture-hookups/{id}`: Get smart furniture hookup position and zone ID.
* `PATCH /api/smart-furniture-hookups/{id}`: Update smart furniture hookup position.
* `DELETE /api/smart-furniture-hookups/{id}`: Remove a smart furniture hookup.


**Internal - Smart Furniture Hookups**
* `GET /api/internal/smart-furniture-hookups/{id}`: Retrieve smart furniture hookup details by ID.

[RESTful API endpoints doc](/api/map)
</details>

# Monitoring service

<details>
<summary>WebSocket namespaces</summary>

 **Real-Time Socket**
- _Client Emits_
   - `subscribeActiveSmartFurnitureHookups`:Subscribes the client to the room that provides real-time information about
    currently active smart furniture hookups, including their consumption data.
   - `subscribeRealTimeUtilityMeters`: Subscribes the client to the room that provides real-time utility meter values, aggregated per utility type.
-  _Server Emits_
   - `activeSmartFurnitureHookupsUpdate`: Periodically broadcast to all subscribed clients, containing the updated list
   of active smart furniture hookups and their current consumption values.
   - `utilityMetersUpdate`: Periodically broadcast to all subscribed clients, containing updated real-time utility meter values for each resource.

 **Utility Consumptions Socket**
- _Client Emits_
   - `subscribe(queries: UtilityConsumptionsQuery[])`: Subscribes the client to one or more utility consumption queries.
   - `editQuery(query: UtilityConsumptionsQuery)`: Updates an existing query previously registered by the client.
- _Server Emits_
   - `utilityConsumptionsUpdate`: Periodically emitted to the client, containing updated time series data for the subscribed utility consumptions queries
   - `utilityConsumptionsQueryUpdate`: Emitted when a query is added or modified, containing the result of the query.

**Utility Meters Socket**
-  _Client Emits_
   - `subscribe(queries: UtilityMetersQuery[], interval?: number)`: Subscribes the client to one or more utility meter queries.
   An optional interval parameter allows specifying a custom update frequency.
   - `editQuery(query: UtilityMetersQuery`: Modifies an existing utility meter query previously defined by the client.
   - `deleteQuery(queryLabel: string)`: Removes a previously registered query, stopping further updates for that query.
-  Server Emits
   - `utilityMetersUpdate`: Periodically emitted to the client, containing updated utility meters for the subscribed queries.
   - `utilityMetersQueryUpdate`: Emitted whenever a query is added or modified, reflecting the current configuration of the client’s utility meter queries.
</details>

<details>
<summary>RESTful API endpoints</summary>

**Internal - Measurements**
* `POST /api/internal/measurements`: Create a new measurement for a specific smart furniture hookup.
* `GET /api/internal/measurements/{utilityType}`: Retrieve aggregated consumption data points for GAS, WATER, or ELECTRICITY.
* `DELETE /api/internal/measurements/household-user-tags/{username}`: Remove a specific user tag from all associated measurement records.
* `DELETE /api/internal/measurements/zone-tags/{zoneID}`: Remove a specific zone ID tag from all associated measurement records.


**Internal - Smart Furniture Hookup**
* `POST /api/internal/registerSmartFurnitureHookup`: Register a connection between a hookup ID and a network endpoint.
* `POST /api/internal/disconnectSmartFurnitureHookup`: Terminate a connection for a specific network endpoint.

[RESTful API endpoints doc](/api/monitoring)
</details>

# Forecasting service

<details>
<summary>RESTful API endpoints</summary>

**Forecasts**
* `GET /api/forecasts`: Retrieve all available energy consumption forecasts (optionally filterable by `utilityType` via query string).
* `GET /api/forecasts/{utilityType}`: Retrieve a specific forecast for a single utility type (ELECTRICITY, GAS, or WATER).

[RESTful API endpoints doc](/api/forecast)
</details>

# Threshold service

<details>
<summary>RESTful API endpoints</summary>

* **Threshold Management**
* `GET /api/thresholds`: List all thresholds with optional filters for name, utility type, state, and period.
* `POST /api/thresholds`: Create a new consumption threshold for Electricity, Gas, or Water.
* `GET /api/thresholds/{id}`: Retrieve detailed configuration for a specific threshold by its UUID.
* `PUT /api/thresholds/{id}`: Update the properties (name, value, state, etc.) of an existing threshold.
* `DELETE /api/thresholds/{id}`: Permanently remove a threshold.

* **Internal**
* `POST /api/internal/thresholds/evaluations/forecast`: Trigger a batch evaluation of forecasted aggregations against existing thresholds to detect potential future breaches.

[RESTful API endpoints doc](/api/threshold)
</details>

# Alert service


<details>
<summary>RESTful API endpoints</summary>

**Alerts**
* `GET /api/alerts`: Retrieve all alerts for the currently authenticated user.
* `GET /api/alerts/{id}`: Get the full details of a specific alert by ID.
* `PATCH /api/alerts/{id}`: Update the "read" state of a specific alert.
* `DELETE /api/alerts/{id}`: Delete a specific alert.
* `DELETE /api/alerts`: Clear all alerts from the system.
* `GET /api/alerts/unread-count`: Get the total count of unread notifications.
* `GET /api/alerts/stream`: Establish a **Server-Sent Events (SSE)** connection for real-time alert streaming.


**Internal**
* `POST /api/internal/alerts`: Request the creation of a new alert (includes spam mitigation logic to prevent duplicate notifications).

[RESTful API endpoints doc](/api/alert)
</details>

