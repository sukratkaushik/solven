# Insolvenz-Wächter — Complete Claude Code Build Plan
### For a non-technical founder on Mac

---

## What you're building
A web app where German freelancers add client companies to a watchlist. Every morning, the app checks Germany's official registers for insolvency filings, director changes, and distress signals — then sends an email alert instantly. Subscription: 12 €/month via Stripe.

---

## Your role vs Claude Code's role

| Your job (product director) | Claude Code's job (developer) |
|---|---|
| Decide what to build next | Write all the code |
| Write the prompts describing features | Fix bugs when they appear |
| Test the app and report what's broken | Connect APIs and services |
| Talk to customers | Handle database logic |
| Make product decisions | Deploy and configure |

**Your only technical skills needed:**
1. Open Terminal on your Mac
2. Copy/paste commands Claude Code gives you
3. Paste error messages back and say "fix this"

---

## Tech Stack (Claude Code will set all of this up)

| Layer | Tool | Why |
|---|---|---|
| Frontend | Next.js (React) | Industry standard, Claude Code knows it perfectly |
| Backend | Next.js API routes | Same codebase, no separate server needed |
| Database | Supabase (PostgreSQL) | Free tier, visual dashboard, easy to understand |
| Auth | Supabase Auth | Free, handles email/password + magic links |
| Payments | Stripe | EU/SEPA compliant, excellent subscription handling |
| Email alerts | Resend | Modern email API, 3,000 free emails/month |
| Data source | handelsregister.ai | Structured insolvency API for Germany |
| Scheduling | Vercel Cron Jobs | Free — runs your daily check automatically |
| Hosting | Vercel | Free tier, deploy in 2 minutes from terminal |

**Total monthly cost at launch: ~€15–25**
(Supabase free, Vercel free, Resend free, handelsregister.ai ~€20 at low usage)

---

## One-time Mac setup (do this first — 30 minutes)

Open Terminal (press Cmd+Space, type "Terminal", press Enter) and run these commands one at a time:

```bash
# Install Homebrew (Mac package manager) — if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Install Claude Code (if not already installed via hAIperspace)
npm install -g @anthropic-ai/claude-code

# Verify everything works
node --version    # should show v18 or higher
claude --version  # should show Claude Code version
```

Then sign into Claude Code:
```bash
claude
```
It will open a browser to authenticate. Use your company/hAIperspace credentials.

---

## Account setup checklist (all free to start)

- [ ] **Supabase** — supabase.com → create account → create new project called "insolvenz-waechter"
- [ ] **Stripe** — stripe.com → create account → stay in TEST mode for now
- [ ] **handelsregister.ai** — handelsregister.ai → create account → get API key
- [ ] **Resend** — resend.com → create account → get API key
- [ ] **Vercel** — vercel.com → create account (connect your GitHub)
- [ ] **GitHub** — github.com → create account (Vercel needs this to deploy)

Keep all API keys in a text file called `keys.txt` on your Desktop. You'll paste them into Claude Code.

---

## The Build — 10 Sessions with Claude Code

Each "session" is one focused conversation with Claude Code.
Start each session by opening Terminal, navigating to your project folder, and typing `claude`.

---

### Session 1: Project scaffolding
**Time: 1–2 hours**

Open Terminal. Navigate to where you want your project:
```bash
cd ~/Desktop
mkdir insolvenz-waechter
cd insolvenz-waechter
claude
```

**Prompt to give Claude Code:**
```
Create a new Next.js 14 application with TypeScript and Tailwind CSS called insolvenz-waechter. 

It's a SaaS app for German freelancers to monitor their clients for insolvency risk.

Set up:
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS for styling
- Supabase for database and auth (I'll provide env variables)
- A clean folder structure with /app, /components, /lib folders
- A basic .env.local file template with placeholders for: 
  NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, 
  SUPABASE_SERVICE_KEY, HANDELSREGISTER_API_KEY, 
  STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET,
  RESEND_API_KEY

After setup, show me how to run it locally.
```

