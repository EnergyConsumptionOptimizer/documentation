---
id: conclusions
title: Conclusions
position: 8
sidebar_position: 8
---

# Conclusions

From a software process engineering point of view, this project allowed us to gain a concrete understanding of the limitations
and challenges of traditional development approaches, while consolidating the best practices learned during the course.
The evolution of our workflow, from unstructured commits to the adoption of Conventional Commits, together with the introduction
of semantic release, significantly simplified versioning and release management activities.

The implementation of a structured CI/CD pipeline played a crucial role in establishing a robust and reliable development workflow,
enabling the automation of build, testing, and deployment processes and reducing the risk of human error. The adoption of CI/CD was also fundamental
for supporting the microservices architecture, as it allowed individual services to grow independently while being continuously
integrated and tested as part of the overall system. This made it possible to develop features in parallel and verify their
correct integration across services throughout the development process.

Even before the development phase, the adoption of a Domain-Driven Design (DDD) approach proved fundamental in achieving a deep understanding
of the application domain, clearly defining what needed to be developed and how the system should be structured.
This approach, combined with the principles of Clean Architecture, allowed us to design and implement multiple microservices (even using different programming languages)
without introducing excessive complexity. The standardization of project structure and development practices significantly
reduced cognitive overhead, making it easier to move between different services without the need to re-learn or recall
architectural details. This ultimately improved both developer productivity and the overall maintainability of the system.

## Future work
Our journey is not complete. We plan to significantly evolve the system from both architectural and network perspectives
to improve scalability and resilience.
* **From Clean Architecture to Hexagonal Architecture**: Enhance the implementation of Ports and Adapters for better modularity and maintainability.
* **Architectural Testing**: implement automated architectural tests (e.g., using ArchUnit) to strictly enforce the
Dependency Inversion Principle and prevent architectural drift.
* **End-to-End Testing**: expand our test coverage to include E2E scenarios, ensuring the integrity of complex interactions between microservices.
* **Advanced Observability**: Currently, we only use Healtheche for monitoring. We plan to extend this with additional metrics,
such as number of requests per second and average response time, to gain deeper insights.
* **Event-Driven Architecture**: Transition from RESTful APIs to asynchronous communication between microservices to improve
overall system communication and responsiveness, and to reduce coupling.
* **Caching Strategy**: One current critique is that services make repeated requests for the same data
(e.g., checking for username existence). By adopting an event-driven architecture, we could implement a cache that reduces redundant
requests and reacts to changes in real time.
* **Fault Tolerance and CAP Theorem Analysis**: In the current state, a component failure can compromise data integrity.
We plan to introduce fault-tolerant mechanisms and evaluate the system according to the CAP theorem.
* **API Gateway Evolution**: Move from a simple proxy to a centralized API Gateway with unified authentication and support for API composition.