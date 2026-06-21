---
title: Microservices
sidebar_position: 3
---

# Microservices
After defining all use cases, the complete set of features for each context, and how services communicate with one another,
this section presents the microservices design of the system.

## Microservices Patterns
### Communication patterns
Different protocols will be used to handle all network traffic, utilizing JSON as the standard data payload format.

#### API Gateway
The API Gateway pattern is used to provide a single entry point for all clients.
It is responsible for performing path-based routing, prefix stripping, and centralised authentication.
#### Asynchronous messaging
Instead of relying on synchronous request-response chains, services communicate asynchronously by publishing and consuming meaningful events through an event broker.
#### HTTP REST API
REST APIs are used for synchronous communication to communicate with the outside world and for when a microservice needs to retrieve data required to complete a business operation.
#### WebSockets
For real-time communication, WebSockets are used to notify other components about events, state changes, or user actions.
### Event-driven Architecture Patterns
#### Transactional Outbox pattern 
The Transactional Outbox pattern is utilized in the system to decouple microservices, ensure high fault tolerance, and
safely propagate data asynchronously across backend services. When a service updates its state, it saves the new data and
writes a domain event to a local Outbox collection. Both actions happen inside a
single transaction, ensuring that they either succeed or fail together. A Change Data Capture (CDC) process reads the Outbox
and pushes the events to the event broker. This decouples the services, so that the
sender does not need to wait for the receiver.

#### Inbox pattern
To ensure exactly-once processing the Inbox Pattern is utilized with an inbox collection for deduplication. Before processing an event, the service saves its ID in the Inbox. A
unique database index rejects duplicate IDs, guaranteeing that the state is updated exactly once per event.


#### Dead Letter Queue Pattern
Dead-Letter Queue (DLQ) is used to handle messages that cannot be processed successfully after repeated attempts.
Failures trigger a retry policy before being routed to a Dead-Letter Queue (DLQ). Events that continue to fail after all retry attempts
are redirected to dedicated DLQ topics for further inspection and handling.
### Deployments Patterns
#### Service as Containers
Each microservice is deployed as an independent Docker container. This ensures isolation between services and allows them to be deployed and scaled independently.

#### Database per Service
Each microservice owns its own database or schema, which is accessible only through its API. This approach improves isolation,
scalability, and security, while allowing each service to choose a database technology and schema optimized for its specific needs

#### Externalized configuration
Service configuration is externalized and provided at runtime rather than hard-coded.
A push-based model is used, where configuration values are supplied via environment variables or configuration files.
This allows services to adapt easily to different environments, and improves maintainability.

### Security patterns
#### Access Token
The Access Token pattern is used to secure communication between services. The system uses token-based authentication with JWT access tokens.

### Observability Patterns
#### Health-check API
Each microservice exposes a health-check endpoint that reports its operational status. These endpoints are used for deployment-level health checks,
enabling early detection of failures.

### Log aggregation
Each microservice generates structured logs describing its internal activity (e.g., requests received, errors, state transitions).
Logs are forwarded to a centralized logging platform, which enables unified storage, indexing, and search across all services.

### Distributed tracing
Each incoming external request is assigned a unique correlation identifier that is propagated across all downstream service calls.
This enables end-to-end tracking of a request as it traverses multiple microservices, making it possible to reconstruct the full execution path and identify latency bottlenecks or failure points.
Tracing data are collected by a centralized tracing system that visualizes service dependencies and request flows.

### Application metrics
Each microservice exposes quantitative runtime metrics such as request counts, response latency, error rates, and resource utilization.
These metrics are collected by a monitoring system at regular intervals and stored.
Metrics are categorized into differente types of plots.


## User Microservice
![user_service_cc.svg](../img/cc/user_service_cc.svg)

### External communication
- Accepts and processes HTTP REST requests routed from the frontend via the API Gateway to manage user account.
- Direct-routes from the API Gateway to handle authentication requests

<details>
<summary>Public RESTful API endpoints</summary>

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
[RESTful API endpoints doc](/api/user)
</details>

### Internal API REST communication
- Responds to requests from the Monitoring Service to look up usernames for existing household users.

<details>
<summary>Internal RESTful API endpoints</summary>

**Internal - Users**
* `GET /api/internal/users/{username}`: Internal endpoint to retrieve a user by their username.
* `GET /api/internal/users`: Internal endpoint to retrieve all household users.

[RESTful API endpoints doc](/api/user)
</details>

### Event architecture
- Publishes user creation and deletion events using the outbox pattern, which are consumed by the Monitoring Service.

<details>
<summary>User Events</summary>

