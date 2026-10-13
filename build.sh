#!/usr/bin/env bash
# Auto-build agent runner — double-click or run: ./build.sh
#
# Override defaults via env vars:
#   AGENT_CMD="..."     # the agent CLI invocation. If unset, auto-selected:
#                       # if REPLIT_SSH_HOST is set, the build runs INSIDE
#                       # your repl over Replit's official SSH transport
#                       # (spec/ is synced up, the agent runs there, app/ is
#                       # pulled back); if that fails (or isn't configured),
#                       # local Claude Code is tried next; if nothing works
#                       # the script exits with instructions.
#                       # An explicit AGENT_CMD skips selection entirely and
#                       # is always streamed raw — its output schema is
#                       # unknown to us.
#   CLAUDE_MODEL="..."  # model the auto-selected Claude command runs (default: opus —
#                       # the most capable model, so the build actually completes
#                       # /app/ end-to-end). Set CLAUDE_MODEL=sonnet or =haiku for
#                       # a cheaper, faster build. Ignored if you override AGENT_CMD.
#   MAX_BUDGET_USD="..."# hard spend cap for the auto-selected Claude command, in USD
#                       # (default: 15). The run stops once it has spent ~this
#                       # much. Set MAX_BUDGET_USD=0 (or empty) to disable the cap
#                       # and run uncapped. Ignored if you override AGENT_CMD.
#                       # Note: a cap can end a large build before /app/ is
#                       # finished — raise it (or set 0) if the build is truncated.
#   PROMPT_FILE="..."   # path to the prompt/contract file (default: spec/AGENTS.md).
#                       # For the Replit path keep it under spec/ — that's what
#                       # gets synced to the repl.
#   PROGRESS_LOG="..."  # raw NDJSON event log (default: .build/progress.log)
#
# Replit (see REPLIT_GUIDE.md for the one-time setup):
#   REPLIT_SSH_HOST="..."   # [user]@[host].[cluster].replit.dev — from the
#                           # repl's SSH pane. Setting this turns the Replit
#                           # path on. Paid plans only (Replit gates SSH).
#   REPLIT_SSH_PORT="..."   # default 22
#   REPLIT_SSH_KEY="..."    # identity file, e.g. ~/.ssh/replit. Optional if
#                           # your ~/.ssh/config already maps *.replit.dev.
#   REPLIT_REMOTE_DIR="..." # directory inside the repl, relative to the SSH
#                           # login dir (default: workspace — the repl root).
#   REPLIT_AGENT_CMD="..."  # command to run inside the repl (default: the
#                           # same Claude Code command as the local path, so
#                           # install `claude` in the repl and set
#                           # ANTHROPIC_API_KEY as a Replit Secret). Streamed raw.
#
# Replit deploy (send the finished app/ to Replit so it shows up there):
#   REPLIT_GIT_REMOTE="..."  # GitHub remote URL from the repl's Git pane
#                            # (Tools -> Git -> Create Remote / Connect
#                            # Existing). Setting this runs replit.js as the
#                            # last build step: it force-pushes app/ (as its
#                            # own git repo) to this remote. No public Replit
#                            # API exists for this — git push is the real
#                            # mechanism. After the push, Pull then Publish in
#                            # the repl's Git pane; Replit does not auto-build
#                            # on push (yet). See REPLIT_GUIDE.md.
#   REPLIT_GIT_BRANCH="..."  # branch to push to (default: main) — match what
#                            # the repl's Git pane tracks.
#
# The jq renderer parses Claude Code's `--output-format stream-json` schema
# and only runs for Claude-shaped commands. Any custom AGENT_CMD /
# REPLIT_AGENT_CMD streams stdout raw instead of going silently blank —
# PROGRESS_LOG always has the same raw event stream either way.
#
# Reality check on Replit: Replit Agent is a browser-only product — there is
# no public API, webhook or CLI to trigger the agent from outside a repl
# (the published npm `replit` CLI predates Agent and 403s against today's
# backend). What Replit does officially expose is SSH into a repl, so the
# honest integration is "use the repl as the compute": ship spec/ up, run a
# headless coding agent there, pull app/ back. That is what this path does.
# To drive Replit's own Agent by hand instead, follow REPLIT_GUIDE.md.

