---
title: Major Accuracy Scoring (MAS)
description: A team-level trust metric that measures escalation accuracy — rewarding proportional incident declaration and penalizing both over- and under-escalation.
---

> "The goal isn't fewer majors. The goal is more *accurate* majors."

Declaring a Major Incident is a high-impact decision. Over-escalate and you create noise, fatigue, and alert desensitization. Under-escalate and you delay response, damage trust, and extend customer impact.

Major Accuracy Scoring (MAS) introduces measurable feedback on that decision — not as punishment, but as a mirror for operational maturity.

---

## How It Works

Every incident a team proposes or participates in contributes to a rolling score based on classification accuracy.

| Scenario | Score Impact | Rationale |
|---|---|---|
| Proposed as Major → Confirmed Major | +10 | Correct escalation, timely judgment |
| Not Proposed → Stayed Non-Major | +5 | Accurate non-major triage |
| Proposed as Major → Downgraded | −5 | Over-escalation / false positive |
| Not Proposed → Later Escalated | −15 | Missed major — the most costly error |

The asymmetry is intentional. Missing a major is penalized three times more heavily than a false positive. The cost of under-escalation is always higher than the cost of over-escalation — in customer impact, in response delay, in trust.

---

## The Score

Scores are normalized to a 0–10 scale over a **90-day rolling window**.

| Score | Band | Operational Trust Level |
|---|---|---|
| 8–10 | Excellent | May self-declare majors; light validation |
| 6–7.9 | Good | Standard IM validation required |
| 4–5.9 | Needs Improvement | Review escalation criteria; oversight recommended |
| < 4 | Poor | Mandatory validation and retraining |

Minimum sample threshold: **10 incidents** per rolling window for a valid score.

---

## Example

```json
{
  "team": "PlatformOps",
  "score": 8.4,
  "rolling_window": "90d",
  "distribution": {
    "correct_major": 12,
    "false_major": 2,
    "missed_major": 1,
    "correct_non_major": 18
  },
  "trend": "upward"
}
```

PlatformOps at 8.4: excellent accuracy, improving trend, eligible for self-declaration pilot. Two false positives offset by strong correct major rate. One missed major noted — worth a coaching conversation.

---

## What the Score Enables

High-scoring teams earn **operational autonomy**. Low-scoring teams receive **oversight and coaching**.

This is not punitive ranking. It is a trust ladder. Teams that demonstrate sound judgment gain the ability to move faster. Teams that consistently mis-classify get support, not punishment — until the pattern is resolved.

| Trust Level | What It Means |
|---|---|
| Self-declare authority | Team can open a Major Incident without IM validation |
| Standard flow | MIM validates the declaration before full activation |
| Mandatory oversight | Every declaration requires validation; patterns reviewed monthly |

---

## The Formula

```sql
SELECT
  team,
  ROUND(
    SUM(
      CASE
        WHEN proposed='Major' AND final='Major' THEN 10
        WHEN proposed='Major' AND final!='Major' THEN -5
        WHEN proposed!='Major' AND final='Major' THEN -15
        ELSE 5
      END
    ) / COUNT(*)
  , 1) AS major_accuracy_score
FROM incidents
WHERE event_date >= DATE_SUB(CURDATE(), INTERVAL 90 DAY)
GROUP BY team;
```

**Required data fields:** `proposed_by_team`, `proposed_severity`, `final_severity`, `event_date`  
**Optional:** `impact_confidence` weighting

---

## Governance

**Transparency:** Teams can view their raw data and challenge misclassifications. Disputed downgrades are scored as neutral (0) until resolved.

**Review cadence:** Updated monthly with quarterly trust calibration.

**Ownership:** Managed by the Major Incident Management Office.

**Purpose:** Drive learning and autonomy — not punitive ranking. MAS is an input to coaching conversations, not an HR metric.

---

## Relationship to Other Scoring Systems

MAS is one of four scoring systems in MajorOps. They operate at different levels:

| Score | Level | Measures |
|---|---|---|
| **Major Accuracy Score** | Team | Escalation accuracy (over/under-escalation) |
| **Team Dispatch Credit Score** | Team | On-call response speed and reliability |
| **Incident Readiness Score** | Agency | Preparedness at dispatch time (run card quality, After Action completion) |
| **Response Reputation Score** | Individual | Responder quality across communication, escalation, and documentation |

These scores are designed to be complementary — a team can have excellent MAS but a low Dispatch Credit Score if they declare accurately but respond slowly. Each score tells a different story.

---

## Pilot Approach

1. **Pilot phase (90 days):** Roll out to 2–3 product teams
2. **Refinement:** Validate behavioral outcomes (false major rates, mean time to escalate)
3. **Adoption:** Integrate score visibility into dashboards with trend lines and team benchmarks
4. **Trust tiers:** Use MAS as one input to team-level autonomy (self-declare authority)

---

*See also: [Response Reputation Score](/governance/response-reputation) · [Three-Tier Run Card System](/runcards/runcard-system) · [Escalation Doctrine](/bridge/escalation)*
