---
title: Bounded Contexts
sidebar_position: 1
---

# Bounded Contexts
After the event storming session, the following contexts have been identified:
- **User:** Responsible for managing the authentication and authorization of all users, as well as user account creation and lifecycle management.
- **Smart Furniture Hookup:** Responsible for managing the registration, configuration, and lifecycle of connections to smart furniture hookups within the system.
- **Map:** Responsible for managing the floor plan, the zones and the placement of smart furniture hookups.
- **Monitoring:** responsible for ingesting and storing raw utility consumption from each physical smart furniture hookup, and for providing query capabilities over the collected data.
- **Forecasting:** responsible for managing the forecast of utility consumptions.
- **Threshold:** responsible for managing and evaluating the utility consumption limits that trigger alerts.
- **Alert:** responsible for managing and delivery of the alerts to admins when consumption limits are exceeded.

## User context
This context is responsible for managing the authentication and authorization of all users, as well as user account creation and lifecycle management.
Each account includes a unique username that has two purpose:
- Recognize the administrator account that will have the "admin" username;
- Associates utility consumption data with a specific household user, so that the utility consumption filter can be achieved.

Authentication is handled by validating each user’s credentials (username and password). Users may change their own password at any time;
however, only household users can update their username, and only the admin has the ability to reset his password.
The admin also manages household user’s accounts by creating, editing, and deleting them.
The authentication management responsibilities also include creating and terminating sessions.  
The authorization is handled through a permission system which uses a role model, where the roles can be only “admin” or “household user”.

![user-ddd.svg](../img/uml/user-ddd.svg)

### Commands
**Commands triggered by the user:**

| Command        | Description                       |
|:---------------|:----------------------------------|
| Login          | Authenticate a User               |
| Logout         | Logout the user from the platform |
| ChangePassword | Update user’s password            |

**Commands triggered by the admin:**

| Command             | Description                                 |
|:--------------------|:--------------------------------------------|
| CreateHouseholdUser | Create a new household user                 |
| DeleteHouseholdUser | Delete an existing household user           |
| UpdateHouseholdUser | Edit an existing household user information |
| ResetPassword       | Reset password with a new one               |

**Commands triggered by an household user:**

| Command        | Description         |
|:---------------|:--------------------|
| ChangeUsername | Update own username |

### Events
**Outbound events:**
- _UserLoggedIn_: emitted when the user is authenticated
- _UserLoggedOut_: emitted when the user logs out
- _HouseholdUserCreated_: emitted when the admin creates a new household user
- _HouseholdUserUpdated_: emitted when the admin edits a household user’s information
- _HouseholdUserDeleted_: emitted when the admin deletes a household user
- _PasswordChanged_: emitted when the user's password is updated
- _UsernameChanged_: emitted when the household user's username is updated

## Smart Furniture Hookup context
This context is responsible for managing the registration, configuration, and lifecycle of connections to smart furniture hookups within the system.
It acts as the "Digital Twin" registry. To register a smart furniture hookup, the admin provides the endpoint of the smart furniture hookup,
a unique name, and the utility type. Thought that endpoint, the physical smart furniture hookup should be notified where to transmit his consumptions.

![sfh_ddd.svg](../img/uml/sfh_ddd.svg)

### Commands
**Commands triggered by the admin:**

| Command                    | Description                         |
|:---------------------------|:------------------------------------|
| CreateSmartFurnitureHookup | Create a new smart furniture hookup |
| EditSmartFurnitureHookup   | Edit a smart furniture hookup       |
| DeleteSmartFurnitureHookup | Delete a smart furniture hookup     |

### Events
**Outbound events:**
- _SmartFurnitureHookupCreated_: emitted when the admin creates a new smart furniture hookup
- _SmartFurnitureHookupDeleted_: emitted when the admin edits a smart furniture hookup
- _SmartFurnitureHookupUpdated_: emitted when the admin deletes a smart furniture hookup

## Map context
This context is responsible for managing the floor plan, the zones and the placement of smart furniture hookups.
Its primary duties include storing the floor plan, in an SVG format, the zones, and the position of smart furniture hookups.
It should use (x,y) coordinate to manage the position of the elements of the map. To create a zone, the admin should provide a unique name, color,
and the coordinate of the vertices of the geometric definition of zone. Additionally, it manages the relationship logic that automatically
assigns a hookup to a zone based on its coordinates, updating these associations when the map element change.
To keep the integrity of the map, the floor plan can be updated only once.