set -euo pipefail
cd "$(dirname "$0")"

# Hard spend cap (USD) for the auto-detected Claude agent run. `--max-budget-usd`
# is a native Claude Code print-mode flag; the run stops once it has spent ~this
# much. Set MAX_BUDGET_USD=0 (or empty) to run uncapped. Only applied to the
# auto-detected Claude AGENT_CMD — if you override AGENT_CMD, add your own cap.
#
# The default is a per-project estimate the server substitutes for
# 47 at generation (sized to this bundle's features /
# pseudocode / assets). If this bundle was assembled without the server, the
# placeholder is left as-is; the numeric guard below then falls back to a flat 15.
DEFAULT_BUDGET_USD="47"
case "$DEFAULT_BUDGET_USD" in ''|*[!0-9.]*) DEFAULT_BUDGET_USD="15" ;; esac
MAX_BUDGET_USD="${MAX_BUDGET_USD-$DEFAULT_BUDGET_USD}"
if [ -n "$MAX_BUDGET_USD" ] && [ "$MAX_BUDGET_USD" != "0" ]; then
  BUDGET_FLAG=" --max-budget-usd ${MAX_BUDGET_USD}"
else
  BUDGET_FLAG=""
fi

PROMPT_FILE="${PROMPT_FILE:-spec/AGENTS.md}"
PROGRESS_LOG="${PROGRESS_LOG:-.build/progress.log}"
mkdir -p "$(dirname "$PROGRESS_LOG")"

print_banner() {
  echo "========================================="
  echo "  Code Auto-Builder - ver 0.10"
  echo "========================================="
  echo ""
  echo "  Agent:   $AGENT_CMD"
  echo "  Source:  $AGENT_SOURCE"
  echo "  Prompt:  $PROMPT_FILE"
  echo "  Log:     $PROGRESS_LOG"
  if [ -n "$BUDGET_FLAG" ]; then
    echo "  Budget:  \$${MAX_BUDGET_USD} (set MAX_BUDGET_USD=0 to disable)"
  else
    echo "  Budget:  uncapped"
  fi
  echo ""
  echo "  Steps:"
  echo "    1. Read $PROMPT_FILE and scan project"
  echo "    2. Scaffold app structure"
  echo "    3. Generate code from pseudocode + hints"
  echo "    4. Write UI from .png + .structure.txt"
  echo "    5. Install dependencies"
  echo "    6. Verify dev server starts"
  echo ""
  echo "========================================="
  echo "Starting analysis"
}

# Renders an agent's stdout: through the Claude stream-json jq filter iff
# USE_CLAUDE_RENDERER=1, raw otherwise. Shared by the local and Replit paths.
render_output() {
  if [ "$USE_CLAUDE_RENDERER" = "1" ]; then
    jq --unbuffered -j '
      if .type=="assistant" then
        .message.content[]? |
        if .type=="text" then "\n" + .text + "\n"
        elif .type=="tool_use" then "."
        else empty end
      elif .type=="user" then
        .message.content[]? |
        if .type=="tool_result" then "."
        else empty end
      elif .type=="result" then
        "\n✅ done (cost: $\(.total_cost_usd // 0), tokens: in=\(.usage.input_tokens // 0) out=\(.usage.output_tokens // 0) total=\((.usage.input_tokens // 0) + (.usage.output_tokens // 0)))\n"
      else empty end
    '
  else
    cat
  fi
}

# Runs $AGENT_CMD locally against $PROMPT_FILE. Returns the agent CLI's own
# exit code (via PIPESTATUS[0], not tee's or the renderer's) so callers can
# tell a real failure from a real success.
run_agent() {
  set +e
  $AGENT_CMD "$(cat "$PROMPT_FILE")" | tee "$PROGRESS_LOG" | render_output
  local rc="${PIPESTATUS[0]}"
  set -e
  return "$rc"
}

