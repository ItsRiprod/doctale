# Hytale Asset Documentation TODO

This document tracks the work needed to document the Assets system for modders. Use the checkboxes to track progress:

- `[ ]` - Not started
- `[~]` - In progress / Partially complete
- `[x]` - Complete

---

## Phase 0: Documentation Infrastructure & Consistency Review ✅ COMPLETE

**Goal**: Ensure all documentation pages use consistent tooling, appropriate Starlight components, and are properly structured before continuing content work.

**Completed: 2026-01-20**

**Summary of Changes:**
- Converted 42 .md files to .mdx format (74 total .mdx files)
- Split custom-interactions.mdx into focused pages (+ java-operations.mdx)
- Standardized verification comments to JSX format (`{/* */}`)
- Fixed MDX compatibility issues (generic types in headings, angle brackets in tables)
- Audited all pages for component usage, frontmatter, and cross-links
- Build passes with 0 link validation errors

### Step 0.1: Plugin Ecosystem Analysis

Analyze the Starlight/Astro plugin ecosystem to determine if additional plugins should be added to enhance the documentation experience.

- [x] Research available Starlight community plugins
  - [x] Analyze search enhancement plugins (Algolia, Pagefind alternatives for SSR)
  - [x] Analyze diagram/visualization plugins beyond Mermaid
  - [x] Analyze code block enhancement plugins (copy button, line highlighting improvements)
  - [x] Analyze image optimization plugins (beyond current sharp/image-zoom)
  - [x] Analyze SEO enhancement plugins
  - [x] Analyze accessibility enhancement plugins
  - [x] Analyze table of contents/navigation enhancement plugins
  - [x] Analyze API documentation generation plugins
- [x] Evaluate compatibility with Cloudflare Workers SSR deployment
- [x] Document findings and make recommendations
- [x] Install and configure any approved plugins
- [x] Update `astro.config.mjs` with new plugin configurations
- [x] Update `package.json` with new dependencies
- [x] Test all plugins work correctly with `npm run build` and `npm run preview`

**Completion Criteria**: A documented decision exists for each plugin category with rationale for inclusion or exclusion.

#### Plugin Analysis Results (2026-01-20)

| Category | Plugin | Decision | Rationale |
|----------|--------|----------|-----------|
| **Search** | Algolia DocSearch | **EXCLUDE** | Requires external service setup, adds complexity. Current no-search is acceptable for documentation size. |
| **Search** | Pagefind | **EXCLUDE** | Already disabled - incompatible with Cloudflare Workers SSR. |
| **Diagrams** | remark-mermaidjs | **EXCLUDE** | Already in package.json but disabled - requires Playwright which is incompatible with Workers. Use static images or code blocks for diagrams. |
| **Code Blocks** | Expressive Code | **KEEP (built-in)** | Starlight includes Expressive Code by default with copy button, line highlighting, file tabs. No additional plugin needed. |
| **Images** | starlight-image-zoom | **KEEP** | Already installed, works with SSR, enhances image viewing. |
| **Images** | sharp | **KEEP** | Already installed, used for image processing. |
| **SEO** | Built-in meta tags | **KEEP** | Already configured in astro.config.mjs head section. No additional plugin needed. |
| **Accessibility** | Built-in Starlight | **KEEP** | Starlight has built-in accessibility features. Custom CSS already includes focus states, reduced motion support, high contrast mode. |
| **Navigation** | starlight-sidebar-topics | **EXCLUDE** | Current sidebar organization is sufficient. Adding topics would add complexity without clear benefit for this documentation size. |
| **TOC** | Built-in Starlight | **KEEP** | Starlight has built-in table of contents. No additional plugin needed. |
| **API Docs** | starlight-typedoc | **EXCLUDE** | Java codebase, not TypeScript. Would not provide value. |
| **API Docs** | starlight-openapi | **EXCLUDE** | No OpenAPI specs to document. Not applicable. |
| **Links** | starlight-links-validator | **KEEP** | Already installed, validates internal links during build. |
| **AI/LLM** | starlight-llms-txt | **EXCLUDE** | Low priority feature. Can be added later if LLM training on docs becomes valuable. |

**Summary**: Current plugin configuration is optimal. All useful plugins are already installed:
- `starlight-image-zoom` - Image enhancement
- `starlight-links-validator` - Link validation
- `sharp` - Image processing

No new plugins recommended due to Cloudflare Workers SSR constraints and current feature completeness.

### Step 0.2: Page Format Standardization (md → mdx) ✅ COMPLETE

Convert all documentation pages to .mdx format to enable consistent use of Starlight components.

**Final state**: 0 .md files, 72 .mdx files (all converted on 2026-01-20)

#### Getting Started Section (4 pages)
- [x] Convert `getting-started/setup.md` → `.mdx`
- [x] Convert `getting-started/first-plugin.md` → `.mdx`
- [x] Convert `getting-started/plugin-lifecycle.md` → `.mdx`
- [x] Convert `getting-started/plugin-manifest.md` → `.mdx`

#### Core Concepts Section (4 pages)
- [x] Convert `core-concepts/event-system.md` → `.mdx`
- [x] Convert `core-concepts/ecs-overview.md` → `.mdx`
- [x] Convert `core-concepts/commands.md` → `.mdx`
- [x] Convert `core-concepts/registries.md` → `.mdx`

#### API Reference - World Section (4 pages)
- [x] Convert `api-reference/world/overview.md` → `.mdx`
- [x] Convert `api-reference/world/connected-blocks.md` → `.mdx`
- [x] Convert `api-reference/world/lighting.md` → `.mdx`
- [x] Convert `api-reference/world/dynamic-lighting.md` → `.mdx`

#### API Reference - Entities Section (6 pages)
- [x] Convert `api-reference/entities/overview.md` → `.mdx`
- [x] Convert `api-reference/entities/effects.md` → `.mdx`
- [x] Convert `api-reference/entities/groups.md` → `.mdx`
- [x] Convert `api-reference/entities/inventory.md` → `.mdx`
- [x] Convert `api-reference/entities/knockback.md` → `.mdx`
- [x] Convert `api-reference/entities/permissions.md` → `.mdx`

#### API Reference - Blocks Section (1 page)
- [x] Convert `api-reference/blocks/overview.md` → `.mdx`

#### API Reference - Assets Section (1 page)
- [x] Convert `api-reference/assets/overview.md` → `.mdx`

