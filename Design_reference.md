# Modern Design Best Practices

## Philosophy

Create unique, memorable experiences while maintaining consistency through modern design principles. Every project should feel distinct yet professional, innovative yet intuitive.

---

## Landing Pages & Marketing Sites

### Hero Sections
**Go beyond static backgrounds:**
- Animated gradients with subtle movement
- Particle systems or geometric shapes floating
- Interactive canvas backgrounds (Three.js, WebGL)
- Video backgrounds with proper fallbacks
- Parallax scrolling effects
- Gradient mesh animations
- Morphing blob animations


### Layout Patterns
**Use modern grid systems:**
- Bento grids (asymmetric card layouts)
- Masonry layouts for varied content
- Feature sections with diagonal cuts or curves
- Overlapping elements with proper z-index
- Split-screen designs with scroll-triggered reveals

**Avoid:** Traditional 3-column equal grids

### Scroll Animations
**Engage users as they scroll:**
- Fade-in and slide-up animations for sections
- Scroll-triggered parallax effects
- Progress indicators for long pages
- Sticky elements that transform on scroll
- Horizontal scroll sections for portfolios
- Text reveal animations (word by word, letter by letter)
- Number counters animating into view

**Avoid:** Static pages with no scroll interaction

### Call-to-Action Areas
**Make CTAs impossible to miss:**
- Gradient buttons with hover effects
- Floating action buttons with micro-interactions
- Animated borders or glowing effects
- Scale/lift on hover
- Interactive elements that respond to mouse position
- Pulsing indicators for primary actions

---

## Dashboard Applications

### Layout Structure
**Always use collapsible side navigation:**
- Sidebar that can collapse to icons only
- Smooth transition animations between states
- Persistent navigation state (remember user preference)
- Mobile: drawer that slides in/out
- Desktop: sidebar with expand/collapse toggle
- Icons visible even when collapsed

**Structure:**
```
/dashboard (layout wrapper with sidebar)
  /dashboard/overview
  /dashboard/analytics
  /dashboard/settings
  /dashboard/users
  /dashboard/projects
```

All dashboard pages should be nested inside the dashboard layout, not separate routes.

### Data Tables
**Modern table design:**
- Sticky headers on scroll
- Row hover states with subtle elevation
- Sortable columns with clear indicators
- Pagination with items-per-page control
- Search/filter with instant feedback
- Selection checkboxes with bulk actions
- Responsive: cards on mobile, table on desktop
- Loading skeletons, not spinners
- Empty states with illustrations or helpful text

**Use modern table libraries:**
- TanStack Table (React Table v8)
- AG Grid for complex data
- Data Grid from MUI (if using MUI)

### Charts & Visualizations
**Use the latest charting libraries:**
- Recharts (for React, simple charts)
- Chart.js v4 (versatile, well-maintained)
- Apache ECharts (advanced, interactive)
- D3.js (custom, complex visualizations)
- Tremor (for dashboards, built on Recharts)

**Chart best practices:**
- Animated transitions when data changes
- Interactive tooltips with detailed info
- Responsive sizing
- Color scheme matching design system
- Legend placement that doesn't obstruct data
- Loading states while fetching data

### Dashboard Cards
**Metric cards should stand out:**
- Gradient backgrounds or colored accents
- Trend indicators (↑ ↓ with color coding)
- Sparkline charts for historical data
- Hover effects revealing more detail
- Icon representing the metric
- Comparison to previous period

---

## Color & Visual Design

### Color Palettes
**Create depth with gradients:**
- Primary gradient (not just solid primary color)
- Subtle background gradients
- Gradient text for headings
- Gradient borders on cards
- Elevated surfaces for depth

**Color usage:**
- 60-30-10 rule (dominant, secondary, accent)
- Consistent semantic colors (success, warning, error)
- Accessible contrast ratios (WCAG AA minimum)

### Typography
**Create hierarchy through contrast:**
- Large, bold headings (48-72px for heroes)
- Clear size differences between levels
- Variable font weights (300, 400, 600, 700)
- Letter spacing for small caps
- Line height 1.5-1.7 for body text
- Inter, Poppins, or DM Sans for modern feel

### Shadows & Depth
**Layer UI elements:**
- Multi-layer shadows for realistic depth
- Colored shadows matching element color
- Elevated states on hover
- Neumorphism for special elements (sparingly)

