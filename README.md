# Farewell Wishes — Inensia

A farewell-card website where colleagues leave wishes for a departing teammate. Wishes are stored in this GitHub repo itself (`data/wishes.json`) — every submission creates a commit, so the repo is the database.

## Personalize

Edit `config.js` — set `COLLEAGUE_NAME`.

## Setup

### 1. Push this code to GitHub
```
git init
git add .
git commit -m "Farewell site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```
(If the repo already exists, just replace the files, commit, and push.)

### 2. Create a GitHub token (lets the site write wishes to the repo)
1. GitHub → your avatar → **Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained tokens** → **Generate new token**.
2. Name: anything. Expiration: pick a date after her last day.
3. **Repository access**: "Only select repositories" → choose this repo.
4. **Permissions → Repository permissions → Contents: Read and write.**
5. Generate and copy the token (starts with `github_pat_`).

### 3. Deploy on Vercel
1. vercel.com → **Add New → Project** → import the repo → before deploying, expand **Environment Variables** and add:
   - `GITHUB_REPO` = `YOUR_USERNAME/YOUR_REPO`
   - `GITHUB_TOKEN` = the token from step 2
   - `GITHUB_BRANCH` = `main` (only needed if your branch isn't `main`)
2. Click **Deploy**. (Project already exists? Add the variables in **Settings → Environment Variables**, then **Redeploy**.)

### 4. Share
Site is live at `https://YOUR_PROJECT.vercel.app`.

## Notes
- Every wish is a commit to `data/wishes.json` with message `Add wish from <name> [skip ci]` — the `[skip ci]` stops Vercel from redeploying on each wish.
- To edit or delete a wish, just edit `data/wishes.json` on GitHub and commit.
- Keep the token secret — anyone with it can write to the repo.
