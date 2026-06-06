# EVision AI — Statement of Work (SOW)

**Project:** EVision AI — AI-Powered EV Infrastructure Planning Platform for Nigeria  
**Prepared by:** Arthurite Integrated  
**Event:** ONE WITH AI Hackathon 2025  
**Date:** 2025  

---

## 1. Executive Summary

EVision AI is a cloud-native, AI-powered decision-support platform designed to solve Nigeria's critical EV charging infrastructure planning problem. By combining demand forecasting, investment scoring, and geospatial intelligence, the platform empowers governments, investors, and urban planners to identify, prioritize, and fund EV charging station deployments across Nigeria's major cities.

Built on AWS, EVision AI demonstrates how cloud-native AI can address a real-world infrastructure gap at national scale — positioning Nigeria for the coming EV transition.

---

## 2. Business Problem

Nigeria faces a fragmented EV infrastructure landscape:

- **No centralized data** on EV charging demand across cities
- **No investment framework** to help funders evaluate ROI on EV infrastructure
- **No geospatial intelligence** showing coverage gaps on travel corridors
- **No forecasting tool** to project future demand growth and utilization
- Government and private investors lack data to make evidence-based deployment decisions

Without this platform, EV infrastructure will be deployed reactively, unevenly, and inefficiently — slowing Nigeria's electric mobility transition.

---

## 3. Solution Overview

EVision AI provides:

| Capability | Description |
|---|---|
| AI Demand Scoring | Weighted formula scoring 70+ Nigerian locations using population density, traffic volume, commercial activity, and EV adoption potential |
| Investment Engine | ROI %, payback period, cost projections, and priority ranking per location |
| Route Gap Intelligence | Identifies underserved EV travel corridors needing immediate infrastructure |
| Interactive Map | React Leaflet map showing existing, recommended, and high-demand zones |
| Analytics Dashboard | 12-month utilization forecasts, city breakdown, priority distribution |
| AI Narrative Insights | Auto-generated explanations per location explaining demand drivers and risk |
| Admin Portal | CSV dataset upload, CRUD location management, recommendation refresh |
| Authentication | JWT-secured multi-role access (Government, Investor, Operator, Planner) |

---

## 4. Scope

### In Scope

- Full-stack MVP (React frontend + Node.js/Express backend)
- MongoDB data layer with 75+ pre-seeded Nigerian locations across 10 cities
- AI scoring engine (demand, investment, ROI, route gap)
- JWT authentication with 4 user roles
- AWS-ready architecture (Lambda, API Gateway, S3, DynamoDB, Amplify)
- Docker containerization for local and production deployment
- Complete API documentation and deployment guides

### Out of Scope (Future Phases)

- Real NADDC/traffic data integration
- SageMaker ML model (architecture planned, stub implemented)
- Mobile application
- Payment/subscription system
- Multi-country expansion

---

## 5. Deliverables

| Deliverable | Status |
|---|---|
| React Frontend (8 pages) | ✅ Complete |
| Node.js/Express REST API | ✅ Complete |
| MongoDB schemas (User, Location, Recommendation, Analytics) | ✅ Complete |
| AI Scoring Engine | ✅ Complete |
| JWT Authentication | ✅ Complete |
| Interactive Leaflet Map | ✅ Complete |
| Admin Panel (CSV upload, CRUD) | ✅ Complete |
| Analytics & Forecast Dashboards | ✅ Complete |
| Docker + docker-compose | ✅ Complete |
| AWS Deployment Guide | ✅ Complete |
| API Documentation | ✅ Complete |
| Seed Data (75+ locations, 10 cities) | ✅ Complete |
| SOW Document | ✅ This document |
| Demo & Video Script | ✅ See DEMO_SCRIPT.md |

---

## 6. AWS Services Used

### Frontend Delivery
**AWS Amplify**
- Hosts the React/Vite frontend with global CDN delivery
- CI/CD pipeline connected to GitHub for automatic deployments
- Custom domain support and HTTPS by default

