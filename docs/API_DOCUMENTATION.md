# RESTful API Documentation

**Project**: AI-Powered Smart Scholarship Finder and Eligibility Recommendation System  
**Base URL**: `http://localhost:5000/api`  
**Authentication**: Bearer Token (JSON Web Token) passed in HTTP Header `Authorization: Bearer <token>`

---

## 0. System Health & Discovery Endpoints

### 0.1 Health Check
- **Method**: `GET`
- **Endpoint**: `/api/health` (also aliased at `/health`)
- **Access**: Public
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "status": "online",
    "message": "Scholarship Finder Backend Server is healthy and running",
    "system": "AI-Powered Smart Scholarship Finder and Eligibility Recommendation System",
    "database": {
      "status": "Connected",
      "connected": true,
      "host": "127.0.0.1"
    },
    "uptimeSeconds": 142,
    "timestamp": "2026-09-03T08:12:00.000Z"
  }
  ```

### 0.2 API Root & Route Directory
- **Method**: `GET`
- **Endpoint**: `/api` (also aliased at `/`)
- **Access**: Public
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Welcome to the AI-Powered Smart Scholarship Finder & Eligibility Recommendation System API",
    "status": "online",
    "version": "1.0.0",
    "healthCheck": "/api/health",
    "endpoints": {
      "health": "GET /api/health",
      "auth": "POST /api/auth/register, POST /api/auth/login, GET /api/auth/me",
      "profile": "GET /api/profile, PUT /api/profile",
      "scholarships": "GET /api/scholarships, GET /api/scholarships/:id, GET /api/scholarships/meta/filters",
      "recommendations": "GET /api/recommendations, POST /api/recommendations/simulate",
      "applications": "GET /api/applications, POST /api/applications/save/:id, POST /api/applications/apply/:id",
      "notifications": "GET /api/notifications, PUT /api/notifications/read-all",
      "analytics": "GET /api/analytics/admin, GET /api/analytics/student"
    }
  }
  ```

---

## 1. Authentication Endpoints (`/api/auth`)

### 1.1 Register User
- **Method**: `POST`
- **Endpoint**: `/api/auth/register`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "name": "Aarav Sharma",
    "email": "student@scholarship.org",
    "password": "student123",
    "role": "student" // "student" or "admin"
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "6688f01b...",
      "name": "Aarav Sharma",
      "email": "student@scholarship.org",
      "role": "student"
    },
    "profile": { ... }
  }
  ```

### 1.2 User Login
- **Method**: `POST`
- **Endpoint**: `/api/auth/login`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "student@scholarship.org",
    "password": "student123"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "6688f01b...",
      "name": "Aarav Sharma",
      "email": "student@scholarship.org",
      "role": "student"
    }
  }
  ```

### 1.3 Get Current User Session
- **Method**: `GET`
- **Endpoint**: `/api/auth/me`
- **Access**: Private (Student & Admin)

---

## 2. Student Academic Profile Endpoints (`/api/profile`)

