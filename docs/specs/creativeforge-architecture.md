# CreativeForge: Complete Technical & Product Architecture
### AI-Powered Creative Real Estate Financing Platform
*Senior Technical Co-Founder Architecture Document — MVP + Phase 2*

---

## Architecture Summary

CreativeForge is a multi-tenant SaaS built on **Lovable.dev (React/Vite frontend) + Supabase (auth, database, storage, edge functions) + Claude API (AI engine)**. The platform transforms complex creative financing strategies (seller finance, subject-to, lease options, novations, JVs, private money) into a guided, compliance-aware experience for two distinct user personas: self-directed investors and professional deal brokers/packagers.

**Stack at a glance:**
| Layer | Technology |
|---|---|
| Frontend | Lovable.dev → React/Vite/Tailwind, exported to GitHub |
| Auth | Supabase Auth (JWT, RLS, role-based) |
| Database | Supabase PostgreSQL with Row Level Security |
| Storage | Supabase Storage (documents, templates, generated PDFs) |
| AI Engine | Anthropic Claude API via Supabase Edge Functions |
| Background Jobs | Supabase Edge Functions (scheduled + event-driven) |
| Payments | Stripe (subscriptions + usage-based metering) |
| Documents | PandaDoc API (e-signature + template rendering) |
| Property Data | ATTOM Data API or Propstream API |
| Email | Resend or SendGrid via Edge Functions |
| PDF Generation | Puppeteer (in Edge Function) or html-pdf-node |

---

## 1. Product Vision & User Personas

### Core Value Proposition

> "CreativeForge turns complex creative real estate financing into a structured, AI-guided workflow — from deal discovery through executed documents — so investors and brokers can close more deals with less confusion, fewer costly mistakes, and bulletproof paper trails."

The category is new: there's no tool that combines deal structuring AI, financial modeling, compliance guardrails, and document generation for creative financing specifically. TurboTax made tax prep accessible to non-accountants. DealCheck made rental analysis accessible to new investors. CreativeForge does the same for creative financing — a space where the learning curve has historically kept 90% of investors on the sidelines.

---

### Primary User Personas

#### Persona 1: The Independent Investor ("Alex")
- **Who:** Individual investor, 1–10 deals per year, self-directed
- **Skill level:** Intermediate — knows creative financing exists but struggles to execute confidently
- **Pain points:** Overwhelmed by deal structure options, afraid of getting paperwork wrong, no trusted advisor, can't afford a transaction coordinator on every deal
- **Goals:** Find the right structure for each deal, model numbers accurately, generate clean documents, stay compliant
- **Mode:** **Investor Mode** — personal deal management, owns all data
- **Willingness to pay:** $49–$99/month

#### Persona 2: The Deal Broker / Packager ("Jordan")
- **Who:** Wholesaler, creative finance broker, or transaction coordinator handling deals for buyers/sellers/investors
- **Skill level:** Advanced — understands the strategies, needs efficiency and professionalism at scale
- **Pain points:** Managing multiple active deals, tracking fees across deal parties, presenting structured proposals to clients, keeping compliance clean across transactions
- **Goals:** Handle 5–20 concurrent deals, track broker fees, share polished deal packages with clients, build a repeatable business system
- **Mode:** **Broker/Packager Mode** — multi-deal portfolio, client management, fee tracking
- **Willingness to pay:** $149–$299/month

#### Persona 3: The Platform Admin ("You")
- **Who:** Platform operator (you)
- **Goals:** Monitor usage, manage subscriptions, curate prompt packs and templates, flag compliance issues
- **Mode:** **Admin Mode** — full platform visibility

---

### Key Differentiators

1. **Strategy-first AI:** Users describe the deal situation; the AI recommends 2–3 viable strategies with tradeoffs explained in plain English — not just a calculator that requires you to already know the answer.
2. **Prompt Pack System:** Your proprietary deal-structuring logic is encoded as system-level prompt packs, giving CreativeForge an institutional knowledge advantage that generic AI tools lack.
3. **California-first compliance engine:** Built-in awareness of CA-specific requirements (DRE licensing, California Civil Code, SAFE Act nuances, Due-on-Sale risk disclosure requirements) with extensibility to other states.
4. **Broker Mode with fee architecture:** Tracks assignment fees, broker fees, consulting fees, and packaging fees — something no competitor addresses at all.
5. **Document generation that actually works:** Generates deal-specific documents (option agreements, land contracts, novation agreements) pre-populated with deal data, not just generic templates.
6. **Deal Comparison Engine:** Side-by-side comparison of 2–3 strategies on a single property with financial projections for each.

---

## 2. User Flows & Core Features

### Feature Priority Matrix

| Feature | MVP | Phase 2 | Complexity |
|---|---|---|---|
| Onboarding & Mode Selection | ✅ | | Low |
| AI Deal Architect (conversational) | ✅ | | High |
| Financial Modeling & Calculators | ✅ | | Medium |
| Deal Pipeline / Dashboard | ✅ | | Medium |
| Document Template Library | ✅ | | Medium |
| AI Document Generation | ✅ | | High |
| Compliance Disclaimer Engine | ✅ | | Medium |
| Broker Mode + Fee Tracking | ✅ | | Medium |
| E-Signature Integration | | ✅ | High |
| Property Data API Pull | | ✅ | Medium |
| Deal Sharing & Client Portal | | ✅ | High |
| Multi-state Compliance Engine | | ✅ | High |
| Education / Help Center | | ✅ | Low |
| Team/Org Accounts | | ✅ | High |
| API Access for Power Users | | ✅ | High |

---

### 2.1 Onboarding & Dashboard

**Onboarding Flow (First-time user):**
1. Sign up (email/Google OAuth)
2. Mode selection screen: **"I'm investing for myself"** vs **"I'm a broker/deal packager"** — with clear visual differentiation
3. State selection (primary state of operations; defaults to CA)
4. Subscription plan selection (free trial → paid)
5. Guided tour overlay on first dashboard load
6. Prompt: "Start your first deal" → launches AI Deal Architect

**Investor Dashboard (Key Screens):**
- Deal Pipeline view (Kanban: Analyzing → Structuring → Documenting → Closed)
- Recent AI sessions
- Financial summary across portfolio
- Quick action: "New Deal" button
- Compliance alerts sidebar

**Broker Dashboard (Key Screens):**
- All of the above plus:
- Active client deals by stage
- Pending broker fees (projected vs collected)
- Deal Package share links (active/expired)
- Revenue tracker (monthly brokered volume, fees earned)

