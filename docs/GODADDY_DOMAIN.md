# GoDaddy Custom Domain Setup

## Purchase and connect

1. Buy the domain in GoDaddy.
2. In GitHub, open repository Settings -> Pages.
3. Enter the custom domain, for example `example.com`.
4. Save. GitHub will create or expect a `CNAME` file in the published site.

## DNS records

At GoDaddy DNS Management, set these records for the apex domain:

| Type | Name | Value |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | rajasekar21.github.io |

Remove conflicting parked-domain A records.

## WWW and non-WWW

Recommended setup:

- Put `www.example.com` in GitHub Pages custom domain if you prefer WWW.
- Put `example.com` in GitHub Pages custom domain if you prefer apex.
- GitHub Pages will redirect the alternate host when DNS is configured correctly.

## Verification

Use:

```bash
nslookup example.com
nslookup www.example.com
```

Expected apex results are the four GitHub Pages IPs. Expected WWW result is `rajasekar21.github.io`.

## HTTPS

After DNS resolves, return to Settings -> Pages and enable Enforce HTTPS. Certificate provisioning can take minutes to several hours.

## Common issues

- DNS still shows GoDaddy parking: delete old A or forwarding records.
- HTTPS checkbox is disabled: wait, save the domain again, or temporarily remove and re-add it.
- Redirect loop: do not combine GoDaddy web forwarding with GitHub Pages custom domain redirects.
