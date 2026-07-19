# Lucky Spelling Test project instructions

## Local preview and smoke test

- After every change that affects the generated app, templates, lesson data, or site generator, update `docs/` as needed.
- Start or keep the local preview running at `http://localhost:8000/` using `start-preview.bat`.
- Smoke-test the generated app over HTTP, never through a `file://` URL.
- Use a fresh cache-busting query for the smoke test and verify at least: the page, `app.js`, `styles.css`, the current lesson, the previous lesson, and the Settings screen markers.
- When themes are affected, switch from Pokémon to a non-Pokémon theme and back. On the main screen exactly one lineup must be visible: Pokémon images or the selected collection, never both.
- Leave the preview server running so the user can inspect `http://localhost:8000/`, unless the user asks to stop it.
