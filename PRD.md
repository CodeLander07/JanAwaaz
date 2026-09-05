Product Requirements Document

**Product Name:** CivicPulse – Multilingual AI Platform for Citizen-Driven Infrastructure Planning  
**Version:** 1.0  
**Date:** 2026-09-05  
**Status:** Draft for Review

---

## 1. Executive Summary

CivicPulse is a scalable, multilingual AI platform designed as a Digital Public Good (DPG) to aggregate citizen development requests via voice, text, and messaging apps across diverse linguistic regions. It analyzes this feedback alongside national demographic data, infrastructure indices, and public investment plans to surface demand hotspots and recommend high-priority development projects to policymakers in BRICS nations. The platform bridges the gap between citizen voices and infrastructure investment decisions, enabling evidence-based, inclusive, and transparent public spending.

---

## 2. Problem Statement

Governments struggle to consolidate citizen feedback from fragmented channels (social media, call centers, local offices, messaging apps) and align it with national infrastructure priorities. Development requests live in siloed systems, leading to misaligned public spending, unaddressed infrastructure gaps, and no measurable impact of large-scale digital public infrastructure initiatives. In multilingual nations like BRICS countries, language barriers further exclude large populations from voicing their needs.

**Key pain points:**
- Fragmented feedback mechanisms with no unified view.
- Language diversity makes analysis difficult.
- Lack of integration with existing demographic and investment data.
- No systematic way to prioritize projects based on actual demand.
- Limited transparency and citizen engagement in decision-making.

---

## 3. Goals and Objectives

### 3.1 Primary Goals
- **Aggregate** citizen development requests from multiple channels (voice, text, messaging apps) in multiple languages.
- **Analyze** large datasets combining citizen feedback with national data (demographics, infrastructure indices, investment plans).
- **Surface demand hotspots** and **recommend** high-priority development projects.
- **Provide actionable insights** to policymakers through an interactive dashboard.

### 3.2 Success Metrics (KPIs)
- Number of unique citizen submissions processed per month.
- Percentage of feedback accurately classified by sector and location (target > 90%).
- Reduction in time from feedback collection to policy insight (target: < 1 week).
- Increase in alignment between citizen demand and funded projects (measured by overlapping hotspots and project locations).
- User satisfaction score from policymakers (target > 4/5).

---

## 4. Target Users and Personas

### 4.1 Citizens
- **Demographics:** Residents of BRICS nations, diverse languages, varying digital literacy.
- **Channels:** Mobile phones (voice, SMS, WhatsApp, Telegram, web form).
- **Goals:** Report infrastructure needs (e.g., broken roads, lack of water, electricity outages) easily in their own language.

### 4.2 Policymakers / Government Officials
- **Roles:** Ministry planners, regional development officers, infrastructure project managers.
- **Goals:** Access consolidated demand data, visualize hotspots, prioritize projects, justify budget allocations.

### 4.3 System Administrators / Data Analysts
- **Roles:** Maintain platform, monitor data quality, fine-tune models.
- **Goals:** Ensure smooth operation, handle edge cases, generate custom reports.

### 4.4 Developers (Open Source Community)
- **Goals:** Extend platform, add new language models, integrate new data sources.

---

## 5. Scope

### 5.1 In Scope
- Multi-channel ingestion: REST API for text, voice upload, messaging app webhooks (WhatsApp, Telegram, SMS).
- Multilingual processing: Automatic Speech Recognition (ASR), language identification, machine translation, entity extraction, sentiment analysis, topic classification, geolocation.
- Data integration: Combine feedback with demographic data, infrastructure indices, and public investment plans (ingested as structured datasets).
- Analytics: Hotspot detection, demand scoring, project recommendation.
- Web dashboard: Interactive map, charts, filters, and recommendation panel.
- Open-source release under Apache 2.0 license.

### 5.2 Out of Scope (Future Enhancements)
- Direct integration with government project management systems.
- Real-time two-way communication with citizens.
- Automatic budget allocation simulation.
- Mobile application for citizens (web and messaging only initially).

---

## 6. Functional Requirements

### 6.1 User Stories

**As a citizen**, I want to:
- Submit a voice message in my local language describing a broken water pump, so that the government knows about it.
- Send a text message via WhatsApp to report a pothole, without needing to create an account.
- See that my submission has been received and will be considered.

**As a policymaker**, I want to:
- View a heatmap of infrastructure demand by region and sector.
- Filter demand data by time period, sentiment, and topic.
- See a ranked list of recommended projects with supporting metrics.
- Export reports for budget meetings.

