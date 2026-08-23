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

The site deploys from `main` to GitHub Pages at <https://polyform-ai.github.io/activityschema-site/>. The deployment build uses that temporary project path while the permanent domain is being connected.

When the custom domain is ready:

1. Add the domain in the repository's **Settings → Pages** screen.
2. Add `public/CNAME` containing the domain.
3. Change `SITE_URL` in `.github/workflows/deploy-pages.yml` to the custom origin.
4. Change `BASE_PATH` in the workflow to `/`.
5. Update `public/robots.txt` and `public/sitemap.xml` if the final domain differs from `www.activityschema.com`.

## Canonical resources

- Website guide source: this repository
- Specification: <https://github.com/ActivitySchema/ActivitySchema/blob/main/2.0.md>
- Activity Schema V3 proposal: <https://www.activityschema.com/v3/>
- Activity Schema MCP and public compiler: <https://www.activityschema.com/mcp/>
- Implementation guide: <https://github.com/ActivitySchema/ActivitySchema/blob/main/implementation.md>
- Standard repository: <https://github.com/ActivitySchema/ActivitySchema>
- dbt proof of concept: <https://github.com/bcodell/dbt-activity-schema>
