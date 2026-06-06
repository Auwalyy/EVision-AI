# EVision AI — API Documentation

Base URL: `http://localhost:5000/api`

---

## GET /locations

Returns all analyzed locations.

**Query params:**
- `city` — filter by city name (partial match)
- `hasExistingStation` — `true` | `false`

**Response:**
```json
{
  "success": true,
  "count": 52,
  "data": [
    {
      "_id": "...",
      "name": "Victoria Island",
      "city": "Lagos",
      "latitude": 6.4281,
      "longitude": 3.4219,
      "populationDensity": 88,
      "trafficVolume": 95,
      "commercialScore": 97,
      "evScore": 72,
      "hasExistingStation": true,
      "stationType": "dcfast"
    }
  ]
}
```

---

## GET /recommendations

Returns AI-generated recommendations.

**Query params:**
- `priority` — `Low` | `Medium` | `High` | `Critical`
- `limit` — max results (default 50)

**Response:**
```json
{
  "success": true,
  "count": 45,
  "data": [
    {
      "_id": "...",
      "locationId": { "name": "Lekki Phase 1", "city": "Lagos" },
      "demandScore": 84,
      "investmentScore": 80,
      "priority": "High",
      "chargersNeeded": 5,
      "estimatedROI": 29,
      "estimatedCost": 175000,
      "estimatedUtilization": 72,
      "routeGapScore": 68,
      "riskLevel": "Low",
      "paybackPeriodMonths": 41,
      "aiInsight": "Lekki Phase 1 (Lagos) shows high charging demand..."
    }
  ]
}
```

---

## POST /recommendations/generate

Runs the AI scoring engine on all non-existing-station locations and regenerates recommendations.

**Response:**
```json
{
  "success": true,
  "message": "Generated 45 recommendations",
  "count": 45
}
```

---

## GET /analytics

Returns complete analytics snapshot for dashboards.

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalLocations": 52,
      "recommendedStations": 45,
      "highDemandZones": 18,
      "avgDemandScore": 67,
      "avgUtilization": 58,
      "totalEstimatedInvestment": 5250000
    },
    "cityBreakdown": [
      { "city": "Lagos", "avgDemand": 74, "stationCount": 14, "totalInvestment": 2100000 }
    ],
    "investmentRanking": [...],
    "forecastData": [
      { "month": "Jan 25", "utilization": 58, "demandGrowth": 69, "newStations": 2 }
    ],
    "priorityDistribution": [
      { "priority": "Critical", "count": 4 },
      { "priority": "High", "count": 14 }
    ],
    "topInsights": [...]
  }
}
```

---

## POST /upload

Upload CSV dataset for batch location import.

**Content-Type:** `multipart/form-data`

**Field:** `file` — CSV file

**CSV columns:**
```
name, city, state, latitude, longitude,
populationDensity, trafficVolume, commercialScore, evScore,
hasExistingStation, stationType, routeCoverage
```

**Response:**
```json
{
  "success": true,
  "message": "Processed 25 locations",
  "upserted": 20,
  "modified": 5,
  "errors": 0
}
```

---

## GET /health

Returns server health status.

```json
{ "status": "ok", "timestamp": "2025-01-01T00:00:00.000Z" }
```
