# Affiliate Tracking — Active Plans

In-progress implementation plans for the Affiliate Tracking feature.

This feature covers: affiliate link CRUD (admin), server-side redirect Route Handler (`/api/affiliate/[linkId]`), click logging to `link_clicks` table, platform enum (tiktok_shop, shopee, lazada, amazon, other), and the affiliate button UI component.

**This feature is financially critical.** Every plan in this folder requires COMPLEX plan shape and must include verification evidence for the click-logging path. Never implement affiliate redirect as client-side only.

Naming: `affiliate-[task]_PLAN_[dd-mm-yy].md`
