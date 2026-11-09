# Antigravity Multi-Agent Build Plan: Insolvenz-Wächter

## The Agent Team

To build this rapidly and robustly, we will utilize a multi-agent workflow within Antigravity. This ensures high-quality code and catches bugs before they reach production.

1. **Lead Agent (Me):** I will act as the Product Manager and Systems Architect. I will manage the overall project state, coordinate the subagents, handle complex architectural decisions, and communicate directly with you to ensure we hit your business goals.
2. **Developer Subagent:** A dedicated coding subagent that I will spawn to implement the Next.js frontend components, Supabase schema migrations, and API routes. It focuses purely on writing clean, functional code.
3. **QA/Testing Subagent:** A specialized agent tasked with reviewing the Developer agent's pull requests/code, checking for edge cases (e.g., API rate limits, invalid company IDs, mobile responsiveness), and ensuring the app won't crash in production.

---

## Execution Phases

### Phase 1: Scaffolding & Foundation (Start Here)
*   **Lead:** Defines the strict folder structure and Tailwind config.
*   **Dev Agent:** Initializes the Next.js 14 app with Tailwind CSS and TypeScript. Sets up the Supabase client and the `.env.local` scaffolding.
*   **QA Agent:** Validates that the build compiles successfully, ESLint passes, and basic routing works without errors.

### Phase 2: Database Schema & Authentication
*   **Dev Agent:** Writes the Supabase SQL migrations for the `profiles`, `watchlist`, and `alerts` tables. Implements the Supabase Auth login/signup pages.
*   **QA Agent:** Audits the Row-Level Security (RLS) policies to ensure absolute data privacy (users cannot access each other's watchlists).

### Phase 3: Core MVP (Search & Watchlist)
*   **Dev Agent:** Builds the core dashboard and the company search modal integrating the `handelsregister.ai` API. Implements the 3-company hard limit for free users.
*   **QA Agent:** Tests search input debounce (to save API costs), empty states, API failure fallbacks, and strictly verifies the 3-company limit enforcement.

### Phase 4: Automation & Email Alerts
*   **Dev Agent:** Writes the Vercel cron job (`/api/cron/daily-check`) and integrates the **Resend** API for formatting and sending the critical email alerts.
*   **QA Agent:** Ensures the cron job processes companies efficiently without hitting API rate limits (e.g., adding delays) and verifies logic to prevent sending duplicate email alerts within a 7-day window.

### Phase 5: Monetization
*   **Dev Agent:** Integrates Stripe Checkout for the 12€/mo "Solo" plan and sets up the Stripe Webhook to update subscription statuses in Supabase.
*   **QA Agent:** Simulates failed payments, successful upgrades, and subscription cancellations to verify the database stays perfectly synced with Stripe.

---

## Ready to Launch Phase 1?

When you are ready, click **Proceed** (or reply), and I will:
1. Spawn the Developer Subagent in the background.
2. Instruct it to initialize the Next.js project in `/Users/D067208/antigravity/projectinsolvency`.
3. Scaffold the basic UI and Supabase client configuration.