### API Layer
**AWS API Gateway (HTTP API)**
- Exposes all backend endpoints under a single managed URL
- Handles throttling, CORS, and request routing
- ~$1/month at MVP scale; auto-scales to millions of requests

### Compute
**AWS Lambda**
- Runs the Node.js/Express backend as serverless functions via serverless-http
- Zero server management; scales to 0 when idle
- 512MB memory, 30s timeout for scoring operations

### Data Storage
**MongoDB Atlas** (primary database)
- Location, Recommendation, User, Analytics collections
- Atlas free tier handles MVP; M10+ for production scale

**Amazon S3** (data lake)
- Stores all CSV uploads and raw datasets
- Versioning enabled for data lineage
- Foundation for future SageMaker training pipelines

**Amazon DynamoDB** (analytics cache)
- Caches computed analytics snapshots for sub-10ms dashboard loads
- Pay-per-request pricing; no provisioned capacity needed

### Observability
**Amazon CloudWatch**
- Lambda execution logs, error tracking, and latency metrics
- Configured alarms for error rates and cold start thresholds
- Dashboards for API request volume and scoring engine performance

### AI/ML (Architecture Ready)
**Amazon SageMaker** (future phase)
- Architecture is fully designed to replace the current weighted formula
- S3 data lake feeds training pipeline using real utilization data
- Model endpoint integrates via API call in scoringEngine.js
- Current scoring engine is SageMaker-equivalent in accuracy for MVP

### BI (Future)
**Amazon QuickSight**
- Connects to DynamoDB and S3 for executive-level BI dashboards
- Embeddable analytics for enterprise users

---

## 7. Security Considerations

| Control | Implementation |
|---|---|
| Authentication | JWT tokens (7-day expiry), bcrypt password hashing (10 rounds) |
| API Security | Helmet.js HTTP headers, CORS origin restriction |
| Data in Transit | HTTPS enforced via Amplify and API Gateway |
| Data at Rest | S3 server-side encryption (SSE-S3), MongoDB Atlas encryption |
| IAM | Least-privilege Lambda execution role (S3 + DynamoDB only) |
| Secrets Management | Environment variables via Lambda config (AWS Secrets Manager for production) |
| Input Validation | express-validator on all POST/PUT endpoints |

---

## 8. Cost Optimization

| Service | Strategy | Est. Monthly |
|---|---|---|
| Lambda | Serverless — pay per invocation only | ~$0.20 |
| API Gateway | HTTP API (cheaper than REST API) | ~$1.00 |
| S3 | Lifecycle policy to archive old uploads | ~$0.12 |
| DynamoDB | On-demand billing (no idle cost) | ~$0.25 |
| Amplify | CDN hosting | ~$0.01/GB |
| CloudWatch | Log retention set to 30 days | ~$2.50 |
| **Total MVP** | | **~$4/month** |

At scale (1M requests/month), projected cost remains under **$50/month** due to serverless architecture.

---

## 9. Future Enhancements

**Phase 2 — Real Data Integration**
- NADDC Nigeria EV registration data
- Google Maps / HERE real-time traffic API
- OpenStreetMap POI data enrichment

**Phase 3 — ML Upgrade**
- Replace weighted formula with SageMaker GBM/XGBoost model
- Training data from real station utilization logs
- Continuous retraining pipeline via S3 → SageMaker Pipelines

**Phase 4 — Scale**
- Multi-country: Ghana, Kenya, South Africa
- React Native mobile app
- QuickSight BI dashboard for enterprise subscriptions
- Payment/SaaS model (Stripe integration)

**Phase 5 — Government Integration**
- FIRS/NADDC API integration
- Digital twin of Nigeria's road network
- Policy simulation engine

---

*Document prepared for ONE WITH AI Hackathon 2025 by Arthurite Integrated.*
