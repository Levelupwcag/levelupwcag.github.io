# LevelUp WCAG — Website

Website accessibility fix service for Pakistani small businesses.

---

## Files

```
index.html   — Main page (single page funnel)
styles.css   — All styles
main.js      — Form, nav, FAQ, WhatsApp logic
README.md    — This file
```

---

## Local Run

1. Download all files into one folder
2. Open `index.html` in any browser
3. Done — no server needed

---

## GitHub Pages Deploy

1. Create a new GitHub repository (e.g. `levelupwcag`)
2. Upload all 3 files: `index.html`, `styles.css`, `main.js`
3. Go to repository **Settings**
4. Click **Pages** in left sidebar
5. Under **Source** select **main** branch and **/ (root)** folder
6. Click **Save**
7. Your site will be live at: `https://yourusername.github.io/levelupwcag`

---

## How to Update Contact Details

Open `index.html` and search for:
- `923086324003` — replace with your WhatsApp number
- `levelupwcag@gmail.com` — replace with your email

Open `main.js` and search for:
- `923086324003` — replace with same WhatsApp number

---

## How to Update Case Studies

Open `index.html` and find the `id="results"` section.
Update the Before/After scores and client names directly.

---

## How to Update Pricing

Open `index.html` and search for `Rs. 21,500`.
Replace with new price wherever it appears.

---

## Form Data

When a visitor submits the audit form:
1. Their details are saved in browser localStorage as `levelup_leads`
2. WhatsApp opens with a pre-filled message to your number
3. You receive the lead directly on WhatsApp

---

## WCAG Testing

1. Go to wave.webaim.org
2. Enter your site URL
3. Screenshot the report
4. Fix any red errors first
5. Fix contrast errors second
6. Alerts are optional

---

## Expected Lighthouse Scores

- Accessibility: 95+
- Performance: 85+
- SEO: 90+
- Best Practices: 90+

---

*LevelUp WCAG — Making Pakistani Websites Work For Everyone*
*+92 308 6324003 | levelupwcag@gmail.com*