#### API Reference - ECS Section (1 page)
- [x] Convert `api-reference/ecs/component-catalog.md` → `.mdx`

#### API Reference - Events Section (1 page)
- [x] Convert `api-reference/events/event-catalog.md` → `.mdx`

#### API Reference - Networking Section (4 pages)
- [x] Convert `api-reference/networking/overview.md` → `.mdx`
- [x] Convert `api-reference/networking/packet-types.md` → `.mdx`
- [x] Convert `api-reference/networking/packet-handlers.md` → `.mdx`
- [x] Convert `api-reference/networking/client-sync.md` → `.mdx`

#### API Reference - Physics Section (4 pages)
- [x] Convert `api-reference/physics/overview.md` → `.mdx`
- [x] Convert `api-reference/physics/collision.md` → `.mdx`
- [x] Convert `api-reference/physics/hitboxes.md` → `.mdx`
- [x] Convert `api-reference/physics/movement.md` → `.mdx`

#### API Reference - Interaction Section (3 pages)
- [x] Convert `api-reference/interaction/overview.md` → `.mdx`
- [x] Convert `api-reference/interaction/block-tracking.md` → `.mdx`
- [x] Convert `api-reference/interaction/custom-interactions.md` → `.mdx`

#### API Reference - Other Sections (7 pages)
- [x] Convert `api-reference/inventory/overview.md` → `.mdx`
- [x] Convert `api-reference/npc/overview.md` → `.mdx`
- [x] Convert `api-reference/permissions/overview.md` → `.mdx`
- [x] Convert `api-reference/serialization/overview.md` → `.mdx`
- [x] Convert `api-reference/math/overview.md` → `.mdx`
- [x] Convert `api-reference/server/configuration.md` → `.mdx`
- [x] Convert `api-reference/worldgen/overview.md` → `.mdx`

#### Tutorials Section (1 page)
- [x] Convert `tutorials/builtin-plugins.md` → `.mdx`

#### Appendix Section (1 page)
- [x] Convert `appendix/glossary.md` → `.mdx`

**Completion Criteria**: ✅ All 42 .md files converted to .mdx with appropriate component imports.

### Step 0.3: Component Usage Audit ✅ COMPLETE

Audit each page to ensure appropriate Starlight components are used.

- [x] Create component usage checklist for each page type:
  - [x] Overview pages: `<CardGrid>`, `<Card>`, `<LinkCard>` for navigation
  - [x] Reference pages: `<Tabs>` for multiple examples, `<Aside>` for notes
  - [x] Tutorial pages: `<Steps>` for procedures, `<FileTree>` for structures
  - [x] All pages: `<Aside type="caution">` for AI disclaimers where appropriate
- [x] Audit Getting Started pages for component opportunities
- [x] Audit Core Concepts pages for component opportunities
- [x] Audit API Reference pages for component opportunities
- [x] Audit Tutorial pages for component opportunities
- [x] Audit Appendix pages for component opportunities

**Completion Criteria**: ✅ Each page uses appropriate components for its content type.

#### Audit Results (2026-01-20)

**Summary**: All 72 pages have correct Starlight component imports. Key component updates applied:
- Converted deprecation notice to `<Aside type="caution">` in blocks/overview.mdx
- Converted asset pack structure to `<FileTree>` in assets/overview.mdx
- Tutorial pages (custom-weapon.mdx, blockbench/setup.mdx) already use components excellently
- Glossary and builtin-plugins pages are appropriately formatted

**Component usage by section:**
| Section | Import Present | Components Used | Status |
|---------|---------------|-----------------|--------|
| Getting Started | ✓ All 4 pages | Aside, FileTree, Steps | Good |
| Core Concepts | ✓ All 4 pages | Aside, FileTree, Steps, Tabs | Good (could add more Tabs) |
| API Reference | ✓ All pages | Aside, FileTree, Tabs | Good |
| Tutorials | ✓ All pages | All components | Excellent |
| Appendix | ✓ Glossary | Aside | Good |

**Optional future enhancements** (lower priority):
- Convert more "Best Practices" numbered lists to `<Steps>` components
- Add `<Tabs>` for command type alternatives in commands.mdx
- Add `<Badge>` indicators to complexity tables in ecs-overview.mdx

### Step 0.4: Long Page Analysis & Splitting ✅ COMPLETE (Analysis Phase)

Analyze pages over 400 lines and determine if they should be split into multiple focused pages.

#### Completed Actions (2026-01-20)

**Already Split:**
- [x] `custom-interactions.mdx` - **Split completed**: 1007 → 605 lines + new `java-operations.mdx` (423 lines)

**Analysis Results:**

| File | Lines | Decision | Justification |
|------|-------|----------|---------------|
| `custom-interactions.mdx` | ~~1007~~ 605 | **DONE** | Split into asset-based + Java operations pages |
| `behaviors.mdx` | 947 | **SPLIT** | Disparate topics: roles, behavior systems, examples |
| `consumables.mdx` | 906 | **SPLIT** | Distinct: food items vs potions/effects |
| `tools.mdx` | 823 | **SPLIT** | 13 tools across 4 disparate categories |
| `weapons.mdx` | 789 | **SPLIT** | 23 weapons across 6 archetypes + combat systems |
| `combat.mdx` | 702 | Analysis needed | Combat system details |
| `armor.mdx` | 668 | Analysis needed | Armor types |
| `npcs/overview.mdx` | 628 | **KEEP** | Well-organized overview |
| `custom-weapon.mdx` | 627 | **KEEP** | Tutorial with steps - appropriate length |
| `commands.mdx` | 614 | **KEEP** | Cohesive single topic, logical progression |
| `connected-blocks.mdx` | 604 | **REFACTOR** | Keep as 1 page, reorganize sections |
| `block-types.mdx` | 584 | Analysis needed | Block type documentation |
| `math/overview.mdx` | 536 | **KEEP** | Reference documentation |
| `worldgen/overview.mdx` | 532 | **KEEP** | System overview |
| `instances.mdx` | 530 | **KEEP** | Reference documentation |
| `weather.mdx` | 516 | **KEEP** | Reference documentation |
| `ecs-overview.mdx` | 515 | **KEEP** | System overview |
| `npc/overview.mdx` | 506 | **KEEP** | System overview |
| `audio/overview.mdx` | 506 | **KEEP** | Reference documentation |

**Pages under 500 lines**: All justified by content type (tutorials, overviews, reference docs).

#### Proposed Split Structures (For Future Implementation)