* `UserCreatedEvent`: emitted when the admin creates a new household user
* `UserDeletedEvent`: emitted when the admin deletes a household user

</details>

### Behavior

<details>
<summary>User account management</summary>

```gherkin
Feature: User account management

  Scenario: Create a household user
    Given an authenticated administrator
    And an available username
    When the administrator creates a household user
    Then the household user account exists

  Scenario: Update a household user's credentials
    Given an authenticated administrator
    And an existing household user
    When the administrator changes the user's username or password
    Then the household user's credentials are updated

  Scenario: Delete a household user
    Given an authenticated administrator
    And an existing household user
    When the administrator deletes the household user
    Then the household user account no longer exists

  Scenario: Household user updates their own credentials
    Given an authenticated household user
    When the user changes their username or password
    Then the user can authenticate using the updated credentials

  Scenario: Reset an admin password
    Given a valid password reset code for an admin account
    When a new password is submitted with the reset code
    Then the administrator can authenticate using the new password
```
</details>
<details>
<summary>Authentication</summary>


```gherkin
Feature: Authentication

  Scenario: Household user logs in
    Given a household user account exists
    When the user logs in with valid credentials
    Then the user is authenticated
    And the user's account information is returned

  Scenario: Administrator logs in
    Given an administrator account exists
    When the administrator logs in with valid credentials
    Then the administrator is authenticated
    And the administrator's account information is returned

  Scenario: User logs out
    Given an authenticated user
    When the user logs out
    Then the user is no longer authenticated
```
</details>

## Hookup Microservice
![hookup_service_cc.svg](../img/cc/hookup_service_cc.svg)


### External communication
- Accepts and processes HTTP REST requests routed from the frontend via the API Gateway to manage smart furniture hookups.
- Sends requests to physical smart furniture hookups to set, update or remove the measurements destination endpoint.

<details>
<summary>Public RESTful API endpoints</summary>

**Smart Furniture Hookups**
* `GET /api/smart-furniture-hookups`: Retrieve a list of all registered smart furniture hookups.
* `POST /api/smart-furniture-hookups`: Register a new smart furniture hookup device.
* `GET /api/smart-furniture-hookups/{id}`: Get the configuration details for a specific hookup by ID.
* `PATCH /api/smart-furniture-hookups/{id}`: Update the name or endpoint of an existing hookup.
* `DELETE /api/smart-furniture-hookups/{id}`: Remove a smart furniture hookup from the system.

[RESTful API endpoints doc](/api/hookup)
</details>

### Internal API REST communication
- Responds to requests from the Monitoring Service to look up IDs for existing hookups.

<details>
<summary>Internal RESTful API endpoints</summary>

**Internal - Users**
* `GET /api/internal/smart-furniture-hookups/{id}`:  Internal endpoint to retrieve hookup details by ID.
* `GET /api/internal/smart-furniture-hookups/`: Internal endpoint to retrieve all hookups.

[RESTful API endpoints doc](/api/hookup)
</details>

### Event architecture
- Publishes hookup creation and deletion events using the outbox pattern, which are consumed by the Monitoring and Map Service.

<details>
<summary>Hookup Events</summary>
* `HookupCreatedEvent`: emitted when the admin creates new smart furniture hookup
* `HookupDeletedEvent`: emitted when the admin deletes a smart furniture hookup

</details>

### Behavior

<details>
<summary>Smart furniture hookup management</summary>


```gherkin
Feature: Smart furniture hookup management

  Scenario: Create a smart furniture hookup
    Given an authenticated administrator
    And a smart furniture hookup name that is not already in use
    And an endpoint that is not already in use
    When the administrator creates a smart furniture hookup
    Then the smart furniture hookup exists


  Scenario: Update a smart furniture hookup
    Given an existing smart furniture hookup
    And an authenticated administrator
    When the administrator updates the hookup details
    Then the smart furniture hookup reflects the updated details

  Scenario: Delete a smart furniture hookup
    Given an existing smart furniture hookup
    And an authenticated administrator
    When the administrator deletes the smart furniture hookup
    Then the smart furniture hookup no longer exists
```
</details>

## Map Microservice
![map_service_cc.svg](../img/cc/map_service_cc.svg)


### External communication
- Accepts and processes HTTP REST requests routed from the frontend via the API Gateway to manage the map.

<details>
<summary>Public RESTful API endpoints</summary>

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


[RESTful API endpoints doc](/api/map)
</details>

### Internal API REST communication
- Responds to requests from the Monitoring Service to look up IDs for existing hookups.

<details>
<summary>Internal RESTful API endpoints</summary>

