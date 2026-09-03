# CivicPulse AI — Data Schema

> Last updated: 2026-09-03 (Agent Iteration #1)

## Overview

This document defines the data schemas used across the CivicPulse AI platform, covering PostgreSQL/PostGIS table definitions, H3 data contracts (matching the TypeScript interfaces), index strategies, and sample queries.

---

## H3 Data Contract

### TypeScript Interface → API Response

The frontend consumes `H3HexData[]` from the backend API. Each object represents one H3 resolution-8 hexagonal cell:

```typescript
interface H3HexData {
  h3Index: string;           // "8828308281fffff"
  demandScore: number;       // 0.0 – 1.0
  vulnerabilityScore: number;// 0.0 – 1.0
  deficitScore: number;      // 0.0 – 1.0
  compositePriority: number; // 0.0 – 1.0
  complaintCount: number;    // Integer ≥ 0
  topCategory: 'Water' | 'Transport' | 'Healthcare' | 'Energy' | 'Sanitation';
  isCoveredByDPI: boolean;
  districtName: string;
}
```

### Scoring Formula

```
compositePriority = 0.4 × demandScore
                  + 0.3 × vulnerabilityScore
                  + 0.3 × deficitScore
```

---

## PostgreSQL / PostGIS Schemas (Planned)

### `complaints` Table

```sql
CREATE TABLE complaints (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    -- Content
    raw_text        TEXT,
    transcribed_text TEXT,             -- Whisper output (if voice)
    audio_url       TEXT,              -- S3/GCS path (if voice)
    
    -- Classification
    category        VARCHAR(20) NOT NULL
                    CHECK (category IN ('Water','Transport','Healthcare','Energy','Sanitation')),
    urgency         SMALLINT NOT NULL DEFAULT 1 CHECK (urgency BETWEEN 1 AND 5),
    
    -- Location
    location        GEOGRAPHY(POINT, 4326) NOT NULL,
    h3_index_r8     VARCHAR(15) NOT NULL,  -- Pre-computed H3 cell
    district_id     INTEGER REFERENCES districts(id),
    
    -- Metadata
    source          VARCHAR(20) DEFAULT 'web'
                    CHECK (source IN ('web','mobile','voice','sms')),
    status          VARCHAR(20) DEFAULT 'open'
                    CHECK (status IN ('open','acknowledged','in_progress','resolved'))
);
```

### `h3_cells` Materialized View

```sql
CREATE MATERIALIZED VIEW h3_cells AS
SELECT
    c.h3_index_r8                           AS h3_index,
    COUNT(*)                                AS complaint_count,
    
    -- Demand: normalized count × avg urgency
    LEAST(1.0, (COUNT(*) * AVG(c.urgency)) / 
        (SELECT MAX(cnt * avg_urg) FROM cell_stats)) AS demand_score,
    
    -- Top category by count
    MODE() WITHIN GROUP (ORDER BY c.category) AS top_category,
    
    -- District
    d.name                                  AS district_name,
    
    -- DPI coverage
    EXISTS (
        SELECT 1 FROM dpi_projects dp
        WHERE dp.h3_coverage @> ARRAY[c.h3_index_r8]
          AND dp.status = 'active'
    )                                       AS is_covered_by_dpi
    
FROM complaints c
JOIN districts d ON d.id = c.district_id
GROUP BY c.h3_index_r8, d.name;
```

### `districts` Table

```sql
CREATE TABLE districts (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    boundary    GEOGRAPHY(MULTIPOLYGON, 4326),
    state       VARCHAR(50) NOT NULL,
    
    -- Socio-economic indicators for vulnerability scoring
    population          INTEGER,
    literacy_rate       REAL,
    poverty_index       REAL,         -- 0.0 – 1.0
    infra_density_score REAL          -- 0.0 – 1.0 (higher = better)
);
```

### `dpi_projects` Table

```sql
CREATE TABLE dpi_projects (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(200) NOT NULL,
    category        VARCHAR(20) NOT NULL,
    status          VARCHAR(20) DEFAULT 'active'
                    CHECK (status IN ('planned','active','completed','stalled')),
    budget_crores   NUMERIC(12, 2),
    start_date      DATE,
    end_date        DATE,
    
    -- Spatial coverage as array of H3 cells
    h3_coverage     VARCHAR(15)[] NOT NULL,
    district_id     INTEGER REFERENCES districts(id)
);
```

---

## Index Strategies

```sql
-- Complaint spatial queries
CREATE INDEX idx_complaints_h3      ON complaints (h3_index_r8);
CREATE INDEX idx_complaints_loc     ON complaints USING GIST (location);
CREATE INDEX idx_complaints_cat     ON complaints (category);
CREATE INDEX idx_complaints_created ON complaints (created_at DESC);

-- H3 cell lookups
CREATE UNIQUE INDEX idx_h3_cells_h3 ON h3_cells (h3_index);

-- DPI project coverage
CREATE INDEX idx_dpi_h3_coverage    ON dpi_projects USING GIN (h3_coverage);
CREATE INDEX idx_dpi_status         ON dpi_projects (status);
```

---

## Sample Queries

### Get hex data for map viewport

```sql
SELECT
    hc.h3_index,
    hc.demand_score,
    d.poverty_index AS vulnerability_score,
    (1.0 - d.infra_density_score) AS deficit_score,
    (0.4 * hc.demand_score + 0.3 * d.poverty_index + 0.3 * (1.0 - d.infra_density_score)) AS composite_priority,
    hc.complaint_count,
    hc.top_category,
    hc.is_covered_by_dpi,
    hc.district_name
FROM h3_cells hc
JOIN districts d ON d.name = hc.district_name
WHERE hc.h3_index = ANY($1::varchar[])   -- Array of H3 cells in viewport
ORDER BY composite_priority DESC;
```

### Top 10 hotspot cells

```sql
SELECT h3_index, district_name, complaint_count, demand_score
FROM h3_cells
ORDER BY demand_score DESC
LIMIT 10;
```

### Complaints by category in a district

```sql
SELECT category, COUNT(*) as count, AVG(urgency) as avg_urgency
FROM complaints
WHERE district_id = $1
GROUP BY category
ORDER BY count DESC;
```