# Runs $AGENT_CMD inside the repl at $REPLIT_SSH_HOST over Replit's official
# SSH transport: scp spec/ up → ssh in and run the agent from the repl root
# (it reads the synced $PROMPT_FILE there, so no giant prompt goes through
# argv quoting) → scp app/ back. Returns the REMOTE agent's exit code (ssh
# propagates it); a failed upload returns 1 before ssh is ever attempted.
# BatchMode=yes so a missing key fails fast instead of hanging on a password
# prompt; accept-new is what Replit's own SSH docs recommend for ~/.ssh/config.
run_replit_ssh() {
  local port="${REPLIT_SSH_PORT:-22}"
  local rdir="${REPLIT_REMOTE_DIR:-workspace}"
  local key_opt=()
  if [ -n "${REPLIT_SSH_KEY:-}" ]; then key_opt=(-i "$REPLIT_SSH_KEY"); fi
  # ${arr[@]+"${arr[@]}"} — bash 3.2 (macOS) treats an empty array as unbound under set -u.
  local ssh_opts=(${key_opt[@]+"${key_opt[@]}"} -o BatchMode=yes -o StrictHostKeyChecking=accept-new)

  echo "→ syncing spec/ to $REPLIT_SSH_HOST:$rdir/ ..."
  if ! scp -P "$port" "${ssh_opts[@]}" -q -r spec "$REPLIT_SSH_HOST:$rdir/"; then
    echo "✗ could not upload spec/ to the repl." >&2
    return 1
  fi

  set +e
  ssh -p "$port" "${ssh_opts[@]}" "$REPLIT_SSH_HOST" \
    "cd '$rdir' && $AGENT_CMD \"\$(cat '$PROMPT_FILE')\"" \
    | tee "$PROGRESS_LOG" | render_output
  local rc="${PIPESTATUS[0]}"
  set -e
  if [ "$rc" != "0" ]; then return "$rc"; fi

  echo "→ pulling app/ back from $REPLIT_SSH_HOST:$rdir/app ..."
  if ! scp -P "$port" "${ssh_opts[@]}" -q -r "$REPLIT_SSH_HOST:$rdir/app" .; then
    echo "⚠ remote build succeeded but app/ could not be pulled back — it is still in the repl at $rdir/app." >&2
  fi
  return 0
}

# Selection: explicit AGENT_CMD skips everything below (always raw-streamed,
# and — like the pre-fallback script — a failure aborts via `set -e`, no
# fallback for an override you chose yourself). Otherwise, when
# REPLIT_SSH_HOST is set, the build is run inside the repl first; only a real
# failure (checked via run_replit_ssh's actual exit code) falls back to
# local Claude, which is the last resort — its own failure also aborts via
# `set -e`, matching prior behavior.
USE_CLAUDE_RENDERER=0
CLAUDE_CMD="claude -p --model ${CLAUDE_MODEL:-opus} --output-format stream-json --verbose --dangerously-skip-permissions${BUDGET_FLAG}"
if [ -n "${AGENT_CMD:-}" ]; then
  AGENT_SOURCE="custom AGENT_CMD"
  USE_CLAUDE_RENDERER=0
  print_banner
  run_agent
