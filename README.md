# EVision AI

**AI-Powered EV Infrastructure Planning Platform for Nigeria**

EVision AI helps governments, investors, urban planners, and EV companies identify the optimal locations for EV charging stations using demand forecasting, route intelligence, and investment scoring.

---

## Features

- **AI Demand Scoring** — Weighted formula scoring locations by population density, traffic, commercial activity, and EV adoption
- **Investment Engine** — ROI estimation, payback period, cost projections, and priority ranking
- **Route Gap Intelligence** — Identifies underserved EV travel corridors needing charging infrastructure
- **Interactive Map** — React Leaflet map showing existing, recommended, and high-demand zones across Nigeria
- **Analytics Dashboard** — 12-month utilization forecasts, city breakdown, priority distribution
- **AI Insights** — Narrative explanations per location explaining demand drivers and risk levels
- **Admin Portal** — CSV dataset upload, location CRUD, recommendation refresh
- **AWS-Ready** — Lambda + API Gateway backend, Amplify frontend, S3 data lake, SageMaker-ready architecture

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Leaflet, Recharts |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Cloud | AWS Lambda, API Gateway, S3, DynamoDB, CloudWatch, Amplify |
| AI | Custom scoring engine (SageMaker-ready) |
| DevOps | Docker, Docker Compose |

---

## Quick Start (Local)

### Prerequisites

- Node.js 20+
- MongoDB running locally or Atlas URI
- Git

### 1. Clone & Setup

```bash
git clone https://github.com/your-org/evision-ai.git
cd evision-ai
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env   # edit MONGODB_URI
npm run seed           # seed 52 Nigerian locations
npm run dev
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

---

## Docker (Full Stack)

```bash
docker-compose up --build
```

- Frontend: http://localhost
- Backend: http://localhost:5000
- MongoDB: localhost:27017

---

## Project Structure

```
evision-ai/
├── backend/
│   ├── controllers/
│   │   ├── analyticsController.js
│   │   ├── locationController.js
│   │   ├── recommendationController.js
│   │   └── uploadController.js
│   ├── models/
│   │   ├── Analytics.js
│   │   ├── Location.js
│   │   └── Recommendation.js
│   ├── routes/
│   │   ├── analytics.js
│   │   ├── locations.js
│   │   ├── recommendations.js
│   │   └── upload.js
│   ├── utils/
│   │   └── scoringEngine.js      # AI demand & investment scoring
│   ├── seed/
│   │   └── seedData.js           # 52 Nigerian locations
│   ├── lambda/
│   │   └── handler.js            # AWS Lambda entry point
│   └── server.js
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── admin/            # CSV upload, location manager
│       │   ├── dashboard/        # Charts, stat cards
│       │   ├── insights/         # AI insight cards
│       │   ├── layout/           # Sidebar, header
│       │   └── map/              # React Leaflet map
│       ├── hooks/useFetch.js
│       ├── pages/
│       │   ├── Admin.jsx
│       │   ├── Dashboard.jsx
│       │   ├── Insights.jsx
│       │   └── MapPage.jsx
│       └── utils/
│           ├── api.js
│           └── helpers.js
├── docker-compose.yml
├── AWS_DEPLOYMENT.md
└── API_DOCS.md
```

---

## AI Scoring Formula

```
Demand Score =
  40% × Population Density
  30% × Traffic Volume
  20% × Commercial Activity
  10% × EV Adoption Estimate

Investment Score =
  60% × Demand Score
  40% × Access Score
  − Risk Penalty

ROI = (Monthly Revenue × 12) / Total Cost × 100
```

**Priority Thresholds:**
- Critical: ≥ 85
- High: ≥ 70
- Medium: ≥ 50
- Low: < 50

---

## Sample Data

52 locations across 4 Nigerian cities:
- **Lagos** — Victoria Island, Lekki, Ikeja, Surulere, Yaba, Ikoyi, Marina, Apapa, Oshodi...
- **Abuja** — Maitama, Wuse 2, CBD, Garki, Asokoro, Jabi, Gwarinpa, Kubwa...
- **Port Harcourt** — GRA Phase 2, Trans Amadi, Mile 1, Rumuola, Diobu...
- **Kano** — Sabon Gari, City Centre, Nassarawa, BUK Road, Challawa...

---

## Deployment

See [AWS_DEPLOYMENT.md](./AWS_DEPLOYMENT.md) for full AWS setup guide.

**Estimated cloud cost: ~$4/month** at MVP scale.

---

## API Reference

See [API_DOCS.md](./API_DOCS.md).

---

## Roadmap

- [ ] Real-time EV adoption data integration (NADDC Nigeria)
- [ ] SageMaker ML model replacing weighted formula
- [ ] Mobile app (React Native)
- [ ] Multi-country support (Ghana, Kenya, South Africa)
- [ ] Real-time traffic data (Google Maps / HERE)
- [ ] QuickSight BI dashboard integration
- [ ] Payment/subscription model for enterprise users

---

## License

MIT
