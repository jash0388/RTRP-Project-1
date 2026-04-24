# Frontend Developer Guide

The SPHN frontend is a React application built with Vite. It provides distinct interfaces for Citizens, Police Officers, and System Administrators.

## 1. Core Technologies

-   **Framework:** React 18 (using Hooks and functional components).
-   **Build Tool:** Vite (for fast HMR and optimized production builds).
-   **Routing:** `react-router-dom` v6.
-   **Styling:** Vanilla CSS with custom properties (variables) defined in `index.css`.
-   **Mapping:** `react-leaflet` and `leaflet` for rendering interactive maps.
-   **Charting:** `recharts` for rendering analytics data.
-   **Icons:** `lucide-react` for consistent SVG iconography.

## 2. Directory Structure (`client/src/`)

-   **`components/`**: Reusable UI elements (Buttons, Cards, Modals, Navbar, Sidebar).
-   **`context/`**: React Context providers (e.g., `AuthContext.jsx` for global user state).
-   **`pages/`**: Full-page components routed via React Router.
    -   *Citizen Pages:* `Home.jsx`, `Dashboard.jsx`, `SubmitReport.jsx`, `ReportHistory.jsx`, `UserProfile.jsx`
    -   *Admin Pages:* `AdminDashboard.jsx`, `AdminReports.jsx`, `AdminUsers.jsx`, `AdminAuditRegistry.jsx`, `Analytics.jsx`
    -   *Police Pages:* `PoliceDashboard.jsx`, `PoliceReports.jsx`
-   **`services/`**: API wrapper functions encapsulating `fetch` or `axios` calls to the Node.js backend. Keeps components clean from raw network logic.
-   **`styles/`**: Global CSS files (`index.css`, `App.css`).
-   **`firebase.js`**: (Optional/Legacy) Configuration for Firebase if used alongside or instead of the custom JWT backend.

## 3. State Management & Authentication

The application uses the Context API for global state.

### `AuthContext.jsx`
-   Wraps the entire application.
-   Provides `user` (object or null), `login()`, `logout()`, and `register()` functions.
-   Automatically checks for a stored JWT in `localStorage` on initial load.
-   Role-based access control (RBAC) is enforced at the routing level.

### Protected Routes
In `App.jsx`, routes are protected based on the user's role:
-   `/dashboard` requires a logged-in user.
-   `/admin/*` requires the user role to be `admin`.
-   `/police/*` requires the user role to be `police`.

## 4. UI/UX and Styling

-   **Glassmorphism:** The UI utilizes translucent backgrounds with background-blur (`backdrop-filter: blur()`) to create a modern "glass" effect over gradient backgrounds.
-   **CSS Variables:** Theme colors are defined in `:root` inside `index.css` (e.g., `--primary-color`, `--bg-dark`).
-   **Responsiveness:** Media queries are heavily used to ensure mobile-first compatibility, especially for the citizen reporting flow.

## 5. Adding a New Page

To add a new page to the frontend:
1.  Create the component file in `client/src/pages/NewPage.jsx`.
2.  Import it into `client/src/App.jsx`.
3.  Add a `<Route path="/new-page" element={<NewPage />} />` inside the `<Routes>` block.
4.  If it needs to be protected, wrap it in a custom `<ProtectedRoute>` wrapper.
5.  Add a link to the page in the `Navbar` or `Sidebar` component.
