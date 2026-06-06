# EVision AI — Demo & Presentation Scripts

**ONE WITH AI Hackathon 2025 | Arthurite Integrated**

---

## Elevator Pitch (30 seconds)

"Nigeria is on the brink of an EV revolution, but nobody knows where to put the charging stations. EVision AI solves this. We built an AI-powered platform that analyzes 75+ locations across 10 Nigerian cities, scores each one for demand and investment potential using a proven formula, and shows governments and investors exactly where to deploy EV infrastructure first — with ROI projections and risk analysis baked in. Built on AWS, it scales from MVP to national infrastructure in one click."

---

## 3-Minute Live Demo Script

**[0:00 — Login]**
"Let me show you EVision AI. I'll log in as an infrastructure investor — one of the four user types we support alongside government officials, operators, and urban planners."

*(Log in → Dashboard loads)*

**[0:20 — Dashboard]**
"Immediately on the dashboard, we see the full picture: 75 analyzed locations across Nigeria, 60+ AI recommendations, 18 high-demand zones, and over $5 million in estimated investment opportunity. These KPI cards update live from our backend."

"The demand chart shows city-by-city breakdown — Lagos leading at 74 average demand score, followed by Abuja and Port Harcourt. The utilization forecast projects 12 months of growth."

**[0:50 — Map]**
"Let me switch to the interactive map. This is built with React Leaflet on a dark CartoDB tile. Green markers are existing stations. Red markers are high-demand zones — where the AI scored demand above 70. Blue are recommended deployment sites."

*(Click a marker — e.g., Lekki Phase 1)*

"Look at this popup — Demand Score 84, Investment Score 80, Priority: High, 5 chargers needed, estimated $175K investment with 29% annual ROI. And the AI insight explains exactly why: high commercial activity, heavy traffic, strong EV adoption trends."

*(Apply city filter to Lagos)*

"I can filter by city. Lagos alone has 14 recommended deployment zones."

**[1:30 — Recommendations Page]**
"The Recommendations page lets you filter by city and priority. Here I'm filtering for Critical priority locations across all cities. These are our top targets — locations scoring above 85 — and each card shows the 6-month and 1-year demand forecasts, payback period, and risk level."

**[2:00 — AI Insights]**
"The Insights page goes deeper. Route Coverage Gaps shows where EV travel corridors are most underserved — these are corridors where range anxiety is highest. The ROI Champions chart ranks locations by annual return. And the City Radar compares Lagos, Abuja, Kano, and Port Harcourt across demand, investment, and coverage."

**[2:20 — Analytics]**
"Analytics gives planners the full forecasting view — 12-month utilization curves, EV adoption growth vs. infrastructure gap, and a city breakdown table. This is the kind of data a Minister of Transport needs to make a budget case."

**[2:40 — Admin]**
"In the Admin panel, operators can upload a CSV to bulk-import new location data — it goes straight to our S3 data lake — then hit 'Run AI Engine' to regenerate all recommendations in seconds."

**[2:55 — Wrap]**
"EVision AI is fully deployable to AWS today — Lambda, API Gateway, Amplify, S3, DynamoDB — all documented. We estimate $4 per month at MVP scale. The SageMaker architecture is designed and ready for Phase 2. Thank you."

---

## Judge Presentation Script (5 minutes)

**[Problem — 1 min]**
"Nigeria will have millions of EVs on its roads within a decade, driven by global OEM commitments and rising fuel costs. But there is no data infrastructure to plan where charging stations should go. Governments are guessing. Investors are waiting on the sidelines. Infrastructure is being deployed reactively, in the wrong places, at the wrong time. The result? Range anxiety, stranded EVs, and a market that can't grow."

**[Solution — 1 min]**
"EVision AI is a cloud-native AI platform that makes EV infrastructure planning data-driven. Our AI scoring engine evaluates every location on four dimensions — population density, traffic volume, commercial activity, and EV adoption potential — and produces a single demand score, investment score, ROI estimate, and deployment priority. We've pre-analyzed 75 locations across 10 Nigerian cities, and the platform is live today."

