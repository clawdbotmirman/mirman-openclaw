# Canonical Cron Schedule

**Authority of truth for all cron jobs. Every job must match this exactly.**

## Daily Schedules (Mon-Fri)

| Time | Job Name | Cron Expression | Timezone | Description |
|------|----------|-----------------|----------|-------------|
| 8:00 AM EST | Daily Tasks - Morning | `0 8 * * 1-5` | America/New_York | Morning digest, priorities |
| 12:00 PM EST | Daily Tasks - Midday | `0 12 * * 1-5` | America/New_York | Midday check-in |
| 4:00 PM EST | Daily Tasks - Afternoon | `0 16 * * 1-5` | America/New_York | EOD wrap-up |

## Weekend Schedules

| Day | Time | Job Name | Cron Expression | Timezone | Description |
|-----|------|----------|-----------------|----------|-------------|
| Saturday | 10:00 AM EST | Weekend Check-In | `0 10 * * 6` | America/New_York | Saturday tasks |
| Sunday | 10:00 AM EST | Sunday Morning Check-In | `0 10 * * 0` | America/New_York | Week ahead planning |
| Sunday | 6:00 PM EST | Weekly Summary | `0 18 * * 0` | America/New_York | Weekly recap |

## Monthly Schedules

| Date | Time | Job Name | Cron Expression | Timezone | Description |
|------|------|----------|-----------------|----------|-------------|
| 1st | 9:00 AM EST | Monthly Invoice Reminder | `0 9 1 * *` | US/Eastern | Send invoices |

## Interval Schedules

| Frequency | Job Name | Interval (ms) | Description |
|-----------|----------|---------------|-------------|
| Every 14 days | Water Reorder Check-in | 1209600000 | Mountain Valley Water reorder |

## Validation Rules

1. **Job name must include the time** (e.g., "Morning (8am EST)")
2. **Expression must match the time exactly**
3. **Timezone must be America/New_York for all EST jobs** (except where noted)
4. **No job names or expressions can deviate without updating this file first**

## How to Add a Job

1. Add entry to this file in the appropriate section
2. Run `cron add` with exact expression and timezone from this file
3. Verify job fires at correct time
4. Commit this file to git as part of the change

## How to Modify a Job

1. Update entry in this file
2. Run `cron update` with new values
3. Verify change
4. Commit this file to git

**Last Updated:** 2026-02-23
**Validated:** All 8 jobs match canonical schedule ✅