---

## Interactions & Micro-animations

### Button Interactions
**Every button should react:**
- Scale slightly on hover (1.02-1.05)
- Lift with shadow on hover
- Ripple effect on click
- Loading state with spinner or progress
- Disabled state clearly visible
- Success state with checkmark animation

### Card Interactions
**Make cards feel alive:**
- Lift on hover with increased shadow
- Subtle border glow on hover
- Tilt effect following mouse (3D transform)
- Smooth transitions (200-300ms)
- Click feedback for interactive cards

### Form Interactions
**Guide users through forms:**
- Input focus states with border color change
- Floating labels that animate up
- Real-time validation with inline messages
- Success checkmarks for valid inputs
- Error states with shake animation
- Password strength indicators
- Character count for text areas

### Page Transitions
**Smooth between views:**
- Fade + slide for page changes
- Skeleton loaders during data fetch
- Optimistic UI updates
- Stagger animations for lists
- Route transition animations

---

## Mobile Responsiveness

### Mobile-First Approach
**Design for mobile, enhance for desktop:**
- Touch targets minimum 44x44px
- Generous padding and spacing
- Sticky bottom navigation on mobile
- Collapsible sections for long content
- Swipeable cards and galleries
- Pull-to-refresh where appropriate

### Responsive Patterns
**Adapt layouts intelligently:**
- Hamburger menu → full nav bar
- Card grid → stack on mobile
- Sidebar → drawer
- Multi-column → single column
- Data tables → card list
- Hide/show elements based on viewport

---

## Loading & Empty States

### Loading States
**Never leave users wondering:**
- Skeleton screens matching content layout
- Progress bars for known durations
- Animated placeholders
- Spinners only for short waits (<3s)
- Stagger loading for multiple elements
- Shimmer effects on skeletons

### Empty States
**Make empty states helpful:**
- Illustrations or icons
- Helpful copy explaining why it's empty
- Clear CTA to add first item
- Examples or suggestions
- No "no data" text alone

---

## Unique Elements to Stand Out

### Distinctive Features
**Add personality:**
- Custom cursor effects on landing pages
- Animated page numbers or section indicators
- Unusual hover effects (magnification, distortion)
- Custom scrollbars
- Glassmorphism for overlays
- Animated SVG icons
- Typewriter effects for hero text
- Confetti or celebration animations for actions

### Interactive Elements
**Engage users:**
- Drag-and-drop interfaces
- Sliders and range controls
- Toggle switches with animations
- Progress steps with animations
- Expandable/collapsible sections
- Tabs with slide indicators
- Image comparison sliders
- Interactive demos or playgrounds

---

## Consistency Rules

### Maintain Consistency
**What should stay consistent:**
- Spacing scale (4px, 8px, 16px, 24px, 32px, 48px, 64px)
- Border radius values
- Animation timing (200ms, 300ms, 500ms)
- Color system (primary, secondary, accent, neutrals)
- Typography scale
- Icon style (outline vs filled)
- Button styles across the app
- Form element styles

### What Can Vary
**Project-specific customization:**
- Color palette (different colors, same system)
- Layout creativity (grids, asymmetry)
- Illustration style
- Animation personality
- Feature-specific interactions
- Hero section design
- Card styling variations
- Background patterns or textures

---

## Technical Excellence

### Performance
- Optimize images (WebP, lazy loading)
- Code splitting for faster loads
- Debounce search inputs
- Virtualize long lists
- Minimize re-renders
- Use proper memoization

### Accessibility
- Keyboard navigation throughout
- ARIA labels where needed
- Focus indicators visible
- Screen reader friendly
- Sufficient color contrast
- Respect reduced motion preferences

---

## Key Principles

1. **Be Bold** - Don't be afraid to try unique layouts and interactions
2. **Be Consistent** - Use the same patterns for similar functions
3. **Be Responsive** - Design works beautifully on all devices
4. **Be Fast** - Animations are smooth, loading is quick
5. **Be Accessible** - Everyone can use what you build
6. **Be Modern** - Use current design trends and technologies
7. **Be Unique** - Each project should have its own personality
8. **Be Intuitive** - Users shouldn't need instructions


---

# Project-Specific Customizations