**[AWS Architecture — 1.5 min]**
"Architecturally, we're fully AWS-native. The React frontend is deployed on Amplify with global CDN. The Node.js backend runs on Lambda behind API Gateway — completely serverless, scales to zero when idle, handles burst traffic automatically. All CSV uploads flow to S3, which is designed as our data lake feeding future SageMaker training pipelines. Analytics are cached in DynamoDB for sub-10ms dashboard loads. Everything is monitored in CloudWatch. Total cost at MVP scale: $4 per month."

"The SageMaker architecture is designed. When we have 6 months of real utilization data from deployed stations, we replace the weighted formula with a GBM model trained on actual demand. The platform is built to make that transition seamless."

**[Demo — 1 min]**
*(Run through the 90-second highlights: Dashboard KPIs → Map popup → Recommendations filter → Admin CSV)*

**[Impact — 30 sec]**
"EVision AI gives Nigeria the infrastructure intelligence it needs to lead Africa's EV transition. Governments can make evidence-based budget decisions. Investors can evaluate opportunities with real ROI projections. Operators can deploy with confidence. We're not just building a hackathon project — we're building the planning layer for Nigeria's electric future."

---

## 2–3 Minute Video Script

**[0:00 — Hook — narrator voiceover, aerial footage of Lagos traffic]**
"Nigeria's roads are congested, fuel costs are rising, and the world is going electric. But Nigeria cannot plan its EV future without data."

**[0:10 — Problem statement — text overlays]**
"Charging infrastructure is fragmented. Demand data is scattered. Investors don't know where to build. Governments don't know where to start."

**[0:20 — Introduction]**
"Introducing EVision AI — an AI-powered EV infrastructure planning platform for Nigeria. Built by Arthurite Integrated for the ONE WITH AI Hackathon 2025."

**[0:30 — Dashboard screen recording]**
"EVision AI analyzes 75 locations across 10 Nigerian cities — Lagos, Abuja, Kano, Port Harcourt, Ibadan, Kaduna, Enugu, Jos, Maiduguri, and Abeokuta — and scores each one for demand, investment potential, and deployment priority."

**[0:50 — Map screen recording]**
"The interactive map shows exactly where to deploy. Green for existing stations. Red for high-demand zones. Blue for AI-recommended sites. Click any marker to see demand score, investment score, estimated ROI, and an AI-generated insight explaining why."

**[1:10 — Recommendations page]**
"The Recommendations engine filters by city and priority, showing 6-month and 12-month demand forecasts, payback periods, and risk levels for every location."

**[1:30 — AI Insights page]**
"AI Insights reveals route coverage gaps — corridors where range anxiety is highest — and ranks locations by ROI potential. This is the intelligence layer that Nigeria's planners have never had."

**[1:50 — AWS Architecture diagram / overlay]**
"EVision AI is built on AWS. React on Amplify. Node.js on Lambda. API Gateway. S3 data lake. DynamoDB analytics cache. CloudWatch monitoring. SageMaker-ready for Phase 2 ML. Total cloud cost: $4 per month."

**[2:10 — Admin panel]**
"Administrators can upload new datasets via CSV, manage locations, and regenerate AI recommendations with a single click — keeping the platform current as Nigeria's EV market evolves."

**[2:30 — Closing]**
"EVision AI is production-ready, cloud-native, and built for scale. From MVP to national infrastructure intelligence — one platform for Nigeria's electric future."

"Built by Arthurite Integrated. ONE WITH AI Hackathon 2025."

**[2:50 — End card]**
*EVision AI logo. "Powering Nigeria's EV Future." GitHub link. AWS badge.*

---

*All scripts prepared for ONE WITH AI Hackathon 2025 by Arthurite Integrated.*
