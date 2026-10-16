#!/usr/bin/env bash
#
# Behavioral test: health-monitoring data foundation (Phase 1).
#
# Proves, against a live Postgres (no mocks, no unit tests):
#   1. the seed loads the Phase 0 bundle: counts match the bundle's manifest.
#   2. re-running the seed duplicates nothing (idempotency).
#   3. every laboratory observation resolves a reference range for the patient's
#      demographics at the observation's effective time (SQL, independent of the
#      application's resolver).
#   4. the pediatric vs adult specificity rule selects the right range.
#   5. UPDATE on Observation / ClinicalEvent is rejected by the append-only
#      trigger, and DELETE likewise.
#   6. the append-only triggers exist in the catalog.
#   7. no rows were mutated by the rejected statements.
#
# Usage:  scripts/test-health-data.sh
# Env:    PG_CONTAINER (default tangerine-postgres), PG_USER, PG_DB
#         HEALTH_TEST_SEED=0 to skip re-seeding (uses whatever is in the DB).
#
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PG_CONTAINER="${PG_CONTAINER:-tangerine-postgres}"
PG_USER="${PG_USER:-tangerine}"
PG_DB="${PG_DB:-tangerine}"
BUNDLE="$ROOT/apps/api/prisma/synthetic/health-population.json.gz"
SEED="${HEALTH_TEST_SEED:-1}"

pass=0
fail=0
check() { # check <description> <0|1>
  if [ "$2" = "1" ]; then
    printf '  \033[32mPASS\033[0m  %s\n' "$1"; pass=$((pass + 1))
  else
    printf '  \033[31mFAIL\033[0m  %s\n' "$1"; fail=$((fail + 1))
  fi
}
psql_q()  { docker exec -i "$PG_CONTAINER" psql -U "$PG_USER" -d "$PG_DB" -tAX -c "$1"; }
psql_file() { docker exec -i "$PG_CONTAINER" psql -U "$PG_USER" -d "$PG_DB" -tAX "$@"; }

echo "=== health data foundation behavioral test ==="
echo "db=$PG_CONTAINER  bundle=$BUNDLE"

[ -f "$BUNDLE" ] || { echo "bundle missing: $BUNDLE"; exit 1; }

# ── manifest counts from the committed bundle ────────────────────────────────
read -r EXP_PAT EXP_OBS EXP_COND EXP_ENC EXP_PROC EXP_MED EXP_RANGES <<EOF
$(python3 - "$BUNDLE" <<'PY'
import gzip, json, sys
d = json.load(gzip.open(sys.argv[1]))
c = d["meta"]["resourceCounts"]
print(d["meta"]["patientCount"], c.get("Observation", 0), c.get("Condition", 0),
      c.get("Encounter", 0), c.get("Procedure", 0), c.get("MedicationRequest", 0),
      d["meta"]["referenceRangeCount"])
PY
)
EOF
EXP_EVENTS=$((EXP_COND + EXP_ENC + EXP_PROC + EXP_MED))
echo "bundle expects: patients=$EXP_PAT observations=$EXP_OBS clinicalEvents=$EXP_EVENTS (cond=$EXP_COND enc=$EXP_ENC proc=$EXP_PROC med=$EXP_MED) ranges=$EXP_RANGES"

# ── 1. seed ──────────────────────────────────────────────────────────────────
if [ "$SEED" = "1" ]; then
  echo "seeding (fresh health tables)..."
  ( cd "$ROOT" && HEALTH_SEED_RESET=1 pnpm --filter @tangerine/api prisma:seed-health ) >/tmp/health-seed.log 2>&1
  SEED_RC=$?
  check "seed script exited 0 (rc=$SEED_RC)" "$([ "$SEED_RC" = "0" ] && echo 1 || echo 0)"
  [ "$SEED_RC" = "0" ] || { echo "--- seed log ---"; tail -20 /tmp/health-seed.log; }
fi

