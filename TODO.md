# Hytale Asset Documentation TODO

This document tracks the work needed to document the Assets system for modders. Use the checkboxes to track progress:

- `[ ]` - Not started
- `[~]` - In progress / Partially complete
- `[x]` - Complete

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

## Resources

### Local References
- **Assets Directory**: `/home/riprod/Documents/hytale/modding/docs/Assets/`
- **Extracted Java Code**: `/home/riprod/Documents/hytale/modding/docs/extracted/`
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
