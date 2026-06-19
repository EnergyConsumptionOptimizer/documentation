---
id: intro
title: Introduction
position: 1
sidebar_position: 1
---


# Energy Consumption Optimizer
ECO is a web-based platform designed for the monitoring and optimization of household consumption related to electricity, gas, and water.
The platform is implemented through integration with intelligent power outlets (*smart furniture hookups*) deployed across different areas of the home.
Thanks to the continuous data acquisition performed by these devices, the platform provides real-time monitoring of utility usage.
The system also implements predictive functionalities for estimating future consumption. Finally, the platform allows the configuration
of customized consumption thresholds which, supported by an alerting system, automatically send notifications to the user when the
defined critical conditions are met.


## Smart Furniture Hookups

*Smart furniture hookups* are intelligent power outlets capable of monitoring their own energy consumption and transmitting it over the network via HTTP calls. Each outlet exposes several HTTP endpoints through which it is possible to:

- Retrieve information about the outlet, such as name, status, and type of consumed resource.
- Dynamically configure the destination endpoint to which the outlet must send consumption data.

From a functional standpoint, the outlets perform continuous consumption monitoring with a high sampling frequency (very short time intervals), transmitting the data to the configured remote endpoint via HTTP requests.  
In addition, in order to simplify the interpretation of state change events, the outlets transmit consumption values equal to zero during power-on and power-off phases.

Finally, these outlets can associate their consumption data with a *username* tag representing the household user currently using the device.

![sfh_device_cc.svg](./img/uml/sfh_device_cc.svg)