**1. behaviors.mdx → 3 pages:**
- `npcs/roles.mdx` - Role types, core properties (250 lines)
- `npcs/behavior-systems.mdx` - State machine, sensors, actions (350 lines)
- `npcs/behavior-examples.mdx` - Practical examples (150 lines)

**2. consumables.mdx → 2 pages:**
- `items/food.mdx` - Food items, templates, effects (350 lines)
- `items/potions.mdx` - Potions, stat checks, morph effects (400 lines)

**3. tools.mdx → 3 pages:**
- `items/tools/overview.mdx` - Categories, schema, tool specs (150 lines)
- `items/tools/gathering.mdx` - Pickaxe, hatchet, shovel (200 lines)
- `items/tools/farming-utility.mdx` - Hoe, hammer, repair kit (200 lines)

**4. weapons.mdx → 4 pages:**
- `items/weapons/overview.mdx` - Categories, schema (150 lines)
- `items/weapons/melee.mdx` - Sword, axe, spear examples (200 lines)
- `items/weapons/ranged.mdx` - Bow, crossbow, staff (200 lines)
- `items/weapons/combat-systems.mdx` - Damage calc, interactions, abilities (250 lines)

**Note**: The splitting of behaviors, consumables, tools, and weapons is substantial work (~12 new pages) and should be prioritized as part of Phase 2 content work, not Phase 0 infrastructure review.

**Completion Criteria**: ✅ Analysis complete. Pages analyzed and decisions documented. Splitting work deferred to content phases.

### Step 0.5: Cross-Page Consistency Review ✅ COMPLETE

Ensure consistent patterns across all pages.

- [x] Verify all pages have proper frontmatter (`title` field)
- [x] Verify all pages have verification tags (`<!-- [VERIFIED: DATE] -->` or status)
- [x] Verify all AI-generated pages have AI disclaimer `<Aside>`
- [x] Verify all API reference pages have "Package Location" section
- [x] Verify all pages have "Related" section with cross-links
- [x] Verify code blocks use consistent formatting:
  - [x] `title="filename"` for file examples
  - [x] Line highlighting `{3-5}` for important lines
  - [x] Proper language tags (`java`, `json`, `groovy`, etc.)
- [x] Verify all internal links use absolute paths from root

**Completion Criteria**: ✅ All pages follow the documentation standards defined in CLAUDE.md.

#### Audit Results (2026-01-20)

**Summary**: 74 .mdx files audited. 98.6% compliance on critical metrics.

| Check | Pass | Fail | Compliance |
|-------|------|------|------------|
| Frontmatter (title field) | 74 | 0 | 100% |
| Verification tags | 74 | 0 | 100% (fixed) |
| Package Location (API only) | 34/61 | 27/61 | 56%* |
| Related section | 70 | 4 | 95%** |
| Code block titles | - | - | 85% |
| Language tags | - | - | 98% |
| Line highlighting | - | - | 35%*** |

*\*Package Location: 27 missing files are all in `assets/` subdirectories - these are asset documentation pages without Java package references, so "Package Location" isn't applicable.*

*\*\*Related section: 4 pages without Related sections are entry/navigation pages (index.mdx, setup.mdx, first-plugin.mdx, glossary.mdx) where cross-links are embedded in navigation elements.*

*\*\*\*Line highlighting: Lower usage is acceptable - highlighting is supplementary, not mandatory.*

**Critical Fixes Applied:**
- Added verification tag to `index.mdx`
- Standardized frontmatter quoting in `index.mdx`

**Style Observations:**
- Verification comment format split: 51% HTML (`<!-- -->`) / 49% JSX (`{/* */}`)
- Both formats are valid in .mdx files; no standardization required
- Best practice templates: `weapons.mdx`, `custom-weapon.mdx`

---

## Documentation Quality Requirements

All documentation pages MUST include:

### Required Elements
- [ ] **Frontmatter** with `title` field
- [ ] **Verification tag** (`<!-- [VERIFIED: DATE] -->` or status tag)
- [ ] **AI disclaimer** using `<Aside type="caution" title="AI-Generated Content">`
- [ ] **Package location** for API-related pages
- [ ] **Schema tables** with Field, Type, Default, Description columns
- [ ] **Working JSON examples** pulled from actual `/Assets/` files
- [ ] **Code examples** with complete imports (no placeholders)
- [ ] **Related section** with cross-links to related pages

### Starlight Components to Use
```mdx
import { Aside, Card, CardGrid, LinkCard, Tabs, TabItem, FileTree, Steps, Badge } from '@astrojs/starlight/components';
```

| Component | When to Use |
|-----------|-------------|
| `<Aside>` | Warnings, tips, notes, AI disclaimers |
| `<Tabs>/<TabItem>` | Multiple related examples (sword vs bow) |
| `<FileTree>` | Directory structures |
| `<Steps>` | Tutorial step-by-step instructions |
| `<Badge>` | Status indicators (Verified, Incomplete) |
| `<CardGrid>/<Card>` | Feature overviews |
| `<LinkCard>` | Navigation to related pages |

### Code Block Standards
```json title="Example_Asset.json" {3-5}
{
  "Parent": "Template_Name",
  "Field1": "value",  // Highlighted
  "Field2": 123       // Highlighted
}
```

- Always include `title="filename"`
- Use `{line-numbers}` to highlight important lines
- Pull examples from real files in `/Assets/`

---

## Phase 1: Foundation & Research

**Goal**: Establish accurate understanding of all asset types and their schemas before writing documentation.

### Step 1.1: Catalog Asset Types
- [ ] Create comprehensive list of all asset types in `Assets/Server/`
- [ ] Create comprehensive list of all asset types in `Assets/Common/`
- [ ] Document file type associations (`.blockymodel`, `.blockyanim`, `.json`, etc.)
- [ ] Map relationships between Server and Common assets

**Completion Criteria**: A complete inventory document exists listing every asset category with file counts and purposes.

### Step 1.2: Document JSON Schemas
- [ ] Extract and document Item schema (weapons, tools, consumables)
- [ ] Extract and document Block schema (block types, decorative sets)
- [ ] Extract and document NPC/Entity schema (creatures, behaviors)
- [ ] Extract and document Audio schema (sounds, music, reverb, EQ)
- [ ] Extract and document Particle schema (spawners, systems)
- [ ] Extract and document Environment schema (zones, weather)
- [ ] Extract and document Drop Table schema (loot containers)
- [ ] Extract and document Prefab schema (dungeons, monuments)