**IMPORTANT: This section contains the specific design requirements for THIS project. The guidelines above are universal best practices - these customizations below take precedence for project-specific decisions.**

## User Design Requirements

# ConverseForms - Development Blueprint

## Project Concept
ConverseForms is an AI-first form builder that converts static forms into conversational AI agents. Users (product, marketing, and sales teams) create "agents" that specify fields to collect, validations, persona/instructions, appearance, and optional contextual knowledge (FAQs, product docs). Each agent publishes to a public URL that opens a full-page chat where an LLM-guided agent collects required fields via natural dialogue, stores full transcripts and structured answers as sessions, and can forward session data to external systems via webhooks. The backend orchestrates the LLM, deterministic form state, validation engine, knowledge retrieval, and session persistence, while the frontend provides an Agent Builder UI, Dashboard, Public Chat UI, and Admin tools. The vision is to make lead capture richer, more human, and easier to deploy than traditional forms or full chatbot platforms.

## Problem Statement
- Core problems:
  - Traditional multi-step forms are rigid, impersonal, and yield low completion and poor-quality lead data.
  - Teams lack a simple way to deploy a conversational lead capture flow without custom engineering.
  - LLMs can converse but often produce hallucinations or fail to respect strict validation rules when used client-side.
  - Integrations and reliable delivery of captured data to CRMs/webhooks require infrastructure (retries, signing, DLQ).
- Who experiences these problems:
  - Product & marketing teams needing higher-quality leads.
  - Sales teams requiring richer qualification without extra dev work.
  - SMBs/startups lacking engineering resources to build chat-first capture.
  - Admins/operators who need monitoring, auditing, and delivery reliability.
- Why these problems matter:
  - Poor capture reduces lead conversion, wastes ad spend, and creates manual qualification burden.
  - Hallucinating LLMs or client-side validation breaks data integrity and harms trust.
  - Lack of integration reliability means missed leads and operational overhead.
- Current gaps without this solution:
  - No lightweight product that combines deterministic server-side field collection with LLM conversation, public links, persona/appearance controls, and production-grade webhooks + analytics.

## Solution
- How application addresses problems:
  - Provides a no-code Agent Builder to define fields, validations, persona, appearance, and attach knowledge.
  - Uses server-side LLM orchestration plus a deterministic validation state machine to collect fields reliably via conversational prompts.
  - Exposes each agent via a public URL so non-technical users can deploy conversational capture immediately.
  - Persists complete session transcripts and structured field data; supports exports and webhooks with signing, retries, and DLQs for reliability.
  - Offers dashboard, admin console, billing, and templates to accelerate onboarding and monetization.
- Approach & methodology:
  - Server-authoritative state machine to enforce required fields, validation, and ordering.
  - Deterministic prompt templating that combines persona + context + current state; server-side validation prevents hallucination-driven invalid data.
  - Streaming interfaces (SSE/WebSocket) to deliver assistant messages in real-time with polling fallbacks.
  - Vector DB for knowledge retrieval and caching; S3 for asset storage; SendGrid/Stripe integrations.
  - RBAC, auditing, and admin tooling to operate multi-tenant orgs.
- Key differentiators:
  - Chat-first, public-link lead capture focused on strict field collection and export reliability.
  - Persona + contextual knowledge attachments per agent enabling helpful, brand-aligned conversation.
  - Server-side deterministic validation engine and replayable session transcripts with replay/debug capabilities.
- Value creation for users:
  - Higher conversion and richer qualification from conversational flows.
  - Rapid deployment via public links and templates.
  - Reliable integrations and auditability for downstream systems and compliance.

## Requirements

### 1. Pages (UI Screens)
- Landing Page
  - Purpose: Marketing, conversion, demo agent access.
  - Key sections: Hero with Try Demo CTA, live demo link to public chat, features overview, pricing teaser, testimonials, footer with legal links.
  - Contribution: Converts visitors to sign-ups and demonstrates public agent behavior.

- Login / Signup Page
  - Purpose: Authentication entry for new and returning users.
  - Key sections: Tabbed login/signup or separate routes, email/password fields, SSO buttons (Google/Microsoft/GitHub), password strength, privacy notice.
  - Contribution: Secure onboarding and account creation for agent creators.

- Password Reset Page
  - Purpose: Secure password recovery.
  - Key sections: Request reset email, token-based reset form with password policy, success/error states.
  - Contribution: Account recovery and security.

