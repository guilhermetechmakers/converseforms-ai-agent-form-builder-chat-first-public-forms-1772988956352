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

# Agent List Page Prompt for AI Development Tool

You are building the Agent List Page for a no-code AI Agent Form Builder platform. The goal is to deliver a production-ready, scalable frontend and backend blueprint (with integration points) that adheres to strict runtime safety rules and design system guidelines provided. The page must render a list of agents owned by the current user/organization, show status, session counts, last activity, and provide actions (edit, duplicate, publish, archive). It must integrate with the Agent Builder (CRUD) and Dashboard components, support filtering, searching, sorting, bulk actions, and clean transitions. All code and specs must guard against null/undefined values before array methods, initialize arrays in useState with proper types, and follow the runtime safety rules highlighted in the project brief.

Structure of the prompt
- Overview
- Page Description (Full Detail)
- Components to Build
- Implementation Requirements
  - Frontend
  - Backend
  - Integration
- User Experience Flow
- Technical Specifications
  - Data Models
  - API Endpoints
  - Security
  - Validation
- Acceptance Criteria
- UI/UX Guidelines
- Visual Style (Color Palette, Typography, Key Design Elements)
- Mandatory Coding Standards — Runtime Safety
- Project Context Notes

Now, the complete, actionable prompt

1) Overview
- Build the Agent List Page as the primary management surface for agents owned by the user/organization.
- Display agent name, avatar/thumbnail, status (draft, published), session counts, last activity timestamp, and a set of quick actions.
- Provide filtering, searching, sorting, bulk actions, and an entry point to create/edit agents via the Agent Builder.
- Ensure data safety: guard against null/undefined values for all array operations, initialize useState with proper types, and sanitize API responses as specified.

2) Page Description (Full Detail)
What this page is:
- A responsive Agent List Page that lists agents owned by the current user or organization. Each agent item shows:
  - Avatar/thumbnail
  - Agent name
  - Status badge (draft or published)
  - Session counts (per agent)
  - Last activity timestamp
  - Inline actions: Edit, Duplicate, Publish/Unpublish, Archive
  - Optional context actions: View analytics, export
- Goals:
  - Enable fast discovery, editing, duplication, and publishing of agents
  - Support creating new agents via a prominent Create Agent CTA that opens the Agent Builder
  - Allow bulk actions (publish/unpublish, export, archive) for selected agents
  - Provide filters (status), search by name, and sorting by last activity or session counts
  - Maintain parity with connected pages: Agent Builder / Editor and Dashboard
- Connected features:
  - Agent Builder (CRUD): Create, read, update, delete with full configuration (fields, persona, appearance, context)
  - Dashboard: Quick metrics summary and recent session insights
- UI elements and guidance:
  - Agents List: Card Grid or Table View that adapts to screen size
  - Filter Bar: Status filter chips, search input, sort dropdown
  - Bulk Actions Bar: Checkboxes for multi-select and bulk action dropdown/panel
  - Create Agent CTA: Prominent button aligned with design system
  - Empty state messaging with guidance to create the first agent
- API integrations:
  - Data retrieval for agents per user/org
  - Actions trigger (edit, duplicate, publish, archive) invoke corresponding backend endpoints
  - No external APIs beyond internal app APIs (per PROJECT CONTEXT)

3) Components to Build
- AgentListPage
  - Props: userId, organizationId, initialFilters (optional)
  - State: agents[], searchQuery, statusFilter, sortKey, selectedIds[]
  - Sub-components:
    - AgentCard (or AgentListRow for table view)
      - Props: agent object, onEdit, onDuplicate, onPublishToggle, onArchive
    - FilterBar
      - Props: searchQuery, statusFilter, onSearchChange, onStatusChange, onSortChange
    - BulkActionsBar
      - Props: selectedIds[], onPublishBulk, onArchiveBulk, onExportBulk, onClearSelection
    - CreateAgentCTA
      - Opens Agent Builder (modal or dedicated page)
- AgentCard / AgentListRow
  - UI: avatar, name, status badge, sessionCount, lastActivity, small action icons or dropdown
  - Safety: ensure all arrays accessed are guarded: (agent?.sessions ?? 0), etc.
- StatusBadge
  - Simple pill with color coding for draft (neutral) vs published (green/blue)
- EmptyState
  - Guidance card with CTA to create an agent
- AgentBuilderLauncher
  - Trigger API to open Agent Builder (modal or route)
- AnalyticsPreview (optional)
  - Lightweight micro-visuals for last few sessions (sparklines)

4) Implementation Requirements

