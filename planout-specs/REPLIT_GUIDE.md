# Build with Replit

| | Plan | Who does the work | Automated? |
|---|---|---|---|
| **A. Upload the bundle ZIP** | any (incl. Free) | Replit Agent — or Claude Code in the Repl's Shell | one upload, one sentence |
| **B. Build from your machine over SSH** | Core / Pro (SSH is a paid feature) | a headless agent running in the repl (Claude Code by default) | yes — `REPLIT_SSH_HOST=… ./build.sh` |
| **C. Push the finished app/ to a Replit-linked GitHub repo** | any (incl. Free) | build runs wherever you like; only the *deploy* step touches Replit | pushes automatically — `REPLIT_GIT_REMOTE=… ./build.sh`; a manual Pull + Publish in the repl still finishes it |

Replit's AI Agent is real and works well, but only from inside a Repl —
there is no headless CLI, API or webhook to trigger it from outside (the
published `replit` npm CLI predates Agent and no longer works against
Replit's backend; Replit's docs list Agent triggers as "coming soon"). So
the bundle meets Agent where it lives: it ships a root `replit.md`, which
Agent reads automatically at the start of every conversation.

## A. Upload the bundle ZIP

1. Open **replit.com/import**, choose **ZIP**, and upload this bundle's
   `.zip` exactly as downloaded (≤ 200 MB; it's far smaller). Select
   **Import**. Replit creates a new Repl and Agent prepares the environment.
2. Because `replit.md` is at the root, Agent already knows that
   `spec/AGENTS.md` is the build contract and `app/` is the output. Open
   the Agent chat and say:

   > Build the app: follow spec/AGENTS.md exactly, start to finish.

3. Let Agent run the staged build. It writes `app/` the same way `build.sh`
   does — same spec, same stages, driven by Replit's own AI.

**Prefer Claude Code instead of Replit Agent?** Same upload, then in the
Repl's **Shell** tab:

```bash
npm install -g @anthropic-ai/claude-code
./build.sh
```

with `ANTHROPIC_API_KEY` added as a **Replit Secret** (Tools → Secrets).
`build.sh` detects `claude` on the Repl's PATH and runs the normal local
path — no SSH, no paid plan.

## B. Build from your machine over SSH

Use this when you want to keep driving from your own terminal but have the
build run on Replit's compute.

One-time setup:

1. **Enable SSH on the repl.** In the workspace, open the *SSH* pane (Tools
   → SSH). Replit generates a hostname like `abc123@abc123.kirk.replit.dev`.
2. **Add an SSH key.** Locally:
   ```bash
   ssh-keygen -t ed25519 -f ~/.ssh/replit -q -N ""
   ```
   Paste the contents of `~/.ssh/replit.pub` into the SSH pane's key list.
   Optionally, so plain `ssh` just works, add to `~/.ssh/config`:
   ```
   Host *.replit.dev
     Port 22
     IdentityFile ~/.ssh/replit
     StrictHostKeyChecking accept-new
   ```
3. **Install the agent inside the repl** (its Shell tab):
   ```bash
   npm install -g @anthropic-ai/claude-code
   ```
   and add `ANTHROPIC_API_KEY` as a **Replit Secret** (Tools → Secrets) so
   the key never travels over the command line. Any other headless agent
   works too — see `REPLIT_AGENT_CMD` below.
4. **Check the connection** from your machine:
   ```bash
   ssh -i ~/.ssh/replit abc123@abc123.kirk.replit.dev 'cd workspace && claude --version'
   ```

Then, from this bundle's root:

```bash
REPLIT_SSH_HOST=abc123@abc123.kirk.replit.dev REPLIT_SSH_KEY=~/.ssh/replit ./build.sh
```

`build.sh` will `scp` `spec/` into the repl's `workspace/`, run the agent
there against `spec/AGENTS.md` (streaming its progress to your terminal and
`.build/progress.log`), then `scp` the resulting `app/` back into this
folder. If the SSH run fails for any reason, it falls back to running Claude
Code locally, exactly as it would without `REPLIT_SSH_HOST`.

Knobs (all optional): `REPLIT_SSH_PORT` (22), `REPLIT_SSH_KEY`,
`REPLIT_REMOTE_DIR` (`workspace`), `REPLIT_AGENT_CMD` (defaults to the same
Claude Code command the local path uses; set it to e.g. `gemini -p` to run a
different agent in the repl — its output is streamed raw).

Verify a run really happened in Replit: the banner says
`Source:  replit over ssh (…)`, and the repl's file tree shows `spec/` and
`app/` afterwards.

## C. Push the finished app/ to a Replit-linked GitHub repo

Use this when you want to build wherever you like (locally, in CI, over the
SSH path above) and just get the result showing up in a repl — no SSH, no
paid plan.

One-time setup, in the repl's workspace:

1. Open the **Git** pane (Tools → Git).
2. Click **Create Remote** (Replit creates a new GitHub repo and links it),
   or **Connect Existing** to link one you already have.
3. Make sure you (or a git credential helper) can push to that repo from
   your machine — e.g. bake a PAT into the URL
   (`https://<token>@github.com/you/your-repl.git`) or use an SSH-form
   remote with a key that's already set up for GitHub.

Then, from this bundle's root:

```bash
REPLIT_GIT_REMOTE=https://github.com/you/your-repl.git ./build.sh
```

`build.sh` runs `replit.js` as its last step: it treats `app/` as its own git
repo (initializing one the first time) and force-pushes it to the branch
`REPLIT_GIT_REMOTE` tracks (`REPLIT_GIT_BRANCH`, default `main`). Force-push
because `app/` is regenerated output, not history worth preserving on the
Replit side.

Only `app/` makes this trip — `spec/` stays behind in the bundle. So
`replit.js` also refreshes `app/.design-reference/` from `spec/assets/` and
writes a fresh `app/replit.md` pointing at it before every push. Without
this, the repo Replit ends up with would carry no design reference at all,
and Replit Agent — reading only that repo — would have nothing to match the
UI against on any further change, so it free-styles its own look instead of
the spec's. `replit.md` at the pushed repo's root is what Agent auto-reads
at the start of every conversation there, the same way the bundle root's
does for the ZIP-import path in A.

**This does not by itself make the repl rebuild or redeploy.** Replit does
not (yet) auto-build on a git push — after `replit.js` finishes, open the
repl, **Pull** in the Git pane, then click **Publish**. So this path
automates the "send the package" half; the "build and render" half is still
one Pull + one Publish click in Replit's UI.

## Why there's no fully hands-off Replit path

There's no headless Replit Agent CLI or API to script against — checked
directly: `replit --help` lists only legacy repl-management commands
(`auth`/`bash`/`local`/`run`/`cp`/`exec`/`bulk`), and a real `replit exec`
call against a real, authenticated repl fails outright (HTTP 403). Nor is
there a public endpoint that accepts a package and triggers a build/deploy —
"External access tokens" only authenticate *into* an already-running private
app, and auto-deploy-on-git-push is a Replit roadmap item, not a shipped
feature, as of this writing. If Replit ships either, wire the Agent one in
via `REPLIT_AGENT_CMD` and drop the manual Pull+Publish step from C — no
`build.sh` change needed for the former. Until then: A is one upload plus one
sentence in Agent chat, B is how you script Replit's compute from outside,
and C is how you get a build made elsewhere onto Replit without SSH.