else
  REPLIT_SUCCEEDED=0
  if [ -n "${REPLIT_SSH_HOST:-}" ]; then
    if [ -n "${REPLIT_AGENT_CMD:-}" ]; then
      AGENT_CMD="$REPLIT_AGENT_CMD"
      USE_CLAUDE_RENDERER=0
    else
      AGENT_CMD="$CLAUDE_CMD"
      USE_CLAUDE_RENDERER=1
    fi
    AGENT_SOURCE="replit over ssh ($REPLIT_SSH_HOST)"
    print_banner
    if run_replit_ssh; then
      REPLIT_SUCCEEDED=1
    else
      echo ""
      echo "⚠ replit (ssh) failed — falling back to local claude."
      echo ""
    fi
  fi

  if [ "$REPLIT_SUCCEEDED" != "1" ]; then
    if command -v claude >/dev/null 2>&1; then
      AGENT_CMD="$CLAUDE_CMD"
      AGENT_SOURCE="auto-detected: claude"
      USE_CLAUDE_RENDERER=1
      print_banner
      run_agent
    else
      echo "error: no agent configured." >&2
      echo "Either:" >&2
      echo "  - set REPLIT_SSH_HOST to run the build inside your repl (see REPLIT_GUIDE.md), or" >&2
      echo "  - install Claude Code so \`claude\` is on PATH, or" >&2
      echo "  - set AGENT_CMD to your own agent invocation, e.g. AGENT_CMD=\"gemini -p\" ./build.sh" >&2
      exit 1
    fi
  fi
fi