**What you'll get:** A running Next.js app at http://localhost:3000. It won't do anything yet — that's fine.

---

### Session 2: Database schema
**Time: 1 hour**

**Prompt to give Claude Code:**
```
Set up the Supabase database schema for Insolvenz-Wächter. 

Create these tables with proper relationships:

1. profiles (extends Supabase auth.users)
   - id (uuid, references auth.users)
   - email (text)
   - full_name (text)
   - stripe_customer_id (text)
   - subscription_status (text: 'free', 'active', 'cancelled', 'past_due')
   - subscription_tier (text: 'free', 'solo', 'team')
   - created_at (timestamp)

2. watchlist
   - id (uuid)
   - user_id (uuid, references profiles)
   - company_name (text)
   - company_id (text) — the handelsregister.ai company identifier
   - company_city (text)
   - legal_form (text) — GmbH, AG, etc.
   - status (text: 'active', 'warning', 'insolvent', 'dissolved')
   - last_checked_at (timestamp)
   - added_at (timestamp)

3. alerts
   - id (uuid)
   - user_id (uuid, references profiles)
   - company_id (text)
   - company_name (text)
   - alert_type (text: 'insolvency', 'director_change', 'late_filing', 'dissolution')
   - details (jsonb)
   - sent_at (timestamp)
   - email_sent (boolean)

Write the SQL migration I should run in Supabase SQL editor, 
plus set up Row Level Security so users can only see their own data.
```

**What to do:** Copy the SQL it gives you → go to supabase.com → your project → SQL Editor → paste and run.

---

### Session 3: Authentication
**Time: 1–2 hours**

**Prompt to give Claude Code:**
```
Build the authentication flow for Insolvenz-Wächter using Supabase Auth.

I need:
1. A sign-up page (/signup) — email + password + full name
2. A login page (/login) — email + password  
3. A "forgot password" flow
4. Auto-create a row in the profiles table when a user signs up
5. Protected routes — if a user isn't logged in and tries to access /dashboard, redirect to /login
6. A simple navbar with: logo "Insolvenz-Wächter", and either Login/Signup buttons (logged out) or user email + Logout (logged in)

The design should be clean and professional. 
Use German language for all user-facing text.
Primary colour: #1D4ED8 (blue).
```

**Test it:** Sign up with your own email. Check Supabase dashboard — you should see a new row in `profiles`.

---

### Session 4: Company search + watchlist
**Time: 2–3 hours**

**Prompt to give Claude Code:**
```
Build the core feature: company search and watchlist management.

1. Create a dashboard page (/dashboard) showing:
   - A summary: "You are watching X companies"
   - A list of all watched companies with: name, city, legal form, current status (colour coded: green=active, amber=warning, red=insolvent)
   - An "Add company" button

2. Create a company search flow:
   - User clicks "Add company"
   - A modal opens with a search input
   - As they type, call the handelsregister.ai search API:
     GET https://handelsregister.ai/api/v1/search-organizations?q={query}&api_key={key}
   - Show results as a list: company name, city, legal form, register number
   - User clicks one to add it to their watchlist
   - Save to the watchlist table in Supabase

3. Free plan limit: maximum 3 companies on the watchlist.
   If user tries to add a 4th, show: "Upgrade to Pro to watch unlimited companies."

4. Add a delete button on each watchlist item.

Use German language for all text.
```

**Test it:** Log in, search for "Volkswagen AG", add it. Check your Supabase watchlist table — the row should appear.

---

### Session 5: handelsregister.ai data fetch + status update
**Time: 2 hours**