**As an admin**, I want to:
- Monitor system performance and error rates.
- Review low-confidence classifications manually.
- Manage data sources and API keys.

### 6.2 Functional Modules

#### 6.2.1 Submission Ingestion API
- **Endpoints:**
  - `POST /api/v1/submit/text` – Accept text feedback with optional language, location, and user ID.
  - `POST /api/v1/submit/voice` – Accept audio file upload (WAV, MP3) or streaming audio.
  - `POST /api/v1/webhooks/whatsapp` – Webhook for WhatsApp messages.
  - `POST /api/v1/webhooks/telegram` – Webhook for Telegram messages.
  - `POST /api/v1/webhooks/sms` – Webhook for SMS gateway.
- **Authentication:** Optional API key for partner services; citizens do not require authentication but can include anonymous user ID.
- **Response:** Acknowledgment with `request_id` for tracking.

#### 6.2.2 Processing Pipeline
- **Asynchronous processing** triggered by message queue (Kafka/Redis Streams).
- **Steps:**
  1. **Speech-to-Text** (if audio) using Whisper (multilingual).
  2. **Language Identification** (if not provided) using fastText.
  3. **Machine Translation** to English for analysis (preserve original).
  4. **Named Entity Recognition** – extract infrastructure-related entities (roads, water, electricity, schools, etc.).
  5. **Sentiment Analysis** – score from -1 (negative) to 1 (positive) indicating urgency.
  6. **Topic Classification** – assign to one of predefined sectors (Transport, Water, Sanitation, Energy, Education, Health, Other).
  7. **Geolocation** – extract location from text; if ambiguous, use provided coordinates or geocode via Nominatim.
  8. **Anonymization** – remove PII, store with random user hash.
- **Output:** Processed feedback stored in PostgreSQL/PostGIS, with original and translated text, metadata.

#### 6.2.3 Analytics Engine
- **Demand Score Calculation:** Per geographic area (H3 hexagon resolution 7) and sector:
  - `demand_score = request_count * weighted_sentiment * population_density * (1 + infrastructure_gap_index)`
  - Weighted sentiment = 1 for negative/urgent, 0.5 for neutral, 0 for positive.
  - Infrastructure gap index from external datasets (e.g., 1 if no water access, 0.5 partial, etc.).
- **Hotspot Detection:** Use H3 hexagons; compute demand score per hexagon per sector. Identify hexagons above threshold (e.g., >75th percentile) as hotspots.
- **Project Recommendation:** For each sector and region, compare hotspots with existing/planned projects (from investment plans dataset). Generate list of recommended projects:
  - Location (administrative unit or hexagon)
  - Sector
  - Estimated demand score
  - Alignment with national priorities (weight factor)
  - Suggested project type (e.g., "Build water supply system")
- **Recommendation ranking:** Multi-criteria scoring (demand, cost-effectiveness, equity, feasibility).

#### 6.2.4 Dashboard
- **Map View:**
  - Heatmap layer for demand hotspots (using Deck.gl HeatmapLayer).
  - Toggle between sectors, time ranges, sentiment.
  - Click on hexagon to see summary statistics and sample feedback.
- **Charts:**
  - Time series of submissions by sector.
  - Bar chart of top requested infrastructure types.
  - Pie chart of sentiment distribution.
- **Recommendations Panel:**
  - Table of top 10 recommended projects with score breakdown.
  - Option to export as CSV/PDF.
- **Data Exploration:**
  - Table of recent feedback with original language and translation.
  - Filter by language, sector, location, sentiment.
- **Multilingual UI:** Supported languages: English, Portuguese, Hindi, Chinese, Russian (plus local languages as needed). UI language switchable.

### 6.3 Data Requirements

#### 6.3.1 Citizen Feedback Data
- **Required fields:** submission_id (UUID), timestamp, channel (text/voice/whatsapp/etc.), raw_content (text or audio path), language, location (lat/lon if available), user_id_hash.
- **Processed fields:** translated_text, entities, sentiment_score, topic, geolocation (lat/lon, administrative boundaries), hex_id, confidence scores.

#### 6.3.2 External Datasets
- **Demographics:** population density, age distribution, income levels (by admin unit or grid).
- **Infrastructure Indices:** access rates (water, electricity, roads, internet), quality indices.
- **Public Investment Plans:** list of planned/ongoing projects with location, sector, budget, status.
- **Source:** Government open data portals, World Bank, national statistical agencies. Ingested via periodic batch upload (CSV, GeoJSON) or API.

