-- KPI source-of-truth tables

CREATE TABLE IF NOT EXISTS kpi_definitions (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  formula TEXT NOT NULL,
  units TEXT NOT NULL,
  targets TEXT,
  data_sources TEXT,
  visibility TEXT NOT NULL, -- internal | exec
  owner TEXT NOT NULL,
  review_cadence TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
);

CREATE TABLE IF NOT EXISTS kpi_observations (
  id TEXT PRIMARY KEY,
  kpi_slug TEXT NOT NULL REFERENCES kpi_definitions(slug) ON DELETE CASCADE,
  incident_id TEXT NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
  timestamp INTEGER NOT NULL,
  value REAL NOT NULL,
  units TEXT NOT NULL,
  source TEXT NOT NULL, -- worker | ui | import | cli
  confidence REAL,
  metadata TEXT,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  UNIQUE (kpi_slug, incident_id, timestamp)
);

CREATE INDEX IF NOT EXISTS idx_kpi_observations_incident ON kpi_observations(incident_id);
CREATE INDEX IF NOT EXISTS idx_kpi_observations_slug ON kpi_observations(kpi_slug);