Frontend
- UI Components and Pages
  - Use the design system from the Visual Style section exactly (colors, typography, spacing, etc.)
  - Agent List rendered as a responsive grid of cards or a compact table depending on viewport
  - Implement a top filter bar with:
    - Search input (name-based)
    - Status filter chips: Draft, Published, All
    - Sort dropdown: Last Activity, Session Count, Name
  - Bulk selection: checkboxes to select multiple agents
  - Bulk actions: Publish, Archive, Export
  - Per-agent actions: Edit, Duplicate, Publish/Unpublish toggle, Archive
  - Create Agent button: prominent CTA to open Agent Builder
  - Empty state messaging and a path to create the first agent
- Data Handling
  - Fetch agents via API (GET /api/agents?ownerId=...&orgId=...&status=...&search=...&sort=...)
  - Use data ?? [] for result arrays
  - Guard all array ops: (agents ?? []).map(...) and Array.isArray(agents) ? agents.map(...) : []
  - Normalize API response: const items = Array.isArray(response?.data) ? response.data : []
  - Each agent object should include: id, name, avatarUrl, status, sessionCount, lastActivityAt, canEdit, etc.
- State Management
  - useState<Agent[]>([]) for agents
  - useState<string>("") for search
  - useState<string>("all") for status
  - useState<string>("lastActivity") for sort
  - useState<string[]>([]) for selectedIds
- Interactions
  - Debounced search input to avoid excessive API calls
  - Confirm dialogs for destructive actions (archive)
  - Optimistic UI updates for actions with error fallback
- Accessibility
  - All interactive elements must have ARIA labels and keyboard navigability
  - Focus management on modal open
- Performance
  - Pagination or infinite scroll for large agent sets? Implement at least paginated fetch (page size 20) with next/prev
  - Client-side filtering should rely on server when possible; fallback to client-side when needed

Backend
- API Endpoints (examples; align with your actual framework)
  - GET /api/agents
    - Query params: ownerId, orgId, status, search, sort, page, pageSize
    - Returns: { data: Agent[], total: number }
  - POST /api/agents
    - Body: agent configuration (fields, persona, appearance, context)
    - Returns: created Agent
  - GET /api/agents/{id}
    - Returns: Agent details
  - PUT /api/agents/{id}
    - Body: updated agent configuration
    - Returns: updated Agent
  - POST /api/agents/{id}/duplicate
    - Returns: duplicated Agent
  - POST /api/agents/{id}/publish
    - Toggles publish state
  - POST /api/agents/{id}/archive
    - Archives the agent
  - POST /api/agents/bulk
    - Body: { action: "publish"|"archive"|"export", ids: string[] }
    - Returns: status/result
- Database Tables (conceptual)
  - agents: id, ownerId, orgId, name, avatarUrl, status (draft|published), createdAt, updatedAt, lastActivityAt
  - agent_config: agentId, fieldsConfig, persona, appearanceSettings, contextKnowledge
  - agent_sessions: sessionId, agentId, startedAt, endedAt, leadData
- Data Safety
  - All API responses should be validated; return [] if data missing
  - Use nullish coalescing for optional arrays
  - Ensure user authorization checks on owner/org
  - Error handling with structured messages

Integration
- Connect Agent List to Agent Builder (no-code editor):
  - On Edit: navigate to Agent Builder with agentId
  - On Create: open Agent Builder with an empty configuration
  - On Duplicate: call duplication endpoint, refresh list
  - On Publish/Archive: trigger corresponding endpoints and refresh
- Connection to Dashboard:
  - Provide quick actions to navigate to analytics (view analytics) and show quick metrics (agents count, sessions)
- Dataflow
  - List fetch -> render -> user actions (edit/duplicate/publish/archive) -> subsequent fetch for freshness
  - Bulk actions perform server calls -> on success refresh current page with updated data

User Experience Flow
- User lands on Agent List Page
  - Page renders header with Create Agent button and a filter/search bar
  - Agents are displayed as cards in a responsive grid
  - Each card shows avatar, name, status badge, session count, last activity, and per-agent actions
  - User can select multiple agents via checkboxes and apply bulk actions
  - User uses search or status filter to narrow the list; sort by Last Activity or Sessions
  - If no agents exist, an EmptyState invites to create the first agent
- User actions
  - Create Agent: opens Agent Builder interface to define a new agent
  - Edit: opens existing agent in Agent Builder with preloaded config
  - Duplicate: creates a copy of the agent with a new name suffix and navigates to edit
  - Publish/Archive: toggles state with confirmation if archiving
  - Bulk actions: select multiple agents and perform publish/archive/export
- Data consistency
  - All data fetches handle nulls safely; UI renders gracefully with loading states
  - After any mutation, the page refreshes the list to reflect changes
- Accessibility and responsiveness
  - All interactions accessible via keyboard
  - Layout adapts to mobile/tablet with proper spacing and touch targets

Technical Specifications