**Internal - Smart Furniture Hookups**
* `GET /api/internal/smart-furniture-hookups/{id}`: Internal endpoint to retrieve hookup map details by ID.
* `GET /api/internal/smart-furniture-hookups/`: Internal endpoint to retrieve all hookups.

[RESTful API endpoints doc](/api/map)
</details>

### Event architecture
- Listens for hookup creation and deletion events from the Hookup Service.
- Publishes zone creation and deletion events and hookup's zone changed event using the outbox pattern, which are consumed by the Monitoring Service.

<details>
<summary>Map Inbound Events</summary>
* `SmartFurnitureHookupCreated`:  received when a smart furniture hookup is created in the hookup service
* `SmartFurnitureHookupCreated`: received when a smart furniture hookup is deleted in the hookup service
</details>

<details>
<summary>Map Outbound Events</summary>
* `SmartFurnitureHookupZoneUpdated`: emitted when the system updates the smart furniture hookup’s assigned zone.
</details>

### Behavior

<details>
<summary>Floor plan management</summary>

```gherkin
Feature: Floor plan management

  Scenario: Upload a floor plan
    Given an authenticated administrator
    And a valid floor plan
    When the administrator uploads the floor plan
    Then the floor plan is available in the house map

  Scenario: Replace an existing floor plan
    Given an existing floor plan
    And an authenticated administrator
    When the administrator uploads a new floor plan
    Then the new floor plan becomes the active floor plan

  Scenario: View the floor plan
    Given a floor plan exists
    And an authenticated user
    When the user requests the floor plan
    Then the floor plan is returned
```
</details>

<details>
<summary>Zone management</summary>

```gherkin
Feature: Zone management

  Scenario: Create a zone
    Given an authenticated administrator
    When the administrator creates a zone
    Then the zone exists in the house map

  Scenario: View all zones
    Given one or more zones exist
    And an authenticated user
    When the user requests the list of zones
    Then all zones are returned

  Scenario: View a zone
    Given an existing zone
    And an authenticated user
    When the user requests the zone
    Then the zone details are returned

  Scenario: Update a zone
    Given an existing zone
    And an authenticated administrator
    When the administrator updates the zone
    Then the zone reflects the updated details

  Scenario: Delete a zone
    Given an existing zone
    And an authenticated administrator
    When the administrator deletes the zone
    Then the zone no longer exists
```
</details>

<details>
<summary>Smart furniture hookup position</summary>

```gherkin
Feature: Smart furniture hookup position

  Scenario: View all smart furniture hookups
    Given one or more smart furniture hookups have been placed
    And an authenticated user
    When the user requests the list of smart furniture hookups
    Then all placed smart furniture hookups are returned

  Scenario: View a smart furniture hookup
    Given an existing smart furniture hookup position
    And an authenticated user
    When the user requests the smart furniture hookup
    Then the smart furniture hookup details are returned

  Scenario: Place a smart furniture hookup
    Given an authenticated administrator
    When the administrator sets the position of a smart furniture hookup
    Then the smart furniture hookup is placed on the house map

  Scenario: Place a smart furniture hookup within a zone
    Given an existing zone
    And an authenticated administrator
    When the administrator places a smart furniture hookup inside the zone
    Then the smart furniture hookup is associated with that zone

  Scenario: Place a smart furniture hookup outside all zones
    Given one or more zones exist
    And an authenticated administrator
    When the administrator places a smart furniture hookup outside all zones
    Then the smart furniture hookup is not associated with any zone

  Scenario: Assign a smart furniture hookup to a zone
    Given an existing zone
    And an authenticated administrator
    When the administrator assigns the smart furniture hookup to the zone
    Then the smart furniture hookup is associated with that zone
```
</details>

## Monitoring Microservice
![monitoring_service_cc.svg](../img/cc/monitoring_service_cc.svg)

### External communication
- Accepts and processes HTTP REST requests routed from a physical smart furniture hookup via the API Gateway to ingest a measurement.
- Establishes a real-time WebSocket connection from the frontend through the API Gateway to enable bidirectional data streaming.

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

</details>

<details>
<summary> Public RESTful API endpoints</summary>

**Measurements**
* `POST /api/measurements`: Create a new measurement for a specific smart furniture hookup.

[RESTful API endpoints doc](/api/monitoring)
</details>

### Internal API REST communication
- Responds to requests from the Forecast Service to retrieve aggregated consumption data points.

<details>
<summary>Internal RESTful API endpoints</summary>

**Internal - Measurements**
* `GET /api/internal/measurements/{utilityType}`: Retrieve aggregated consumption data points for GAS, WATER, or ELECTRICITY.

[RESTful API endpoints doc](/api/monitoring)
</details>

