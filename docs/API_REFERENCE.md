# API Reference

The SPHN system exposes the main Node.js Backend API.

---

## 1. Node.js Backend API

**Base URL:** `http://localhost:5000/api`

### 1.1 Authentication (`/auth`)

#### Register User
- **URL:** `/auth/register`
- **Method:** `POST`
- **Body:** `{ "name": "John Doe", "email": "john@example.com", "password": "password123" }`
- **Response:** `201 Created`
  ```json
  {
    "message": "User registered successfully",
    "token": "eyJhbGciOiJIUz...",
    "user": { "id": "...", "name": "...", "role": "user" }
  }
  ```

#### Login User
- **URL:** `/auth/login`
- **Method:** `POST`
- **Body:** `{ "email": "john@example.com", "password": "password123" }`
- **Response:** `200 OK` (Returns JWT token and user info)

#### Get Current Profile
- **URL:** `/auth/me`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `200 OK` (Returns user details based on token)

### 1.2 Reports (`/reports`)

*(All routes in this section require Authorization header)*

#### Create a Report
- **URL:** `/reports`
- **Method:** `POST`
- **Headers:** `Content-Type: multipart/form-data`
- **Body:**
  - `violationType` (string)
  - `description` (string)
  - `latitude` (number)
  - `longitude` (number)
  - `address` (string)
  - `image` (file)
- **Response:** `201 Created`
  Returns the created report object.

#### Get My Reports
- **URL:** `/reports/my`
- **Method:** `GET`
- **Response:** `200 OK` (Returns array of reports belonging to the logged-in user)

#### Get Report by ID
- **URL:** `/reports/:id`
- **Method:** `GET`
- **Response:** `200 OK`

### 1.3 Admin/Police (`/admin` and `/police`)

*(Requires Authorization header and Admin/Police role)*

#### Get All Reports
- **URL:** `/admin/reports`
- **Method:** `GET`
- **Query Params:** `?status=pending` (optional)
- **Response:** `200 OK` (Array of all reports)

#### Update Report Status
- **URL:** `/admin/reports/:id`
- **Method:** `PUT`
- **Body:** `{ "status": "approved", "adminNotes": "Fine issued", "verifiedNumberPlate": "MH01AB1234", "verifiedVehicleType": "motorcycle" }`
- **Response:** `200 OK`

#### Get All Users
- **URL:** `/admin/users`
- **Method:** `GET`
- **Response:** `200 OK` (Array of all registered users)

### 1.4 Analytics (`/analytics`)

*(Requires Authorization header and Admin/Police role)*

#### Get Summary Statistics
- **URL:** `/analytics/summary`
- **Method:** `GET`
- **Response:** `200 OK` (Returns counts of total, pending, approved reports, etc.)

#### Get Heatmap Data
- **URL:** `/analytics/heatmap`
- **Method:** `GET`
- **Response:** `200 OK` (Returns array of lat/lng coordinates for map rendering)