# ---------------------------------------------------------------------------
# GxP pack — assemble the agent-authored HTML documents into one print-ready
# file under spec/summary: "spec/summary/User Requirements Specification.html".
# No pandoc, no project libraries — the docs ARE HTML; build.sh renders them to
# PDF with a headless browser (system Chrome/Chromium/Edge, or a one-off headless
# Chromium via `npx puppeteer`). The print CSS in _head.html lays it out A4.
# No-op when no spec/GxP was shipped.
# ---------------------------------------------------------------------------
if [ -d spec/GxP ]; then
  HEAD="spec/GxP/assets/_head.html"
  FOOT="spec/GxP/assets/_foot.html"
  if [ -f "$HEAD" ] && [ -f "$FOOT" ]; then
    echo ""
    echo "GxP pack — assembling HTML..."
    mkdir -p spec/GxP/out/html spec/summary
    shopt -s nullglob

    # 1) wrap each authored fragment into a standalone, viewable HTML document
    for f in spec/GxP/src/*.html; do
      base="$(basename "${f%.html}")"
      cat "$HEAD" "$f" "$FOOT" > "spec/GxP/out/html/${base}.html"
      echo "  ✓ ${base}.html"
    done

    # 2) merged deliverable: cover + every document, one per printed page
    out="spec/summary/User Requirements Specification.html"
    title="$(node -p "require('./app/package.json').name" 2>/dev/null || basename "$PWD")"
    {
      cat "$HEAD"
      printf '<div class="cover"><h1>%s</h1><div class="sub">User Requirements Specification &middot; %s</div></div>\n' \
        "$title" "$(date +%Y-%m-%d)"
      for f in spec/GxP/src/*.html; do
        printf '<section class="doc-page">\n'
        cat "$f"
        printf '\n</section>\n'
      done
      cat "$FOOT"
    } > "$out"
    echo "  ✓ merged → $out"

    # 3) render every document AND the merged deliverable to real PDFs. This is
    #    the "browser makes the PDF" step, automated so the files exist without
    #    anyone printing by hand. Per-document PDFs land in spec/GxP/out/pdf/,
    #    the merged deliverable next to its HTML in spec/summary/.
    mkdir -p spec/GxP/out/pdf

    # Collect "html<TAB>pdf" render jobs.
    GXP_JOBS=()
    for f in spec/GxP/out/html/*.html; do
      base="$(basename "${f%.html}")"
      GXP_JOBS+=("$f	spec/GxP/out/pdf/${base}.pdf")
    done
    GXP_JOBS+=("$out	spec/summary/User Requirements Specification.pdf")

    # Find a system Chrome/Chromium/Edge (offline path, no download).
    GXP_BROWSER=""
    for c in google-chrome-stable google-chrome chromium chromium-browser chrome \
             microsoft-edge-stable microsoft-edge brave-browser chrome-headless-shell; do
      if command -v "$c" >/dev/null 2>&1; then GXP_BROWSER="$(command -v "$c")"; break; fi
    done
    if [ -z "$GXP_BROWSER" ]; then
      for p in "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
               "/Applications/Chromium.app/Contents/MacOS/Chromium" \
               "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge" \
               "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"; do
        if [ -x "$p" ]; then GXP_BROWSER="$p"; break; fi
      done
    fi

    # render_with_browser: prints from a space-free temp dir so spaces in the
    # bundle path (e.g. "~/Downloads/02 - Dashboard") never corrupt the file URL.
    render_with_browser() {  # $1=html  $2=pdf
      local td; td="$(mktemp -d)" || return 1
      cp "$1" "$td/page.html"
      local ok=1 mode
      for mode in "--headless=new" "--headless"; do
        if "$GXP_BROWSER" "$mode" --disable-gpu --no-sandbox --no-pdf-header-footer \
             --print-to-pdf="$td/out.pdf" "file://$td/page.html" >/dev/null 2>&1 \
           && [ -s "$td/out.pdf" ]; then ok=0; break; fi
      done
      [ "$ok" -eq 0 ] && mv "$td/out.pdf" "$2"
      rm -rf "$td"
      return "$ok"
    }

    GXP_PDF_OK=0
    if [ -n "$GXP_BROWSER" ]; then
      echo "GxP pack — rendering PDFs via $GXP_BROWSER ..."
      GXP_PDF_OK=1
      for job in "${GXP_JOBS[@]}"; do
        html="${job%%	*}"; pdf="${job##*	}"
        if render_with_browser "$html" "$pdf"; then echo "  ✓ ${pdf}"; else GXP_PDF_OK=0; fi
      done
    fi

    # Fallback: no system browser — render with a one-off headless Chromium via
    # `npx puppeteer` (downloads on first use). pathToFileURL encodes spaces.
    if [ "$GXP_PDF_OK" -ne 1 ]; then
      echo "GxP pack — rendering PDFs via headless Chromium (npx puppeteer) ..."
      if printf '%s\n' "${GXP_JOBS[@]}" | npx --yes -p puppeteer node -e '
        const pptr = require("puppeteer");
        const { pathToFileURL } = require("url");
        const path = require("path");
        const fs = require("fs");
        (async () => {
          const jobs = fs.readFileSync(0, "utf8").split("\n").filter(Boolean)
            .map((l) => { const i = l.indexOf("\t"); return [l.slice(0, i), l.slice(i + 1)]; });
          const b = await pptr.launch({ args: ["--no-sandbox"] });
          for (const [html, pdf] of jobs) {
            const pg = await b.newPage();
            await pg.goto(pathToFileURL(path.resolve(html)).href, { waitUntil: "load" });
            await pg.pdf({ path: pdf, printBackground: true, preferCSSPageSize: true });
            await pg.close();
            console.log("  ✓ " + pdf);
          }
          await b.close();
        })().catch((e) => { console.error("  PDF render failed:", e.message); process.exit(1); });
      '; then GXP_PDF_OK=1; fi
    fi

    if [ "$GXP_PDF_OK" -ne 1 ]; then
      echo "  ⚠ Could not auto-render PDFs (no browser found and npx/puppeteer unavailable)."
      echo "    Open '$out' in a browser and choose Print → \"Save as PDF\"."
    fi

    shopt -u nullglob
  fi
fi

# ---------------------------------------------------------------------------
# Replit deploy — send the finished app/ to Replit. No-op unless
# REPLIT_GIT_REMOTE is set. See replit.js and REPLIT_GUIDE.md for why this is
# a git push (no public Replit API) and what to do in the repl afterward.
# ---------------------------------------------------------------------------
if [ -n "${REPLIT_GIT_REMOTE:-}" ]; then
  echo ""
  echo "Replit deploy — pushing app/ ..."
  # cwd is already the bundle root (see the `cd "$(dirname "$0")"` above),
  # so replit.js sits right next to this script.
  node replit.js
fi