- Email Verification Page
  - Purpose: Confirm user emails.
  - Key sections: Token status, resend verification, next-step CTA.
  - Contribution: Verifies identity and ensures deliverability.

- Dashboard
  - Purpose: Workspace overview for agents and sessions.
  - Key sections: Top metrics (agents, sessions, completion rate), recent sessions, quick actions (create agent), activity feed, sidebar nav.
  - Contribution: Monitoring, quick navigation to agent/session tasks.

- Agent List Page
  - Purpose: Manage agents.
  - Key sections: Agents table/card grid (status, sessions), search & filters, create agent CTA, bulk actions.
  - Contribution: Agent lifecycle (create/edit/publish/archive).

- Agent Builder / Editor
  - Purpose: Create/edit agents (core product).
  - Key sections: Field palette, field properties pane (validation, conditional logic), persona editor, appearance settings, context/knowledge upload, publish controls, live preview.
  - Contribution: No-code definition of conversational form and behavior.

- Agent Detail / Publish Page
  - Purpose: Summarize and publish agent, manage public link.
  - Key sections: Agent summary, public link/QR, embed options, usage snapshot, regenerate/revoke URL, custom domain setup.
  - Contribution: Publish and distribute agents.

- Public Chat Page (Agent URL)
  - Purpose: Conversational form UI for respondents.
  - Key sections: Full-screen chat with transcript, composer, progress indicator, agent header with privacy note, session controls.
  - Contribution: Public-facing conversation to collect leads.

- Session Viewer
  - Purpose: Inspect individual session transcripts and structured fields.
  - Key sections: Transcript panel, extracted fields table (validation status, timestamps), session metadata (IP, UTM), action bar (export/resend), replay mode.
  - Contribution: Review, export, and debug lead data.

- Templates Library
  - Purpose: Provide prebuilt agent templates.
  - Key sections: Template cards with preview/tags, filter/search, clone/customize CTA, feedback widget.
  - Contribution: Faster agent creation and onboarding.

- Webhooks Configuration Page
  - Purpose: Manage outbound integrations reliably.
  - Key sections: Webhook list with status, create/edit modal (URL, secret, events, headers), delivery log viewer, test delivery button, retry controls.
  - Contribution: Reliable delivery of session events to external systems.

- Billing / Checkout Page
  - Purpose: Handle subscriptions and payments.
  - Key sections: Plan selector, Stripe Elements card form, billing address, coupon code, invoice preview, acceptance checkbox.
  - Contribution: Monetization and subscription management.

- Billing History / Transaction Page
  - Purpose: View invoices and update payment methods.
  - Key sections: Invoices table, download links, subscription details, update card flow.
  - Contribution: Financial transparency for customers.

- Admin Dashboard
  - Purpose: Platform owner controls and monitoring.
  - Key sections: Org metrics (users, agents, LLM costs), user management, system logs (webhook failures, LLM errors), feature flags.
  - Contribution: Operations, support, and governance.

- Settings & Preferences
  - Purpose: Account and org-level configuration.
  - Key sections: Account settings, LLM defaults, webhook management link, API keys, data retention.
  - Contribution: User control over defaults and privacy.

- User Profile Page
  - Purpose: Profile, security, team settings.
  - Key sections: Profile form, avatar upload, 2FA setup, team invites, danger zone (delete account).
  - Contribution: Account management and security.

- Privacy Policy Page
  - Purpose: Legal compliance and transparency.
  - Key sections: Data collected, retention, export/delete instructions, contact info.
  - Contribution: Compliance and trust.

- Terms of Service Page
  - Purpose: Legal agreement and limits.
  - Key sections: Usage restrictions, billing terms, liability limits.
  - Contribution: Legal protection and clarity.

- About & Help Page
  - Purpose: Support resources and developer docs.
  - Key sections: FAQs, getting started guide, developer docs link, support form.
  - Contribution: Assistance to users and integrators.

- 404 Not Found Page
  - Purpose: Friendly route error handling.
  - Key sections: Error copy, search, quick links.
  - Contribution: Improved UX on broken routes.

- 500 Server Error Page
  - Purpose: Graceful server error handling.
  - Key sections: Apology, retry button, status link, error ID.
  - Contribution: User guidance during outages.

