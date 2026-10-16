#!/usr/bin/env bash
#
# Adversarial test: referential integrity across the seeded population (Phase 5).
#
# Proves against a live Postgres (no mocks) that the 100-patient synthetic
# population is internally consistent — the invariants a clinical system must
# never violate:
#   1. every laboratory observation resolves a matching reference range for the
#      patient's sex and age at the time of the observation (a lab result with
#      no range is not interpretable);
#   2. every patient who has a medication order also has a recorded condition
#      (no treatment without a diagnosis);
#   3. every encounter (and observation) belongs to a real patient.
#
# It auto-seeds the population if it is absent, so it is safe to run first.
#
# Usage:  scripts/test-health-referential-integrity.sh
# Env:    PG_CONTAINER (default tangerine-postgres), PG_USER, PG_DB
#
set -uo pipefail

PG_CONTAINER="${PG_CONTAINER:-tangerine-postgres}"
PG_USER="${PG_USER:-tangerine}"
PG_DB="${PG_DB:-tangerine}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

pass=0; fail=0
check() { if [ "$2" = "1" ]; then printf '  \033[32mPASS\033[0m  %s\n' "$1"; pass=$((pass+1)); else printf '  \033[31mFAIL\033[0m  %s\n' "$1"; fail=$((fail+1)); fi; }
psql_q() { docker exec -i "$PG_CONTAINER" psql -U "$PG_USER" -d "$PG_DB" -tAX -c "$1"; }

echo "=== health referential-integrity test ==="
echo "db=$PG_CONTAINER/$PG_DB"

PROFILES="$(psql_q "SELECT count(*) FROM \"PatientProfile\";")"
if [ "${PROFILES:-0}" -lt 100 ]; then
  echo "  population has only $PROFILES profiles — seeding..."
  ( cd "$ROOT" && pnpm --filter @tangerine/api prisma:seed-health >/dev/null 2>&1 ) || true
  PROFILES="$(psql_q "SELECT count(*) FROM \"PatientProfile\";")"
fi
check "population seeded with ≥ 100 patient profiles (got $PROFILES)" "$([ "${PROFILES:-0}" -ge 100 ] && echo 1 || echo 0)"

LAB_TOTAL="$(psql_q "SELECT count(*) FROM \"Observation\" WHERE category='LABORATORY';")"
echo "  laboratory observations: $LAB_TOTAL"

# 1. Every lab observation resolves a range for the patient's sex + age at the
#    time of the observation, active on that date.
MISSING_RANGE="$(psql_q "
SELECT count(*) FROM \"Observation\" o
  JOIN \"PatientProfile\" p ON p.\"userId\" = o.\"patientId\"
 WHERE o.category='LABORATORY' AND o.\"valueNumeric\" IS NOT NULL AND o.\"valueUnit\" IS NOT NULL
   AND NOT EXISTS (
     SELECT 1 FROM \"ReferenceRange\" r
      WHERE r.code = o.code AND r.\"valueUnit\" = o.\"valueUnit\"
        AND (r.sex IS NULL OR r.sex::text = p.sex::text)
        AND (r.\"ageMinDays\" IS NULL OR floor(extract(epoch FROM (o.\"effectiveAt\" - p.\"birthDate\"))/86400) >= r.\"ageMinDays\")
        AND (r.\"ageMaxDays\" IS NULL OR floor(extract(epoch FROM (o.\"effectiveAt\" - p.\"birthDate\"))/86400) <= r.\"ageMaxDays\")
        AND r.\"effectiveFrom\" <= o.\"effectiveAt\"
        AND (r.\"effectiveTo\" IS NULL OR r.\"effectiveTo\" >= o.\"effectiveAt\")
   );")"
check "every laboratory observation has a matching reference range (missing=$MISSING_RANGE)" "$([ "${MISSING_RANGE:-1}" = "0" ] && echo 1 || echo 0)"

# 1b. And every lab observation's patient has a profile at all (so age is knowable).
NO_PROFILE="$(psql_q "SELECT count(*) FROM \"Observation\" o WHERE NOT EXISTS (SELECT 1 FROM \"PatientProfile\" p WHERE p.\"userId\"=o.\"patientId\");")"
check "every observation belongs to a patient with a profile (missing=$NO_PROFILE)" "$([ "${NO_PROFILE:-1}" = "0" ] && echo 1 || echo 0)"

# 2. No treatment without a diagnosis: every patient with a medication order has
#    at least one CONDITION event.
MED_NO_COND="$(psql_q "
SELECT count(*) FROM (
  SELECT DISTINCT \"patientId\" FROM \"ClinicalEvent\" WHERE type='MEDICATION_ORDER'
  EXCEPT
  SELECT DISTINCT \"patientId\" FROM \"ClinicalEvent\" WHERE type='CONDITION'
) x;")"
MED_PATIENTS="$(psql_q "SELECT count(DISTINCT \"patientId\") FROM \"ClinicalEvent\" WHERE type='MEDICATION_ORDER';")"
check "every medication-order patient also has a condition (patients=$MED_PATIENTS, without=$MED_NO_COND)" "$([ "${MED_NO_COND:-1}" = "0" ] && echo 1 || echo 0)"

# 3. Every encounter belongs to a real patient.
ORPHAN_ENC="$(psql_q "SELECT count(*) FROM \"ClinicalEvent\" e WHERE e.type='ENCOUNTER' AND NOT EXISTS (SELECT 1 FROM \"User\" u WHERE u.id = e.\"patientId\");")"
ENC_TOTAL="$(psql_q "SELECT count(*) FROM \"ClinicalEvent\" WHERE type='ENCOUNTER';")"
check "every encounter has a valid patient (encounters=$ENC_TOTAL, orphans=$ORPHAN_ENC)" "$([ "${ORPHAN_ENC:-1}" = "0" ] && echo 1 || echo 0)"

ORPHAN_OBS="$(psql_q "SELECT count(*) FROM \"Observation\" o WHERE NOT EXISTS (SELECT 1 FROM \"User\" u WHERE u.id = o.\"patientId\");")"
check "every observation has a valid patient (orphans=$ORPHAN_OBS)" "$([ "${ORPHAN_OBS:-1}" = "0" ] && echo 1 || echo 0)"

echo
echo "=== result: $pass passed, $fail failed ==="
[ "$fail" = "0" ]
