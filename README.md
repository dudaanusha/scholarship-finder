# ScholarAI — AI-Powered Smart Scholarship Finder and Eligibility Recommendation System

A full-stack MERN application (MongoDB, Express.js, React.js, Node.js) with an intelligent recommendation engine that analyzes student profiles and calculates compatibility scores, tracks deadlines, automates reminders, and provides comprehensive student and administrative portals.

---

## 🌟 Key Features

### 🎓 For Students
- **Smart AI Recommendations**: Multi-attribute algorithm evaluating CGPA, Income, Category, State, and Course to generate compatibility percentage (0–100%) and priority ranking (`Top Match`, `High Match`, `Eligible`).
- **Personalized Academic Profile**: Track profile completion percentage and criteria.
- **Scholarship Directory**: Search, multi-attribute filter (State, Category, Course, Type), and sort (Deadline, Amount, CGPA).
- **Watchlist & Application Tracker**: Pipeline view (`Saved`, `Applied`, `Under Review`, `Approved`, `Rejected`) with applicant notes.
- **Automated Deadline Notifications**: In-app alerts at 7 days, 3 days, and 1 day before application deadlines.

### 🛡️ For Administrators
- **Executive Analytics Dashboard**: Interactive Chart.js graphs displaying pipeline conversion, reservation categories, and state-wise demographic distribution.
- **Scholarship Control**: Full CRUD interface to add, edit, or delete scholarships.
- **Application Review**: Review student submissions and update review statuses.

---

## ⚡ Quick Start

### 1. Credentials (Pre-Seeded)
- **Demo Student**:
  - Email: `student@scholarship.org`
  - Password: `student123`
- **Demo Admin**:
  - Email: `admin@scholarship.org`
  - Password: `admin123`
*(Both accounts can be logged into with 1 click using the "Quick Demo Login" buttons on the Login page!)*

---

### 2. Running Locally

#### Prerequisites
- Node.js (v18+)
- npm

#### Backend
```bash
cd backend
npm install
node server.js
```
*Backend runs on `http://localhost:5000`. If no `MONGODB_URI` is supplied in `.env`, it automatically spins up an embedded in-memory MongoDB instance pre-seeded with 15+ comprehensive real-world scholarships!*

#### Frontend
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 📂 Project Structure

```
├── backend/
│   ├── config/db.js              # Resilient Mongo connection with memory fallback
│   ├── controllers/              # RESTful API controllers
│   ├── models/                   # Mongoose schemas (User, Profile, Scholarship, etc.)
│   ├── routes/                   # Express routes
│   ├── services/                 # recommendationEngine.js (AI matching logic)
│   ├── seed/seedData.js          # Pre-populates 15+ scholarships & demo users
│   └── server.js                 # Express entry point
├── frontend/
│   ├── src/
│   │   ├── components/           # Reusable UI components & Chart.js wrappers
│   │   ├── context/              # AuthContext & NotificationContext
│   │   ├── pages/                # 12 distinct pages
│   │   ├── services/api.js       # Centralized Axios client
│   │   └── App.jsx               # Router & Route guards
├── docs/
│   ├── API_DOCUMENTATION.md      # Full REST endpoint contracts
│   ├── DATABASE_SCHEMA.md        # Mermaid ER diagrams & schemas
│   ├── SYSTEM_ARCHITECTURE.md    # Architecture & AI mathematical formula
│   ├── PROJECT_REPORT.md         # Academic report & comparative analysis
│   └── PRESENTATION_SLIDES.md    # Project defense slide deck
```

---

## 📄 Documentation Links
- [API Documentation](docs/API_DOCUMENTATION.md)
- [Database Schema](docs/DATABASE_SCHEMA.md)
- [System Architecture](docs/SYSTEM_ARCHITECTURE.md)
- [Project Report](docs/PROJECT_REPORT.md)
- [Presentation Slides](docs/PRESENTATION_SLIDES.md)
