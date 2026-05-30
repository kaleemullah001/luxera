# Luxéra — Premium Affiliate Website

A luxury affiliate product showcase website with a built-in admin dashboard.
No server required. Runs entirely in the browser. Deploy free on GitHub Pages.

---

## 📁 Project Structure

```
luxera/
├── index.html          ← Main website file
├── css/
│   └── style.css       ← All styles (edit to rebrand)
├── js/
│   ├── products.js     ← YOUR PRODUCTS — edit this file!
│   └── app.js          ← Application logic
└── README.md
```

---

## ✏️ How to Add Your Affiliate Products

Open `js/products.js` and add a new block inside the `PRODUCTS_DATA` array:

```js
{
  id: 9,                          // unique number
  brand: "Nike",
  name: "Air Max 2025",
  price: "$180",
  desc: "Revolutionary cushioning for everyday performance.",
  cat: "accessories",             // watches | fragrance | tech | skincare | accessories
  link: "https://nike.com/...",   // ← YOUR REAL AFFILIATE LINK HERE
  commission: "7",                // your commission %
  emoji: "👟",                    // emoji shown on the card
  badge: "New",                   // optional badge (Bestseller, Rare, etc.)
  rating: "4.8",
  live: true
},
```

Save the file and push to GitHub — your site updates automatically.

---

## 🚀 How to Deploy on GitHub Pages (Step-by-Step)

### Step 1 — Create a GitHub Account
Go to https://github.com and sign up (free).

### Step 2 — Create a New Repository
1. Click the **+** button (top right) → **New repository**
2. Repository name: `luxera` (or any name you like)
3. Set it to **Public**
4. Click **Create repository**

### Step 3 — Upload Your Files
**Option A — Upload via GitHub website (easiest):**
1. On your new repo page, click **uploading an existing file**
2. Drag and drop ALL files maintaining the folder structure:
   - `index.html`
   - `css/style.css`
   - `js/products.js`
   - `js/app.js`
3. Scroll down, click **Commit changes**

**Option B — Upload via Git (if you have Git installed):**
```bash
cd luxera
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/luxera.git
git push -u origin main
```

### Step 4 — Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** (top menu)
3. Scroll down to **Pages** (left sidebar)
4. Under **Source**, select **Deploy from a branch**
5. Choose branch: **main** | folder: **/ (root)**
6. Click **Save**

### Step 5 — Get Your Live URL
After 1–2 minutes, your website is live at:
```
https://YOUR_USERNAME.github.io/luxera/
```

That's it! Share this URL with your audience. 🎉

---

## 🔄 Updating Products Later

To add/remove products after publishing:

**Via GitHub website:**
1. Go to your repo → `js/products.js`
2. Click the ✏️ pencil icon to edit
3. Add your new product block
4. Click **Commit changes**
5. Site updates in ~1 minute

**Via Git:**
```bash
# Edit js/products.js locally, then:
git add js/products.js
git commit -m "Add new product"
git push
```

---

## 🎨 Customization

### Change Colors / Branding
Edit `css/style.css` — find the `:root` section at the top:
```css
:root {
  --gold: #c9a84c;      /* Main accent color */
  --dark: #0d0c0a;      /* Page background */
  --cream: #faf8f3;     /* Light text */
}
```

### Change Store Name
- In `index.html`, search for "Luxéra" and replace with your brand name
- In `css/style.css`, the logo styling is under `.nav-logo` and `.footer-logo`

### Add a Custom Domain (optional)
1. Buy a domain (e.g. from Namecheap, GoDaddy)
2. In GitHub repo Settings → Pages → Custom domain, enter your domain
3. Follow GitHub's DNS instructions

---

## 💡 Dashboard Features

| Feature | How to use |
|---|---|
| **Add Product** | Dashboard → Add Product → fill form → Publish |
| **Drag & Arrange** | Dashboard → Drag & Arrange → drag rows → Save Order |
| **Manage Products** | Dashboard → Manage Products → Edit or Remove |
| **Analytics** | Dashboard → Analytics (demo data shown) |
| **Settings** | Dashboard → Settings → toggle display options |

> **Note:** Dashboard changes (added products, order) are saved in your browser's localStorage.
> To make them permanent for all visitors, edit `js/products.js` directly.

---

## 📋 Affiliate Link Tips

- **Amazon Associates:** `https://www.amazon.com/dp/ASIN?tag=YOUR_TAG`
- **ShareASale:** Use the link generator in your ShareASale dashboard
- **Commission Junction:** Generate deep links from the CJ dashboard
- **Direct programs:** Many luxury brands have affiliate programs via Impact or Rakuten

Always disclose affiliate links to your audience (required by FTC guidelines).

---

## 🆓 Free Hosting Alternatives

| Platform | URL format | Notes |
|---|---|---|
| GitHub Pages | `username.github.io/repo` | Recommended — free forever |
| Netlify | `yoursite.netlify.app` | Drag & drop deploy |
| Vercel | `yoursite.vercel.app` | Great for developers |

---

Made with ♦ for premium affiliate marketers.