### Internal WebSocket communication
- Establishes a real-time WebSocket connection with the Threshold service to enable bidirectional data streaming of utility meters.

<details>
<summary>WebSocket namespaces</summary>

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


### Event architecture
- Listens for household user creation and deletion events from the User Service.
- Listens for hookup creation and deletion events from the Hookup Service.
- Listens for zone creation and deletion events from the Map Service.
- Listens for hookup's zone updated events from the Map Service.

<details>
<summary>Monitoring Inbound Events</summary>

* `HouseholdUserCreated`: received when the admin creates a new household user in the User Service.
* `HouseholdUserDeleted`: received when the admin deletes a household user in the User Service.
* `SmartFurnitureHookupCreated`: received when a new smart furniture hookup is created in the Hookup Service.
* `SmartFurnitureHookupDeleted`: received when a smart furniture hookup is deleted in the Hookup Service.
* `ZoneCreated`: received when the admin creates a new zone in the Map Service.
* `ZoneDeleted`: received when the admin deletes a zone in the Map Service.
* `SmartFurnitureHookupZoneUpdated`: received when the system updates the smart furniture hookup’s assigned zone in the Map Service.
</details>

### Behavior

<details>
<summary>Measurement management</summary>


```gherkin
Feature: Measurement management

  Scenario: Create a measurement
    Given a smart furniture hookup exists
    When a new utility consumption measurement is received
    Then the measurement is available for monitoring and analysis

  Scenario: Delete a household user
    Given an existing household user
      And measurements are associated with that user
    When the administrator deletes the household user
    Then the measurements are no longer associated with that user

  Scenario: Delete a zone
    Given an existing zone
      And measurements are associated with that zone
    When the administrator deletes the zone
    Then the measurements are no longer associated with that zone
```
</details>


## Forecast Microservice
![forecast_service_cc.svg](../img/cc/forecast_service_cc.svg)


<details>
<summary>RESTful API endpoints</summary>

**Forecasts**
* `GET /api/forecasts`: Retrieve all available energy consumption forecasts (optionally filterable by `utilityType` via query string).
* `GET /api/forecasts/{utilityType}`: Retrieve a specific forecast for a single utility type (ELECTRICITY, GAS, or WATER).

[RESTful API endpoints doc](/api/forecast)
</details>

### External communication:


<details>
<summary>Public RESTful API endpoints</summary>

</details>

### API REST communication:
- Responds to requests from the Monitoring Service to look up IDs for existing hookups.

<details>
<summary>Internal RESTful API endpoints</summary>

</details>

### Event architecture:

<details>
<summary>Hookup Events</summary>
* ``: emitted when 

</details>

### Behavior

<details>
<summary></summary>


```gherkin

```
</details>


## Threshold Microservice

![threshold_service_cc.svg](../img/cc/threshold_service_cc.svg)


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

### External communication:


<details>
<summary>Public RESTful API endpoints</summary>

</details>

### API REST communication:
- Responds to requests from the Monitoring Service to look up IDs for existing hookups.

<details>
<summary>Internal RESTful API endpoints</summary>

</details>

### Event architecture:

<details>
<summary>Hookup Events</summary>
* ``: emitted when 

</details>

### Behavior

<details>
<summary></summary>


```gherkin

```
</details>

## Notification Microservice

![notification_service_cc.svg](../img/cc/notification_service_cc.svg)


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

### External communication:


<details>
<summary>Public RESTful API endpoints</summary>

</details>

### API REST communication:
- Responds to requests from the Monitoring Service to look up IDs for existing hookups.

<details>
<summary>Internal RESTful API endpoints</summary>

</details>

### Event architecture:

<details>
<summary>Hookup Events</summary>
* ``: emitted when 

</details>

### Behavior

<details>
<summary></summary>


```gherkin

```
</details>



## Clean Architecture

<img
src={require('../img/clean_arch.png').default}
alt="clean_arch"
width="100%" height="100%"
/>

Internally, each microservice adopts a clean architecture. This approach separates core business logic from technical details, improving maintainability
and scalability. The architecture is composed of multiple layers and is based on the dependency rule, meaning that outer layers depend on innermost ones but vice versa is
not true.

The adopted layers are the following:
* **Domain:** It includes aggregate roots, entities, value objects, domain errors, and domain events.
* **Application:** Contains application services and use cases that orchestrate business logic with inbound/outbound ports (services, repositories, event publishers, etc.).
* **Presentation:** Exposes the microservice's entrypoint though the inbound adapters like REST controllers or event consumers that call application ports.
* **Infrastructure:** Manages the outbound adapters such as repositories, event publishers, and external integrations.


![general_package_organization.svg](../img/general_package_organization.svg)
