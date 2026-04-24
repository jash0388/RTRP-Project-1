# Backend Developer Guide

The SPHN backend is a robust Node.js and Express API server. It handles data persistence, authentication, and authorization.

## 1. Core Technologies

-   **Runtime/Framework:** Node.js v18+ with Express.js.
-   **Database:** MongoDB.
-   **ODM (Object Data Modeling):** Mongoose.
-   **Authentication:** `jsonwebtoken` (JWT) and `bcrypt` for password hashing.
-   **File Handling:** `multer` for parsing `multipart/form-data` uploads.
-   **Security:** `helmet`, `cors`, `express-rate-limit`.

## 2. Directory Structure (`server/`)

-   **`server.js`**: The entry point. Configures middleware, connects to DB, mounts routes, and seeds default data.
-   **`config/`**: Database configuration (`db.js`).
-   **`controllers/`**: Contains the business logic for the routes.
-   **`middleware/`**:
    -   `auth.js`: Verifies JWTs and role-based access.
    -   `sanitize.js`: Basic XSS prevention.
    -   `upload.js`: Multer configuration for handling file uploads.
-   **`models/`**: Mongoose schemas defining the data structure (`User.js`, `Report.js`).
-   **`routes/`**: Express Router files that map URL endpoints to controller functions.
-   **`uploads/`**: Local directory where user-uploaded images and videos are stored.

## 3. Database Models

### User Model (`User.js`)
Stores user accounts.
-   `name`, `email` (unique), `password` (hashed).
-   `role`: String enum (`'user'`, `'police'`, `'admin'`). Default is `'user'`.
-   Timestamps enabled.

### Report Model (`Report.js`)
Stores traffic violation reports.
-   `userId`: Reference to the User who submitted it.
-   `violationType`: Type of offense.
-   `location` / `latitude` / `longitude` / `address`: Geospatial data.
-   `imagePath` / `videoPath`: References to files in the `uploads/` directory.
-   `status`: `'pending'`, `'approved'`, or `'rejected'`.
-   `verifiedNumberPlate`: String populated during manual review.
-   `verifiedVehicleType`: String populated during manual review.

## 4. Middleware Deep Dive

### Authentication Middleware (`middleware/auth.js`)
Exports functions like `protect` and `authorize`:
-   `protect`: Looks for `Authorization: Bearer <token>` in headers. Decodes the token, finds the user in MongoDB, and attaches `req.user`. If invalid, returns a 401 error.
-   `authorize('admin')`: Must be used *after* `protect`. Checks if `req.user.role` matches the required roles. If not, returns a 403 Forbidden.

### Upload Middleware (`middleware/upload.js`)
Uses `multer` configured to:
-   Save files to `./uploads/`.
-   Generate unique filenames using timestamps + original name.
-   Filter file types to accept only images (JPEG, PNG, WebP) and standard video formats.

## 5. Security Measures Implemented

1.  **Rate Limiting:** Protects `/auth/login` from brute-force password guessing. General rate limiter on all API routes to prevent DoS.
2.  **Helmet:** Sets various HTTP headers to prevent XSS, clickjacking, etc.
3.  **Sanitization:** Custom middleware strips `<script>` tags and dangerous characters from incoming JSON payloads.
4.  **CORS:** Restricts API access to the specific URLs where the React frontend is hosted.