# ── 2. counts match the bundle ───────────────────────────────────────────────
N_OBS="$(psql_q 'SELECT count(*) FROM "Observation";')"
N_EV="$(psql_q 'SELECT count(*) FROM "ClinicalEvent";')"
N_RR="$(psql_q 'SELECT count(*) FROM "ReferenceRange";')"
N_PAT="$(psql_q 'SELECT count(*) FROM "PatientProfile";')"
check "Observation count = bundle ($N_OBS = $EXP_OBS)" "$([ "$N_OBS" = "$EXP_OBS" ] && echo 1 || echo 0)"
check "ClinicalEvent count = bundle ($N_EV = $EXP_EVENTS)" "$([ "$N_EV" = "$EXP_EVENTS" ] && echo 1 || echo 0)"
check "ReferenceRange count = catalog ($N_RR = $EXP_RANGES)" "$([ "$N_RR" = "$EXP_RANGES" ] && echo 1 || echo 0)"
check "PatientProfile count = patients ($N_PAT = $EXP_PAT)" "$([ "$N_PAT" = "$EXP_PAT" ] && echo 1 || echo 0)"

# ── 3. idempotency: re-seed inserts nothing ──────────────────────────────────
if [ "$SEED" = "1" ]; then
  ( cd "$ROOT" && pnpm --filter @tangerine/api prisma:seed-health ) >/tmp/health-seed2.log 2>&1
  OBS_INS="$(grep -oE 'Observation: +[0-9]+' /tmp/health-seed2.log | grep -oE '[0-9]+$')"
  EV_INS="$(grep -oE 'ClinicalEvent: [0-9]+' /tmp/health-seed2.log | grep -oE '[0-9]+$')"
  check "second seed inserted 0 observations (got ${OBS_INS:-?})" "$([ "${OBS_INS:-x}" = "0" ] && echo 1 || echo 0)"
  check "second seed inserted 0 clinical events (got ${EV_INS:-?})" "$([ "${EV_INS:-x}" = "0" ] && echo 1 || echo 0)"
fi

# ── 4. every laboratory observation resolves a reference range ───────────────
# Resolution mirrors the application rule: sex match (or wildcard) AND age band
# (or unbounded) at the observation's effective time.
UNRESOLVED="$(psql_q '
SELECT count(*) FROM "Observation" o
JOIN "PatientProfile" p ON p."userId" = o."patientId"
WHERE o.category = '"'"'LABORATORY'"'"'
AND NOT EXISTS (
  SELECT 1 FROM "ReferenceRange" rr
  WHERE rr.code = o.code
    AND rr."valueUnit" = o."valueUnit"
    AND (rr.sex IS NULL OR rr.sex = p.sex)
    AND (rr."ageMinDays" IS NULL OR floor(extract(epoch FROM (o."effectiveAt" - p."birthDate"))/86400) >= rr."ageMinDays")
    AND (rr."ageMaxDays" IS NULL OR floor(extract(epoch FROM (o."effectiveAt" - p."birthDate"))/86400) <= rr."ageMaxDays")
);')"
check "0 laboratory observations lack a reference range (got $UNRESOLVED)" "$([ "$UNRESOLVED" = "0" ] && echo 1 || echo 0)"

# ── 5. specificity: pediatric child band chosen for a child, not the adult row ─
PEDIATRIC_ID="$(psql_q '
SELECT o.id FROM "Observation" o
JOIN "PatientProfile" p ON p."userId" = o."patientId"
WHERE o.code = '"'"'8867-4'"'"'
  AND floor(extract(epoch FROM (o."effectiveAt" - p."birthDate"))/86400) BETWEEN 365 AND 6570
LIMIT 1;')"
ADULT_ID="$(psql_q '
SELECT o.id FROM "Observation" o
JOIN "PatientProfile" p ON p."userId" = o."patientId"
WHERE o.code = '"'"'8867-4'"'"'
  AND floor(extract(epoch FROM (o."effectiveAt" - p."birthDate"))/86400) > 6570
LIMIT 1;')"