---

### 2.2 AI Deal Architect (Conversational Wizard)

This is the core differentiator. A multi-step, conversational interface where users describe a deal and the AI structures it.

**User Journey:**
1. User clicks "New Deal" → names the deal (property address or nickname)
2. AI Architect opens in a side-panel chat interface alongside a structured data form
3. **Phase 1 — Deal Intake:** AI asks a guided sequence of questions:
   - What's the situation? (Seller needs to sell, investor wants to acquire, etc.)
   - Property type and estimated value
   - Existing liens / mortgage balance
   - Seller's motivation and timeline
   - Buyer's/investor's goals (cash flow, appreciation, quick flip)
   - Available cash/down payment
4. **Phase 2 — Strategy Recommendation:** AI returns 2–3 recommended structures with:
   - Strategy name and plain-English explanation
   - Why it fits this deal
   - Key risks and mitigations
   - Rough financial projection
   - Compliance flags for their state
5. **Phase 3 — Structure Refinement:** User selects a strategy; AI drills deeper:
   - Specific terms (price, interest rate, payment, balloon, option period, etc.)
   - Positions each party
   - Flags due-on-sale, title, insurance considerations
6. **Phase 4 — Financial Model:** Auto-populates financial calculator with agreed terms; user can adjust
7. **Phase 5 — Document Selection:** AI recommends which documents are needed; user initiates generation
8. **Save & Continue Later:** All sessions saved; user can return to any phase

**Key Screens:**
- Chat panel (left/bottom) + deal data card (right/top)
- Strategy comparison card with 3-column comparison
- Terms negotiation workspace (editable fields with AI commentary)

---

### 2.3 Document & Template Engine

**Template Library:**
- Curated library of creative financing documents:
  - All-Inclusive Trust Deed (AITD) / Wraparound Note
  - Subject-To Agreement + Seller Acknowledgment
  - Lease-Option / Lease-Purchase Agreement
  - Novation Agreement
  - Joint Venture Operating Agreement
  - Private Money Loan Agreement + Note + DOT
  - Option Agreement (standalone)
  - Assignment of Contract
  - Purchase & Sale Agreement (creative terms)
  - Due-on-Sale Disclosure (CA-specific)
  - Broker/Consultant Fee Agreement

**AI Document Generation Flow:**
1. User selects template category
2. System pulls deal data from the current deal record
3. AI fills in deal-specific fields (parties, terms, property, dates)
4. User reviews in document preview
5. User can request AI to "adjust this clause" via inline chat
6. Export as PDF or push to PandaDoc for e-signature

**Template Management (Admin):**
- Admin uploads master templates (DOCX format with merge fields)
- Tag by state, strategy type, and user role
- Version control with change history

---

### 2.4 Financial Modeling & Calculators

**Calculator Suite (all deal data flows in from the AI session):**

| Calculator | Description |
|---|---|
| Seller Finance Analyzer | Monthly payment, balloon, amortization, seller yield, buyer IRR |
| Subject-To Cashflow Model | PITI on existing loan, spread to market rent, equity position |
| Lease-Option Analyzer | Option consideration, monthly credit, strike price, option delta |
| Wrap/AITD Spread Calculator | Underlying vs wrap rate, spread income, risk-adjusted yield |
| JV Split Modeler | Profit split, contributed equity vs sweat equity, waterfall |
| Private Money Deal Analyzer | Points, rate, term, lender yield, borrower all-in cost |
| Novation Break-Even | Holding cost, renovation estimate, resale vs wholesale spread |
| Hybrid Structure Builder | Combine any two strategies, see blended terms and projections |

**Output Views:**
- 10-year cash flow table
- IRR / ROI / Equity Multiple
- Amortization schedule
- Break-even analysis
- Sensitivity table (what if rate goes up 1%? What if occupancy drops to 85%?)

---

### 2.5 Deal Pipeline / Portfolio Management

**Pipeline Views:**
- Kanban board (drag-and-drop stage management)
- List view with sortable columns
- Map view (Phase 2 — using property addresses)

**Deal Record (the central data object):**
- Property details
- All deal parties (buyer, seller, broker, lender, etc.)
- Linked AI sessions
- Financial model snapshot
- Document library for this deal
- Activity log (timestamped)
- Notes (private + shared)
- Stage + status
- Broker fees (Broker Mode only)

**Portfolio Analytics (Phase 2):**
- Total portfolio value
- Aggregate cash flow
- Deals by strategy type
- Success rate by strategy

---

### 2.6 Collaboration & Broker Tools (Broker Mode)

**Deal Sharing:**
- Generate a read-only deal package link (shareable with clients)
- Package includes: deal summary, financial model, strategy rationale, document list
- Expiration date on share links
- View analytics (who opened, when)

**Client Management:**
- Client CRM: name, contact, deals linked
- Activity timeline per client

**Fee Tracking:**
- Add fee type (assignment, consulting, brokering, packaging)
- Status: Projected → Agreed → Invoiced → Collected
- Link fees to specific deal records
- Monthly/quarterly revenue report

**Broker Compliance:**
- Automatic disclaimer injection: "This analysis was prepared by [Broker Name] for informational purposes..."
- DRE license number field (CA) — displayed on all generated documents
- Broker Agreement template included in document library

---

### 2.7 Compliance & Risk Engine

**Per-Deal Compliance Scan:**
After each AI Deal Architect session, the system runs a compliance check:
- Is a real estate license required for this transaction type in this state?
- Are there due-on-sale considerations that must be disclosed?
- Is this a covered loan under HOEPA or Dodd-Frank?
- Does the seller-financing structure trigger SAFE Act (MLO licensing)?
- Are there California-specific disclosures required (TDS, SPQ, etc.)?

**Output:**
- Green/Yellow/Red indicator per compliance category
- Plain-English explanation of each flag
- Recommended action (include disclosure, consult attorney, etc.)
- Links to relevant statutes (displayed but not legal advice)

**Disclaimer System:**
- Every AI output includes a persistent footer: "This analysis is for educational and informational purposes only. It does not constitute legal, financial, or real estate advice. Consult a licensed attorney and real estate professional before executing any transaction."
- Users must acknowledge disclaimer on first use per deal type
- Broker Mode adds additional licensee disclaimers

---

### 2.8 Education / Help Center (Phase 2)

