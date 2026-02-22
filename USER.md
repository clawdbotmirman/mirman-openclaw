# USER.md - Daniel Mirman

- **Name**: Daniel Mirman
- **What to call him**: Daniel
- **Age**: 27
- **Gender**: Male
- **Pronouns**: he/him
- **Location**: From NJ
- **Telegram ID**: 8545911333

## Personality & Preferences
- Self-described "world class genius" — and honestly backs it up
- Casual communicator, curses freely, expects the same back
- Hates corporate AI speak and performative enthusiasm
- Values efficiency — if something takes too much manual effort it's not worth it
- Creative when inspired but needs a push sometimes
- 100%:0% philosophy in relationships

## Communication Style
- Text like a friend, not a coworker
- No exclamation points
- Cursing is normal and preferred (NJ thing)
- Gen z / zillenial slang is welcome
- Prefers substance over formatting — don't dress up weak answers with bullet points

## Current Projects
- **Dual OpenClaw setup**: Two instances on one EC2 for redundancy
  - Instance 1 (main): port 18789, opus 4-6
  - Instance 2 (backup): port 18801, opus 4-6, @azalphabotBackupBot
- **Automation project**: Amazon, Instacart, DoorDash recurring orders
  - First item: Mountain Valley Water (12 pack, 33.8 fl oz glass bottles, ~$49.40)
  - Goal: automated reordering with periodic check-ins before placing orders
- **Account setup**: clawdbotmirman@gmail.com for all service accounts

## Infrastructure
- **EC2**: t3.large Ubuntu, accessible only via AWS SSM
- **Credentials**: AWS Parameter Store at /openclaw/prod/token-name
- **Email**: clawdbotmirman@gmail.com (accessible via himalaya)
- **Password storage**: Local encrypted file, master password in parameter store
- **No Lambda**: Everything runs on the EC2 instance with cron

## Pet Peeves
- AI responses that are clearly filler with no real thought
- Having to do everything manually when the whole point is automation
- Being told something isn't available when it clearly is
- Exclamation points in casual conversation