### 2.1 Get Student Profile
- **Method**: `GET`
- **Endpoint**: `/api/profile`
- **Access**: Private (Student)
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "fullName": "Aarav Sharma",
      "email": "student@scholarship.org",
      "mobileNumber": "9876543210",
      "gender": "Male",
      "dateOfBirth": "2003-08-15T00:00:00.000Z",
      "state": "Maharashtra",
      "district": "Pune",
      "course": "B.Tech",
      "branch": "Computer Science and Engineering",
      "yearOfStudy": "3rd Year",
      "collegeName": "Pune Institute of Computer Technology",
      "cgpa": 8.7,
      "familyIncome": 240000,
      "category": "OBC",
      "minorityStatus": false,
      "disabilityStatus": false,
      "completionPercentage": 100
    }
  }
  ```

### 2.2 Update Student Profile
- **Method**: `PUT`
- **Endpoint**: `/api/profile`
- **Access**: Private (Student)
- **Request Body**: All or partial profile fields.

---

## 3. Scholarship Catalog Endpoints (`/api/scholarships`)

### 3.1 List Scholarships with Advanced Filters
- **Method**: `GET`
- **Endpoint**: `/api/scholarships`
- **Access**: Public / Optionally Authenticated
- **Query Parameters**:
  - `search`: Keyword for title, description, or provider
  - `state`: e.g. "Maharashtra", "All India"
  - `category`: "General", "OBC", "SC", "ST", "EWS"
  - `course`: e.g. "B.Tech", "MBBS"
  - `type`: "Government", "Merit-based", "Need-based", "Private", "Minority", "Special Category"
  - `sort`: `deadline_asc`, `amount_desc`, `amount_asc`, `cgpa_asc`, `newest`
  - `page`: Page number (default: 1)
  - `limit`: Number of items (default: 12)
- **Response**: Returns array of scholarships. If user Bearer token is provided, each item is augmented with real-time `compatibility` AI score and breakdown.

### 3.2 Get Single Scholarship by ID
- **Method**: `GET`
- **Endpoint**: `/api/scholarships/:id`
- **Access**: Public / Optionally Authenticated
- **Description**: Increments `viewsCount` and calculates personalized eligibility match if authenticated.

### 3.3 Create Scholarship
- **Method**: `POST`
- **Endpoint**: `/api/scholarships`
- **Access**: Private (Admin Only)

### 3.4 Update Scholarship
- **Method**: `PUT`
- **Endpoint**: `/api/scholarships/:id`
- **Access**: Private (Admin Only)

### 3.5 Delete Scholarship
- **Method**: `DELETE`
- **Endpoint**: `/api/scholarships/:id`
- **Access**: Private (Admin Only)

---

## 4. AI Recommendation Engine Endpoints (`/api/recommendations`)

### 4.1 Get Personalized Ranked Recommendations
- **Method**: `GET`
- **Endpoint**: `/api/recommendations`
- **Access**: Private (Student)
- **Description**: Analyzes the logged-in student's academic profile against all active scholarships, applies multi-criteria weighted scoring, and returns ranked list with `stats`:
  ```json
  {
    "success": true,
    "stats": {
      "totalScholarships": 15,
      "eligibleCount": 6,
      "topMatchCount": 13,
      "highMatchCount": 2,
      "averageScore": 93
    },
    "data": [
      {
        "scholarshipName": "Reliance Foundation Undergraduate Scholarship",
        "compatibility": {
          "eligibilityPercentage": 95,
          "recommendationScore": 95,
          "isEligible": true,
          "priorityRanking": "Top Match",
          "breakdown": [
            {
              "factor": "Academic (CGPA)",
              "weight": 30,
              "awarded": 30,
              "status": "MATCH",
              "detail": "Exceeds minimum CGPA of 7.5 (Your CGPA: 8.7)"
            },
            ...
          ]
        }
      }
    ]
  }
  ```

### 4.2 Simulate Recommendation (What-If Analyzer)
- **Method**: `POST`
- **Endpoint**: `/api/recommendations/simulate`
- **Access**: Public
- **Request Body**: `{ "profile": { "cgpa": 9.0, "familyIncome": 150000, "category": "SC", ... } }`

---

## 5. Application Tracking Endpoints (`/api/applications`)

### 5.1 Toggle Bookmark / Save
- **Method**: `POST`
- **Endpoint**: `/api/applications/save/:scholarshipId`
- **Access**: Private (Student)

### 5.2 Submit / Record Application
- **Method**: `POST`
- **Endpoint**: `/api/applications/apply/:scholarshipId`
- **Access**: Private (Student)
- **Request Body**: `{ "notes": "Submitted via State Portal ID: MH-2026-881" }`
- **Side-Effects**: Increments `applicationsCount` on scholarship, creates confirmation notification.

### 5.3 Get Student Applications
- **Method**: `GET`
- **Endpoint**: `/api/applications?status=Applied`
- **Access**: Private (Student)

### 5.4 Update Application Review Status
- **Method**: `PUT`
- **Endpoint**: `/api/applications/:id/status`
- **Access**: Private (Admin for status, Student for personal notes)
- **Request Body**: `{ "status": "Approved" | "Under Review" | "Rejected", "notes": "..." }`

---

## 6. Deadline Notifications Endpoints (`/api/notifications`)

### 6.1 Get Notifications & Trigger Reminders
- **Method**: `GET`
- **Endpoint**: `/api/notifications`
- **Access**: Private (Student)
- **Description**: Evaluates deadlines of saved and applied scholarships and generates 7-day, 3-day, and 1-day reminders without duplicates.

### 6.2 Mark Single Notification Read
- **Method**: `PUT`
- **Endpoint**: `/api/notifications/:id/read`
- **Access**: Private (Student)

### 6.3 Mark All Notifications Read
- **Method**: `PUT`
- **Endpoint**: `/api/notifications/read-all`
- **Access**: Private (Student)

---

## 7. Platform Analytics Endpoints (`/api/analytics`)

### 7.1 Admin Analytics Dashboard
- **Method**: `GET`
- **Endpoint**: `/api/analytics/admin`
- **Access**: Private (Admin Only)
- **Response**: Aggregates total users, students, scholarships, applications, funding pool, pipeline stages, category distribution, and state distributions.

### 7.2 Student Summary Metrics
- **Method**: `GET`
- **Endpoint**: `/api/analytics/student`
- **Access**: Private (Student)
- **Response**: Eligible scholarships, saved, applied, and 14-day upcoming deadline urgency alerts.