#### 6.3.3 Data Storage
- **PostgreSQL/PostGIS:** processed feedback, aggregated demand scores, project recommendations, external datasets (spatial tables).
- **MongoDB:** raw submissions (flexible schema), audit logs.
- **Elasticsearch:** full-text search for feedback and translations.
- **Object Storage (MinIO/S3):** audio files, exported reports.

---

## 7. Non-Functional Requirements

### 7.1 Scalability
- System must handle at least 10,000 submissions/day per country initially, scalable to 1M/day.
- Horizontal scaling via Kubernetes; stateless services, message queue decoupling.

### 7.2 Performance
- API response for submission acknowledgment < 500ms.
- Processing pipeline: from submission to processed feedback stored < 5 minutes (95th percentile).
- Dashboard queries: map data load < 2 seconds for 1M data points (using pre-aggregated tiles).

### 7.3 Availability
- Target 99.9% uptime for core submission API.
- Data replication across availability zones.

### 7.4 Multilingual Support
- Support at least 20 languages initially (covering major languages in BRICS).
- ASR and translation models must be open-source or freely usable.
- Language detection accuracy > 95%.

### 7.5 Security & Privacy
- All citizen PII must be anonymized; no raw phone numbers or names stored.
- Encryption in transit (TLS 1.2+) and at rest (AES-256).
- Role-based access control (RBAC) for dashboard.
- Compliance with local data protection laws (LGPD, PDPB, etc.) – allow data residency per country.

### 7.6 Usability
- Citizen submission via WhatsApp/SMS should require no app installation.
- Dashboard UI intuitive for non-technical policymakers.
- Provide multi-language documentation.

### 7.7 Maintainability
- Codebase modular with clear separation of concerns.
- Containerized microservices.
- Continuous Integration/Continuous Deployment (CI/CD) pipeline.

### 7.8 Open Source / DPG
- Released under Apache 2.0 license.
- Public GitHub repository with contribution guidelines.
- Documentation for deployment and customization.
- Community forum and governance model.

---

## 8. System Architecture

### 8.1 High-Level Architecture

https://excalidraw.com/#json=jF16wOtecu2b20WAnTxLM,h1Sh6a6wc2y4JW_9e9QdiA

The system is composed of the following layers:

1. **Ingestion Layer** – Accepts submissions from various channels.
2. **Message Queue** – Decouples ingestion from processing.
3. **Processing Pipeline** – Asynchronous workers perform NLP and geolocation tasks.
4. **Analytics Engine** – Computes demand scores and recommendations.
5. **Data Storage** – Persistent stores for raw/processed data and aggregates.
6. **Dashboard Backend** – API serving dashboard frontend.
7. **Dashboard Frontend** – Next.js web application for policymakers.

All components are containerized and orchestrated with Kubernetes.

### 8.2 Component Description

| Component | Technology | Responsibility |
|-----------|------------|----------------|
| API Gateway | FastAPI + Uvicorn | Expose REST endpoints for text/voice submission and webhooks; validate input; produce to Kafka. |
| Message Queue | Apache Kafka | Buffer raw submissions; topics: `raw-feedback`, `processed-feedback`, `analytics-jobs`. |
| Worker: ASR | Python (Celery) | Consume audio messages; run Whisper ASR; output transcript. |
| Worker: NLP | Python (Celery) | Perform language detection, translation, NER, sentiment, topic classification. |
| Worker: Geolocation | Python (Celery) | Extract location from text; geocode; assign H3 hexagon. |
| Analytics Job Scheduler | Apache Airflow or Celery Beat | Periodically run batch jobs to recompute demand scores and recommendations. |
| Spatial Database | PostgreSQL/PostGIS | Store processed feedback, external datasets, aggregated hotspots. |
| Object Storage | MinIO (S3-compatible) | Store audio files, exports. |
| Search Index | Elasticsearch | Index translated feedback for full-text search in dashboard. |
| Dashboard API | FastAPI | Serve aggregated data, hotspots, recommendations to frontend. |
| Dashboard UI | Next.js 14 + React | Interactive map, charts, recommendations table. |
| Monitoring | Prometheus + Grafana | Metrics and alerts. |
| Logging | ELK Stack | Centralized logging. |

### 8.3 Data Flow

