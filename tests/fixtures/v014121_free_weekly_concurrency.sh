#!/usr/bin/env bash
# Disposable PostgreSQL 16 GitHub Actions service ONLY. NEVER run against production.
# Two independent database sessions attempt the same account's first Journal save
# under a one-record limit. Only one save may commit; the other must fail closed.
set -euo pipefail
: "${PGDATABASE:?Use the isolated CI Postgres database}"
if [[ "$PGDATABASE" != "free_week_v121" ]]; then
  echo "REFUSED: this fixture requires the explicitly disposable free_week_v121 database" >&2
  exit 1
fi
member="dddddddd-dddd-4ddd-8ddd-dddddddddddd"
psql -X -v ON_ERROR_STOP=1 <<SQL
INSERT INTO auth.users(id) VALUES('$member');
UPDATE public.platform_plans SET metadata=jsonb_set(metadata,'{journal_limit_week}','1'::jsonb)
 WHERE plan_code='FREE' AND price_cents=0;
SQL
first_log="$(mktemp)"
second_log="$(mktemp)"
trap 'rm -f "$first_log" "$second_log"' EXIT
# First transaction holds its journal save open while second connection contends.
(psql -X -v ON_ERROR_STOP=1 <<SQL
BEGIN;
INSERT INTO public.decision_journal(user_id,ticker,trade_date,journal_type,status)
 VALUES('$member','TEST',CURRENT_DATE,'paper','draft');
SELECT pg_sleep(3);
COMMIT;
SQL
) >"$first_log" 2>&1 &
first_pid=$!
sleep 1
if psql -X -v ON_ERROR_STOP=1 -c "
 INSERT INTO public.decision_journal(user_id,ticker,trade_date,journal_type,status)
 VALUES('$member','TEST',CURRENT_DATE,'paper','draft');" >"$second_log" 2>&1; then
  echo "FAIL: concurrent second Journal save unexpectedly succeeded" >&2
  cat "$first_log" "$second_log" >&2
  wait "$first_pid" || true
  exit 1
fi
wait "$first_pid"
if ! grep -Fq 'FREE_WEEKLY_JOURNAL_LIMIT_REACHED' "$second_log"; then
  echo "FAIL: concurrent rejection was not the expected weekly quota boundary" >&2
  cat "$second_log" >&2
  exit 1
fi
psql -X -v ON_ERROR_STOP=1 -v member="$member" <<'SQL'
DO $verify$
DECLARE
 u uuid:='dddddddd-dddd-4ddd-8ddd-dddddddddddd';
 records int;
 ledger int;
BEGIN
 SELECT count(*) INTO records FROM public.decision_journal WHERE user_id=u;
 SELECT used_count INTO ledger FROM public.gu_free_weekly_usage_v014121
 WHERE user_id=u
   AND week_start=(date_trunc('week',now() AT TIME ZONE 'UTC'))::date
   AND usage_kind='journal';
 IF records<>1 OR ledger<>1 THEN
  RAISE EXCEPTION 'Concurrent save count mismatch: % records, % usage',records,ledger;
 END IF;
 RAISE NOTICE 'PASS concurrent Journal writes: exactly one commit and one quota rejection';
END $verify$;
SQL
