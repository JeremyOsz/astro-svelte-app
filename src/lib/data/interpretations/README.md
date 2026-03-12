# Astrological Interpretations

Runtime interpretation data is generated from markdown authoring files in `content/interpretations/`.

## Workflow

- Edit markdown in `content/interpretations/`
- Run `npm run interpretations:build`
- Review `npm run interpretations:audit`
- Generated runtime files are written to `src/lib/data/interpretations/generated/`

## Runtime API

The public API in `src/lib/data/interpretations/index.ts` is unchanged. Existing imports continue to work because the runtime modules in this directory re-export generated data.
