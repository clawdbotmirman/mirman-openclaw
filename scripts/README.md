# Automation Scripts

Reusable scripts for automation tasks. All scripts pull secrets from AWS Parameter Store at runtime — never hardcode credentials.

## Order Automation

### amazon-automation/buy-item.js
- **Purpose**: Search for item, add to cart, checkout, place order on Amazon
- **Auth**: Uses Parameter Store credentials
- **Confirmation**: Requires manual approval before placing order
- **Status**: ✅ Working (tested with water & toothpaste)
- **Next**: Wrap in cron job for recurring Mountain Valley Water orders (every 3 weeks)

**Usage:**
```bash
node buy-item.js "search query" resultNumber
```

### instacart-automation/ (planned)
- **Status**: 🔲 Not started
- **Notes**: Research Instacart API availability first
- **Goal**: Automate recurring grocery orders

### doordash-automation/ (planned)
- **Status**: 🔲 Not started
- **Notes**: Research DoorDash API availability first
- **Goal**: Automate recurring meal delivery orders

## Claims Appeals Processing

### appeals-processor/ (planned)
- **Purpose**: Ingest appeals from FTP, process documents, generate letters
- **Scope**: Waiting on Justin's MEC crosswalk + final requirements from Matt & Rhonda
- **Database**: SQL Server on Azure (finalized)
- **Volume**: ~20 appeals/day
- **SLA**: 30 days

## Email Processing

### email-monitor.js (planned)
- **Purpose**: Monitor clawdbotmirman@gmail.com for incoming appeals
- **Action**: Auto-forward key info to processing queue
- **Tool**: himalaya skill for IMAP access

## Security Policy

1. **Never hardcode secrets** — Use `getSecret()` or AWS Parameter Store queries
2. **Parameter Store paths**: `/openclaw/prod/token-name` for all API keys
3. **No credentials in git** — Even after cleanup, .gitignore blocks them
4. **Test before production** — Always confirm behavior on test items first
5. **Log actions** — Keep audit trail of what scripts do (but not sensitive details)

## Testing

- Use test accounts: clawdbotmirman@gmail.com (all platforms)
- Test with low-value items first (e.g., $5-10)
- Verify cancellation flow before automating reorders
- Document any captcha/MFA quirks discovered

## Performance Notes

- Amazon checkout requires fresh auth per order (cached sessions fail)
- Multiple login attempts trigger Arkose Labs CAPTCHA puzzle
- SafeKey CVV verification usually auto-approves
- Playwright headless Chrome stable with stealth plugin (bypasses basic captchas)
- DOMContentLoaded faster than networkidle for Amazon (site never stops requesting)

## Deployment

Scripts deploy to the main OpenClaw instance (port 18789). Backup instance (port 18801) can repair if primary breaks.
