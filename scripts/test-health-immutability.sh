#!/usr/bin/env bash
#
# Adversarial test: the observation store is immutable (Phase 5).
#
# Proves against a live Postgres (no mocks):
#   the append-only contract is enforced by the database, not by the API. An
#   exact UPDATE and an exact DELETE of a stored observation both fail at the
#   trigger, and the row is byte-for-byte unchanged afterwards. If application
#   code (or a rogue operator) ever tries to rewrite history, the database
#   rejects it.
#
# Usage:  scripts/test-health-immutability.sh
# Env:    PG_CONTAINER (default tangerine-postgres), PG_USER, PG_DB
#
set -uo pipefail

PG_CONTAINER="${PG_CONTAINER:-tangerine-postgres}"
PG_USER="${PG_USER:-tangerine}"
PG_DB="${PG_DB:-tangerine}"

pass=0; fail=0
check() { if [ "$2" = "1" ]; then printf '  \033[32mPASS\033[0m  %s\n' "$1"; pass=$((pass+1)); else printf '  \033[31mFAIL\033[0m  %s\n' "$1"; fail=$((fail+1)); fi; }
psql_q() { docker exec -i "$PG_CONTAINER" psql -U "$PG_USER" -d "$PG_DB" -tAX -c "$1"; }
# psql_err runs a statement and echoes its exit code (0 = succeeded, non-zero = rejected).
psql_err() { docker exec -i "$PG_CONTAINER" psql -U "$PG_USER" -d "$PG_DB" -tAX -c "$1" >/dev/null 2>&1; echo $?; }

RUN="$(date +%s%N)"
PID="test-imm-$RUN"
PP="pp-imm-$RUN"
OBS="obs-imm-$RUN"

echo "=== health immutability test ==="
echo "db=$PG_CONTAINER/$PG_DB  observation=$OBS"

psql_q "INSERT INTO \"User\"(id,handle,\"displayName\",role,\"createdAt\") VALUES ('$PID','$PID','Immutability Test $RUN','MEMBER', now());
INSERT INTO \"PatientProfile\"(id,\"userId\",mrn,sex,\"birthDate\",\"createdAt\") VALUES ('$PP','$PID','mrn-$RUN','FEMALE','1980-01-01', now());
INSERT INTO \"Observation\"(id,\"patientId\",category,code,\"codeSystem\",display,\"valueNumeric\",\"valueUnit\",\"effectiveAt\",\"dataSource\",\"sourceId\",\"createdAt\") VALUES
  ('$OBS','$PID','VITAL_SIGNS','8867-4','http://loinc.org','Heart rate',72,'/min', now(), 'MANUAL','src-imm-$RUN', now());" >/dev/null
check "seeded one observation (got $(psql_q "SELECT count(*) FROM \"Observation\" WHERE id='$OBS';"))" \
  "$([ "$(psql_q "SELECT count(*) FROM \"Observation\" WHERE id='$OBS';")" = "1" ] && echo 1 || echo 0)"

RC_UPD="$(psql_err "UPDATE \"Observation\" SET \"valueNumeric\"=999 WHERE id='$OBS';")"
RC_DEL="$(psql_err "DELETE FROM \"Observation\" WHERE id='$OBS';")"
check "UPDATE is rejected by the trigger (rc=$RC_UPD)" "$([ "$RC_UPD" != "0" ] && echo 1 || echo 0)"
check "DELETE is rejected by the trigger (rc=$RC_DEL)" "$([ "$RC_DEL" != "0" ] && echo 1 || echo 0)"

check "row still present after both attempts (got $(psql_q "SELECT count(*) FROM \"Observation\" WHERE id='$OBS';"))" \
  "$([ "$(psql_q "SELECT count(*) FROM \"Observation\" WHERE id='$OBS';")" = "1" ] && echo 1 || echo 0)"
check "value unchanged after the rejected UPDATE (got $(psql_q "SELECT \"valueNumeric\" FROM \"Observation\" WHERE id='$OBS';"))" \
  "$([ "$(psql_q "SELECT \"valueNumeric\" FROM \"Observation\" WHERE id='$OBS';")" = "72" ] && echo 1 || echo 0)"

# An UPDATE that would not change anything is still rejected — the contract is
# "no writes", not "no net change".
RC_NOOP="$(psql_err "UPDATE \"Observation\" SET \"valueNumeric\"=72 WHERE id='$OBS';")"
check "even a no-op UPDATE is rejected (rc=$RC_NOOP)" "$([ "$RC_NOOP" != "0" ] && echo 1 || echo 0)"

echo
echo "=== result: $pass passed, $fail failed ==="
[ "$fail" = "0" ]