- Strategy explainer library (one page per strategy type)
- Glossary of creative financing terms
- "When to use this strategy" decision matrix
- Video walkthroughs (embedded Loom/YouTube)
- FAQ by user type

---

### 2.9 Admin / Billing

**Admin Dashboard:**
- User management (view, impersonate, suspend)
- Subscription overview (MRR, churn, active trials)
- Template management (upload, version, tag)
- Prompt pack management (upload/edit system prompts)
- Compliance rule editor
- Activity logs and usage metrics

**Billing:**
- Stripe-powered subscriptions
- Plans: Free Trial (3 deals, watermarked docs), Investor ($79/mo), Broker ($199/mo), Team (custom)
- Usage-based metering for AI tokens on high-volume plans
- Annual discount (20%)

---

## 3. Data Architecture (Supabase Schema)

### Core Tables

```sql
-- =============================================
-- USERS & AUTH
-- =============================================

-- Extends Supabase auth.users
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  user_mode TEXT NOT NULL DEFAULT 'investor' CHECK (user_mode IN ('investor', 'broker', 'admin')),
  primary_state TEXT NOT NULL DEFAULT 'CA',
  dre_license_number TEXT,              -- Broker mode: CA DRE license
  company_name TEXT,
  phone TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  onboarding_step INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SUBSCRIPTIONS
-- =============================================

CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  plan_id TEXT NOT NULL,               -- 'free_trial', 'investor', 'broker', 'team'
  status TEXT NOT NULL,                -- 'active', 'past_due', 'canceled', 'trialing'
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  trial_ends_at TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  ai_tokens_used INTEGER DEFAULT 0,
  ai_tokens_limit INTEGER DEFAULT 100000,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- DEALS (Central Object)
-- =============================================

CREATE TABLE public.deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  deal_name TEXT NOT NULL,
  property_address TEXT,
  property_city TEXT,
  property_state TEXT DEFAULT 'CA',
  property_zip TEXT,
  property_type TEXT,                  -- 'sfr', 'multi', 'commercial', 'land'
  property_value NUMERIC(15,2),
  existing_loan_balance NUMERIC(15,2),
  existing_loan_rate NUMERIC(5,3),
  existing_loan_payment NUMERIC(10,2),
  arv NUMERIC(15,2),                   -- After Repair Value
  
  -- Deal stage and status
  stage TEXT NOT NULL DEFAULT 'analyzing' CHECK (
    stage IN ('analyzing', 'structuring', 'documenting', 'under_contract', 'closed', 'dead')
  ),
  status TEXT DEFAULT 'active',
  
  -- Selected strategy (set after AI recommendation)
  selected_strategy TEXT,             -- 'seller_finance', 'subject_to', 'lease_option', etc.
  
  -- Broker mode fields
  is_brokered_deal BOOLEAN DEFAULT FALSE,
  broker_user_id UUID REFERENCES public.profiles(id),
  
  -- Metadata
  notes TEXT,
  tags TEXT[],
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_deals_user_id ON public.deals(user_id);
CREATE INDEX idx_deals_stage ON public.deals(stage);
CREATE INDEX idx_deals_created_at ON public.deals(created_at DESC);

-- =============================================
-- DEAL PARTIES
-- =============================================

CREATE TABLE public.deal_parties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (
    role IN ('seller', 'buyer', 'investor', 'lender', 'broker', 
             'title_company', 'attorney', 'other')
  ),
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company_name TEXT,
  address TEXT,
  entity_type TEXT,                   -- 'individual', 'llc', 'trust', 'corp'
  entity_name TEXT,                   -- If signing as entity
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_deal_parties_deal_id ON public.deal_parties(deal_id);

-- =============================================
-- AI SESSIONS
-- =============================================

CREATE TABLE public.ai_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_type TEXT NOT NULL CHECK (
    session_type IN ('deal_architect', 'document_draft', 'compliance_check', 
                     'strategy_compare', 'custom_query')
  ),
  phase TEXT,                         -- 'intake', 'recommendation', 'refinement', 'modeling', 'document'
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
  
  -- Token usage
  prompt_tokens INTEGER DEFAULT 0,
  completion_tokens INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  
  -- Strategy output
  recommended_strategies JSONB,       -- Array of strategy recommendations from AI
  selected_strategy TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_sessions_deal_id ON public.ai_sessions(deal_id);
CREATE INDEX idx_ai_sessions_user_id ON public.ai_sessions(user_id);

-- =============================================
-- AI MESSAGES (Conversation History)
-- =============================================

CREATE TABLE public.ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.ai_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('system', 'user', 'assistant')),
  content TEXT NOT NULL,
  metadata JSONB,                     -- Phase, extracted data, etc.
  token_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_messages_session_id ON public.ai_messages(session_id);

-- =============================================
-- FINANCIAL MODELS
-- =============================================

CREATE TABLE public.financial_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  model_name TEXT NOT NULL DEFAULT 'Primary Model',
  strategy_type TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT TRUE,
  
  -- Purchase/Acquisition
  purchase_price NUMERIC(15,2),
  down_payment NUMERIC(15,2),
  down_payment_pct NUMERIC(5,2),
  closing_costs NUMERIC(10,2),
  rehab_budget NUMERIC(10,2),
  
  -- Financing Terms
  loan_amount NUMERIC(15,2),
  interest_rate NUMERIC(5,3),
  loan_term_months INTEGER,
  amortization_months INTEGER,
  balloon_months INTEGER,
  monthly_payment NUMERIC(10,2),
  
  -- Seller Finance Specific
  wrap_rate NUMERIC(5,3),             -- For AITD/wrap deals
  underlying_rate NUMERIC(5,3),
  wrap_spread NUMERIC(5,3),
  seller_carry_amount NUMERIC(15,2),
  
  -- Lease Option Specific
  option_consideration NUMERIC(10,2),
  option_period_months INTEGER,
  monthly_rent NUMERIC(10,2),
  monthly_rent_credit NUMERIC(10,2),
  option_strike_price NUMERIC(15,2),
  
  -- Income / Cashflow
  gross_monthly_rent NUMERIC(10,2),
  vacancy_rate NUMERIC(5,2) DEFAULT 5.0,
  gross_monthly_income NUMERIC(10,2),
  monthly_taxes NUMERIC(10,2),
  monthly_insurance NUMERIC(10,2),
  monthly_hoa NUMERIC(10,2),
  monthly_maintenance NUMERIC(10,2),
  monthly_management NUMERIC(10,2),
  
  -- Computed (can be stored or computed on fly)
  net_operating_income NUMERIC(10,2),
  monthly_cashflow NUMERIC(10,2),
  annual_cashflow NUMERIC(10,2),
  cap_rate NUMERIC(5,2),
  cash_on_cash_return NUMERIC(5,2),
  irr_5yr NUMERIC(5,2),
  irr_10yr NUMERIC(5,2),
  equity_multiple NUMERIC(5,2),
  
  -- JV Specific
  jv_split_investor_pct NUMERIC(5,2),
  jv_split_operator_pct NUMERIC(5,2),
  
  -- Broker Fees
  broker_fee_amount NUMERIC(10,2),
  broker_fee_type TEXT,              -- 'flat', 'percentage', 'split'
  
  -- Raw model data for complex scenarios
  model_data JSONB,
  assumptions JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_financial_models_deal_id ON public.financial_models(deal_id);

-- =============================================
-- TEMPLATES
-- =============================================

CREATE TABLE public.templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID REFERENCES public.profiles(id),  -- NULL = platform template
  template_name TEXT NOT NULL,
  template_type TEXT NOT NULL,        -- 'seller_finance_note', 'subject_to_agreement', etc.
  strategy_types TEXT[],              -- Which strategies this applies to
  applicable_states TEXT[],           -- ['CA', 'TX'] or ['*'] for all
  description TEXT,
  instructions TEXT,                  -- For AI document generation
  merge_fields JSONB,                 -- List of required fields + types
  file_path TEXT,                     -- Supabase storage path to DOCX master
  pandadoc_template_id TEXT,          -- If pushed to PandaDoc
  version INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  is_platform_template BOOLEAN DEFAULT TRUE,  -- FALSE = user-uploaded
  requires_attorney_review BOOLEAN DEFAULT FALSE,
  compliance_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- DOCUMENTS (Generated & Uploaded)
-- =============================================

CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  template_id UUID REFERENCES public.templates(id),
  document_name TEXT NOT NULL,
  document_type TEXT NOT NULL,        -- Mirrors template_type
  status TEXT DEFAULT 'draft' CHECK (
    status IN ('draft', 'review', 'sent_for_signature', 'partially_signed', 'executed', 'voided')
  ),
  file_path TEXT,                     -- Supabase storage path
  pandadoc_document_id TEXT,
  pandadoc_status TEXT,
  generated_by_ai BOOLEAN DEFAULT FALSE,
  ai_session_id UUID REFERENCES public.ai_sessions(id),
  merge_data JSONB,                   -- Populated fields used in generation
  notes TEXT,
  executed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_documents_deal_id ON public.documents(deal_id);

-- =============================================
-- BROKER FEES
-- =============================================

CREATE TABLE public.broker_fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
  broker_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  fee_name TEXT NOT NULL,
  fee_type TEXT NOT NULL CHECK (
    fee_type IN ('assignment', 'consulting', 'brokering', 'packaging', 'referral', 'other')
  ),
  amount NUMERIC(10,2) NOT NULL,
  percentage_basis NUMERIC(5,2),      -- If % of purchase price
  status TEXT DEFAULT 'projected' CHECK (
    status IN ('projected', 'agreed', 'invoiced', 'collected', 'disputed', 'waived')
  ),
  payer_party_id UUID REFERENCES public.deal_parties(id),
  due_date DATE,
  collected_date DATE,
  invoice_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_broker_fees_deal_id ON public.broker_fees(deal_id);
CREATE INDEX idx_broker_fees_broker_user_id ON public.broker_fees(broker_user_id);

-- =============================================
-- COMPLIANCE CHECKS
-- =============================================

CREATE TABLE public.compliance_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  check_state TEXT NOT NULL DEFAULT 'CA',
  strategy_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'error')),
  results JSONB,                      -- Array of {category, severity, message, action}
  overall_risk_level TEXT CHECK (overall_risk_level IN ('green', 'yellow', 'red')),
  ai_session_id UUID REFERENCES public.ai_sessions(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_compliance_checks_deal_id ON public.compliance_checks(deal_id);

-- =============================================
-- ACTIVITIES (Audit / Timeline)
-- =============================================

CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,        -- 'deal_created', 'stage_changed', 'document_generated', etc.
  description TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activities_deal_id ON public.activities(deal_id);
CREATE INDEX idx_activities_user_id ON public.activities(user_id);

-- =============================================
-- NOTES
-- =============================================

CREATE TABLE public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_private BOOLEAN DEFAULT TRUE,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- DEAL SHARE LINKS (Broker Mode)
-- =============================================

CREATE TABLE public.deal_share_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  share_token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(24), 'base64'),
  recipient_name TEXT,
  recipient_email TEXT,
  access_level TEXT DEFAULT 'view' CHECK (access_level IN ('view', 'comment')),
  included_sections TEXT[],           -- ['summary', 'financials', 'documents', 'strategy']
  expires_at TIMESTAMPTZ,
  view_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PROMPT PACKS (Admin-managed)
-- =============================================

CREATE TABLE public.prompt_packs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pack_name TEXT NOT NULL,
  strategy_type TEXT,                 -- Which strategy this pack handles (NULL = global)
  pack_type TEXT NOT NULL CHECK (
    pack_type IN ('system', 'intake', 'recommendation', 'refinement', 
                  'compliance', 'document_gen', 'financial_model')
  ),
  state TEXT DEFAULT '*',             -- '*' = all states, 'CA' = California only
  prompt_content TEXT NOT NULL,
  version INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Row Level Security (RLS) Overview

```sql
-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deal_parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broker_fees ENABLE ROW LEVEL SECURITY;
-- (all tables)

