# QMD Interpretation Workflow

QMD is optional and local to the editor workflow. It is not required for app runtime or CI.

## Suggested Collections

```bash
qmd collection add content/interpretations --name interpretations
qmd collection add content/review-notes --name interpretation-review
```

## Suggested Context

```bash
qmd context add qmd://interpretations "Astrology interpretation source files grouped by family and aspect."
qmd context add qmd://interpretation-review "Editorial audit notes, rewrite guidance, and batch dossiers for interpretation cleanup."
qmd context add qmd://interpretations/synastry "Relationship interpretations with romance, friendship, family, and business variants."
qmd context add qmd://interpretations/transits "Transit interpretation families keyed by transit planet and natal planet."
qmd context add qmd://interpretations/planets.md "Planet descriptions and planet-in-sign interpretations."
qmd context add qmd://interpretations/houses.md "Sign-in-house interpretations that need concise but specific phrasing."
```

## Review Loop

1. Run `npm run interpretations:audit:write`.
2. Open the relevant markdown family file and dossier in QMD.
3. Search for the flagged key, then retrieve stronger nearby examples from the same family.
4. Ask QMD-backed drafting tools for richer alternatives while preserving the family schema.
5. Edit the markdown source manually.
6. Run `npm run interpretations:build` and `npm run interpretations:audit` again.
7. Run targeted tests before committing.

## Good QMD Queries

```bash
qmd query "synastry trine entries that feel specific and emotionally distinct"
qmd query "houses entries with strong sign plus house specificity"
qmd query "transit interpretations avoiding repetitive opening sentences"
qmd search "merge into one powerful force"
qmd search "work together beautifully"
```
