# Agent Memory

## Learned User Preferences

- Do not expose the chat API to external clients; only the website frontend should interact with it. Leave CHAT_API_BEARER_TOKEN empty when the only client is the frontend.
- Nav and subnav need strong hover contrast; subnav text should be visibly lighter on hover.
- Chart labels and text must use theme-aware colors so they are not black in dark mode.
- Analytics, usage telemetry, and other non-critical persistence should fail open: database or connection failures must not surface as user-visible errors or block core flows.

## Learned Workspace Facts

- Chat API is same-origin only by design; bearer token protection is not used when the only client is the app's own frontend.
- Google Search Console HTML-tag verification is driven by `PUBLIC_GOOGLE_SITE_VERIFICATION`; use the token from Search Console, not reCAPTCHA-style site keys.
- Chart save UI treats a chart as already saved only when displayed chart data and birth data match a saved person; shared URL loads must not show “Saved as …” based on `currentChartId` alone.
