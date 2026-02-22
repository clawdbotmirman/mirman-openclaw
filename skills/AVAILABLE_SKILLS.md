# Available Skills

OpenClaw skills extend functionality with specialized tools. Each skill provides CLI access to specific capabilities.

## Active / Recommended

### himalaya
**Email management via IMAP/SMTP**
- List, read, write, reply, forward, search emails
- Multiple accounts supported
- Account: clawdbotmirman@gmail.com
- Usage: `himalaya list` / `himalaya read` / `himalaya send`
- Status: ✅ Ready

### summarize
**Summarize URLs, files, PDFs, images, audio, YouTube**
- Web pages, documents, media analysis
- Usage: `summarize <url>` or `summarize <file>`
- Status: ✅ Ready

### weather
**Current weather and forecasts (no API key required)**
- Location-based forecasts
- Usage: `weather <location>`
- Status: ✅ Ready

### github
**GitHub interaction via `gh` CLI**
- Issues, PRs, CI runs, API queries
- Usage: `gh issue list` / `gh pr create` / `gh api`
- Status: ✅ Ready

### agent-cost-monitor
**Real-time token usage and cost tracking**
- Alerts, budgets, optimization tips
- Tracks all OpenClaw agents
- Status: ✅ Recommended (for tracking dual-instance costs)

### habit-tracker
**Build habits with streaks, reminders, progress visualization**
- Daily habit tracking
- Streak management
- Status: ✅ Recommended (morning routine)

### workout-logger
**Log workouts, track progress, PR tracking**
- Exercise suggestions
- Progress visualization
- Status: ✅ Available

### nano-pdf
**Edit PDFs with natural-language instructions**
- Usage: `nano-pdf <file> "instruction"`
- Status: ✅ Ready

### skill-creator
**Create or update AgentSkills**
- Package scripts, references, and assets
- Status: ✅ Available (for building custom skills)

## Available But Not Yet Used

### tmux
**Remote-control tmux sessions**
- Interactive CLI control via keystrokes
- Pane output scraping
- Status: ✅ Available

### goplaces
**Google Places API (New) via goplaces CLI**
- Text search, place details, resolve, reviews
- Status: ✅ Available

### openai-image-gen
**Batch-generate images via OpenAI Images API**
- Random prompt sampler + gallery
- Status: ✅ Available

### openai-whisper-api
**Transcribe audio via OpenAI Whisper API**
- Status: ✅ Available

## Skill Setup

Skills live at:
- System skills: `/usr/lib/node_modules/openclaw/skills/`
- Custom skills: `/home/ssm-user/.openclaw/workspace/skills/`

Each skill has a `SKILL.md` with detailed usage instructions.

## Recommended Next Steps

1. **agent-cost-monitor** — Set up budget alerts for dual-instance setup
2. **habit-tracker** — Morning routine: stretch + coffee + check inbox
3. **Custom skill** — Build `instacart-automation` and `doordash-automation` skills

## Automation Ideas

- Use **himalaya** to auto-process incoming claims appeals emails
- Use **summarize** to extract key info from appeals documents
- Use **agent-cost-monitor** to track costs across both instances
- Use **habit-tracker** to ensure morning routine (stretch, inbox, calendar check)
