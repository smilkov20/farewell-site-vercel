# Farewell Wishes — Inensia

A small farewell-card website where colleagues leave wishes for a departing teammate. Built with Next.js; wishes are stored in Vercel Blob so everyone sees the same shared card.

## Personalize

Edit `config.js` — set `COLLEAGUE_NAME` (and the subtitle if you like).

## Deploy to Vercel

### 1. Put the code on GitHub
1. Create a new repository on github.com (private is fine).
2. In this folder run:
   ```
   git init
   git add .
   git commit -m "Farewell site"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

### 2. Import into Vercel
1. Go to https://vercel.com and sign up / log in (easiest with your GitHub account).
2. Click **Add New… → Project**, pick your repository, and click **Import**.
3. Vercel auto-detects Next.js — leave all settings as they are and click **Deploy**.

### 3. Enable Blob storage (required — this is where wishes are saved)
1. In your Vercel project, open the **Storage** tab.
2. Click **Create Database → Blob** (free Hobby tier is enough), give it any name, and **connect it to this project**.
3. This automatically adds the `BLOB_READ_WRITE_TOKEN` environment variable.
4. Go to **Deployments** and click **Redeploy** on the latest deployment so the token takes effect.

### 4. Share
Your site is live at `https://YOUR_PROJECT.vercel.app` — send the link to the team.

## Alternative: deploy without GitHub
Install the Vercel CLI (`npm i -g vercel`), then run `vercel` in this folder and follow the prompts. Steps 3–4 above still apply.

## Run locally (optional)
`npm install` then `npm run dev`. Note: wishes need the Blob token; pull it with `vercel env pull` after step 3, or just test locally for looks only.
