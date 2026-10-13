# Generated behavioural tests

This folder was bundled into your artifact ZIP by the Kolosal code-generation
pipeline. It contains replay-mode Vitest tests that verify the generated code
under `app/` against an LLM- or pipeline-authored assertion set.

## Running

```bash
cd tests
npm install
npm test
```

No API keys needed — replay mode reads only the frozen assertions under
`scenarios/<feature>/expected/assertions/`.

## Layout

```
tests/
  helpers/
    assertion-kit.ts     # evaluator dispatch for the canonical check grammar
    fixture-io.ts        # loads code + assertion files
    scenario-runner.ts   # exported entrypoint each <feature>.test.ts calls
  scenarios/
    <feature>/
      expected/
        pseudocode/<swimlane>.md  # pseudocode that drove the codegen
        app/<swimlane>/...        # generated code (duplicate of ../../../app/)
        assertions/<swimlane>.json
        assertions/_cross-swimlane.json
      <feature>.test.ts
```

## Regenerating assertions

Replay mode evaluates whatever JSON is sitting under `expected/assertions/`.
To regenerate with a different model or a different prompt, see the plan at
`scratch-pad/test-assertions-plan-v1.md` in the Kolosal repo.

## Assertion grammar

Each assertion is a JSON object:

```json
{
  "id":        "stable-slug",
  "category":  "structural | behavioural | cross-swimlane",
  "target":    "path/relative/to/expected/app/",
  "check":     "file_exists | source_parses | export_present | ...",
  "args":      { "..." : "..." },
  "rationale": "why this assertion exists"
}
```

Supported `check` values are documented inline in `helpers/assertion-kit.ts`.
