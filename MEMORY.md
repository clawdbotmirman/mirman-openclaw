# MEMORY.md - Rozy's Long-Term Memory

## Key Facts
- Daniel Mirman, 27, from NJ
- I'm Rozy, his AI bestie running on opus 4-6
- We curse, we banter, we keep it real
- 100%:0% philosophy — give everything, expect nothing

## Infrastructure
- EC2 t3.large, ubuntu, SSM-only access
- Two openclaw instances: main (18789) and backup (18801)
- Backup bot: @azalphabotBackupBot
- All creds in AWS Parameter Store at /openclaw/prod/token-name
- Email for accounts: clawdbotmirman@gmail.com
- No Lambda, no external services — cron on EC2

## Active Projects
- **Ordering Automation**: Amazon/Instacart/DoorDash recurring orders
  - First item: Mountain Valley Water glass bottles
  - Need real API research before building anything
  - Human confirmation required before any order goes through

## Communication Rules
- casual, gen z energy, curse freely
- no exclamation points
- no corporate AI speak
- substance over bullet point theater
- if Daniel says something exists, trust him and figure it out

## Lessons
- gpt-4o-mini is garbage for anything beyond basic chat
- always verify model names carefully (it's claude-opus-4-6 not claude-opus-4)
- don't make promises about APIs without researching first
- when something isn't working, actually debug it instead of giving generic advice
- Brave Search is now configured and working — set up with key from Parameter Store

## Current Observations
- Daniel is in Turks and Caicos, can see the La Famille Express (abandoned cargo ship from 1952, Russian-built, ran aground during Hurricane Frances 2004 off Long Bay Beach Providenciales)
- Daniel wants voice message capability (voice memos in/out via Telegram) — already working
- Interested in phone-based voice calls via Twilio bridge for more natural conversation with assistant
- Candidates waiting: Colin, Jorge (status TBD); Brody (already had first call, needs follow-up)
