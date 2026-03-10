-- ─────────────────────────────────────────────────────────────────────────────
-- MajorOps Dev Seed Data
-- Run locally: npm run db:seed:local
-- DO NOT run against production (--remote)
-- ─────────────────────────────────────────────────────────────────────────────

-- Users
INSERT OR IGNORE INTO users (id, email, display_name, role, created_at)
VALUES
  ('01J0000000000000000000001', 'mim@example.com',  'Jordan MIM',     'mim',   datetime('now')),
  ('01J0000000000000000000002', 'sre@example.com',  'Alex SRE',       'tech',  datetime('now')),
  ('01J0000000000000000000003', 'ops@example.com',  'Sam Ops',        'ops',   datetime('now'));

-- Incidents
INSERT OR IGNORE INTO incidents (id, title, severity, status, phase, created_at, updated_at, created_by)
VALUES
  ('01J0INC0000000000000000001', 'Payment Processing Degradation',   'critical', 'active',     'initial',    datetime('now', '-2 hours'), datetime('now'), '01J0000000000000000000001'),
  ('01J0INC0000000000000000002', 'Storage Service Regional Failure', 'high',     'monitoring', 'mitigation', datetime('now', '-6 hours'), datetime('now'), '01J0000000000000000000001'),
  ('01J0INC0000000000000000003', 'Auth Service Latency Spike',       'high',     'active',     'assess',     datetime('now', '-45 minutes'), datetime('now'), '01J0000000000000000000001');