1. Citizen submits feedback via channel.
2. Ingestion API normalizes payload and publishes to Kafka topic `raw-feedback`.
3. Processing workers consume from `raw-feedback`:
   - If audio, ASR worker transcribes and publishes text back to a temporary topic or directly to NLP worker.
   - NLP workers process and store processed feedback in PostgreSQL.
   - Geolocation worker adds location and hex ID.
4. Analytics scheduler runs daily:
   - Reads processed feedback and external datasets.
   - Computes demand scores per hexagon/sector.
   - Detects hotspots.
   - Generates recommendations.
   - Stores results in PostgreSQL.
5. Dashboard API queries these aggregated results.
6. Dashboard UI displays data to policymakers.

---

## 9. API Specifications

### 9.1 Submission Endpoints

#### `POST /api/v1/submit/text`
**Request Body:**
```json
{
  "text": "There is no clean water in my village",
  "language": "hi", // optional, ISO 639-1
  "location": {
    "lat": 25.5,
    "lon": 78.2
  },
  "user_id": "anonymous_hash" // optional
}
```
**Response:**
```json
{
  "status": "accepted",
  "request_id": "uuid"
}
```

#### `POST /api/v1/submit/voice`
**Request:** Multipart form-data with audio file.
**Fields:** `audio` (file), `language` (optional), `location` (optional JSON), `user_id` (optional).
**Response:** Same as above.

#### `POST /api/v1/webhooks/whatsapp`
**Request:** WhatsApp webhook payload (according to Meta API).
**Response:** `200 OK` with optional reply.

### 9.2 Dashboard API

