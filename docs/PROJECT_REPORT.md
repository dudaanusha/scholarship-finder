# Project Report

## AI-Powered Smart Scholarship Finder and Eligibility Recommendation System for Personalized Scholarship Discovery and Eligibility Analysis

---

## Abstract

Higher education access is significantly hindered by the opacity, dispersion, and complexity of scholarship opportunities. Students routinely miss out on millions in financial aid due to fragmented criteria, manual tracking overheads, and unawareness of targeted reservation or merit programs. This report documents the design, architecture, and implementation of **ScholarAI**, a full-stack MERN (MongoDB, Express.js, React.js, Node.js) web application engineered with an intelligent multi-attribute recommendation engine. The system automates eligibility computation across academic merit (CGPA), socioeconomic thresholds (family income), demographic classifications (caste, minority, disability), geographic domiciles, and degree disciplines. Furthermore, the platform integrates an automated deadline countdown notification subsystem that dispatches 7-day, 3-day, and 1-day alerts, paired with an interactive administrative business intelligence suite powered by Chart.js.

---

## 1. Introduction

### 1.1 Problem Statement
Across India and globally, scholarship disbursements totaling hundreds of crores remain underutilized each financial cycle. Students struggle with:
1. **Information Fragmentation**: Opportunities are scattered across central ministries, state DBT portals, philanthropic trusts, and corporate CSR initiatives.
2. **Criteria Complexity**: Determining eligibility requires cross-referencing multi-tiered requirements (e.g., minimum 80th percentile in 12th board, family income under ₹2.5 LPA, domicile within specific state, enrolled in AICTE-approved B.Tech).
3. **Deadline Lapse**: With distinct application windows, students frequently miss critical submission dates.

### 1.2 Proposed Solution
ScholarAI provides:
- A unified discovery directory of verified scholarships.
- A client-tailored AI recommendation engine calculating percentage compatibility and priority ranking.
- A personalized Application Tracker pipeline (`Saved` $\to$ `Applied` $\to$ `Under Review` $\to$ `Approved`/`Rejected`).
- Proactive time-decay deadline alerts (7, 3, and 1 day warnings).
- Real-time administrative analytics on student distribution, popular schemes, and funding allocation.

---

## 2. Comparative Analysis

| Feature | Conventional Portals (NSP, MahaDBT) | Private Aggregators | ScholarAI (Our System) |
| :--- | :--- | :--- | :--- |
| **Recommendation Engine** | None (Manual Search Only) | Basic Tag Filtering | Weighted Multi-Attribute AI Algorithm |
| **Compatibility Breakdown** | Hidden / Binary Rejection | None | Transparent Criteria Diagnostic |
| **Deadline Reminders** | Email occasionally | Ad-hoc | Automated 7-Day, 3-Day, 1-Day In-App & Push Alerts |
| **Application Pipeline** | Rigid Government Flow | Redirects away | End-to-End Status Pipeline Tracker |
| **Admin Analytics** | Static Reports | Proprietary / Hidden | Real-time Interactive Charts & Insights |
| **UI / UX Experience** | Legacy / Table-heavy | Cluttered with Ads | Modern Glassmorphic Responsive Interface |

---

## 3. System Architecture & Methodology

### 3.1 Technology Stack
- **Frontend**: React 18, Tailwind CSS, Lucide Icons, Chart.js, React Router v6, Axios.
- **Backend**: Node.js, Express.js, JWT, bcryptjs, Morgan.
- **Database**: MongoDB (Mongoose ODM) with resilient automatic in-memory fallback.
- **AI Recommendation Engine**: Calibrated rule-based scoring module evaluating academic, financial, demographic, geographic, and discipline vector compatibility.

### 3.2 Security & Authentication
- Passwords salted and hashed with bcrypt (10 rounds).
- Stateless authentication via JSON Web Tokens (JWT) with configurable expiry.
- Role-Based Access Control (RBAC) protecting Student and Administrative privileges.

---

## 4. Key Results and Achievements

1. **Precision Matching**: The recommendation engine successfully segments scholarships into `Top Match` (≥85%), `High Match` (70-84%), and `Eligible` tiers, providing plain-language diagnostic explanations for each criterion.
2. **Zero-Setup Barrier**: With built-in seed scripts and MongoDB Memory Server support, the application boots instantaneously with 15+ curated national scholarships.
3. **Interactive Visualizations**: Administrative dashboard displays demographic distributions across states, reservation categories, and pipeline conversion rates with responsive Chart.js components.

---

## 5. Conclusion & Future Enhancements

The **AI-Powered Smart Scholarship Finder** bridges the gap between deserving students and available financial aid. Future enhancements include:
- WhatsApp / SMS deadline reminder webhooks.
- Optical Character Recognition (OCR) for automated income certificate and marksheet document verification.
- Predictive Machine Learning models trained on historical approval probabilities.
