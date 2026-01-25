---
id: deployment
title: Deployment
description: Deployment guide using Docker Compose
---

# Deployment
The **EnergyConsumptionOptimizer** system deployment is orchestrated via **Docker Compose**.
The stack provisions the following containerized services:

* **API Gateway**: Reverse proxy acting as the unified entry point.
* **Frontend**: The web user interface application.
* **Backend Services**: The core business logic microservices.
* **Persistence Layer**: MongoDB and InfluxDB v2.

## Prerequisites
- **Docker**

## Configuration

Before starting the system, specific environment variables must be configured.  
These can be provided via a `.env` file in the project root or through the host environment.

### Required Variables

The following variables are strictly required and have **no default values**:

| Variable | Description |
|--------|-------------|
| `JWT_SECRET_KEY` | Secret used for signing and verifying JWT tokens |
| `RESET_CODE` | Code used for the administrator password reset |
| `DOCKER_INFLUXDB_INIT_USERNAME` | InfluxDB username |
| `DOCKER_INFLUXDB_INIT_PASSWORD` | InfluxDB password |
| `DOCKER_INFLUXDB_INIT_ADMIN_TOKEN` | InfluxDB admin token |

## Custom MongoDB Image

:::warning Important
The project uses a custom MongoDB image designed **without external anonymous volumes**.  
This base image (`mongonovolume`) must be generated locally via the provided script **before** starting the orchestration.
:::

## Step-by-step Guide

### 1. Clone the bootstrap Repository
```bash
git clone https://github.com/EnergyConsumptionOptimizer/EnergyConsumptionOptimizer
```
### 2. Setup Environment
Navigate to the project root and configure the [Required Variables](#required-variables). You can create an .env file.

### 3. Generate Database Base Image
Execute the script to build the [custom MongoDB](#custom-mongodb-image) image:
```bash
./CREATE_NOVOLUME_BASE_IMAGE.sh
```

### 4. Start the System
To start up the system, run the command:
```bash
docker compose up
```

### 5. Access
Once the system is running, the application is accessible via browser at URL: http://localhost:80

The system comes with a pre-configured administrator account:
- Username: admin
- Password: admin

To stop the system and remove containers, run the command:
```bash
docker compose down
```