resolve_sql() { # $1 = observation id -> "low|high" of the selected range
  psql_q "
SELECT rr.\"lowValue\" || '|' || rr.\"highValue\" FROM \"Observation\" o
JOIN \"PatientProfile\" p ON p.\"userId\" = o.\"patientId\"
JOIN \"ReferenceRange\" rr ON rr.code = o.code AND rr.\"valueUnit\" = o.\"valueUnit\"
  AND (rr.sex IS NULL OR rr.sex = p.sex)
  AND (rr.\"ageMinDays\" IS NULL OR floor(extract(epoch FROM (o.\"effectiveAt\" - p.\"birthDate\"))/86400) >= rr.\"ageMinDays\")
  AND (rr.\"ageMaxDays\" IS NULL OR floor(extract(epoch FROM (o.\"effectiveAt\" - p.\"birthDate\"))/86400) <= rr.\"ageMaxDays\")
WHERE o.id = '$1'
ORDER BY (rr.sex IS NOT NULL) DESC,
         (rr.\"ageMinDays\" IS NOT NULL AND rr.\"ageMaxDays\" IS NOT NULL) DESC,
         (coalesce(rr.\"ageMaxDays\", 999999) - coalesce(rr.\"ageMinDays\", 0)) ASC
LIMIT 1;"
}
PED_RANGE="$(resolve_sql "$PEDIATRIC_ID")"
ADULT_RANGE="$(resolve_sql "$ADULT_ID")"
echo "  8867-4 child -> ${PED_RANGE:-none}; adult -> ${ADULT_RANGE:-none}"
check "child heart-rate range is the pediatric band (70|120) (got $PED_RANGE)" "$([ "$PED_RANGE" = "70|120" ] && echo 1 || echo 0)"
check "adult heart-rate range is the adult band (60|100) (got $ADULT_RANGE)" "$([ "$ADULT_RANGE" = "60|100" ] && echo 1 || echo 0)"

# ── 6. append-only triggers exist ────────────────────────────────────────────
TRIGGERS="$(psql_q "SELECT count(*) FROM pg_trigger WHERE tgname IN ('Observation_append_only','ClinicalEvent_append_only') AND NOT tgisinternal;")"
check "append-only triggers present on both tables (got $TRIGGERS)" "$([ "$TRIGGERS" = "2" ] && echo 1 || echo 0)"

# ── 7. UPDATE / DELETE are rejected, rows unchanged ──────────────────────────
TARGET_OBS="$(psql_q 'SELECT id FROM "Observation" LIMIT 1;')"
TARGET_EV="$(psql_q 'SELECT id FROM "ClinicalEvent" LIMIT 1;')"

attempt() { # attempt <op> <table> <sql>
  local op="$1" tbl="$2" sql="$3" out rc
  out="$(psql_file -v ON_ERROR_STOP=1 -c "$sql" 2>&1)"; rc=$?
  check "$op on $tbl rejected (rc=$rc)" "$([ "$rc" != "0" ] && echo 1 || echo 0)"
  check "  rejection is the append-only trigger" "$(printf '%s' "$out" | grep -q 'append-only' && echo 1 || echo 0)"
}

attempt UPDATE Observation "UPDATE \"Observation\" SET \"valueNumeric\"=1 WHERE id='$TARGET_OBS'"
attempt DELETE Observation "DELETE FROM \"Observation\" WHERE id='$TARGET_OBS'"
attempt UPDATE ClinicalEvent "UPDATE \"ClinicalEvent\" SET display='x' WHERE id='$TARGET_EV'"
attempt DELETE ClinicalEvent "DELETE FROM \"ClinicalEvent\" WHERE id='$TARGET_EV'"

N_OBS2="$(psql_q 'SELECT count(*) FROM "Observation";')"
N_EV2="$(psql_q 'SELECT count(*) FROM "ClinicalEvent";')"
check "observation count unchanged after rejected mutations ($N_OBS2)" "$([ "$N_OBS2" = "$N_OBS" ] && echo 1 || echo 0)"
check "clinical event count unchanged after rejected mutations ($N_EV2)" "$([ "$N_EV2" = "$N_EV" ] && echo 1 || echo 0)"

echo
echo "=== result: $pass passed, $fail failed ==="
[ "$fail" = "0" ]