#### `GET /api/v1/hotspots?sector=water&start_date=2026-01-01&end_date=2026-06-30&min_demand=0.5`
**Response:**
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [78.2, 25.5]
      },
      "properties": {
        "hex_id": "8728300bfffffff",
        "demand_score": 0.82,
        "request_count": 150,
        "sector": "water"
      }
    }
  ]
}
```

#### `GET /api/v1/recommendations?region=state_xyz`
**Response:**
```json
[
  {
    "rank": 1,
    "sector": "water",
    "location": "District A",
    "demand_score": 0.92,
    "estimated_cost": "$1.2M",
    "alignment_score": 0.85,
    "justification": "High demand, low existing coverage, no planned project"
  }
]
```

#### `GET /api/v1/feedback?language=pt&limit=20&offset=0`
**Response:** List of processed feedback items.

---

## 10. Data Model

### 10.1 Core Entities

**Raw Submission (MongoDB)**
- `_id`: ObjectId
- `request_id`: UUID
- `channel`: string (text, voice, whatsapp, telegram, sms)
- `raw_content`: string (text or path to audio)
- `timestamp`: datetime
- `user_id_hash`: string
- `location`: { lat: number, lon: number } (optional)
- `language`: string (optional)

**Processed Feedback (PostgreSQL)**
- `feedback_id`: UUID (PK)
- `submission_id`: UUID (FK to Raw Submission)
- `original_text`: text
- `translated_text`: text
- `language`: string
- `sentiment_score`: float
- `topic`: string
- `entities`: JSONB
- `location_geom`: geometry(Point, 4326)
- `hex_id`: string
- `admin_unit`: string (e.g., state, district)
- `created_at`: timestamp

**Aggregated Demand (PostgreSQL)**
- `hex_id`: string
- `sector`: string
- `time_bucket`: date (e.g., weekly)
- `request_count`: int
- `avg_sentiment`: float
- `demand_score`: float

**Recommendation (PostgreSQL)**
- `recommendation_id`: UUID
- `sector`: string
- `admin_unit`: string
- `hex_ids`: array of string
- `demand_score`: float
- `score_components`: JSONB
- `recommended_project_type`: string
- `status`: string (pending, accepted, rejected)

**External Datasets**
- `demographic_data`: table with population density by admin unit/hex.
- `infrastructure_indices`: table with sector-specific indices.
- `investment_plans`: table with project locations, sector, budget, status.

---

## 11. Multilingual and Accessibility Requirements

- **Citizen Input:** Accept all languages; no language restriction.
- **Translation:** All feedback translated to English for analysis, but original text preserved for transparency.
- **Dashboard UI:** Must support at least 5 languages initially: English, Portuguese, Hindi, Chinese, Russian. UI strings externalized for easy localization.
- **Voice Input:** ASR models must support code-switching and dialectal variations.
- **Accessibility:** Dashboard must be WCAG 2.1 AA compliant. Citizen submission via SMS ensures accessibility for non-smartphone users.
- **Offline:** Voice submission via phone call (IVR) could be considered in future.

---

## 12. Security and Privacy

- **Anonymization:** PII removed before storage; user IDs hashed with salt; no phone numbers stored.
- **Data Retention:** Raw audio deleted after transcription (configurable). Raw text retained for 1 year, then archived.
- **Encryption:** TLS for all API traffic; AES-256 for data at rest; encrypted backups.
- **Access Control:** Dashboard requires OAuth2/OIDC login; roles: viewer, analyst, admin.
- **Audit Logs:** All access and modifications logged in MongoDB.
- **Data Residency:** Each country deployment can host data within national borders.

---

## 13. Deployment and Operations

### 13.1 Infrastructure Requirements
- Kubernetes cluster (min 3 nodes for production).
- Kafka cluster (3 brokers).
- PostgreSQL with PostGIS (managed or self-hosted).
- Elasticsearch cluster (3 nodes).
- MinIO (or cloud object storage).
- GPU nodes for ASR/NLP inference (optional; can use CPU for small scale).

### 13.2 Environment Configuration
- All services configurable via environment variables and Helm charts.
- Provide Docker images for each microservice.
- Terraform scripts for cloud provisioning (optional).

### 13.3 Monitoring
- Prometheus metrics from all services.
- Grafana dashboards for API latency, queue depth, processing errors, model confidence.
- ELK for log aggregation.
- Alerting for failures (e.g., Kafka lag > threshold).

### 13.4 Backup and Recovery
- Daily automated backups of PostgreSQL, Elasticsearch.
- Object storage versioning for audio files.
- Disaster recovery plan with RPO < 24h, RTO < 4h.

---

## 14. Open Source / Digital Public Good

- **License:** Apache 2.0 for all code.
- **Repository:** Public GitHub with detailed README, CONTRIBUTING, and LICENSE.
- **Documentation:** Deployment guide, API documentation (OpenAPI), user manual for policymakers.
- **Community:** Mailing list, Slack/Discord channel, issue tracker.
- **Governance:** Project Steering Committee with representatives from BRICS countries; open to contributors.
- **Model Artifacts:** Pre-trained models for common languages released under open licenses (e.g., MIT for fine-tuned models).

---

## 15. Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Low adoption by citizens | Use widely adopted channels (WhatsApp, SMS); run awareness campaigns; provide incentives (e.g., feedback acknowledgment). |
| Poor ASR accuracy for low-resource languages | Fine-tune models with community data; fallback to text input; continuously improve. |
| Data quality issues (spam, duplicates) | Implement deduplication (similarity hashing), moderation queue, rate limiting. |
| Bias in recommendations | Use fairness metrics; involve domain experts; regular audits; transparent scoring. |
| Government reluctance to share investment data | Engage early; provide value (show gaps); allow manual entry or use public data only. |
| Scalability challenges | Event-driven architecture; auto-scaling; load testing before launch. |
| Language coverage gaps | Prioritize languages by population; allow community-contributed translation models. |

---

## 16. Success Metrics and KPIs

| Metric | Target |
|--------|--------|
| Monthly active submissions | > 100,000 per country |
| Processing accuracy (topic + sentiment) | > 85% |
| Translation accuracy (BLEU score) | > 25 (for major languages) |
| Hotspot detection precision | > 80% (validated against ground truth) |
| Policymaker dashboard adoption | > 50% of target ministries use monthly |
| Time from submission to dashboard visibility | < 10 minutes |
| User satisfaction (citizen survey) | > 70% positive |
| Open source community contributions | > 50 external contributors in first year |

---

## 17. Appendix: Technology Stack Summary

| Layer | Technologies |
|-------|-------------|
| Backend API | Python 3.11, FastAPI, Uvicorn |
| Message Queue | Apache Kafka |
| Task Queue | Celery + Redis |
| ASR | OpenAI Whisper (or DeepSpeech) |
| NLP | Hugging Face Transformers, spaCy, fastText, sentence-transformers |
| Translation | OPUS-MT, NLLB-200 |
| Database | PostgreSQL 15 + PostGIS, MongoDB 7, Elasticsearch 8 |
| Analytics | PySpark, Dask, GeoPandas, H3, Scikit-learn, XGBoost |
| Frontend | Next.js 14, React 18, Mapbox GL JS, Deck.gl, Recharts |
| Deployment | Docker, Kubernetes, Helm, Terraform |
| Monitoring | Prometheus, Grafana, ELK Stack |
| Object Storage | MinIO (S3-compatible) |

---

**End of PRD**

