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

The site deploys from `main` to GitHub Pages at <https://activityschema.com/>. Because the site uses a custom domain, production builds use the root base path (`/`). `npm run verify:build` confirms that generated Astro asset URLs resolve to files in the deployment artifact.

## Canonical resources

- Website guide source: this repository
- Specification: <https://github.com/ActivitySchema/ActivitySchema/blob/main/2.0.md>
- Implementation guide: <https://github.com/ActivitySchema/ActivitySchema/blob/main/implementation.md>
- Standard repository: <https://github.com/ActivitySchema/ActivitySchema>