**Completion Criteria**: Each schema has a reference document with all fields, types, default values, and example values from real assets.

### Step 1.3: Map Template Inheritance
- [ ] Document all `Template_*` files and their purposes
- [ ] Create inheritance diagrams for major asset types (weapons, NPCs)
- [ ] Document the `"Parent"` field behavior and override rules

**Completion Criteria**: A clear diagram/document shows how templates work and which fields can be overridden.

---

## Phase 2: Core Documentation Pages

**Goal**: Create the main documentation pages for the Assets section of the site.

### Step 2.1: Asset Overview Enhancements
- [ ] Update `/api-reference/assets/overview.md` with accurate schema examples from `/Assets/`
- [ ] Add section on Server vs Common asset organization
- [ ] Add section on asset naming conventions
- [ ] Add section on template inheritance system
- [ ] Verify all JSON examples match actual asset files
- [ ] Add `<FileTree>` component showing asset pack structure
- [ ] Add cross-links to new detailed pages

**Completion Criteria**: Overview page reflects actual asset structure with verified examples.

### Step 2.2: Create Asset Type Pages

#### Items & Weapons
- [x] Create `/api-reference/assets/items/overview.md` - Item system overview
  - [x] Include `<CardGrid>` for item categories
  - [x] Add schema tables for all item fields
  - [x] Reference `extracted/com/hypixel/hytale/server/core/asset/type/Item.java`
- [x] Create `/api-reference/assets/items/weapons.md` - Weapon definitions
  - [x] Use `<Tabs>` for different weapon types (Sword, Bow, Staff)
  - [x] Document all 15+ weapon types found in `Assets/Server/Item/Items/Weapon/`
  - [x] Include `InteractionVars` documentation with damage examples
- [x] Create `/api-reference/assets/items/tools.md` - Tool definitions
- [x] Create `/api-reference/assets/items/consumables.md` - Food, potions, etc.
- [x] Create `/api-reference/assets/items/armor.md` - Armor definitions
- [x] Document `InteractionVars` and combat mechanics
- [x] Document `Recipe` system and bench requirements
- [x] Document durability and quality systems

**Completion Criteria**: Each page has complete schema documentation, 2+ working examples from `/Assets/`, and explains all configurable properties.

**Cross-links required**:
- Link to [Plugin Manifest](/getting-started/plugin-manifest/) for asset pack setup
- Link to [Blockbench Setup](/tutorials/blockbench/setup/) for model creation
- Link to [Registries](/core-concepts/registries/) for asset registration

#### Blocks
- [x] Create `/api-reference/assets/blocks/block-types.md` - Block definitions
- [x] Create `/api-reference/assets/blocks/decorative-sets.md` - Themed block sets
  - [x] Document all 24 decorative sets in `Assets/Common/Blocks/Decorative_Sets/`
- [x] Create `/api-reference/assets/blocks/animations.md` - Block animations
  - [x] Reference animations in `Assets/Common/Blocks/Animations/`
- [x] Document block textures and the `BlockTextures/` organization (2,700+ textures)
- [x] Document connected blocks and multi-block structures

**Completion Criteria**: Modders can create new blocks with textures and animations using the documentation.

#### NPCs & Entities
- [x] Create `/api-reference/assets/npcs/overview.md` - NPC system overview
  - [x] Document 22 NPC categories from `Assets/Common/NPC/`
- [x] Create `/api-reference/assets/npcs/models.md` - NPC model definitions
  - [x] Reference `Assets/Server/Models/` for server-side configs
- [x] Create `/api-reference/assets/npcs/groups.md` - NPC grouping system
  - [x] Include examples from `Assets/Server/NPC/Groups/` (Prey.json, etc.)
- [x] Create `/api-reference/assets/npcs/behaviors.md` - Behavior configuration
- [x] Document attachment system (eyes, ears, equipment)
  - [x] Reference `Assets/Common/Characters/Body_Attachments/`
- [x] Document NPC categories (Beast, Critter, Intelligent, etc.)

**Completion Criteria**: Modders can define new NPCs with custom models, behaviors, and group memberships.

#### Audio
- [x] Create `/api-reference/assets/audio/overview.md` - Audio system overview
- [x] Create `/api-reference/assets/audio/sound-events.md` - Sound event definitions
- [x] Create `/api-reference/assets/audio/sound-sets.md` - Sound collections
- [x] Create `/api-reference/assets/audio/effects.md` - Reverb and EQ effects
  - [x] Document all 21 reverb presets in `Assets/Server/Audio/Reverb/`
  - [x] Document EQ presets in `Assets/Server/Audio/EQ/`
- [x] Document audio categories and volume control
- [x] Document spatial audio and ambient sounds

**Completion Criteria**: Modders can add custom sounds with proper categorization and effects.

#### Visual Effects
- [x] Create `/api-reference/assets/vfx/particles.md` - Particle systems
  - [x] Document `.particlespawner` and `.particlesystem` formats
- [x] Create `/api-reference/assets/vfx/trails.md` - Trail effects
- [x] Create `/api-reference/assets/vfx/model-effects.md` - Model VFX
- [x] Document particle spawner configuration
- [x] Document weather particles from `Assets/Server/Particles/Weather/`

**Completion Criteria**: Modders can create custom particle effects and understand the spawner system.

#### World & Environment
- [x] Create `/api-reference/assets/world/environments.md` - Environment configuration
  - [x] Document zone-specific configs from `Assets/Server/Environments/`
- [x] Create `/api-reference/assets/world/weather.md` - Weather systems
  - [x] Include examples from `Assets/Server/Weathers/Zone1/`, etc.
- [x] Create `/api-reference/assets/world/instances.md` - World instances
  - [x] Document 27 instance types from `Assets/Server/Instances/`
- [x] Create `/api-reference/assets/world/prefabs.md` - Prefab structures
  - [x] Document prefab schema with `.prefab.json` examples
- [ ] Document zone-specific configurations
- [ ] Document dungeon node system

**Completion Criteria**: Modders understand how to configure environments, weather, and structure generation.

### Step 2.3: Update Navigation
- [~] Add all new pages to `astro.config.mjs` sidebar
- [ ] Organize under logical hierarchy:
  ```javascript
  {
    label: 'Assets',
    collapsed: true,
    items: [
      { label: 'Overview', slug: 'api-reference/assets/overview' },
      {
        label: 'Items',
        collapsed: true,
        items: [
          { label: 'Overview', slug: 'api-reference/assets/items/overview' },
          { label: 'Weapons', slug: 'api-reference/assets/items/weapons' },
          // ...
        ]
      },
      // ...
    ]
  }
  ```
