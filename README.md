# Activity Schema site

This repository contains the complete Astro website for Activity Schema. The canonical open specification remains in [`ActivitySchema/ActivitySchema`](https://github.com/ActivitySchema/ActivitySchema), including [Specification 2.0](https://github.com/ActivitySchema/ActivitySchema/blob/main/2.0.md) and the [implementation guide](https://github.com/ActivitySchema/ActivitySchema/blob/main/implementation.md).

## Local development

```bash
npm install
npm run dev
```

Before opening a pull request, run:

```bash
npm run check
npm run build
```

## Hosting

The site deploys from `main` to GitHub Pages at <https://polyform-ai.github.io/activityschema-site/>. The deployment build uses that temporary project path until the permanent domain is connected.

The workflow reads two optional GitHub Actions repository variables, which allow the domain to be switched without another code change:

- `ACTIVITY_SCHEMA_SITE_URL` — set to `https://www.activityschema.com` for the custom domain.
- `ACTIVITY_SCHEMA_BASE_PATH` — set to `/` for the custom domain.

Follow [`docs/DOMAIN_CUTOVER.md`](docs/DOMAIN_CUTOVER.md) for the verified 101domain-to-GitHub-Pages cutover. The public compiler and MCP release remains intentionally deferred; its checklist is in [`docs/PUBLIC_COMPILER_RELEASE.md`](docs/PUBLIC_COMPILER_RELEASE.md).

## Canonical resources

- Website guide source: this repository
- Specification: <https://github.com/ActivitySchema/ActivitySchema/blob/main/2.0.md>
- Activity Schema V3 proposal: <https://www.activityschema.com/v3/>
- Implementation guide: <https://github.com/ActivitySchema/ActivitySchema/blob/main/implementation.md>
- Standard repository: <https://github.com/ActivitySchema/ActivitySchema>
- dbt proof of concept: <https://github.com/bcodell/dbt-activity-schema>