- Loading / Success Microstates
  - Purpose: Reusable feedback states.
  - Key sections: Spinners, progress bars, success cards, retry fallback.
  - Contribution: Clear UX during async operations.

### 2. Features
- User Authentication
  - Implementation: Email/password with bcrypt/argon2, JWT access/refresh tokens, OAuth (Google/Microsoft/GitHub), rate limiting, RBAC (user, admin, org owner).
  - APIs: POST /auth/login, /auth/signup, /auth/logout, /auth/refresh.
  - Contribution: Secure identity and multi-tenant access control.

- Password & Account Recovery
  - Implementation: Time-limited hashed tokens, SendGrid templates, rate limiting.
  - APIs: POST /auth/password-reset/request, POST /auth/password-reset/confirm.
  - Contribution: Secure recovery flows.

- Session & Token Management
  - Implementation: Store hashed refresh tokens with device metadata, rotation, revocation lists, endpoint for listing sessions and remote logout.
  - Contribution: Security and session visibility.

- Email Verification
  - Implementation: Single-use signed tokens, SendGrid transactional email templates, resend with rate limiting.
  - Contribution: Validated users and email deliverability.

- Agent Builder CRUD
  - Implementation: Agents schema (fields, validations, persona, appearance, context, versions). Autosave, optimistic concurrency, version history and rollback.
  - APIs: GET /api/agents, POST /api/agents, PUT /api/agents/:id, DELETE /api/agents/:id, POST /api/agents/:id/publish.
  - Contribution: Core product creation and lifecycle.

- Form Field Definition & Validation Engine
  - Implementation: Declarative field model (id, type, label, validations, required, conditional logic). Server-side deterministic engine validates each candidate value, supports custom enterprise validation webhooks.
  - Contribution: Ensures data integrity regardless of LLM outputs.

- Persona & Appearance Editor
  - Implementation: Persona model (tone, instructions, prohibited topics), appearance settings (colors, avatar), live preview using sandboxed LLM or simulator.
  - APIs: PUT /api/agents/:id/persona, PUT /api/agents/:id/appearance.
  - Contribution: Brand alignment and controllable agent behavior.

- LLM Orchestration & Conversation State Machine
  - Implementation: Per-session state machine with nodes for field collection and validation checkpoints, deterministic prompt templating, streaming SSE/WebSocket endpoints, fallback responses and safety checks.
  - APIs: POST /api/sessions/start, POST /api/sessions/:id/message, GET /api/sessions/:id/stream.
  - Contribution: Reliable conversational capture with strict enforcement of field collection.

- Knowledge Attachment & Retrieval
  - Implementation: Ingestion pipeline (text extraction, chunking), embedding generation, vector index (Pinecone/Weaviate/Milvus), similarity search with thresholds and caching.
  - APIs: POST /api/agents/:id/context/upload, GET /api/agents/:id/context/search.
  - Contribution: Agent can answer contextual questions during conversation.

- Session Persistence & Export
  - Implementation: Normalized session schema storing raw messages, structured fields, timestamps, metadata; export service for streaming CSV/JSON and scheduled exports, retention policy settings.
  - APIs: GET /api/sessions, GET /api/sessions/:id/export.
  - Contribution: Auditable storage and data portability.

- Webhooks & External Integration Dispatcher
  - Implementation: Reliable queue with backoff retries and DLQ, HMAC signing, delivery logs with request/response bodies, manual resend and test endpoints.
  - Contribution: Robust external delivery of captured leads.

- Realtime Streaming & Delivery
  - Implementation: SSE/WebSocket with Redis pub/sub or scalable realtime infra; polling fallback; connection scaling and rate limiting.
  - Contribution: Low-latency public chat for respondents.

- Analytics & Reporting
  - Implementation: Event pipeline to time-series DB or analytics service (PostHog/Segment), dashboards for sessions over time, completion rate, validation failure trends, LLM cost estimates.
  - Contribution: Product and business metrics for growth and reliability.

- Billing & Subscription Management
  - Implementation: Stripe integration for subscriptions and invoices, metering for sessions/LLM usage, invoice retrieval and webhooks for payment events.
  - Contribution: Monetization and entitlement enforcement.

