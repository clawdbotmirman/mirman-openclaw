# Coding Agent (Codex/Claude Code)

Run coding agents (Codex, Claude Code, Pi) for development tasks with **PTY mode** enabled.

## Quick Start

**Always use `pty:true`** — coding agents need a pseudo-terminal to work.

```bash
# One-shot task
bash pty:true workdir:~/project command:"codex exec --full-auto 'Your task here'"

# Background (long-running)
bash pty:true workdir:~/project background:true command:"codex exec --full-auto 'Your task'"
```

## Codex Commands

| Task | Command |
|------|---------|
| One-shot | `codex exec "prompt"` |
| Auto-approve | `codex exec --full-auto "prompt"` |
| No sandbox | `codex --yolo "prompt"` |
| Review PR | `codex review --base origin/main` |
| Chat mode | `codex` (interactive) |

## Process Management

Monitor background sessions with `process` tool:

```bash
process action:list                          # All sessions
process action:poll sessionId:XXX             # Is it running?
process action:log sessionId:XXX              # Get output
process action:submit sessionId:XXX data:"yes"  # Send input + Enter
process action:kill sessionId:XXX             # Stop it
```

## Parallel Work (git worktrees)

Fix multiple issues at once:

```bash
# Create worktrees
git worktree add -b fix/issue-78 /tmp/issue-78 main
git worktree add -b fix/issue-99 /tmp/issue-99 main

# Launch Codex in each (background + PTY!)
bash pty:true workdir:/tmp/issue-78 background:true \
  command:"pnpm install && codex --yolo 'Fix issue #78. Commit and push.'"

bash pty:true workdir:/tmp/issue-99 background:true \
  command:"pnpm install && codex --yolo 'Fix issue #99. Commit and push.'"

# Monitor
process action:list
process action:log sessionId:XXX
```

## ⚠️ Rules

1. **Always PTY** — `pty:true` on all coding agent calls
2. **Respect git** — Codex refuses to run outside git repos (use `git init` for scratch)
3. **Workdir matters** — Keep agents focused on their project folder
4. **Don't kill early** — Let agents finish unless stuck (check logs first)
5. **Auto-notify on finish** — Add to prompt: `openclaw system event --text "Done: ..." --mode now`
6. **NEVER in ~/openclaw/** — Agent will read soul.md and get confused about reality

## Examples

**Build a feature:**
```bash
bash pty:true workdir:~/Projects/myapp background:true \
  command:"codex --full-auto exec 'Build dark mode toggle. Tests required.'"
```

**Review a PR:**
```bash
cd ~/Projects/myapp
git fetch origin '+refs/pull/130/head:refs/remotes/origin/pr-130'
bash pty:true workdir:~/Projects/myapp \
  command:"codex review --base origin/main origin/pr-130"
```

**Refactor with notifications:**
```bash
bash pty:true workdir:~/Projects/api background:true \
  command:"codex --yolo exec 'Refactor auth module for readability.
When done, run: openclaw system event --text \"Done: Auth refactored\" --mode now'"
```

---

**Learn more:** `codex help`