![map_ddd.svg](../img/uml/map_ddd.svg)

### Commands
**Commands triggered by the admin:**

| Command                          | Description                                                               |
|:---------------------------------|:--------------------------------------------------------------------------|
| UploadFloorPlan                  | Upload and store the floor plan file                                      |
| CreateZone                       | Create a new zone in the map                                              |
| EditZone                         | Edit an existing Zone’s information                                       |
| DeleteZone                       | Delete an existing Zone                                                   |
| EditSmartFurnitureHookupPosition | Update the position within the map  of an existing Smart Furniture Hookup |

**Commands triggered by the system:**

| Command                      | Description                                          |
|:-----------------------------|:-----------------------------------------------------|
| EditSmartFurnitureHookupZone | Update the zone assigned to a smart furniture hookup |


### Events
**Inbound events:**
- _SmartFurnitureHookupCreated_: received when a smart furniture hookup is created in the smart furniture hookup context.
- _SmartFurnitureHookupDeleted_: received when a smart furniture hookup is deleted in the smart furniture hookup context.

**Outbound events:**
- _FloorplanUploaded_: emitted when the admin uploads the file of the floorplan.
- _ZoneCreated_: emitted when the admin creates a new zone.
- _ZoneUpdated_: emitted when the admin updates the information of an existing zone.
- _ZoneDeleted_: emitted when the admin deletes a zone.
- _SmartFurnitureHookupPositionUpdated_: emitted when the admin updates the smart furniture hookup’s position within the Map.
- _SmartFurnitureHookupZoneUpdated_: emitted when the system updates the smart furniture hookup’s assigned zone.

## Monitoring context
This context is responsible for ingesting, storing and queering, utility consumption from each physical smart furniture hookup,
and for providing query capabilities over the collected data.
It performs data validation by verifying that each received measurement contains a valid smart furniture hookup ID and,
when a username is provided, that the corresponding household user account exists.
Additionally, it informs each physical smart furniture hookup of the endpoint to which it should send its data.
Another key responsibility is querying the collected data in order to aggregate, filter, and retrieve real-time consumption information.

![monitoring_ddd.svg](../img/uml/monitoring_ddd.svg)

_About DDD_: In this context, we deliberately avoid defining aggregate roots or entities.
This decision lies in the absence of any requirement to retrieve, update, or delete individual measurements.
Instead, measurements are accessed exclusively through queries that operate on aggregated data.


### Commands
Commands trigger by the physical hookup:

| Command           | Description                                                                   |
|:------------------|:------------------------------------------------------------------------------|
| IngestConsumption | Process a received utility consumption from a physical smart furniture hookup |

**Commands triggered by the system:**

| Command                      | Description                                                                  |
|:-----------------------------|:-----------------------------------------------------------------------------|
| RecordConsumption            | Record a new valid consumption                                               |
| RegisterSmartFurnitureHookup | Transmit indication on how to send data to a physical smart furniture hookup |

### Events
**Inbound events:**
- _SmartFurnitureHookupCreated:_ received when a new is created in the smart furniture hookup context.

**Outbound events:**
- _ConsumptionIngested:_ emitted when a received utility consumption  is fully processed
- _SmartFurnitureHookupConsumptionRecorded:_ emitted when a new consumption is recorded

## Forecasting context
This context is responsible for managing the forecast of utility consumptions.
Forecasts are computed by a scheduled daily job, which runs by default at 00:01 and triggers the forecast computation logic.
After a forecast is computed it sends, for each utility, the forecast aggregations (per `PeriodType`) to the Threshold context for evaluation.

![forecast_ddd.svg](../img/uml/forecast_ddd.svg)

### Commands

**Commands triggered by the user:**

| Command | Description |
| --- | --- |
| GetForecasts | Retrieve all stored forecasts |
| GetForecastByUtilityType | Retrieve the stored forecast for a specific `UtilityType` |

**Commands triggered by the system:**

| Command | Description |
| --- | --- |
| ComputeForecasts | Daily scheduled computation of forecasts for all utilities |
| NotifyForecastAggregations | Send forecast aggregations (per `PeriodType`) to the Threshold context for evaluation |