-- profiles: users see only their own profile; admins see all
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR 
         EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND user_mode = 'admin'));

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- deals: users see their own deals; brokers see deals they're assigned to
CREATE POLICY "Users see own deals"
  ON public.deals FOR ALL
  USING (
    user_id = auth.uid()
    OR broker_user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND user_mode = 'admin')
  );

-- deal_parties: accessible if user owns the deal
CREATE POLICY "Deal parties visible to deal owner"
  ON public.deal_parties FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM deals 
      WHERE deals.id = deal_parties.deal_id 
      AND (deals.user_id = auth.uid() OR deals.broker_user_id = auth.uid())
    )
  );

-- documents: same as deal ownership
CREATE POLICY "Documents visible to deal owner"
  ON public.documents FOR ALL
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM deals 
      WHERE deals.id = documents.deal_id 
      AND deals.broker_user_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND user_mode = 'admin')
  );

-- Templates: platform templates visible to all authenticated users; user templates only to creator
CREATE POLICY "Templates visible to authenticated users"
  ON public.templates FOR SELECT
  USING (
    auth.role() = 'authenticated' 
    AND (is_platform_template = TRUE OR created_by = auth.uid())
  );

-- Prompt packs: admin only write; all authenticated can read active packs
CREATE POLICY "Prompt packs readable by authenticated"
  ON public.prompt_packs FOR SELECT
  USING (auth.role() = 'authenticated' AND is_active = TRUE);