- Templates & Onboarding Flows
  - Implementation: Template storage and cloning API, guided onboarding with progress tracking and inline tips.
  - APIs: GET /api/templates, POST /api/agents/clone.
  - Contribution: Faster time-to-value.

- Admin Controls & RBAC
  - Implementation: Role/permission model, impersonation, org defaults, feature flags with rollout controls.
  - Contribution: Governance and operational management.

- Asset & Static Requirements
  - Implementation: Email templates (SendGrid) for verification, password reset, session summaries, billing receipts; logo and avatar assets; default agent avatars; UI component kit and illustration set.
  - Contribution: Consistent branding and out-of-the-box UX.

### 3. User Journeys
- New Visitor → Try Demo → Experience Public Chat
  1. Opens Landing Page.
  2. Clicks "Try Demo" → opens demo public agent URL.
  3. Chat UI loads; assistant greets and begins collecting demo fields.
  4. Visitor completes conversation; session stored; demo owner metrics increment.

- New User Signup → Create & Publish First Agent
  1. Visitor signs up (email/OAuth) and verifies email via verification link.
  2. Redirect to Dashboard; guided onboarding suggests template.
  3. User clones "Lead Capture" template into Agent Builder.
  4. User customizes fields, persona (tone), appearance (avatar, color), and attaches FAQs.
  5. Save draft; preview agent in sandbox. Run quick validation tests.
  6. Publish agent → system generates public URL; user copies URL and shares.
  7. Dashboard shows agent metrics; sessions begin to appear.

- Prospect Visits Public Agent → Session Captured → Webhook Delivery
  1. Prospect opens agent public link; chat starts; agent asks for required fields conversationally.
  2. Each answer sent to POST /api/sessions/:id/message; server validates and updates state machine.
  3. On session completion, session persisted; webhook dispatcher enqueues session.completed event.
  4. Webhook processor signs payload and attempts delivery with retries; delivery logs recorded; DLQ used after threshold.

- Agent Owner Reviews Session → Export / Resend
  1. Owner navigates to Session Viewer from Dashboard.
  2. Inspects transcript and extracted fields; uses Replay Mode to see assistant decisions.
  3. Exports session CSV/JSON or resends to webhook manually if delivery failed.
  4. Annotates session or marks reviewed.

- Admin Operating Platform
  1. Admin logs into Admin Dashboard.
  2. Observes LLM usage costs and webhook failures; inspects DLQ.
  3. Uses impersonation to debug a user's agent.
  4. Toggles feature flag or adjusts org rate limits.

## UI Guide
(Apply design system consistently across all pages and components—see Visual Style below.)

## Visual Style

### Color Palette:
- Primary background: White — #FFFFFF
- Neutral surfaces / map backdrop: #F8FAFC and #F1F5F9
- Primary text / headlines: #0F1724
- Secondary text / metadata: #6B7280
- Dividers & borders: #E6E7EB
- Card shadow / elevation: rgba(15, 23, 36, 0.06)
- Primary CTA / brand accent (dark): #111827
- Warm micro-accent: #FF6A00
- Positive / success accent: #10B981
- Informational accent: #2563EB
- Error: #EF4444
- Suggested gradient / overlay: subtle radial fade to #FFFFFF@~8%

### Typography & Layout:
- Font stack: "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial.
- Hierarchy:
  - H1: 48–56 px, weight 700, color #0F1724
  - H2: 20–28 px, weight 600, color #0F1724
  - Body copy: 16 px, weight 400, color #6B7280
  - UI labels: 12–14 px, weight 400–500, color #6B7280
  - Buttons: 14–16 px, weight 600
- Spacing & grid:
  - Max container: ~1100–1200 px, horizontal padding 24–36 px
  - 12-column responsive grid
  - Vertical rhythm: 24 px baseline; major blocks 48–64 px
  - Card padding: 16–24 px
- Alignment: Centered hero; left-aligned body/dashboard lists.

### Key Design Elements
- Card Design:
  - White background, 10–12 px radius, 1px #E6E7EB border or shadow rgba(15,23,36,0.06)
  - Image/media top/left; bold title, muted meta row; micro actions as chips/pills
  - Hover: lift translateY -4px, subtle scale 1.02 on media