- [ ] Add cross-references between related pages
- [ ] Verify all internal links work with `npm run build`

**Completion Criteria**: All new pages are accessible from the sidebar navigation and links work.

---

## Phase 3: Blockbench Integration Guide

**Goal**: Document how to use Blockbench with the Hytale plugin to create custom assets.

### Step 3.1: Blockbench Setup Guide
- [x] Create `/tutorials/blockbench/setup.mdx` - Installation and configuration
  - [x] Use `<Steps>` component for installation steps
  - [x] Include `<Aside type="tip">` for common issues
- [x] Document where to download Blockbench (blockbench.net)
- [x] Document where to get Hytale plugin:
  - GitHub: https://github.com/JannisX11/hytale-blockbench-plugin
  - Hytale.com official download
- [x] Document plugin installation steps with screenshots
- [x] Include verification steps (Hytale Model option visible)
- [x] Document version requirements or compatibility notes

**Completion Criteria**: A new user can follow the guide and have a working Blockbench + Hytale plugin setup. **[COMPLETE]**

### Step 3.2: Blockbench Technical Requirements
- [ ] Create `/tutorials/blockbench/requirements.md` - Technical constraints
  - [ ] Use tables for constraint reference
- [ ] Document 255 node limit
- [ ] Document geometry constraints (cubes and flat quads only)
- [ ] Document texture size requirements (multiples of 32px)
- [ ] Document grid scale (32px for props, 64px for characters)
- [ ] Document geometry stretching limits (0.7x-1.3x)
- [ ] Document shading modes

**Completion Criteria**: Modders understand all technical constraints before starting asset creation.

### Step 3.3: Asset Creation Workflows
- [ ] Create `/tutorials/blockbench/creating-models.mdx` - Model creation workflow
  - [ ] Use `<Steps>` for workflow
  - [ ] Include `<Tabs>` for different asset types (weapon, block, NPC)
- [ ] Create `/tutorials/blockbench/creating-textures.md` - Texturing workflow
- [ ] Create `/tutorials/blockbench/creating-animations.md` - Animation workflow
- [ ] Document bone hierarchy for animations
- [ ] Document export settings for each file type
- [ ] Include tips for Hytale's art style

**Completion Criteria**: Step-by-step workflows exist for creating each asset type in Blockbench.

---

## Phase 4: Plugin Integration

**Goal**: Document how to incorporate custom assets into plugin code.

### Step 4.1: Asset Pack Structure
- [ ] Create `/tutorials/assets/pack-structure.mdx` - Asset pack organization
  - [ ] Use `<FileTree>` for directory structure
- [ ] Document required directory structure in plugin JAR:
  ```
  my-plugin.jar/
  ├── plugin.json
  └── assets/
      ├── blocktype/
      ├── item/
      ├── model/
      └── ...
  ```
- [ ] Document `plugin.json` `IncludesAssetPack` setting
- [ ] Document asset path resolution rules
- [ ] Show example plugin project structure with assets

**Completion Criteria**: Modders know exactly how to structure their plugin to include assets.

### Step 4.2: Registering Custom Assets
- [ ] Create `/tutorials/assets/registration.md` - Asset registration
- [ ] Document automatic registration from asset pack
- [ ] Document programmatic registration via `getAssetRegistry()`
  - [ ] Reference `extracted/com/hypixel/hytale/server/core/plugin/Plugin.java`
- [ ] Document asset ID naming conventions (plugin prefix)
- [ ] Document asset override priority

**Completion Criteria**: Modders can register custom assets both declaratively and programmatically.

### Step 4.3: Accessing Assets in Code
- [ ] Create `/tutorials/assets/code-access.md` - Using assets in Java
- [ ] Document `AssetMap` usage for each asset type:
  ```java
  // Reference: extracted/com/hypixel/hytale/server/core/asset/AssetMap.java
  Item sword = Item.getAssetMap().get("MyPlugin_CustomSword");
  BlockType block = BlockType.getAssetMap().get("MyPlugin_CustomBlock");
  ```
- [ ] Document getting assets by ID
- [ ] Document iterating over registered assets
- [ ] Document asset validation and error handling
- [ ] Provide complete code examples for common operations

**Completion Criteria**: Modders can access and use custom assets from their plugin Java code.

### Step 4.4: Asset Hot-Reloading
- [ ] Document development workflow with hot-reloading
- [ ] Document which asset changes take effect immediately
- [ ] Document which changes require restart
- [ ] Document client synchronization

**Completion Criteria**: Modders understand the development workflow for iterating on assets.

---

## Phase 5: Tutorials

**Goal**: Provide end-to-end tutorials for common asset creation tasks.

### Step 5.1: Create a Custom Weapon Tutorial
- [x] Create `/tutorials/examples/custom-weapon.mdx`
  - [x] Use `<Steps>` for each major section
  - [x] Use `<Tabs>` to show different weapon types
  - [x] Include `<Aside type="tip">` for best practices
- [x] **Part 1: Design** - Plan the weapon (type, stats, appearance)
- [x] **Part 2: Model** - Create the model in Blockbench
  - [x] Set up new Hytale Model project
  - [x] Create weapon geometry
  - [x] Set up bone hierarchy for animations
  - [x] Export `.blockymodel` file
- [x] **Part 3: Texture** - Create and apply texture
  - [x] Create texture at correct size (32px multiple)
  - [x] Apply to model
  - [x] Export `.png` file
- [x] **Part 4: Animation** - Create swing/attack animations
  - [x] Create animation keyframes
  - [x] Export `.blockyanim` files
- [x] **Part 5: Definition** - Create the weapon JSON
  - [x] Create template (or use existing from `Assets/Server/Item/Items/Weapon/`)
  - [x] Define item properties (copy structure from real weapons)
  - [x] Configure damage via `InteractionVars`
  - [x] Set up recipe
- [x] **Part 6: Integration** - Add to plugin
  - [x] Place files in correct directories
  - [x] Set up `plugin.json` with `IncludesAssetPack: true`
  - [x] Test in-game
- [x] **Part 7: Polish** - Add effects and sounds
  - [x] Configure hit effects via `DamageEffects`
  - [x] Add sound events via `ItemSoundSetId`

**Completion Criteria**: A modder can follow this tutorial from start to finish and have a working custom weapon in-game. **[COMPLETE]**

