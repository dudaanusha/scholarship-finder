# Database Schema Documentation

**Project**: AI-Powered Smart Scholarship Finder and Eligibility Recommendation System  
**Database**: MongoDB (Mongoose ODM)

---

## 1. Entity Relationship (ER) Diagram

```mermaid
erDiagram
    USERS ||--o| STUDENT_PROFILES : "has profile"
    USERS ||--o{ APPLICATIONS : "submits"
    USERS ||--o{ NOTIFICATIONS : "receives"
    SCHOLARSHIPS ||--o{ APPLICATIONS : "receives applications"
    SCHOLARSHIPS ||--o{ NOTIFICATIONS : "references"

    USERS {
        ObjectId _id PK
        String name
        String email UK
        String password "hashed via bcrypt"
        String role "student | admin"
        Date createdAt
        Date updatedAt
    }

    STUDENT_PROFILES {
        ObjectId _id PK
        ObjectId userId FK
        String fullName
        String email
        String mobileNumber
        String gender
        Date dateOfBirth
        String state
        String district
        String course
        String branch
        String yearOfStudy
        String collegeName
        Number cgpa
        Number familyIncome
        String category "General | OBC | SC | ST | EWS"
        Boolean minorityStatus
        Boolean disabilityStatus
    }

    SCHOLARSHIPS {
        ObjectId _id PK
        String scholarshipName
        String providerOrganization
        String description
        String eligibilityCriteria
        Number minimumCGPA
        Number maximumFamilyIncome
        Array applicableCategories
        Array applicableStates
        Array eligibleCourses
        Number scholarshipAmount
        String amountType
        Date deadline
        String applicationLink
        String scholarshipType
        Array requiredDocuments
        Boolean minorityEligibleOnly
        Boolean disabilityEligibleOnly
        String genderRequirement
        Number viewsCount
        Number applicationsCount
        Boolean isActive
    }

    APPLICATIONS {
        ObjectId _id PK
        ObjectId userId FK
        ObjectId scholarshipId FK
        String status "Saved | Applied | Under Review | Approved | Rejected"
        Date appliedDate
        String notes
        String trackingNumber
        Array uploadedDocuments
    }

    NOTIFICATIONS {
        ObjectId _id PK
        ObjectId userId FK
        ObjectId scholarshipId FK
        String title
        String message
        String type "DEADLINE_REMINDER_7D | DEADLINE_REMINDER_3D | DEADLINE_REMINDER_1D | APPLICATION_UPDATE"
        Date deadline
        Boolean readStatus
        Date createdAt
    }
```

---

## 2. Collection Specifications

### 2.1 `users` Collection
Stores credential accounts for both students and portal administrators with bcrypt hashing.

| Field | Type | Constraint | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Primary Key | MongoDB Unique Identifier |
| `name` | String | Required | Full Name |
| `email` | String | Unique, Required | Normalized lowercase email |
| `password` | String | Required | Bcrypt salt-10 encrypted password |
| `role` | String | Enum: `['student', 'admin']` | Access control role |
| `createdAt` | Date | Auto | Account creation timestamp |

### 2.2 `studentprofiles` Collection
Contains demographic, educational, social, and economic criteria required by the AI engine.

| Field | Type | Description |
| :--- | :--- | :--- |
| `userId` | ObjectId | 1-to-1 foreign key reference to `users._id` |
| `cgpa` | Number | Grade point average (0.00 to 10.00) |
| `familyIncome`| Number | Annual family income in INR (₹) |
| `category` | String | Social reservation: `General`, `OBC`, `SC`, `ST`, `EWS` |
| `state` | String | Domicile state (e.g., Maharashtra, Karnataka, Gujarat) |
| `course` | String | Enrolled degree program (B.Tech, MBBS, B.Sc, etc.) |
| `minorityStatus` | Boolean | Declared membership in notified minority community |
| `disabilityStatus` | Boolean | Registered Differently-Abled (PwD) candidate |

### 2.3 `scholarships` Collection
Structured repository of all published scholarship schemes.

| Field | Type | Description |
| :--- | :--- | :--- |
| `scholarshipName` | String | Official scheme title |
| `providerOrganization` | String | Government ministry, corporate foundation, or university |
| `minimumCGPA` | Number | Merit threshold (0 if none) |
| `maximumFamilyIncome`| Number | Economic need ceiling (₹) |
| `applicableCategories` | [String] | Eligible social groups (or `['All']`) |
| `applicableStates` | [String] | Geographic jurisdiction (or `['All India']`) |
| `deadline` | Date | Final application closing timestamp |
| `scholarshipAmount` | Number | Financial grant value in INR |
| `applicationLink` | String | Verified web URL for submission |

### 2.4 `applications` Collection
Maintains user engagement with scholarships across their lifecycle.

| Field | Type | Description |
| :--- | :--- | :--- |
| `userId` | ObjectId | Foreign key to `users` |
| `scholarshipId` | ObjectId | Foreign key to `scholarships` |
| `status` | String | `Saved`, `Applied`, `Under Review`, `Approved`, `Rejected` |
| `trackingNumber` | String | Unique generated applicant tracking code |
| `notes` | String | User custom application notes or interview feedback |

### 2.5 `notifications` Collection
Stores deadline reminders and application lifecycle alerts.

| Field | Type | Description |
| :--- | :--- | :--- |
| `userId` | ObjectId | Target recipient student |
| `scholarshipId` | ObjectId | Target scheme for deep-linking |
| `type` | String | Trigger code (`DEADLINE_REMINDER_7D`, `3D`, `1D`, etc.) |
| `readStatus` | Boolean | Read/Unread flag for dashboard badges |
