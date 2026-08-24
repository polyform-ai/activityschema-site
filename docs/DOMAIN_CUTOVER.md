# Move activityschema.com from Webflow to GitHub Pages

## Verified current state

Checked on August 24, 2026:

- Registrar: 101domain GRS Limited.
- Authoritative DNS: `ns1.101domain.com`, `ns2.101domain.com`, and `ns5.101domain.com`.
- `activityschema.com` currently uses Webflow's `75.2.70.75` and `99.83.190.102` A records.
- `www.activityschema.com` currently points to `proxy-ssl.webflow.com`.
- The current production website is still served by Webflow.
- The GitHub Pages site is available at `https://polyform-ai.github.io/activityschema-site/` and does not yet have a custom domain configured.
- The current DNS TTL is approximately six hours.

The lowest-risk cutover is to keep the nameservers at 101domain and change only the website records. Do not move the nameservers to Cloudflare during the same release.

## Before changing DNS

1. Merge and verify the site at `https://polyform-ai.github.io/activityschema-site/`.
2. If the Polyform GitHub organization has not verified `activityschema.com`, complete GitHub's domain-verification TXT-record step first. This does not move website traffic.
3. In **Settings -> Pages**, enter `www.activityschema.com` under **Custom domain** and save it before changing the website DNS records. This repository deploys through GitHub Actions, so a checked-in `CNAME` file is not required.
4. In the GitHub repository, create these Actions variables under **Settings -> Secrets and variables -> Actions -> Variables**:
   - `ACTIVITY_SCHEMA_SITE_URL` = `https://www.activityschema.com`
   - `ACTIVITY_SCHEMA_BASE_PATH` = `/`
5. Run the **Deploy Astro site to GitHub Pages** workflow and confirm the custom-domain build succeeds.
6. If possible, lower the TTL of the existing root A records and `www` CNAME to `300` seconds. Because the current TTL is about six hours, wait at least six hours before the final cutover for the shorter TTL to take full effect.

## Change the DNS records in 101domain

Sign in at `my.101domain.com`, open **Domain Names**, select `activityschema.com`, and choose **Name Servers & Records -> Manage DNS Records**.

Preserve all email and verification records, including MX, TXT, CAA, and unrelated subdomains. Change only the root website records and `www`.

### Remove the Webflow records

- Delete root A record `75.2.70.75`.
- Delete root A record `99.83.190.102`.
- Delete the `www` CNAME pointing to `proxy-ssl.webflow.com`.

### Add the GitHub Pages records

Add these four A records with name `@`:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |

Add this CNAME:

| Type | Name | Value |
| --- | --- | --- |
| CNAME | `www` | `polyform-ai.github.io` |

Do not include `/activityschema-site` in the CNAME value. If 101domain shows a Cloudflare or SWA proxy toggle, use DNS-only/gray until GitHub has issued the HTTPS certificate.

Optional IPv6 records:

| Type | Name | Value |
| --- | --- | --- |
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |

## Verify the cutover

DNS can be checked with:

```sh
dig activityschema.com A +short
dig www.activityschema.com CNAME +short
```

Expected results:

- The apex returns the four `185.199.*.153` GitHub Pages addresses.
- `www` returns `polyform-ai.github.io.`

Then check:

```sh
curl -I https://www.activityschema.com/
curl -I https://activityschema.com/
```

Expected behavior:

- `https://www.activityschema.com/` returns the new Activity Schema site.
- `https://activityschema.com/` redirects to `https://www.activityschema.com/`.
- Assets, navigation, canonical URLs, `robots.txt`, `sitemap.xml`, and the 404 page work from the root domain.

When GitHub makes the option available, enable **Enforce HTTPS** under **Settings -> Pages**. Certificate issuance can take time after DNS changes.

Keep Webflow active for at least 48 hours after the cutover. Once DNS and HTTPS are stable globally, the old Webflow hosting can be disconnected.

## Rollback

If the GitHub Pages site or certificate fails during cutover, restore:

- Root A records: `75.2.70.75` and `99.83.190.102`.
- `www` CNAME: `proxy-ssl.webflow.com`.

The old Webflow site will resume as DNS caches refresh.

## Official references

- [GitHub Pages: Managing a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [GitHub Pages: Securing a site with HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)
- [101domain: Manage DNS resource records](https://help.101domain.com/kb/manage-dns-resource-records)