**Prompt to give Claude Code:**
```
Build the company data fetching logic.

Create a function in /lib/handelsregister.ts that:
1. Takes a company_id (from our watchlist table)
2. Calls handelsregister.ai API:
   GET https://handelsregister.ai/api/v1/fetch-organization?api_key={key}&q={company_id}&feature=insolvency_publications&feature=publications
3. Returns:
   - Whether insolvency_publications array is non-empty (boolean)
   - The most recent insolvency publication details if any
   - The company's current registered status

Then create an API route at /api/check-company that:
- Takes a company_id
- Calls the above function
- Updates the watchlist row in Supabase with new status and last_checked_at
- If insolvency found: creates a row in the alerts table

Also create a manual "refresh" button on the dashboard that triggers a check for all the user's companies right now (for testing purposes).
```

**Test it:** Add a company, click refresh. Watch the status update in your dashboard and in Supabase.

---

### Session 6: Email alerts
**Time: 1–2 hours**

**Prompt to give Claude Code:**
```
Build the email alert system using Resend.

1. Create an email template for insolvency alerts. 
   It should look professional and urgent. German language. Include:
   - Subject: "⚠️ Insolvenz-Warnung: [Unternehmensname]"
   - Body: company name, what was filed, filing date, insolvency court, case number
   - A link back to the dashboard
   - Footer: "Insolvenz-Wächter · Abo verwalten"

2. Create a function in /lib/email.ts that sends this alert via Resend API

3. Update the /api/check-company route to call this function when a new insolvency is detected

4. Make sure we don't send duplicate alerts — check the alerts table before sending 
   (only send if no alert of same type for same company in last 7 days)

Use my RESEND_API_KEY from .env.local.
Sender: alerts@[my domain] (use resend.dev domain for testing).
```

**Test it:** Claude Code will provide a way to trigger a test alert. Check your inbox.

---

### Session 7: Automated daily check (cron job)
**Time: 1 hour**

**Prompt to give Claude Code:**
```
Set up an automated daily check that runs every morning at 7am CET.

1. Create an API route at /api/cron/daily-check that:
   - Fetches all watchlist entries across ALL users
   - For each entry, checks handelsregister.ai for new insolvency publications
   - Sends email alerts for any new findings
   - Updates last_checked_at timestamps
   - Runs efficiently (add a small delay between API calls to avoid rate limiting)

2. Secure this endpoint with a CRON_SECRET environment variable 
   so only Vercel's cron service can trigger it (not random people)

3. Create a vercel.json file at the project root that schedules this cron:
   - Path: /api/cron/daily-check
   - Schedule: "0 6 * * *" (6am UTC = 7am CET)
   - Add the Authorization header with CRON_SECRET

Add CRON_SECRET to my .env.local template.
```

---

### Session 8: Stripe subscriptions
**Time: 2–3 hours**

**Prompt to give Claude Code:**
```
Integrate Stripe subscriptions.

1. Create two products in Stripe (I'll do this in the Stripe dashboard, 
   just tell me what to create and what Price IDs to add to .env):
   - Solo plan: 12€/month recurring
   - Team plan: 29€/month recurring

2. Build a /pricing page showing the three tiers (Free / Solo 12€ / Team 29€) 
   with a clear feature comparison table. German language.

3. Create an API route /api/stripe/create-checkout that:
   - Creates a Stripe Checkout Session for the selected plan
   - Pre-fills the customer email
   - Sets success_url to /dashboard?upgraded=true
   - Sets cancel_url to /pricing

4. Create a Stripe webhook handler at /api/stripe/webhook that:
   - Handles: checkout.session.completed → update subscription_status to 'active'
   - Handles: customer.subscription.deleted → update to 'cancelled'
   - Handles: invoice.payment_failed → update to 'past_due'

5. On the dashboard, show the current plan and an "Upgrade" button for free users.

6. Gate the "add company" feature: free users max 3, solo max 25, team unlimited.

Use Stripe TEST mode keys for now.
```

**Test it:** Go to /pricing, click upgrade, use Stripe test card 4242 4242 4242 4242. Check your Supabase profiles table — subscription_status should update to 'active'.

---

### Session 9: Deploy to Vercel
**Time: 1 hour**