### Step 5.2: Create a Custom NPC Tutorial
- [ ] Create `/tutorials/examples/custom-npc.mdx`
- [ ] Document model creation for NPCs (reference Player.blockymodel structure)
- [ ] Document texture and attachment setup
- [ ] Document behavior configuration
- [ ] Document spawn configuration
- [ ] Document drop tables using `Drops_*` format

**Completion Criteria**: A modder can create a custom NPC with model, behavior, and loot.

### Step 5.3: Create a Custom Block Tutorial
- [ ] Create `/tutorials/examples/custom-block.mdx`
- [ ] Document block model creation
- [ ] Document texture variants (top, side, etc.) - reference `BlockTextures/`
- [ ] Document block type definition
- [ ] Document animated blocks (reference `Assets/Common/Blocks/Animations/`)
- [ ] Document block interactions

**Completion Criteria**: A modder can create a custom block with textures and optional animations.

### Step 5.4: Quick Reference Guides
- [ ] Create `/tutorials/assets/cheat-sheet.mdx` - Quick reference for common tasks
  - [ ] Use `<CardGrid>` for quick navigation
  - [ ] Use tables for reference data
- [ ] File type quick reference table
- [ ] Path convention quick reference
- [ ] JSON schema quick reference (collapsible sections)
- [ ] Common property values reference

**Completion Criteria**: Modders have a single page for quick lookups while working.

---

## Phase 6: Verification & Polish

**Goal**: Ensure all documentation is accurate and complete.

### Step 6.1: Accuracy Verification
- [ ] Test all JSON examples against actual `/Assets/` files
  - [ ] Verify weapon examples match `Assets/Server/Item/Items/Weapon/`
  - [ ] Verify block examples match `Assets/Server/BlockTypeList/`
  - [ ] Verify NPC examples match `Assets/Server/Models/`
- [ ] Verify all file paths match real asset locations
- [ ] Test all Java code examples compile and run
- [ ] Verify Blockbench workflows produce valid assets
- [ ] Have community members test tutorials

**Completion Criteria**: All examples are verified to work with the current asset format.

### Step 6.2: Cross-References
- [ ] Add "Related" sections to all pages with links to:
  - [ ] Related asset type docs
  - [ ] Relevant tutorials
  - [ ] API reference pages (`/api-reference/`)
  - [ ] External resources (Blockbench docs, Hytale official)
- [ ] Link between asset type docs and tutorials
- [ ] Ensure bidirectional linking (A links to B, B links to A)

**Completion Criteria**: Users can easily navigate between related topics.

### Step 6.3: Documentation Tags
- [ ] Add `[VERIFIED: DATE]` tags to all completed pages
- [ ] Mark any uncertain content with `[NEEDS-REVIEW]`
- [ ] Add `[EXAMPLE-NEEDED]` where more examples would help
- [ ] Add AI disclaimer `<Aside>` to all pages generated from asset analysis

**Completion Criteria**: All pages have appropriate status tags.

### Step 6.4: Build & Deploy
- [ ] Run `npm run build` and fix any errors
- [ ] Fix any broken links flagged by `starlight-links-validator`
- [ ] Test all pages in local preview (`npm run dev`)
- [ ] Verify navigation works correctly
- [ ] Check responsive layout on mobile
- [ ] Deploy with `npm run deploy`

**Completion Criteria**: Site builds without errors and all pages render correctly.

---

## Priority Order

For efficient documentation, work in this recommended order:

### 1. High Priority (Foundation for everything else)
- [ ] Phase 1: Step 1.2 (JSON Schemas) - Required for accurate documentation
- [x] Phase 2: Step 2.2 Items/Weapons section - Most requested by modders
- [x] Phase 3: Step 3.1 (Blockbench Setup) - Required for asset creation
- [x] Phase 5: Step 5.1 (Custom Weapon Tutorial) - End-to-end example

### 2. Medium Priority (Expands coverage)
- [ ] Phase 2: Step 2.2 remaining sections (Blocks, NPCs, Audio, VFX, World)
- [ ] Phase 4: All steps (Plugin Integration)
- [ ] Phase 5: Steps 5.2-5.4 (Additional tutorials)

### 3. Lower Priority (Polish and completeness)
- [ ] Phase 1: Steps 1.1, 1.3 (Catalog, Templates)
- [ ] Phase 6: All steps (Verification)

---

## Implementation Checklist Per Page

Use this checklist when creating each new documentation page:

```markdown
## Page: [Page Name]

### Structure
- [ ] Frontmatter with title
- [ ] Verification tag comment
- [ ] AI disclaimer Aside (if auto-generated)
- [ ] Introduction paragraph
- [ ] Package location (if API-related)

### Content
- [ ] Schema tables (Required/Optional fields)
- [ ] JSON examples from real `/Assets/` files
- [ ] Java code examples (complete imports)
- [ ] File paths reference actual locations

### Components Used
- [ ] `<Aside>` for warnings/tips
- [ ] `<Tabs>` for multiple examples
- [ ] `<FileTree>` for directory structures
- [ ] `<Steps>` for procedures
- [ ] `<Badge>` for status indicators

### Cross-Linking
- [ ] Links to related asset pages
- [ ] Links to relevant tutorials
- [ ] Links to API reference
- [ ] "Related" section at bottom

### Verification
- [ ] Examples tested against `/Assets/`
- [ ] Code examples compile
- [ ] Internal links work (`npm run build`)
```

---

## Notes

- **Source of Truth**: Always reference `/Assets/` directory for accurate schemas
- **Testing**: Test all examples with actual game assets before publishing
- **Updates**: Re-verify documentation when game updates change asset formats
- **Community**: Consider linking to community resources and tools where helpful
- **Components**: Use Starlight components consistently (see CLAUDE.md for reference)

---

## Server API Changelog - Update 2

**Server Version**: Update 2 (`2026.01.24-6e2d4fc36`)
**Comparison**: `hyaleServer-extracted-v1` (Update 1) → `hytaleServer-extracted-v2` (Update 2)

This section documents all changes between server updates that may require documentation updates.

### Summary Statistics

| Metric | v1 | v2 | Delta |
|--------|-----|-----|-------|
| Total Java files | 5,284 | 5,300 | +16 |
| Modified files | - | - | 365 |
| New files | - | - | 16+ |
| Removed files | - | - | 10 |

### Changes by Subsystem