- Navigation:
  - Topbar: left wordmark, center nav links muted #6B7280, right Login + primary CTA (#111827 pill). Height 64 px.
  - Dashboard: left collapsible icon rail; active item uses pill or left accent (#111827/#2563EB).
- Data Visualization:
  - Minimal aesthetic, primary metric color #2563EB, area fills low opacity, sparklines 2px.
- Interactive Elements:
  - Buttons: Primary pill #111827 (white text), Secondary outline #E6E7EB, Tertiary text links #2563EB.
  - Form inputs: #FFFFFF or #F8FAFC background, 1px #E6E7EB border, 8–10 px radius, focus ring #2563EB 2px.
  - Error state: border #EF4444 and message in #EF4444.
  - Micro-interactions: transitions 120–300ms, subtle translateY and shadow, map pins and avatars circular.

### Design Philosophy
- Clean, modern, minimal, content-first.
- Friendly yet professional with rounded corners and readable typography.
- Modular predictable components to reduce learning friction.
- Trust via visual restraint and clear data presentation.
- Efficiency and discoverability with clear CTAs and validation UX.

---

Implementation Notes:
- Apply the design system consistently across UI components and pages.
- Ensure accessibility: proper contrast, keyboard navigation, ARIA labels for chat, inputs, and streaming components.
- Ensure responsive behavior across breakpoints, prioritize mobile-first for public chat experience.

## Instructions to AI Development Tool
1. Refer to Project Concept, Problem Statement, and Solution to maintain the "why" during implementation.
2. Ensure all pages and features map directly to the problems identified and deliver the specified value.
3. Build features per the Requirements and verify correctness with server-side validation, safety checks, and integration tests.
4. Strictly follow the UI Guide and Visual Style for consistent implementation.
5. Maintain RBAC, auditing, telemetry, and operational controls expected for production SaaS.

PROJECT CONTEXT: ConverseForms — AI Agent Form Builder (Chat-first Public Forms)
- See top of blueprint for full project description, target user groups, value props, core functionality, integrations (OpenAI/LLM, Vector DB, AWS S3, SendGrid, Stripe, Analytics, Twilio), business goals, challenges and mitigations, and user journeys.
- Scope assets and pages include email templates, legal docs, logos, default avatars, UI component kit, chat icons/illustrations, sample agent templates, and pages listed above (Webhooks, Templates Library, Billing, Admin Dashboard, Agent Builder, Public Chat, Session Viewer, Settings, etc.).
- API & infra essentials:
  - LLM provider integration (streaming + embeddings)
  - Vector DB (context retrieval)
  - S3 for uploads
  - SendGrid for transactional emails
  - Stripe for billing
  - Analytics via PostHog/Segment
  - Optional Twilio for SMS/2FA

User Flows (condensed)
- Landing → Try Demo → Public chat captures session.
- Signup → Email verify → Dashboard → Clone template → Build agent → Publish URL → Monitor sessions & webhooks.
- Respondent → Open public URL → Chat-driven data collection → Server validation → Session persisted → Webhook dispatch/export.
- Admin → Monitor system metrics, webhook DLQ, impersonate users, toggle feature flags.

End of blueprint.

## Implementation Notes

When implementing this project:

1. **Follow Universal Guidelines**: Use the design best practices documented above as your foundation
2. **Apply Project Customizations**: Implement the specific design requirements stated in the "User Design Requirements" section
3. **Priority Order**: Project-specific requirements override universal guidelines when there's a conflict
4. **Color System**: Extract and implement color values as CSS custom properties in RGB format
5. **Typography**: Define font families, sizes, and weights based on specifications
6. **Spacing**: Establish consistent spacing scale following the design system
7. **Components**: Style all Shadcn components to match the design aesthetic
8. **Animations**: Use Motion library for transitions matching the design personality
9. **Responsive Design**: Ensure mobile-first responsive implementation

## Implementation Checklist

- [ ] Review universal design guidelines above
- [ ] Extract project-specific color palette and define CSS variables
- [ ] Configure Tailwind theme with custom colors
- [ ] Set up typography system (fonts, sizes, weights)
- [ ] Define spacing and sizing scales
- [ ] Create component variants matching design
- [ ] Implement responsive breakpoints
- [ ] Add animations and transitions
- [ ] Ensure accessibility standards
- [ ] Validate against user design requirements

---

**Remember: Always reference this file for design decisions. Do not use generic or placeholder designs.**