**Prompt to give Claude Code:**
```
Help me deploy Insolvenz-Wächter to Vercel.

1. First, help me push the code to GitHub:
   - Initialise a git repository
   - Create a .gitignore that excludes .env.local and node_modules
   - Give me the commands to push to a new GitHub repo

2. Then give me step-by-step instructions to:
   - Connect the GitHub repo to Vercel
   - Add all environment variables in the Vercel dashboard 
     (list every single env variable the app needs)
   - Set up the Stripe webhook endpoint pointing to my Vercel URL
   - Test the cron job manually via Vercel dashboard

3. After deployment, what should I test first to confirm everything works live?
```

**After this session:** Your app is live at a public URL. Real people can sign up.

---

### Session 10: Polish before launch
**Time: 2–3 hours**

**Prompt to give Claude Code:**
```
Polish Insolvenz-Wächter for launch. 

1. Landing page (/) — replace the default page with a proper marketing landing page:
   - Headline: "Wisse, bevor dein Kunde nicht zahlen kann."
   - Subheadline: "Insolvenz-Wächter überwacht automatisch die deutschen Handelsregister 
     und warnt dich sofort, wenn ein Kunde Insolvenz anmeldet."
   - 3 feature highlights with icons
   - Pricing section (link to /pricing)
   - A single CTA button: "Kostenlos starten"
   - Clean, professional, German language

2. Onboarding flow — after signup redirect to a simple onboarding page:
   - "Willkommen! Füge deinen ersten Kunden zur Überwachung hinzu."
   - Pre-open the add company modal

3. Empty state — when watchlist is empty, show a helpful message and 
   a big "Ersten Kunden hinzufügen" button instead of a blank table

4. Meta tags — add proper title, description, og:image for SEO and sharing

5. Error handling — if the handelsregister.ai API fails, 
   show a friendly message rather than crashing
```

---

## Switching to live / production

When you have 5 paying test customers and everything works:

**Prompt to give Claude Code:**
```
Help me switch Insolvenz-Wächter from Stripe test mode to live mode.

What environment variables do I need to change in Vercel?
What do I need to set up in the Stripe live dashboard?
Is there anything I should test before announcing?
```

---

## When things break (and they will)

When you see a red error message, do this:

1. Copy the entire error message
2. Open Terminal, navigate to your project, type `claude`
3. Paste the error and say:

```
I got this error in my Insolvenz-Wächter app. 
[paste error here]
This happened when I [describe what you were doing].
Fix it.
```

Claude Code will fix it. This is normal — even professional developers do exactly this.

---

## Total build timeline

| Session | Feature | Time |
|---|---|---|
| 1 | Project setup | 1–2 hrs |
| 2 | Database | 1 hr |
| 3 | Authentication | 1–2 hrs |
| 4 | Watchlist + search | 2–3 hrs |
| 5 | Data fetching | 2 hrs |
| 6 | Email alerts | 1–2 hrs |
| 7 | Daily cron job | 1 hr |
| 8 | Stripe payments | 2–3 hrs |
| 9 | Deploy | 1 hr |
| 10 | Landing page + polish | 2–3 hrs |
| **Total** | | **~15–20 hrs across 2–3 weeks** |

Work on 1–2 sessions per day. Don't rush. Test thoroughly after each session before moving on.

---

## Your first week checklist

- [ ] Day 1: Mac setup + accounts (Supabase, Stripe, handelsregister.ai, Resend, Vercel, GitHub)
- [ ] Day 2: Session 1 — get the app running locally
- [ ] Day 3: Session 2 + 3 — database and auth
- [ ] Day 4: Session 4 — watchlist working
- [ ] Day 5: Session 5 — real data fetching from handelsregister.ai
- [ ] Day 6–7: Rest, test everything so far, note what feels broken

**Milestone: by end of week 1, you should be able to sign up, add a German company, and see its status pulled live from the register.**

---

*Built with Claude Code. Owned by you. Zero vendor lock-in.*
