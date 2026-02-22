# Rozy OpenClaw Workspace

Personal AI assistant workspace for Daniel Mirman. Running on EC2 t3.large with dual OpenClaw instances for redundancy.

## Structure

- **SOUL.md** — Who I am (personality, philosophy, boundaries)
- **USER.md** — Who you are (Daniel's preferences, infrastructure)
- **IDENTITY.md** — Core identity facts
- **MEMORY.md** — Long-term curated memories
- **TOOLS.md** — Local setup notes (TTS voice, SSH hosts, etc.)
- **HEARTBEAT.md** — Periodic check-in reminders
- **memory/** — Daily session logs (YYYY-MM-DD.md)
- **cron/** — Scheduled automation jobs
- **skills/** — Available agent skills and references
- **scripts/** — Automation & utility scripts

## Active Instances

| Instance | Port | Model | Bot |
|----------|------|-------|-----|
| Main (primary) | 18789 | opus-4-6 | Direct Telegram |
| Backup (repair) | 18801 | opus-4-6 | @azalphabotBackupBot |

## Infrastructure

- **Hosting**: AWS EC2 t3.large, Ubuntu, SSM-only access
- **Secrets**: AWS Parameter Store at `/openclaw/prod/token-name`
- **Email**: clawdbotmirman@gmail.com (via himalaya)
- **GitHub**: https://github.com/clawdbotmirman/mirman-openclaw

## Principles

1. **No hardcoded secrets** — All creds in Parameter Store, accessed at runtime
2. **Automation first** — Cron jobs handle recurring tasks
3. **Memory continuity** — Daily logs + curated long-term memories
4. **Banter over corporate speak** — Casual, honest communication
5. **100%:0% philosophy** — Both give everything, expect nothing

## Current Projects

1. **Claims Appeals AI** — SQL Server automation for processing appeals (20/day, 30-day SLA)
2. **ID Card Auto** — Scope TBD with GPT/Dave
3. **Beni Billing** — MEC plan integration (waiting on Justin's crosswalk)
4. **Order Automation** — Amazon/Instacart/DoorDash recurring orders
   - First item: Mountain Valley Water (glass bottles)
   - Browser automation via Playwright
   - Requires manual confirmation before placing orders

## Recent Updates

- ✅ GitHub repo set up (fresh history, no secrets)
- ✅ Twilio SID and recovery codes removed from memory files
- ✅ .gitignore configured for browser cache, node_modules, credentials
- ✅ Juan payment reminder queued for 3/1

## Next Steps

- [ ] Claims Appeals: Respond to open questions from Matt & Rhonda
- [ ] ID Card Auto: Schedule scope call with GPT/Dave
- [ ] MEC plans: Follow up with Justin on crosswalk status
- [ ] Order automation: Build Instacart/DoorDash scripts (after Amazon working)