CREATE POLICY "Prompt packs writable by admin only"
  ON public.prompt_packs FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND user_mode = 'admin'));
```

---

### Key Database Functions

```sql
-- Function to get full deal summary (used for AI context assembly)
CREATE OR REPLACE FUNCTION get_deal_context(p_deal_id UUID)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'deal', to_jsonb(d),
    'parties', (SELECT jsonb_agg(to_jsonb(dp)) FROM deal_parties dp WHERE dp.deal_id = d.id),
    'financial_model', (SELECT to_jsonb(fm) FROM financial_models fm WHERE fm.deal_id = d.id AND fm.is_primary = TRUE LIMIT 1),
    'compliance', (SELECT to_jsonb(cc) FROM compliance_checks cc WHERE cc.deal_id = d.id ORDER BY created_at DESC LIMIT 1),
    'documents', (SELECT jsonb_agg(jsonb_build_object('id', doc.id, 'name', doc.document_name, 'status', doc.status)) FROM documents doc WHERE doc.deal_id = d.id)
  )
  INTO result
  FROM deals d
  WHERE d.id = p_deal_id;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Subscription check helper
CREATE OR REPLACE FUNCTION user_can_create_deal(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  deal_count INTEGER;
  plan TEXT;
BEGIN
  SELECT plan_id INTO plan FROM subscriptions WHERE user_id = p_user_id AND status IN ('active', 'trialing');
  IF plan IS NULL THEN RETURN FALSE; END IF;
  IF plan != 'free_trial' THEN RETURN TRUE; END IF;
  
  SELECT COUNT(*) INTO deal_count FROM deals WHERE user_id = p_user_id AND is_archived = FALSE;
  RETURN deal_count < 3;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 4. Technical Architecture

### Lovable.dev Scope vs Custom Code

| Concern | Lovable.dev | Custom / Edge Functions |
|---|---|---|
| All UI components and pages | ✅ | |
| Supabase client queries (CRUD) | ✅ | |
| State management (Zustand/Context) | ✅ | |
| Routing (React Router) | ✅ | |
| Stripe checkout redirect | ✅ | |
| AI API calls (direct from browser) | ❌ — never expose API keys | ✅ Edge Function |
| PDF generation | ❌ | ✅ Edge Function |
| Document merge (DOCX → PDF) | ❌ | ✅ Edge Function |
| PandaDoc API calls | ❌ | ✅ Edge Function |
| Stripe webhooks | ❌ | ✅ Edge Function |
| Compliance rule engine | ❌ | ✅ Edge Function |
| Scheduled jobs (token reset, expiry) | ❌ | ✅ Edge Function (cron) |
| Email sending | ❌ | ✅ Edge Function |
| Property data API calls | ❌ | ✅ Edge Function |

**The golden rule for Lovable:** UI + data fetching lives in Lovable. Anything requiring secret keys, CPU-intensive processing, or third-party service calls lives in Edge Functions invoked via Supabase client.

---

### Supabase Setup

```
Supabase Project Structure:
├── Auth
│   ├── Email + password
│   ├── Google OAuth
│   ├── Custom JWT claims (user_mode, plan_id)
│   └── Auth hooks: on signup → create profile row
│
├── Database
│   ├── All tables with RLS (see schema above)
│   ├── pg_cron extension (for scheduled jobs)
│   └── Database webhooks → Edge Functions
│
├── Storage Buckets
│   ├── templates/          (private, admin-write, auth-read)
│   ├── documents/          (private, per-user RLS via path)
│   ├── generated-docs/     (private, per-deal RLS)
│   └── user-uploads/       (private, user owns)
│
└── Edge Functions
    ├── ai-chat             (streams Claude responses)
    ├── generate-document   (merges template + deal data → PDF)
    ├── compliance-check    (runs compliance scan for deal)
    ├── stripe-webhook      (handles payment events)
    ├── pandadoc-sync       (creates/updates PandaDoc documents)
    ├── property-lookup     (calls ATTOM or Propstream)
    └── send-email          (Resend API)
```

**Custom JWT Claims (Auth Hook):**
```javascript
// Supabase Auth hook: customize_access_token
const { data: profile } = await supabase
  .from('profiles')
  .select('user_mode')
  .eq('id', user.id)
  .single();

return {
  ...token,
  user_mode: profile.user_mode,   // Available in RLS policies
  plan_id: subscription.plan_id
};
```

---

### AI Integration Strategy

**Architecture: Browser → Edge Function → Claude API → Stream back**

Never call the Claude API directly from the browser. The Edge Function:
1. Receives the user message + session ID
2. Loads conversation history from `ai_messages` table
3. Loads relevant prompt pack(s) from `prompt_packs` table
4. Assembles the full context (system prompt + history + deal data)
5. Calls Claude API with streaming
6. Streams response back to browser via SSE
7. Saves completed message + token count to DB

```javascript
// Edge Function: ai-chat/index.ts (simplified)
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY') });

Deno.serve(async (req) => {
  const { session_id, user_message, deal_id, phase } = await req.json();
  
  // 1. Auth check
  const user = await getAuthUser(req);
  
  // 2. Load conversation history
  const history = await getSessionHistory(session_id);
  
  // 3. Load system prompt for this phase
  const systemPrompt = await assembleSystemPrompt({ phase, deal_id, user });
  
  // 4. Load deal context for AI
  const dealContext = await getDealContext(deal_id);
  
  // 5. Stream from Claude
  const stream = await client.messages.stream({
    model: 'claude-opus-4-5',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [
      ...history,
      { 
        role: 'user', 
        content: `CURRENT DEAL CONTEXT:\n${JSON.stringify(dealContext)}\n\nUSER:\n${user_message}` 
      }
    ]
  });
  
  // 6. Stream back + save on complete
  return new Response(stream.toReadableStream(), {
    headers: { 'Content-Type': 'text/event-stream' }
  });
});
```

---

### Authentication & Authorization

| Role | Access |
|---|---|
| `investor` | Own deals, own documents, templates (read) |
| `broker` | Own deals + brokered deals, client CRM, fee tracking |
| `admin` | Full platform, template management, prompt pack editor |

**Role enforcement:** At the DB layer via RLS (source of truth) + at the UI layer for navigation guards (UX only, never security-critical).

**Multi-tenancy model:** Single-tenant per user, not org-level (Phase 2 adds org/team accounts). All RLS policies key on `auth.uid()`.

---

### File Storage Strategy

```
Supabase Storage Path Conventions:
├── templates/{template_id}/v{version}/master.docx
├── documents/{user_id}/{deal_id}/{document_id}/draft.pdf
├── documents/{user_id}/{deal_id}/{document_id}/executed.pdf
└── user-uploads/{user_id}/misc/{filename}
```

**Storage RLS Policies (Storage Policies):**
- `templates/`: Read for all authenticated; Write for admin only
- `documents/{user_id}/`: Read/write only for matching `user_id`
- Signed URLs for document downloads (1-hour expiry)
- Separate bucket for deal share links (time-limited signed URLs)

---

### Third-Party Integrations

| Service | Purpose | Integration Method |
|---|---|---|
| **Stripe** | Subscriptions, billing | Edge Function webhook + Stripe.js on client |
| **PandaDoc** | E-signature, polished documents | Edge Function only |
| **Anthropic Claude** | AI engine | Edge Function only |
| **Resend** | Transactional email | Edge Function only |
| **ATTOM Data API** | Property data (AVM, liens, ownership) | Edge Function only |
| **Google OAuth** | Social login | Supabase Auth built-in |
| **Puppeteer / Playwright** | PDF generation fallback | Edge Function (Deno-compatible) |

---

## 5. AI System Design

### System Prompt Architecture

The AI system uses a **layered prompt architecture** with 4 layers assembled at runtime:

```
Layer 1: PLATFORM IDENTITY & RULES (static, always included)
  - What CreativeForge is
  - Hard rules: no legal/financial advice, disclaimers
  - Output format requirements (JSON for structured data, markdown for explanations)
  - Hallucination prevention rules

Layer 2: STRATEGY PROMPT PACK (loaded by strategy_type)
  - Deep knowledge pack for the current strategy
  - Your proprietary deal-structuring logic
  - State-specific rules for the user's primary state
  - Common deal structures, terms, and red flags

Layer 3: PHASE PROMPT (loaded by current session phase)
  - 'intake': Question sequencing, what data to extract
  - 'recommendation': How to present options, comparison format
  - 'refinement': Drilling into terms, negotiation framing
  - 'compliance': Compliance check rules and output format
  - 'document_gen': Merge field extraction and document instructions

Layer 4: DEAL CONTEXT (dynamic, loaded per request)
  - Current deal data (property, parties, financial model)
  - Conversation history (last N messages)
  - User mode (investor vs broker)
  - User's state and license info
```

**Assembly Function:**
```javascript
async function assembleSystemPrompt({ phase, deal_id, strategy_type, user }) {
  // Load all active prompt packs for this context
  const packs = await supabase
    .from('prompt_packs')
    .select('prompt_content, pack_type')
    .eq('is_active', true)
    .in('pack_type', ['system', phase])
    .or(`strategy_type.eq.${strategy_type},strategy_type.is.null`)
    .or(`state.eq.${user.primary_state},state.eq.*`);

  return [
    packs.find(p => p.pack_type === 'system')?.prompt_content,
    packs.find(p => p.pack_type === strategy_type)?.prompt_content,
    packs.find(p => p.pack_type === phase)?.prompt_content,
    DISCLAIMER_BLOCK,
    OUTPUT_FORMAT_INSTRUCTIONS[phase]
  ].filter(Boolean).join('\n\n---\n\n');
}
```

---

### Prompt Pack System (Your Proprietary Logic)

Each of your existing prompt packs maps to a `prompt_packs` row:

| Pack Name | `pack_type` | `strategy_type` | `state` |
|---|---|---|---|
| Platform Core Rules | `system` | NULL | `*` |
| CA Creative Finance Fundamentals | `system` | NULL | `CA` |
| Deal Intake Master | `intake` | NULL | `*` |
| Seller Finance Deep Dive | `recommendation` | `seller_finance` | `*` |
| Subject-To Strategy Pack | `recommendation` | `subject_to` | `*` |
| Lease Option Structure Guide | `recommendation` | `lease_option` | `*` |
| Novation Agreement Pack | `recommendation` | `novation` | `*` |
| JV Deal Architecture | `recommendation` | `joint_venture` | `*` |
| Private Money Structure | `recommendation` | `private_money` | `*` |
| CA Compliance Rules | `compliance` | NULL | `CA` |
| CA SAFE Act / DRE Guidance | `compliance` | `seller_finance` | `CA` |
| Document Generation Rules | `document_gen` | NULL | `*` |
| Broker Mode Pack | `system` | NULL | `*` |

**Admin can update prompts without code deployment** — just edit the `prompt_content` field in the admin UI.

---

### Multi-Step Reasoning Flow

```
DEAL ARCHITECT FLOW:

[INTAKE PHASE]
  System: "You are extracting deal parameters. Ask ONE question at a time. 
           Extract and return structured JSON alongside conversational response.
           Required fields: {property_type, value, liens, seller_motivation, 
           buyer_goals, available_cash, timeline}"
  
  → AI asks clarifying questions
  → Edge function extracts structured data from AI response
  → Saves to deals table incrementally
  → Triggers to RECOMMENDATION PHASE when intake_complete = true

[RECOMMENDATION PHASE]  
  System: Seller Finance Pack + CA Compliance Pack
  Context: Fully populated deal data
  Instruction: "Generate exactly 2-3 strategy recommendations. Return as JSON array:
                [{strategy, plain_english_explanation, why_this_fits, 
                  key_risks, compliance_flags, rough_projection}]
                Then provide conversational explanation."
  
  → Parse JSON recommendations → save to ai_sessions.recommended_strategies
  → Render strategy cards in UI
  → User selects strategy → saves to deals.selected_strategy

[REFINEMENT PHASE]
  System: Deep pack for selected strategy only
  Context: Deal data + selected strategy + recommendation output
  Instruction: "Help refine terms. Ask about: [specific term checklist for strategy].
                When terms are agreed, output FINAL_TERMS JSON block."
  
  → Parse FINAL_TERMS → populate financial_models table

[FINANCIAL MODEL PHASE]
  System: Calculator instructions
  Context: Agreed terms
  Instruction: "Calculate all financial metrics. Return FINANCIAL_MODEL JSON with 
                all calculator fields populated. Include 3 sensitivity scenarios."
  
  → Parse → populate/update financial_models table
  → Trigger calculator UI refresh

[COMPLIANCE CHECK PHASE]
  System: CA Compliance Pack (or state-specific)
  Context: Deal data + selected strategy + financial model
  Instruction: "Run compliance check. Return COMPLIANCE_RESULTS JSON array:
                [{category, severity (green/yellow/red), issue, recommendation, 
                  relevant_statute}]. Then explain in plain English."
  
  → Parse → save to compliance_checks table
  → Render compliance dashboard

[DOCUMENT GENERATION PHASE]
  System: Document Gen Pack
  Context: Full deal context
  Instruction: "Extract all merge fields for {template_name}. Return MERGE_FIELDS JSON.
                Flag any fields where data is missing or ambiguous."
  
  → Parse merge fields → call generate-document Edge Function
  → Edge Function fetches template DOCX from Storage
  → Fills merge fields → converts to PDF → saves to Storage
```

---

### Safeguards & Hallucination Prevention

**Structural guardrails in every system prompt:**
```
STRICT RULES - NEVER VIOLATE:
1. NEVER provide specific legal advice. Use: "consult a licensed attorney"
2. NEVER guarantee investment returns. Use: "projections are estimates only"
3. NEVER advise on whether a specific deal IS compliant — only flag considerations
4. When uncertain about a legal or financial fact, say "I'm not certain — please verify with a professional"
5. ALL numbers in financial models must come from user-provided data or clearly labeled assumptions
6. NEVER invent deal parties, property details, or financial figures
7. When generating documents, ONLY populate fields from provided deal data. Leave [FIELD MISSING] for unknown data.
8. California-specific: Never advise on whether a transaction requires an MLO license — flag it and refer to DRE/CFLL
```

**Technical safeguards:**
- Temperature: 0.3 for financial modeling, 0.5 for strategy recommendations, 0.7 for conversational
- JSON schema validation on all structured AI outputs before saving to DB
- Retry with lower temperature if JSON parse fails
- Human-readable fallback if structured extraction fails
- Token budget caps per session phase (prevent runaway costs)

---

## 6. Compliance & Security

### Legal Disclaimer Strategy

**Disclaimer tiers:**

| Tier | Trigger | Content |
|---|---|---|
| Platform-level | Every AI response footer | "For educational purposes only. Not legal/financial advice." |
| Deal-level | First time user opens any deal | Full disclaimer with acknowledgment checkbox |
| Document-level | Every generated document header | "DRAFT - For discussion only. Not legal advice. Have reviewed by attorney." |
| Broker-level | Any broker-mode output | "Prepared by [Broker Name]. Not a licensed attorney or financial advisor." |
| Compliance flag | Yellow/Red flag triggers | Specific statute reference + "consult licensed professional" |

All disclaimer acknowledgments are stored with timestamp in `activities` table.

---

### State-Specific Compliance Engine

**California (MVP — most thorough):**
- Due-on-Sale clause (Garn-St. Germain): Always flagged for Subject-To and wrap deals
- SAFE Act / MLO licensing: Flagged if seller-financed deal involves installment sale by non-owner-occupant doing >3 deals/year
- California Civil Code §2924i: Pre-payment penalty disclosures on seller-financed notes
- California Finance Lenders Law (CFLL): Flagged for private money lending
- DRE licensing: Flagged for broker-mode users negotiating financing terms
- TDS / SPQ requirements: Flagged on every purchase transaction
- One-Action Rule: Flagged for lenders on foreclosure risk

**Other states (Phase 2 — rule-based):**
- Each state gets a `compliance` prompt pack tagged with its state code
- Rules maintained by admin via prompt pack editor
- States prioritized by user demand (TX, FL, AZ likely first after CA)

---

### Data Privacy & Security

**Data classification:**
- Financial model data: Encrypted at rest (Supabase default AES-256), never logged in client console
- Deal party PII (names, contacts): Encrypted at rest, only accessible via RLS
- Generated documents: Private Storage bucket, signed URLs only, 1-hour expiry
- AI conversation history: Stored in DB, not sent to AI provider beyond session context window
- No PHI or SSN collected

**Security practices:**
- All API keys in Supabase Vault (never in client code or `.env` in repo)
- Edge Functions use Supabase service role only for specific operations
- Principle of least privilege on all DB roles
- Rate limiting on AI Edge Function (max N calls per user per hour, enforced at Edge Function level)
- CORS restricted to production domain only
- Content Security Policy headers
- GitHub repo: no secrets in code, no sensitive data in commits

---

## 7. MVP Scope & Roadmap

### MVP Feature List (Build First in Lovable)

| Feature | Priority | Complexity | Time Estimate |
|---|---|---|---|
| Auth (email + Google) | P0 | Low | 1 day |
| Onboarding flow + mode selection | P0 | Low | 2 days |
| Basic dashboard (deals list) | P0 | Low | 2 days |
| New Deal creation form | P0 | Low | 1 day |
| AI Deal Architect (intake + recommendation phases) | P0 | High | 2 weeks |
| Strategy comparison cards | P0 | Medium | 3 days |
| Seller Finance calculator | P0 | Medium | 3 days |
| Subject-To calculator | P0 | Medium | 2 days |
| Lease Option calculator | P0 | Medium | 2 days |
| Template library (read-only, 5 core templates) | P0 | Low | 2 days |
| AI document generation (merge + PDF) | P1 | High | 1 week |
| Compliance check (CA only) | P1 | Medium | 1 week |
| Deal pipeline (Kanban) | P1 | Medium | 3 days |
| Deal parties management | P1 | Low | 2 days |
| Notes & activity log | P1 | Low | 2 days |
| Broker mode + fee tracking | P1 | Medium | 1 week |
| Stripe subscription (3 plans) | P1 | Medium | 3 days |
| Admin panel (basic) | P2 | Medium | 1 week |

**MVP total estimate: 8–10 weeks for a focused team**

### Phase 2 Additions

| Feature | Complexity | Notes |
|---|---|---|
| E-signature via PandaDoc | High | Significant API work |
| Property data lookup (ATTOM) | Medium | Edge Function + UI |
| Deal share links + client portal | High | New auth flow for non-users |
| Portfolio analytics dashboard | Medium | Aggregate queries |
| Multi-state compliance engine | High | Data-driven rule system |
| Map view of portfolio | Medium | Google Maps API |
| Team/org accounts | High | Major schema change |
| Education center | Low | Content + CMS |
| Public API for power users | High | New auth system |
| Hybrid strategy builder | High | Advanced AI prompting |
| Mobile-optimized views | Medium | Responsive polish |

---

## 8. Implementation Guidance for Lovable

### Recommended Project Structure in Lovable

```
src/
├── components/
│   ├── ui/               (shadcn/ui components — Lovable generates these)
│   ├── deals/
│   │   ├── DealCard.tsx
│   │   ├── DealKanban.tsx
│   │   ├── DealParties.tsx
│   │   └── DealStageButton.tsx
│   ├── ai/
│   │   ├── ChatPanel.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── StrategyCard.tsx
│   │   └── ComplianceBadge.tsx
│   ├── calculators/
│   │   ├── SellerFinanceCalc.tsx
│   │   ├── SubjectToCalc.tsx
│   │   ├── LeaseOptionCalc.tsx
│   │   └── CalcResultsTable.tsx
│   ├── documents/
│   │   ├── TemplateLibrary.tsx
│   │   ├── DocumentCard.tsx
│   │   └── DocumentPreview.tsx
│   ├── broker/
│   │   ├── FeeTracker.tsx
│   │   ├── ClientList.tsx
│   │   └── ShareLinkManager.tsx
│   └── layout/
│       ├── Sidebar.tsx
│       ├── TopNav.tsx
│       └── ModeToggle.tsx
│
├── pages/
│   ├── Index.tsx             (landing/marketing)
│   ├── Dashboard.tsx
│   ├── DealDetail.tsx        (tabbed: Overview, AI, Financials, Documents, Compliance)
│   ├── NewDeal.tsx
│   ├── Templates.tsx
│   ├── BrokerPortfolio.tsx   (broker mode only)
│   ├── Settings.tsx
│   ├── Billing.tsx
│   └── Admin.tsx
│
├── hooks/
│   ├── useDeals.ts
│   ├── useAISession.ts       (manages streaming AI chat)
│   ├── useFinancialModel.ts
│   ├── useSubscription.ts
│   └── useCompliance.ts
│
├── lib/
│   ├── supabase.ts           (Supabase client)
│   ├── stripe.ts
│   ├── calculations.ts       (Pure financial math functions)
│   └── formatters.ts
│
└── context/
    ├── AuthContext.tsx
    ├── ModeContext.tsx        (investor vs broker mode)
    └── DealContext.tsx
```

---

### Lovable-Specific Build Approach

**Prompt strategy for Lovable:**

Build screen by screen. Give Lovable precise component specs. Example:

> "Create a React component called `StrategyCard` that accepts props: `{strategy_name: string, plain_english: string, why_it_fits: string, key_risks: string[], compliance_level: 'green'|'yellow'|'red', rough_projection: string}`. It should render as a card with a colored left border based on compliance_level, a strategy name in bold, expandable sections for 'Why this fits' and 'Key Risks', and a 'Select this strategy' button. Use Tailwind and shadcn Card component."

**AI Chat streaming in Lovable:**
Lovable cannot natively implement SSE streaming. Build the chat interface with Lovable (UI), then use a custom `useAISession` hook that calls the Supabase Edge Function with `fetch()` and reads the streaming response:

```typescript
// hooks/useAISession.ts — custom, not Lovable-generated
const sendMessage = async (message: string) => {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/ai-chat`, {
    method: 'POST',
    headers: { 
      Authorization: `Bearer ${session.access_token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ session_id, user_message: message, deal_id, phase })
  });
  
  const reader = response.body?.getReader();
  // Stream into state incrementally
};
```

---

### Lovable Limitations & Workarounds

| Limitation | Workaround |
|---|---|
| Can't store API keys securely | All sensitive calls go through Supabase Edge Functions |
| No SSE/streaming support natively | Custom hook for streaming, UI built in Lovable |
| Complex state management gets messy | Export to GitHub early; use Zustand for complex state |
| Multi-tenant/role routing can get confused | Implement route guards as HOCs in custom code post-export |
| PDF generation impossible in browser | Supabase Edge Function with Puppeteer |
| Complex financial math | Implement in `lib/calculations.ts`, test separately |
| Realtime subscriptions (deal stage updates) | Supabase Realtime — Lovable can scaffold, but test carefully |
| Admin panel complexity | Build admin in a separate Lovable project or post-export custom code |

**GitHub Export Strategy:**
- Export from Lovable to GitHub on Day 1 of serious development
- Use Lovable for UI scaffolding and design iteration
- Use VS Code / Cursor for hooks, Edge Functions, complex logic
- CI/CD: Vercel for frontend, Supabase CLI for Edge Function deployment

---

### Recommended Build Order (Week by Week)

**Week 1–2:** Supabase project setup + schema + auth + profiles + basic dashboard shell in Lovable

**Week 3–4:** AI Deal Architect UI (chat panel + strategy cards) + Edge Function skeleton + intake phase working end-to-end

**Week 5–6:** Recommendation phase + financial calculators + deal data persistence

**Week 7–8:** Document library + AI document generation Edge Function + compliance check

**Week 9–10:** Broker mode + fee tracking + Stripe integration + MVP polish

**Week 11+:** Phase 2 features, user testing, compliance review by CA real estate attorney

---

### Critical Pre-Launch Checklist

- [ ] California real estate attorney review of all platform disclaimers
- [ ] Attorney review of all document templates (especially seller finance note, subject-to agreement)
- [ ] Privacy Policy + Terms of Service written by attorney (emphasize "no legal advice")
- [ ] Stripe subscription tested end-to-end including failed payments and cancellations
- [ ] RLS policies audited — test that user A cannot access user B's data
- [ ] AI output reviewed for hallucination patterns on edge case deals
- [ ] Rate limits on AI Edge Function verified
- [ ] Storage bucket permissions verified (no public access to documents)
- [ ] GDPR/CCPA compliance for CA users (data deletion capability)
- [ ] Error monitoring (Sentry) configured
- [ ] Analytics (PostHog or Mixpanel) for product metrics

---

*Document Version 1.0 — CreativeForge Architecture*
*Built for Lovable.dev + Supabase + Claude API*