Data Models
- Agent
  - id: string
  - ownerId: string
  - orgId: string
  - name: string
  - avatarUrl?: string
  - status: "draft" | "published"
  - sessionCount: number
  - lastActivityAt?: string (ISO date)
  - createdAt: string
  - updatedAt: string
- AgentConfig
  - agentId: string
  - fields: Array<FieldConfig> // includes order, validations, types
  - persona: PersonaConfig // tone, instructions
  - appearance: AppearanceConfig // colors, avatar, theme
  - contextKnowledge: Knowledge[] // FAQs, product info
- Knowledge
  - type: "faq" | "document" | "notice"
  - question: string
  - answer: string

API Endpoints
- GET /api/agents?ownerId=&orgId=&status=&search=&sort=&page=&pageSize=
- POST /api/agents
- GET /api/agents/{id}
- PUT /api/agents/{id}
- POST /api/agents/{id}/duplicate
- POST /api/agents/{id}/publish
- POST /api/agents/{id}/archive
- POST /api/agents/bulk

Security
- Authentication: JWT or session-based auth as per existing system
- Authorization: Ensure user can access agents owned by their user/account or organization
- Rate limiting on bulk actions
- CSRF protection for mutating actions if required by framework

Validation
- Frontend: validate required fields (name, status), ensure arrays are non-null before map
- Backend: validate payload shapes, required fields, and ownership
- All API responses that contain arrays use data ?? [] or validated via Array.isArray checks

Acceptance Criteria
- The Agent List Page renders with a responsive grid or table, showing at least 6 sample agents in a seeded test
- All array operations guard against null/undefined (e.g., (agents ?? []).map(...))
- Search, filter, and sort work correctly and reflect in API query
- Per-agent actions (Edit, Duplicate, Publish/Archive) perform correctly and refresh the list
- Bulk actions (Publish, Archive, Export) operate on selected agents and return success state
- Create Agent CTA opens Agent Builder and saves new agent with correct meta
- No runtime crashes with null data; proper loading and empty states shown when data is absent
- Data from API is validated: const list = Array.isArray(response?.data) ? response.data : []

UI/UX Guidelines
- Align with Visual Style section: color palette, typography, spacing, and component behavior
- Card Design: white cards, soft borders, medium radii, subtle shadows
- Navigation and layout: topbar with CTA, left app nav, consistent whitespace and alignment
- Micro-interactions: gentle hover lifts, focus rings, transitions 120–180ms
- Accessibility: aria-labels, keyboard focus order, screen reader-friendly labels

Visual Style
- Implement the exact color palette, typography, and design tokens described
- Ensure consistent usage of primary, secondary, and emphasis colors
- Use responsive design with a 12-column grid system as described

Mandatory Coding Standards — Runtime Safety (CRITICAL)
- Supabase/API results guard rails:
  - const items = data ?? []
  - Always use (items ?? []).map(...) or Array.isArray(items) ? items.map(...) : []
  - API response shapes validated: const list = Array.isArray(response?.data) ? response.data : []
- useState defaults:
  - const [agents, setAgents] = useState<Agent[]>([])
  - const [selectedIds, setSelectedIds] = useState<string[]>([])
  - Use typed generics for all arrays/objects
- Optional chaining and defaults:
  - Access nested data safely: agent?.lastActivityAt, agent?.sessionCount ?? 0
  - Destructure with defaults: const { items = [], total = 0 } = response ?? {}
- Destructuring with defaults and defensive checks applied across all code

Project Context Notes
- TARGET PAGE: Agent List Page
- Connected Pages: Agent Builder / Editor, Dashboard
- Connected Features: Agent Builder (CRUD)
- Data flow: All data fetches guarded against null/undefined; state initialized to safe defaults
- No external API integrations beyond internal app APIs in this version

Deliverables
- A working, well-documented codebase for the Agent List Page, including:
  - Frontend components with clear prop typing and comments
  - API service layer with endpoints described
  - State management and data-fetch logic with proper safety guards
  - Mock/seeding data for local development and clear instructions for integration with real backend
  - Accessibility and performance considerations
- Clear developer notes on how to extend features (e.g., adding a table view, more analytics, or deeper bulk operations)

End of Prompt

Notes for the AI tooling
- Prioritize runtime safety by implementing thorough guards for all array operations
- Maintain strict adherence to the design system and visual style
- Provide code with TypeScript typings where possible, and include JSDoc-style comments for clarity
- Include example shapes for Agent and AgentConfig interfaces
- Where applicable, provide small unit-test-like stubs or guidance for tests focusing on the runtime safety rules (e.g., tests that ensure (data ?? []) and Array.isArray checks pass)

Would you like this prompt exported as a ready-to-submit JSON payload for your internal AI development tool, or as a Markdown document for your design/dev team repository?

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
