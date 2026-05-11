# GoDaddy Custom Domain Setup

## 1. Configure DNS

In your GoDaddy account → DNS Management, set these records:

| Type  | Name | Value                 | TTL |
|-------|------|-----------------------|-----|
| CNAME | www  | rajasekar21.github.io | 1hr |
| A     | @    | 185.199.108.153       | 1hr |
| A     | @    | 185.199.109.153       | 1hr |
| A     | @    | 185.199.110.153       | 1hr |
| A     | @    | 185.199.111.153       | 1hr |

Delete any existing parked-domain A records or GoDaddy forwarding rules before adding these.

---

## 2. Connect the domain to GitHub Pages

1. In GitHub → repository → **Settings → Pages**
2. Under **Custom domain**, enter `www.edwinchelliah.com`
3. Click Save — GitHub verifies the `CNAME` file in the repository (`public/CNAME` contains `www.edwinchelliah.com`)

---

## 3. Enable HTTPS

After DNS propagation (usually 30 minutes to a few hours):

1. Return to Settings → Pages
2. Tick **Enforce HTTPS**
3. GitHub provisions a Let's Encrypt certificate automatically

---

## 4. WWW vs apex

The DNS records above make both `edwinchelliah.com` and `www.edwinchelliah.com` work.
GitHub Pages redirects the apex (`edwinchelliah.com`) to the WWW version automatically
when the CNAME is set to `www.edwinchelliah.com`.

---

## 5. Verify

```bash
nslookup www.edwinchelliah.com   # should resolve to rajasekar21.github.io
nslookup edwinchelliah.com       # should return the four GitHub Pages IPs
```

The live site pages:

| Page | URL |
|------|-----|
| Memorial | https://www.edwinchelliah.com/ |
| Admin | https://www.edwinchelliah.com/admin/ |
| Family upload | https://www.edwinchelliah.com/upload/ |
| QR code | https://www.edwinchelliah.com/qr/ |

---

## 6. Common issues

| Problem | Fix |
|---------|-----|
| DNS still shows GoDaddy parking page | Delete old A records and GoDaddy forwarding/redirect rules |
| HTTPS checkbox is greyed out | Wait for DNS to propagate; re-save the custom domain field |
| Redirect loop | Do not combine GoDaddy web forwarding with GitHub Pages custom domain — use only DNS A/CNAME records |
| `CNAME` file deleted by a build | The file lives in `public/CNAME` and is copied to `out/` on every build automatically |
| `/admin/` or `/upload/` returns 404 | Navigate with trailing slash: `/admin/` not `/admin` |
