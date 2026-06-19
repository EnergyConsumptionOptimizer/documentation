---
title: Non-Functional Requirements
sidebar_position: 3
---

# Non-Functional Requirements

## Quality Attributes Overview

### Operational Properties

1. **Availability & Fault Tolerance**
   1. The failure of a single system component shall not compromise the availability of critical operations, particularly the consumption data ingestion pipeline.
   2. The system shall automatically detect failures and recover from component crashes without manual intervention.

2. **Scalability & Performance**
   1. System components shall be independently scalable to handle varying loads without impacting other parts of the system.
   2. The system shall dynamically scale to sustain high-throughput data ingestion as the number of connected hookups and overall data volume increases over time.
   3. The system shall maintain performance degradation within acceptable thresholds during sudden load spikes.

3. **Real-Time Responsiveness**
   1. The system shall propagate consumption data updates to active clients within low-latency thresholds from the moment of ingestion.

4. **Deployability & Delivery**
   1. The system shall support the automated delivery of software artifacts and ensure reproducible and consistent deployments across all environments.

5. **Observability**
   1. The system shall provide comprehensive observability mechanisms to track system health, monitor performance metrics, and trace requests across boundaries, enabling rapid root-cause analysis.

### Structural Properties

1. **Maintainability & Evolvability**
   1. System modules shall exhibit high cohesion and low coupling, allowing them to be versioned, updated, and deployed independently.
   2. The codebase shall adhere to industry-standard static code analysis metrics to maintain a low level of technical debt.

2. **Testability**
   1. The system architecture shall facilitate automated validation at all levels, enabling high coverage for unit, integration, and end-to-end testing scenarios without relying on production data.

### Security Properties

1. **Authentication & Identity Management**
   1. The system shall enforce secure, standard-compliant user and machine authentication processes, supporting mechanisms for session expiration and secure renewal.

2. **Authorization**
   1. The system shall enforce strict access control policies to ensure that users and services can only access resources and endpoints permitted by their explicitly assigned roles.

---

## Measuring Quality Attributes

The system instruments and centralizes the following core architectural Service Level Indicators (SLIs):

* **Throughput:** Request and ingestion rate (e.g., requests per second), categorized by service and endpoint.
* **Error Rate:** The ratio of failed operations (e.g., system exceptions or server-side error responses) to total operations.
* **Latency:** System responsiveness measured at the **p90** and **p99 percentiles** to capture the "long tail" delays under variable, high-frequency loads.
* **Processing Failures:** The rate of asynchronous events that cannot be processed and are safely routed to a centralized dead-letter error queue.
* **Resource Saturation:** Utilization metrics for critical computing resources, including runtime memory allocation and CPU usage per service component.

---

## Quality Attributes Scenarios


### 1. Availability & Fault Tolerance

#### Scenario 1: Automated Recovery
* **Source:** Internal runtime component.
* **Stimulus:** A core data ingestion consumer process crashes or becomes unresponsive.
* **Artifact:** Message routing infrastructure and worker subsystems.
* **Environment:** Production under normal runtime load.
* **Response:** The system isolates the failed process, triggers an automated workload rebalance across healthy instances, and buffers incoming data stream elements to prevent failure propagation.
* **Response Measure:** Fully automated recovery without manual intervention; 0% data loss during the reassignment window.


### 2. Scalability & Performance

#### Scenario 1: High-Frequency Load Spikes
* **Source:** External smart furniture hardware endpoints.
* **Stimulus:** Data ingestion volume surges by 200% due to an increasing number of concurrent active hookups.
* **Artifact:** API gateway, ingestion services, and core data stores.
* **Environment:** Transition from normal operations to sudden peak load.
* **Response:** The traffic management layer dynamically distributes incoming requests across scaled service replicas, and distributed caching absorbs intensive read pressure.
* **Response Measure:** 100% of telemetry requests are successfully processed without dropouts, maintaining latency percentiles within SLO boundaries (e.g., average latency < 2 seconds).

### 3. Real-Time Responsiveness

#### Scenario 1: Live Telemetry Distribution
* **Source:** Smart furniture hookup hardware.
* **Stimulus:** A new utility consumption measurement is emitted and ingested.
* **Artifact:** Real-time push communication channels and monitoring component.
* **Environment:** Normal runtime execution.
* **Response:** The monitoring module asynchronously propagates the data payload to all active, subscribed user client sessions.
* **Response Measure:** End-to-end propagation latency (from edge ingestion to client display) remains under the target threshold (< 200ms at the p90 percentile).

### 4. Deployability

#### Scenario 1: Automated Artifact Delivery
* **Source:** Development team.
* **Stimulus:** A new software release is ready for deployment.
* **Artifact:** CI/CD pipeline and container registry.
* **Environment:** Development / Integration environment.
* **Response:** The CI/CD pipeline automatically builds, tests, and packages the new release, publishing the artifact to the container registry.
* **Response Measure:** The delivery process completes automatically without manual intervention, making the new artifact available within 20 minutes for deployment.

### 5. Observability

#### Scenario 1: Root-Cause Bottleneck Isolation
* **Source:** Internal software defect or anomalous operational state.
* **Stimulus:** A severe performance degradation or high error rate occurs in a downstream component.
* **Artifact:** Centralized observability stack and system modules.
* **Environment:** Live active production environment.
* **Response:** System components automatically emit correlated logs, metrics, and tracing context to a centralized dashboard.
* **Response Measure:** Development teams can isolate the exact faulty component and performance bottleneck via centralized telemetry dashboards without inspecting individual server nodes.

### 6. Maintainability & Extensibility

#### Scenario 1: Feature Addition
* **Source:** Software development team.
* **Stimulus:** A new feature is requested by the product team.
* **Artifact:** System architecture.
* **Environment:** Development environment.
* **Response:** The system supports the integration of the new feature with minimal changes to existing code.
* **Response Measure:** Time required to add the new feature is less than 2 weeks.

#### Scenario 2: Code Maintenance
* **Source:** Users.
* **Stimulus:** A bug is reported in an existing feature.
* **Artifact:** Source code.
* **Environment:** Development and testing environment.
* **Response:** The development team fixes the bug.
* **Response Measure:** The bug is resolved within 2 days.

#### Scenario 3: Automated Test
* **Source:** Development team.
* **Stimulus:** A new feature is completed.
* **Artifact:** Test suite.
* **Environment:** Testing environment.
* **Response:** The system runs a suite of automated tests.
* **Response Measure:** tests must pass without errors.


### 7. Security & Access Control

#### Scenario 1: Ingress Boundary Enforcement
* **Source:** External client or unauthorized machine agent.
* **Stimulus:** An incoming API call attempts to access a protected endpoint.
* **Artifact:** Perimeter API gateway and Identity Access Management (IAM) engine.
* **Environment:** Normal system runtime.
* **Response:** The edge perimeter enforces cryptographically secure session and token verification, rejecting unauthorized calls and propagating valid identity contexts downstream for strict role-based access control.
* **Response Measure:** 100% of unauthenticated or unauthorized requests are immediately rejected at the system perimeter.
