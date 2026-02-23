#!/bin/bash

# Cron Job Validator
# Ensures all running cron jobs match CANONICAL_SCHEDULE.md
# Run this periodically to catch mismatches before they cause problems

set -e

CANONICAL="/home/ssm-user/.openclaw/workspace/cron/CANONICAL_SCHEDULE.md"
ERRORS=0

echo "🔍 Validating cron jobs against canonical schedule..."
echo

# Extract expected jobs from canonical file
# Format: | Job Name | Expression | Timezone |
EXPECTED=$(grep "^\| " "$CANONICAL" | grep -E "\`0 [0-9]|1209600000" || true)

# Get actual jobs from OpenClaw
ACTUAL=$(openclaw cron list --json 2>/dev/null | jq -r '.[] | "\(.name) | \(.schedule.expr // .schedule.everyMs) | \(.schedule.tz)"' || true)

echo "Expected jobs:"
echo "$EXPECTED" | while read line; do
  [[ -z "$line" ]] && continue
  echo "  $line"
done
echo

echo "Actual jobs:"
echo "$ACTUAL" | while read line; do
  [[ -z "$line" ]] && continue
  echo "  $line"
done
echo

# Check for mismatches
echo "🔎 Checking for mismatches..."
echo

# Daily jobs check
DAILY_MORNING_EXPR=$(openclaw cron list --json 2>/dev/null | jq -r '.[] | select(.name | contains("Morning")) | .schedule.expr' || echo "NOT_FOUND")
if [[ "$DAILY_MORNING_EXPR" != "0 8 * * 1-5" ]]; then
  echo "❌ MISMATCH: Morning job expression is '$DAILY_MORNING_EXPR', expected '0 8 * * 1-5'"
  ERRORS=$((ERRORS + 1))
else
  echo "✅ Morning job (8am Mon-Fri): OK"
fi

DAILY_MIDDAY_EXPR=$(openclaw cron list --json 2>/dev/null | jq -r '.[] | select(.name | contains("Midday")) | .schedule.expr' || echo "NOT_FOUND")
if [[ "$DAILY_MIDDAY_EXPR" != "0 12 * * 1-5" ]]; then
  echo "❌ MISMATCH: Midday job expression is '$DAILY_MIDDAY_EXPR', expected '0 12 * * 1-5'"
  ERRORS=$((ERRORS + 1))
else
  echo "✅ Midday job (noon Mon-Fri): OK"
fi

DAILY_AFTERNOON_EXPR=$(openclaw cron list --json 2>/dev/null | jq -r '.[] | select(.name | contains("Afternoon")) | .schedule.expr' || echo "NOT_FOUND")
if [[ "$DAILY_AFTERNOON_EXPR" != "0 16 * * 1-5" ]]; then
  echo "❌ MISMATCH: Afternoon job expression is '$DAILY_AFTERNOON_EXPR', expected '0 16 * * 1-5'"
  ERRORS=$((ERRORS + 1))
else
  echo "✅ Afternoon job (4pm Mon-Fri): OK"
fi

SATURDAY_EXPR=$(openclaw cron list --json 2>/dev/null | jq -r '.[] | select(.name | contains("Saturday")) | .schedule.expr' || echo "NOT_FOUND")
if [[ "$SATURDAY_EXPR" != "0 10 * * 6" ]]; then
  echo "❌ MISMATCH: Saturday job expression is '$SATURDAY_EXPR', expected '0 10 * * 6'"
  ERRORS=$((ERRORS + 1))
else
  echo "✅ Saturday job (10am Sat): OK"
fi

SUNDAY_MORNING_EXPR=$(openclaw cron list --json 2>/dev/null | jq -r '.[] | select(.name | contains("Sunday Morning")) | .schedule.expr' || echo "NOT_FOUND")
if [[ "$SUNDAY_MORNING_EXPR" != "0 10 * * 0" ]]; then
  echo "❌ MISMATCH: Sunday Morning job expression is '$SUNDAY_MORNING_EXPR', expected '0 10 * * 0'"
  ERRORS=$((ERRORS + 1))
else
  echo "✅ Sunday Morning job (10am Sun): OK"
fi

SUNDAY_6PM_EXPR=$(openclaw cron list --json 2>/dev/null | jq -r '.[] | select(.name | contains("Weekly Summary")) | .schedule.expr' || echo "NOT_FOUND")
if [[ "$SUNDAY_6PM_EXPR" != "0 18 * * 0" ]]; then
  echo "❌ MISMATCH: Sunday 6pm job expression is '$SUNDAY_6PM_EXPR', expected '0 18 * * 0'"
  ERRORS=$((ERRORS + 1))
else
  echo "✅ Sunday 6pm job (6pm Sun): OK"
fi

INVOICE_EXPR=$(openclaw cron list --json 2>/dev/null | jq -r '.[] | select(.name | contains("Invoice")) | .schedule.expr' || echo "NOT_FOUND")
if [[ "$INVOICE_EXPR" != "0 9 1 * *" ]]; then
  echo "❌ MISMATCH: Invoice job expression is '$INVOICE_EXPR', expected '0 9 1 * *'"
  ERRORS=$((ERRORS + 1))
else
  echo "✅ Invoice job (9am 1st): OK"
fi

echo
if [[ $ERRORS -eq 0 ]]; then
  echo "✅ All cron jobs validated successfully!"
  exit 0
else
  echo "❌ Found $ERRORS mismatch(es). Fix immediately!"
  echo
  echo "Reference: /home/ssm-user/.openclaw/workspace/cron/CANONICAL_SCHEDULE.md"
  exit 1
fi
