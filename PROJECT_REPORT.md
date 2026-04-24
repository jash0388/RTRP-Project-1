# SPHN: Smart Traffic Violation Reporting & Analytics System
## Academic Project Report

**Project Title:** SPHN — Smart Traffic Violation Reporting & Analytics System  
**Domain:** Web Development, Artificial Intelligence, Traffic Management Systems  

---

## 1. Abstract

The Smart Traffic Violation Reporting & Analytics System (SPHN) is a comprehensive full-stack web application designed to bridge the gap between citizens and traffic enforcement authorities. The system enables citizens to actively report traffic violations by uploading photographic or video evidence. To ensure accuracy and maintain formal legal protocols, SPHN integrates a dedicated manual verification portal where traffic police and administrators can review evidence, verify vehicle types and license plates, and make final enforcement decisions. The data is securely stored and presented to administrators and traffic police through an interactive analytics dashboard, providing actionable insights into traffic violation patterns, hotspots, and trends.

## 2. Introduction

### 2.1 Problem Statement
Traffic violations are a primary cause of road accidents worldwide. Traditional enforcement methods rely heavily on the physical presence of traffic police or static traffic cameras, which cannot cover every street. There is a need for a decentralized, crowd-sourced reporting mechanism backed by automated verification to improve road safety and enforcement efficiency.

### 2.2 Proposed Solution
SPHN proposes a two-tier architecture:
1.  **Citizen Interface:** A mobile-responsive web application where users can upload evidence of violations.
2.  **Enforcement Dashboard:** A secure portal for police and administrators to manually review reports, extract and verify critical details (e.g., license plates), approve or reject them, and visualize data via heatmaps and charts.

## 3. System Architecture

The application is built using a decoupled, microservices-inspired architecture to ensure scalability and separation of concerns.

### 3.1 High-Level Component Diagram
-   **Client Layer:** React.js (Vite build system)
-   **Server Layer:** Node.js, Express.js
-   **Database Layer:** MongoDB (Mongoose ODM)

The interaction flow is as follows: The Client application communicates with the Node.js Server via RESTful API calls. The Server handles business logic and interfaces with MongoDB for data persistence. Police officers review these records manually via the enforcement portal.

### 3.2 Technology Stack Justification
-   **React 18:** Selected for its component-based architecture and efficient DOM manipulation, providing a smooth Single Page Application (SPA) experience.
-   **Node.js & Express:** Chosen for their non-blocking I/O model, making them highly efficient for handling concurrent API requests and file uploads.
-   **MongoDB:** A NoSQL database is utilized for its flexibility in handling unstructured data, such as variable report metadata.

## 4. Implementation Details

### 4.1 Frontend Implementation (Client)
The frontend is structured around role-based access control (RBAC). A global `AuthContext` manages the session state using JSON Web Tokens (JWT). 
-   **Routing:** Handled by `react-router-dom`, protecting sensitive routes based on user roles (`user`, `police`, `admin`).
-   **Data Visualization:** The `recharts` library is implemented in the Analytics Dashboard to render dynamic bar, pie, and line charts representing violation distributions and trends.
-   **Geospatial Mapping:** The `react-leaflet` library is integrated to plot violation locations on an interactive map, aiding in the identification of accident/violation hotspots.

### 4.2 Backend Implementation (Server)
The backend REST API is designed with security and scalability as priorities.
-   **Security Middleware:** `helmet` is used to set secure HTTP headers, `cors` restricts unauthorized cross-origin requests, and `express-rate-limit` prevents brute-force attacks on authentication endpoints.
-   **Data Validation and Sanitization:** Custom middleware ensures incoming data is stripped of potentially malicious scripts (XSS prevention).
-   **Media Handling:** The `multer` library parses `multipart/form-data`, saving media to a local `/uploads` directory and generating unique file paths stored in the database.

### 4.3 Manual Verification Workflow
The system strictly relies on human oversight to ensure legal compliance. When a report is filed, it enters a `pending` state. Traffic officers access a specialized dashboard to view the evidence media, verify the location, and manually input the `Verified Number Plate` and `Verified Vehicle Type` before issuing a final decision (approved/rejected).

## 5. Database Schema

### 5.1 User Collection
Stores authentication and profile data.
-   `name` (String), `email` (String, Unique), `password` (String, Hashed).
-   `role` (Enum: `user`, `police`, `admin`).

### 5.2 Report Collection
Stores user-submitted evidence and corresponding AI analysis.
-   `userId` (ObjectId, Reference to User).
-   `violationType` (String), `description` (String).
-   `location` (Object containing `latitude`, `longitude`, `address`).
-   `imagePath` / `videoPath` (String).
-   `status` (Enum: `pending`, `approved`, `rejected`).
-   `verifiedNumberPlate` (String), `verifiedVehicleType` (String) - manually populated by enforcement personnel.

## 6. API Reference (Core Endpoints)

| Endpoint | Method | Role Required | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | POST | None | Registers a new user account. |
| `/api/auth/login` | POST | None | Authenticates user and issues a JWT. |
| `/api/reports` | POST | User | Accepts multipart form data to create a new violation report. |
| `/api/admin/reports` | GET | Admin/Police| Retrieves all reports, supporting query filters. |
| `/api/admin/reports/:id`| PUT | Admin/Police| Updates report status (e.g., pending to approved). |
| `/api/analytics/summary`| GET | Admin/Police| Aggregates statistical data for dashboard charting. |

## 7. Conclusion and Future Scope
The SPHN project successfully demonstrates the integration of modern web technologies to solve real-world civic issues. By crowdsourcing evidence collection and providing a streamlined dashboard for manual verification, it enhances the reach of traffic enforcement agencies.

**Future Enhancements:**
1.  Integration of an AI/ML pipeline to assist with preliminary analysis.
2.  Migration of local media storage to cloud-based object storage (e.g., AWS S3).
3.  Implementation of real-time push notifications for citizens regarding their report status using WebSockets.
