# Mahamood T M — Portfolio

Personal portfolio. React (Vite) frontend, Node.js + Express backend, Supabase (PostgreSQL) for storing people who click **I'm interested**. No images: every visual on the page is drawn in code.

```
portfolio/
  client/     React site (Vite)
  server/     Express API
  supabase/   schema.sql for the interests table
```

All text content is in `client/src/data.js`.

## 1. Use your personal GitHub (not the organization)

1. Make a separate SSH key: `ssh-keygen -t ed25519 -C "personal" -f ~/.ssh/id_personal`
2. Add `~/.ssh/id_personal.pub` to GitHub (logged in as Mahamood-tm) under Settings, SSH and GPG keys.
3. Add this to `~/.ssh/config`:
   ```
   Host github-personal
     HostName github.com
     User git
     IdentityFile ~/.ssh/id_personal
     IdentitiesOnly yes
   ```
4. Create an empty repo named `portfolio` on github.com/Mahamood-tm.
5. In this folder:
   ```
   git init
   git config user.name "Mahamood T M"
   git config user.email "your-personal-email"
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin git@github-personal:Mahamood-tm/portfolio.git
   git push -u origin main
   ```

## 2. Set up your own Supabase

1. Sign in to supabase.com with your personal account and create a new organization and a project called `portfolio`.
2. Open SQL Editor, paste `supabase/schema.sql`, and run it.
3. In Project Settings, API, copy the Project URL and the `service_role` key.

## 3. Run locally

Backend:
```
cd server
cp .env.example .env      # fill in SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_KEY
npm install
npm run dev               # http://localhost:4000
```

Frontend (second terminal):
```
cd client
cp .env.example .env      # VITE_API_URL=http://localhost:4000
npm install
npm run dev               # http://localhost:5173
```

Click **I'm interested**, submit the form, and the row appears in Supabase under Table Editor, interests.

## 4. Deploy

Backend on Render (Web Service):
1. New, Web Service, connect the `portfolio` repo from your personal GitHub.
2. Root directory: `server`. Build command: `npm install`. Start command: `npm start`.
3. Environment: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_KEY`, and `CLIENT_ORIGIN` set to your live site URL (for example `https://mahamood.pages.dev`).

Frontend on Cloudflare Pages:
1. Create a project, connect the same repo.
2. Root directory: `client`. Build command: `npm run build`. Output directory: `dist`.
3. Environment variable: `VITE_API_URL` = your Render URL (for example `https://portfolio-api.onrender.com`).

After both are live, make sure `CLIENT_ORIGIN` on Render matches the Pages URL exactly, then redeploy the backend.

## 5. See who is interested

```
curl -H "x-admin-key: YOUR_ADMIN_KEY" https://your-api.onrender.com/api/interests
```
Or open Table Editor, interests in Supabase.

## Notes

- The service role key lives only on the server. Row level security is on with no public policies, so the table cannot be read from the browser.
- The form is rate limited to 5 submissions per IP every 15 minutes and has a hidden honeypot field for bots.
- Render's free tier sleeps when idle, so the first submission after a quiet period can take around 30 seconds.
