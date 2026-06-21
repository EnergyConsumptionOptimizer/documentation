---
id: deployment
title: Deployment
description: Deployment guide using Docker Compose
---

# Deployment

The **EnergyConsumptionOptimizer** system is orchestrated with **Docker Compose**. The stack
provisions all containerized components:

* **API Gateway** — Traefik reverse proxy, the single entry point.
* **Frontend** — the web user interface.
* **Backend Services** — the business-logic microservices.
* **Infrastructure** — MongoDB, InfluxDB v2, Redis, and Kafka (with Kafka Connect).
* **Observability** *(optional)* — Prometheus, Grafana, Loki, Tempo and the OpenTelemetry Collector.

The pre-built service images are published to the GitHub Container Registry and pulled
automatically on startup.

## Prerequisites
- **Docker** (with Docker Compose)

## Configuration

Before starting the system, specific environment variables must be configured.  
These can be provided via a `.env` file in the project root or through the host environment.

### Required Variables

The following variables are strictly required and have **no default value**:

| Variable | Description |
|--------|-------------|
| `JWT_SECRET_KEY` | Secret used for signing and verifying JWT tokens |
| `RESET_CODE` | Code used for the administrator password reset |
| `DOCKER_INFLUXDB_INIT_USERNAME` | InfluxDB username |
| `DOCKER_INFLUXDB_INIT_PASSWORD` | InfluxDB password |
| `DOCKER_INFLUXDB_INIT_ADMIN_TOKEN` | InfluxDB admin token |
| `REDIS_PASSWORD` | Password protecting the Redis cache |

## Step-by-step Guide

### 1. Clone the Repository
```bash
git clone https://github.com/EnergyConsumptionOptimizer/EnergyConsumptionOptimizer
```

### 2. Set up the Environment
From the project root, create your `.env` from the example and fill in the
[required variables](#required-variables):
```bash
cp .env-example .env
```

### 3. Start the System
```bash
docker compose up -d
```

### 4. Access
Once running, the application is accessible at http://localhost.

The system comes with a pre-configured administrator account:
- Username: `admin`
- Password: `admin`

### 5. Stop the System
```bash
docker compose down
```
Add the `-v` flag to also remove the data volumes.