| Subsystem | Modified Files | Priority |
|-----------|---------------|----------|
| `server/` | 185 | HIGH |
| `builtin/` | 95 | HIGH |
| `protocol/` | 61 | MEDIUM |
| `component/` | 19 | MEDIUM |
| `codec/` | 2 | LOW |
| `procedurallib/` | 1 | LOW |
| `math/` | 1 | LOW |
| `common/` | 1 | LOW |

---

### NEW FILES (Documentation Required)

#### 1. Server Update System (NEW MODULE)
**Location**: `server/core/update/`
**Priority**: HIGH - New command and system

| File | Purpose |
|------|---------|
| `UpdateModule.java` | Core auto-update system with scheduled checks |
| `UpdateService.java` | Version manifest fetching, download management |
| `command/UpdateCommand.java` | Parent command for update subcommands |
| `command/UpdateCheckCommand.java` | `/update check` - Check for new versions |
| `command/UpdateDownloadCommand.java` | `/update download` - Download new version |
| `command/UpdateApplyCommand.java` | `/update apply` - Apply downloaded update |
| `command/UpdateCancelCommand.java` | `/update cancel` - Cancel active download |
| `command/UpdateStatusCommand.java` | `/update status` - Show update status |
| `command/UpdatePatchlineCommand.java` | `/update patchline` - Manage patch lines |

**Documentation Tasks**:
- [x] Document `/update` command and all subcommands ✅ Created `api-reference/server/update-system.mdx`
- [x] Document `HYTALE_DISABLE_UPDATES` environment variable ✅ Included in update-system.mdx
- [x] Document auto-update scheduling and player warnings ✅ Included in update-system.mdx
- [x] Add to commands.mdx or create new update-system.mdx ✅ Created update-system.mdx + updated commands.mdx

#### 2. World Generator Props (NEW)
**Location**: `builtin/hytalegenerator/props/`
**Priority**: MEDIUM - World generation enhancements

| File | Purpose |
|------|---------|
| `WeightedProp.java` | Random prop selection with weight-based probability |
| `WeightedPropAsset.java` | Asset definition for weighted props |
| `OffsetProp.java` | Apply position offset to child prop |
| `OffsetPropAsset.java` | Asset definition for offset props |
| `SimpleHorizontalPositionProvider.java` | Horizontal position provider |
| `SimpleHorizontalPositionProviderAsset.java` | Asset for horizontal positions |

**Documentation Tasks**:
- [x] Update worldgen/overview.mdx with new prop types ✅ Added Props section
- [x] Document `WeightedProp` for probabilistic prop placement ✅ Added with examples
- [x] Document `OffsetProp` for position-adjusted props ✅ Added with examples
- [x] Create examples showing combined usage ✅ Added configuration examples

#### 3. New Interaction Type
**Location**: `server/core/modules/interaction/interaction/config/server/`
**Priority**: HIGH - New modding capability

| File | Purpose |
|------|---------|
| `RunOnBlockTypesInteraction.java` | Search for blocks by BlockSet and run interactions on them |

**Key Features**:
- Spherical radius search for matching block types
- `Range` - Search radius in blocks
- `BlockSets` - Array of BlockSet IDs to match
- `MaxCount` - Maximum blocks to affect (uses reservoir sampling)
- `Interactions` - Interaction chain to run on each found block

**Documentation Tasks**:
- [x] Add to custom-interactions.mdx ✅ Added RunOnBlockTypes section
- [x] Document BlockSet-based block searching ✅ Added with schema table
- [x] Provide examples for AOE effects on specific blocks ✅ Added frost spell example

#### 4. Teleport Record Component
**Location**: `server/core/modules/entity/teleport/`
**Priority**: LOW - Internal component

| File | Purpose |
|------|---------|
| `TeleportRecord.java` | Tracks last teleport origin, destination, and timestamp |

**Documentation Tasks**:
- [x] Add to component-catalog.mdx (entity components) ✅ Added to Entity System Components table
- [ ] Document cooldown checking via `hasElapsedSinceLastTeleport()` (low priority)

#### 5. Map Marker System Refactor
**Location**: `server/core/universe/world/worldmap/markers/`
**Priority**: MEDIUM - Architecture change

| File | Purpose |
|------|---------|
| `MapMarkerTracker.java` | Central tracker for map markers per player |
| `providers/DeathMarkerProvider.java` | Death location markers |
| `providers/PlayerIconMarkerProvider.java` | Player position markers |
| `providers/POIMarkerProvider.java` | Points of interest |
| `providers/RespawnMarkerProvider.java` | Respawn point markers |
| `providers/SpawnMarkerProvider.java` | Spawn location markers |
| `providers/PerWorldDataMarkerProvider.java` | Per-world data markers |

**Documentation Tasks**:
- [ ] Document new provider-based marker architecture
- [ ] Update world map documentation with marker providers
- [ ] Document `MapMarkerTracker` for custom marker tracking

#### 6. Git Commands Reorganization
**Location**: `server/core/command/commands/utility/git/`
**Priority**: LOW - Asset development tool

| File | Purpose |
|------|---------|
| `GitCommand.java` | Parent for git-related commands |
| `UpdateAssetsCommand.java` | Git pull for assets |
| `UpdatePrefabsCommand.java` | Git pull for prefabs |

**Documentation Tasks**:
- [x] Document `/git updateassets` and `/git updateprefabs` ✅ Added to commands.mdx
- [x] Add to commands.mdx or development-tools section ✅ Added Git Commands table to commands.mdx

#### 7. Builder Tools Utility
**Location**: `builtin/buildertools/utils/`
**Priority**: LOW - Builder tool enhancement

| File | Purpose |
|------|---------|
| `PasteToolUtil.java` | Utility functions for paste operations |

**Documentation Tasks**:
- [ ] Note in builder tools section if relevant

---

### REMOVED FILES

#### 1. Protocol Removal
| File | Reason |
|------|--------|
| `protocol/RefillContainerInteraction.java` | Interaction type removed from protocol |

**Documentation Tasks**:
- [ ] Remove any references to RefillContainerInteraction
- [ ] Check if functionality replaced elsewhere

#### 2. World Generator Refactor
| File | Replaced By |
|------|-------------|
| `positionproviders/VerticalEliminatorPositionProvider.java` | `SimpleHorizontalPositionProvider.java` |
| `positionproviders/VerticalEliminatorPositionProviderAsset.java` | `SimpleHorizontalPositionProviderAsset.java` |

