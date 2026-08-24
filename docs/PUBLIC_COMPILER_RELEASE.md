# Public Activity Schema compiler release checklist

This checklist is intentionally deferred. The Activity Schema website can launch without the public compiler or MCP page. Complete these steps before restoring `src/drafts/mcp.astro` as a public route.

Backend, CLI, and Worker commands in this document run from a current checkout of [`polyform-ai/polyform`](https://github.com/polyform-ai/polyform). Website commands run from this repository.

## Current architecture

```text
Website or CLI
  -> api.polyform.ai/activity-schema/*
  -> Cloudflare Worker
  -> api.us.polyform.ai/activity-schema/*
  -> stateless Activity Schema compiler
```

The regional API is intentionally protected by a shared edge secret. Users do not authenticate and must never receive or send that secret; the Cloudflare Worker injects it after removing any client-supplied authorization, cookie, or edge-secret headers.

## Known release blockers

- `polyform-mcp-gateway` has not been deployed to the Polyform Cloudflare account.
- `api.polyform.ai/activity-schema/*` currently falls through to the blanket redirect to `polyform.ai`.
- `MCP_EDGE_ROUTE_REGISTRY_SECRET` is not configured in the `backend_v2` Doppler configurations `dev_local`, `prd_us_gcp`, or `prd_eu_gcp`.
- `infra/cloudflare/mcp-gateway/wrangler.toml` still contains `REPLACE_DURING_DEPLOYMENT` for `MCP_GRANT_ROUTES`. Use the existing production `region-router` KV namespace, not `region-router_preview`.
- The normal Polyform GitHub deployment workflow deploys the GKE application but does not deploy the Cloudflare Worker.
- The Worker also claims `mcp.polyform.ai/*`. Before deploying, either confirm the broader Polyform MCP gateway is ready or split the public Activity Schema routes into a dedicated Worker.

## Local test

Use a development-only value; never reuse the production secret.

1. Set the development backend secret:

   ```sh
   doppler secrets set MCP_EDGE_ROUTE_REGISTRY_SECRET=activity-schema-local-dev \
     --project backend_v2 \
     --config dev_local
   ```

2. Restart the Polyform development environment:

   ```sh
   ./run dev us
   ```

3. In another terminal, run the edge Worker locally:

   ```sh
   cd infra/cloudflare/mcp-gateway
   npm ci
   npx wrangler dev --local --port 8787 \
     --var EDGE_REGISTRY_SECRET:activity-schema-local-dev \
     --var US_ORIGIN:http://127.0.0.1:8001 \
     --var ALLOWED_ACTIVITY_SCHEMA_ORIGINS:http://localhost:4321
   ```

4. Test the public path without an edge-secret header:

   ```sh
   curl -i http://localhost:8787/activity-schema/compile \
     -H 'Content-Type: application/json' \
     --data '{
       "version": "3",
       "dialect": "bigquery",
       "stream": {
         "entity": "customer",
         "schema": "analytics",
         "table": "activity_stream"
       },
       "cohort": {
         "activity": "signed_up",
         "fetch": "all",
         "columns": [{"name": "customer", "type": "string"}]
       },
       "appends": []
     }'
   ```

   Expected result: HTTP `200` and a JSON response containing generated SQL.

5. To test the website against the local Worker:

   ```sh
   PUBLIC_ACTIVITY_SCHEMA_COMPILE_URL=http://localhost:8787 npm run dev
   ```

The released Polyform CLI uses the fixed production URL. Use the website or `curl` for local testing; the CLI will work after the global production route is live.

## Production release order

1. Generate one high-entropy production secret and store the same value as `MCP_EDGE_ROUTE_REGISTRY_SECRET` in both `prd_us_gcp` and `prd_eu_gcp`.
2. Wait for the Doppler operator to update the Kubernetes secrets, then restart the API deployment in both regions. Environment variables are read at process start.
3. Replace the KV placeholder in `wrangler.toml` with the existing production `region-router` namespace ID. Confirm rate-limit namespace IDs `41001` and `41002` are unique in the Cloudflare account.
4. Confirm `api.polyform.ai` is proxied by Cloudflare.
5. Deploy the Worker and `EDGE_REGISTRY_SECRET` together so the first version is fully configured.
6. Exclude `/activity-schema/*` from the blanket `api.polyform.ai` redirect. Do this last so traffic moves only after the protected backend and Worker are ready.
7. Add a dedicated Worker deployment job or documented release process; merging the Polyform repository alone does not deploy this Worker.

## Production verification

- A valid `POST https://api.polyform.ai/activity-schema/compile` returns `200` JSON with SQL.
- `OPTIONS` from `https://www.activityschema.com` returns the expected CORS headers.
- Requests from an unapproved browser origin return `403`.
- Oversized bodies return `413`, invalid media types return `415`, and rate-limit exhaustion returns `429`.
- Direct regional requests without the edge secret return `404` in both US and EU.
- The streamable HTTP MCP endpoint initializes, lists only `compile_activity_schema`, and successfully calls it.
- `polyform activity-schema compile --request-file request.json` succeeds without a Polyform login or environment lookup.
- The Activity Schema website compiler succeeds from its production origin.

Only after all checks pass should the draft MCP page be restored to `src/pages/mcp.astro`, re-added to navigation and discovery files, and published.
