# Cron Jobs

OpenClaw cron scheduler handles all recurring automation. All jobs use the `/openclaw/prod/token-name` Parameter Store for API credentials.

## Active Jobs

### Daily Tasks - Morning (10am EST)
- **Schedule**: Every day at 10am EST
- **Type**: systemEvent (main session)
- **Task**: Morning digest + task checklist
- **Status**: ✅ Active
- **Fixed**: Changed "2027 Priorities" typo to "2026 Priorities"

**Payload:**
```
📋 Morning Task Digest (8am EST)

🎯 2026 Priorities: Claims Appeals (1) → ID Card Auto (2) → Beni Billing (3)

[Current active tasks and blockers]
```

### Weekly Summary (Sunday 6pm EST)
- **Schedule**: Every Sunday at 6pm EST
- **Type**: systemEvent (main session)
- **Task**: Weekly recap + planning
- **Status**: ✅ Active

### Water Reorder Reminder (Every 3 weeks)
- **Schedule**: Every 3 weeks on day of original order
- **Type**: systemEvent (main session)
- **Task**: Check if water reorder needed (Mountain Valley Water)
- **Action**: Manual confirmation required before placing order via Amazon automation
- **Status**: ✅ Ready to run

### Juan Invoice Reminder (3/1 each month)
- **Schedule**: March 1st annually at 9am EST
- **Type**: systemEvent (main session)
- **Task**: "Send Juan invoice for this month"
- **Status**: ✅ Queued (first run 3/1/2026)

## Job Structure

All jobs configured via OpenClaw `cron` tool:

```javascript
{
  "schedule": { 
    "kind": "cron", 
    "expr": "0 10 * * *",  // 10am daily
    "tz": "US/Eastern"
  },
  "payload": {
    "kind": "systemEvent",
    "text": "Reminder text here"
  },
  "sessionTarget": "main",
  "enabled": true
}
```

## Best Practices

1. **Times in EST** — All schedules use `US/Eastern` timezone
2. **Reminders as context** — Include recent info in the reminder text
3. **Confirmation required** — Any destructive actions require manual approval
4. **Monthly/recurring payments** — Use cron for billing reminders (e.g., Juan 3/1)
5. **Heartbeats vs cron**:
   - Use **heartbeat** for interactive checks (email, calendar, weather in one turn)
   - Use **cron** for exact timing and isolated tasks

## Future Jobs

- [ ] Eden response follow-up (if no Google product team response by date X)
- [ ] MEC crosswalk check (weekly until Justin delivers)
- [ ] Amazon reorder automation (once confirmed working)
- [ ] Claims Appeals: Auto-process new appeals (once system live)