### Events

**Outbound events:**

* *ForecastEvaluation*: sent to the Threshold context when forecast aggregations are produced.

## Threshold context
This context is responsible for managing and evaluating the utility consumption limits that trigger alerts.
A `Threshold` is defined by a utility, a numeric limit, and a `ThresholdType` which dictates the evaluation logic:

* **ACTUAL:** Checked against realtime consumption streams.
* **HISTORICAL:** Checked against aggregated historical consumption over a specific period.
* **FORECAST:** Checked against aggregated forecast consumption over a specific period.

Evaluation is driven by multiple system inputs. The service receives updates from Monitoring to evaluate realtime and historical thresholds, and exposes an internal endpoint to evaluate forecasts.
When a threshold is breached, it transitions to a `BREACHED` state (persisted for Historical/Forecast types) and triggers an alert.
A daily background job acts as a "reset mechanism," returning eligible breached thresholds to an `ENABLED` state based on their period (e.g., weekly thresholds reset on Mondays).

![threshold_ddd.svg](../img/uml/threshold_ddd.svg)

### Commands

**Commands triggered by the admin:**

| Command | Description |
| --- | --- |
| GetThresholdById | Retrieve one threshold by identifier |
| CreateThreshold | Create a new threshold |
| UpdateThreshold | Modify an existing threshold |
| DeleteThreshold | Delete an existing threshold |
| ListThresholds | List thresholds, optionally filtered by utility, type, period, or name |


**Commands triggered by the system:**

| Command | Description |
| --- | --- |
| EvaluateConsumptionReadings | Evaluate incoming Monitoring readings against ACTUAL/HISTORICAL thresholds |
| EvaluateForecast | Evaluate Forecasting aggregations against FORECAST thresholds |
| ResetThresholds | Daily CRON reset of eligible `BREACHED` thresholds back to `ENABLED` |
| PublishThresholdsChange | Push enabled thresholds to Monitoring when the enabled set changes |

### Events

**Inbound events:**

* *ForecastEvaluation*: received from Forecasting containing forecast aggregations.

**Outbound events:**

* *ThresholdExceeded*: sent to Alert context for each breached threshold.


## Alert context
This context is responsible for managing and delivery of the alerts to admins when consumption limits are exceeded.
When that happens, it generates an alert that includes the date, a message, and a descriptive message detailing the
nature and specifics of the violation. The admin can view them, mark them as read to acknowledge them and delete them when no longer relevant
It subscribes to ThresholdExceeded events and handles the logic for delivering this information to the admin.
The context implements **spam mitigation** logic specifically for `ACTUAL` thresholds: if an unread alert for the same
threshold exists within a specific time window (1 hour), the new alert is suppressed to avoid notification fatigue.

![alert_ddd.svg](../img/uml/alert_ddd.svg)

### Commands

**Commands triggered by the admin:**

| Command | Description                                         |
| --- |-----------------------------------------------------|
| SubscribeAlertsStream | Subscribe to the server stream for real-time alerts |
| GetAlertById | Retrieve a single alert by identifier               |
| GetAlerts | Retrieve all stored alerts                          |
| DeleteAlert | Delete a single alert                               |
| DeleteAllAlerts | Delete all alerts                                   |
| GetUnreadAlertCount | Retrieve the number of unread alerts                |
| MarkAlertAsRead | Mark an alert as read (acknowledge)                 |

**Commands triggered by the system:**

| Command | Description |
| --- | --- |
| CreateAlert | Create an alert from a threshold breach request (invoked by Threshold context) |
| SendAlert | Attempt delivery (broadcast) of the created alert|

### Events

**Inbound events:**

* *ThresholdExceeded*: received from the Threshold context.

**Outbound events:**

* *NewAlert*: broadcast to connected clients when a new alert is created and sent.

## Context Map
Along with the bounded contexts, the team produced the context map. Each bounded context is isolated and can be implemented independently,
but they need to be integrated to provide a coherent service to the users. We defined the following model integrity patterns to achieve data consistency:
- **Customer-Supplier pattern**
- **Conformist pattern**

The following diagram shows the context map of the system:

![ContextMap.svg](../img/ContextMap.svg)