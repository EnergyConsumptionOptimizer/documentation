---
title: Functional Requirements
sidebar_position: 2
---

# Functional Requirements

## Account management
1. The system shall include one default admin account to manage the platform
2. The system shall allow admin to create, update, and delete household user accounts.
3. The system shall allow household users to edit their own account information.

<details>
<summary>User stories</summary>

1. **Create Household User Account**\
   As an **admin**,\
   I want to create new household user accounts,\
   So that they can access the platform and their utility consumption can be tracked.

2. **Edit Household User Account**\
   As an **admin**,\
   I want to edit existing household user accounts,\
   So that I can update their details when necessary.

3. **Delete Household User Account**\
   As an **admin**,\
   I want to delete household user accounts when needed,\
   So that I can stop tracking their utility consumption.

4. **Edit Own Account Information**\
   As a **household user**,\
   I want to edit my account information,\
   So that I can update my personal details.
</details>

## Authentication
1. The system has to provide login and logout.
2. The system shall allow the admin log in using pre-configured credentials.
3. The system shall provide a password reset mechanism for admin.
4. The system shall allow users to edit their own password.

<details>
<summary>User stories</summary>

1. **Log in with Pre-configured Admin Credentials**\
   As an **admin**,\
   I want to log in to the system using pre-configured credentials,\
   So that I can access the administrative features.

2. **User Login with Personal Credentials**\
   As a **user**,\
   I want to log in to the system with my credentials,\
   So that I can access the platform.

3. **User Logout**\
   As a **user**,\
   I want to log out of the system when I'm done,\
   So that my session is securely terminated.

4. **Admin Password Reset**\
   As an **admin**,\
   I want to reset my password if I forget it,\
   So that I can regain access to my account.

5. **User Password Update**\
   As a **user**,\
   I want to edit my password,\
   So that I can securely update my login credentials and maintain account security.
</details>

## Smart furniture hookups
1. The system shall allow admin to register, update details, and remove smart furniture hookups.

<details>
<summary>User stories</summary>

1. **Register New Smart Furniture Hookups**\
   As an **admin**,\
   I want to register a new smart furniture hookups to zones,\
   So that utility consumptions can be tracked.

2. **Edit Smart Furniture Hookups**\
   As an **admin**,\
   I want to edit existing smart furniture hookups,\
   So that they reflect the current setup.

3. **Delete Smart Furniture Hookups**\
   As an **admin**,\
   I want to delete smart furniture hookups,\
   So that I can stop track their utility consumption when they outdated or unused ones.

</details>

## Map
1. The system shall allow admin to upload a digital floor plan of the household.
2. The system shall allow admin to define, edit, and delete zones on the floor plan.
3. The system shall allow admin to position smart furniture hookup and associate them to zones.

<details>
<summary>User stories</summary>

1. **Upload Floor Plan**\
   As an **admin**,\
   I want to upload a file of the household floor plan,\
   So that it can serve as the base for the map.

2. **Create Floor Plan Zones**\
   As an **admin**,\
   I want to create zones on the floor plan,\
   So that I can track the consumption of different household areas.

3. **Edit Existing Zones**\
   As an **admin**,\
   I want to edit existing zones,\
   So that I can make adjustments when needed.

4. **Delete Zones**\
   As an **admin**,\
   I want to delete zones,\
   So that I can remove areas that are no longer relevant.

5. **Position Smart Furniture Hookup**\
   As an **admin**,\
   I want to position a smart furniture hookup,\
   So that I can accurately place and associate the smart furniture within designated zones for effective utility monitoring.
</details>

## Monitoring
1. The system shall display a map showing all defined zones and smart furniture hookups.
2. The system shall show the current status and consumption for each smart furniture hookup.
3. The system shall display real-time utility consumption meters.
4. The system shall provide historical consumption data.
5. The system shall provide consumption forecasts based on historical data.
6. The system shall allow filtering of consumption data by user and zone.

<details>
<summary>User stories</summary>

1. **View Map Overview**\
   As a **user**,\
   I want to view the map with all zones and smart furniture hookups,\
   So that I can get an overview of the household’s status.

2. **See Smart Furniture Hookup Status And Consumption**\
   As a **user**,\
   I want to see the status and consumption of each smart furniture hookup,\
   So that I know which ones are currently active and how much they are supplying.

3. **View Real-Time Utility Consumption metrics**\
   As a **user**,\
   I want to view real-time utility consumption metrics,\
   So that I can monitor current usage.

4. **Filter Utility Consumption**\
   As a **user**,\
   I want to filter utility consumption by household user and zone,\
   So that I can analyze individual usage patterns.

5. **Access Historical Consumption Data**\
   As a **user**,\
   I want to access historical consumption data,\
   So that I can analyze past trends.

6. **View Consumption Forecasts**\
   As a **user**,\
   I want to view forecasts,\
   So that I can plan for future usage.
</details>

## Threshold and Alert
1. The system shall allow to define custom thresholds for alerts.
2. The system shall notify users when consumption exceeds a set threshold.
3. The system shall notify users when forecasted consumption exceeds a set threshold.
4. The system shall maintain a history of all alerts generated.

<details>
<summary>User stories</summary>

1. **Receive Consumption Alerts**\
   As an **admin**,\
   I want to receive alerts when consumption exceeds a set threshold,\
   So that I can take action.

2. **Configure Custom Thresholds**\
   As an **admin**,\
   I want to set custom thresholds,\
   So that alerts match my personal needs.

3. **View Alert History**\
   As an **admin**,\
   I want to view a history of past alerts,\
   So that I can identify recurring issues.
</details>


## Connection
1. The system shall send, receive, and process data from smart furniture hookups
<details>
<summary>User stories</summary>

1. **Send, Receive, and Process Smart Furniture Hookups Data**\
   As a **system**,\
   I want to send, receive, and process data from smart furniture hookups,\
   So that users can access accurate utility consumptions.
</details>
