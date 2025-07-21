# FeedbackIt Widget Monorepo

This repository hosts the source code for multiple distribution formats of the FeedbackIt widget. Each package lives in `packages/` and is published independently.

- **react** – React component published as `@feedbackit/widget`.
- **vanilla** – Stand‑alone JS build published as `@feedbackit/widget-html`.
- **wordpress** – WordPress plugin to easily embed the widget.

Use `pnpm` for dependency management and running scripts.

All packages support English and French out of the box. The widget detects the
browser language by default and can be configured explicitly when embedding.