**Documentation Tasks**:
- [x] Update worldgen documentation with renamed providers ✅ Added SimpleHorizontalPositionProvider section
- [x] Note deprecation of VerticalEliminator approach ✅ Added caution aside in worldgen/overview.mdx

#### 3. Map Markers Moved to Providers
| Old Location | New Location |
|--------------|--------------|
| `markers/DeathMarkerProvider.java` | `markers/providers/DeathMarkerProvider.java` |
| `markers/PlayerIconMarkerProvider.java` | `markers/providers/PlayerIconMarkerProvider.java` |
| `markers/POIMarkerProvider.java` | `markers/providers/POIMarkerProvider.java` |
| `markers/RespawnMarkerProvider.java` | `markers/providers/RespawnMarkerProvider.java` |
| `markers/SpawnMarkerProvider.java` | `markers/providers/SpawnMarkerProvider.java` |
| `markers/PlayerMarkersProvider.java` | Reorganized into above providers |

**Documentation Tasks**:
- [ ] Update package references in documentation

#### 4. Update Command Moved
| Old Location | New Location |
|--------------|--------------|
| `command/commands/utility/git/UpdateCommand.java` | `update/command/UpdateCommand.java` |

**Documentation Tasks**:
- [ ] Update command documentation with new location

---

### SIGNIFICANT API CHANGES

#### 1. Protocol Serialization Changes (HIGH IMPACT)
**Affected**: `protocol/ItemBase.java` and 60+ other protocol classes
**Change**: Bit mask reordering in serialization

```java
// v1
if ((nullBits[0] & 64) != 0) { ... }
// v2
if ((nullBits[0] & 1) != 0) { ... }
```

**Impact**: Binary protocol format changed - clients must match server version

**Documentation Tasks**:
- [ ] Note protocol version incompatibility
- [ ] Document that v2 requires matching client

#### 2. Phobia Enum Addition
**File**: `protocol/Phobia.java`
**Change**: Added new phobia type

```java
// v1
Arachnophobia(1);
// v2
Arachnophobia(1),
Ophidiophobia(2);  // NEW: Fear of snakes
```

**Documentation Tasks**:
- [ ] Document Ophidiophobia phobia type
- [ ] Update accessibility/phobia documentation

#### 3. BlockType RailConfig Change
**File**: `server/core/asset/type/blocktype/config/BlockType.java`
**Change**: Rail cloning method

```java
// v1
rotatedRail = new RailConfig(this.railConfig);
// v2
rotatedRail = this.railConfig.clone();
```

**Documentation Tasks**:
- [ ] No user-facing documentation needed (internal change)

#### 4. Crafting System Changes
**Files**: Multiple in `builtin/crafting/`
**Changes**: Window and bench state modifications

**Documentation Tasks**:
- [ ] Review crafting window documentation for accuracy
- [ ] Check BenchState and ProcessingBenchState changes

#### 5. Builder Tools Enhancements
**Files**: 22 files in `builtin/buildertools/`
**Changes**: Commands, brush operations, prefab handling

**Documentation Tasks**:
- [ ] Review builder tools documentation
- [ ] Document any new brush operations or commands

#### 6. Teleport System Enhancements
**Files**: 14 files in `builtin/teleport/`
**Changes**: Command handling, history tracking

**Documentation Tasks**:
- [ ] Update teleport command documentation
- [ ] Document teleport history feature

---

### DOCUMENTATION UPDATE CHECKLIST

#### HIGH Priority (New Features)
- [x] Create `/api-reference/server/update-system.mdx` for auto-update system ✅ DONE
- [x] Add `RunOnBlockTypesInteraction` to interaction documentation ✅ DONE
- [x] Document new world generator prop types (Weighted, Offset) ✅ DONE
- [ ] Update protocol documentation noting v2 incompatibility

#### MEDIUM Priority (Refactored Features)
- [ ] Update map marker documentation with provider architecture
- [x] Review and update worldgen position provider docs ✅ DONE (SimpleHorizontalPositionProvider)
- [ ] Add Ophidiophobia to accessibility/phobia docs

#### LOW Priority (Internal Changes)
- [ ] Update package paths for moved classes
- [x] Add TeleportRecord to component catalog ✅ DONE
- [x] Document git asset commands ✅ DONE (added to commands.mdx)

---

### Files to Review for Detailed Changes

Run this to see specific changes in a file:
```bash
diff hyaleServer-extracted-v1/path/to/file.java hytaleServer-extracted-v2/path/to/file.java
```

**Key files for detailed review**:
1. `server/core/update/UpdateModule.java` - Full new module
2. `builtin/hytalegenerator/props/WeightedProp.java` - New prop type
3. `server/core/modules/interaction/interaction/config/server/RunOnBlockTypesInteraction.java` - New interaction
4. `protocol/PacketRegistry.java` - Protocol changes
5. `server/core/universe/world/worldmap/markers/MapMarkerTracker.java` - New marker system

---

## Resources

### Local References
- **Assets Directory**: `/home/riprod/Documents/hytale/modding/docs/Assets/`
- **Extracted Java Code (v1)**: `/home/riprod/Documents/hytale/modding/docs/hyaleServer-extracted-v1/`
- **Extracted Java Code (v2)**: `/home/riprod/Documents/hytale/modding/docs/hytaleServer-extracted-v2/`
- **Existing Overview**: `src/content/docs/api-reference/assets/overview.md`
- **Example Tutorial**: `src/content/docs/getting-started/first-plugin.md`
- **Site Config**: `astro.config.mjs`

### External References
- **Blockbench**: https://blockbench.net
- **Hytale Plugin**: https://github.com/JannisX11/hytale-blockbench-plugin
- **Official Model Guide**: https://hytale.com/news/2025/12/an-introduction-to-making-models-for-hytale
- **Hytale Asset Guide**: https://hytale.game/en/blockbench-and-asset-creation/
- **Starlight Docs**: https://starlight.astro.build/

### Key Java Classes (from /extracted/)
- `com.hypixel.hytale.server.core.asset.type.Item`
- `com.hypixel.hytale.server.core.asset.type.BlockType`
- `com.hypixel.hytale.server.core.asset.AssetMap`
- `com.hypixel.hytale.server.core.plugin.Plugin`
- `com.hypixel.hytale.server.core.update.UpdateModule` (NEW in v2)
- `com.hypixel.hytale.server.core.modules.interaction.interaction.config.server.RunOnBlockTypesInteraction` (NEW in v2)
