# Interpretation Authoring

This directory is the authoring source of truth for interpretation copy.

## Structure

- `houses.md`: sign-in-house interpretations grouped by sign
- `planets.md`: planet descriptions, keywords, and planet-in-sign interpretations
- `aspects.md`: aspect metadata plus general and pair-specific interpretations
- `synastry/*.md`: one markdown file per synastry aspect family
- `transits/*.md`: one markdown file per transit aspect family

## Workflow

1. Edit the relevant markdown file.
2. Run `npm run interpretations:build` to regenerate runtime TypeScript.
3. Run `npm run interpretations:audit` to review sparse or repetitive entries.
4. Run targeted tests before committing.

Generated runtime files live under `src/lib/data/interpretations/generated/` and should not be edited by hand.
