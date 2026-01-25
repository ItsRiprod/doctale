# Hytale Modding Documentation - Claude Guidelines

## Project Overview

This is an Astro-based documentation site for Hytale server modding. The site documents:
- **Plugin API** (Java code in `/hytaleServer-extracted-v2/`) - Server-side plugin development
- **Assets System** (in `/Assets/`) - Game content definitions (models, textures, sounds, configs)

**Note**: Two decompiled extractions exist:
- `hyaleServer-extracted-v1` - Update 1 (5,284 files)
- `hytaleServer-extracted-v2` - **Update 2** (5,300 files) - Use this for documentation

**Site URL**: https://doctale.dev
**Framework**: Astro 5.6.1 with Starlight 0.37.3
**Hosting**: Cloudflare Workers (SSR)

---

## Implementation Reference

### Directory Structure
```
docs/
├── astro.config.mjs          # Site config + sidebar navigation
├── package.json              # Dependencies
├── src/
│   ├── content/
│   │   └── docs/             # All documentation pages (.md/.mdx)
│   │       ├── getting-started/
│   │       ├── core-concepts/
│   │       ├── api-reference/
│   │       │   ├── assets/   # Asset documentation goes here
│   │       │   ├── blocks/
│   │       │   ├── entities/
│   │       │   └── ...
│   │       ├── tutorials/    # Tutorial pages
│   │       └── appendix/
│   └── styles/
│       └── custom.css        # Theme customization
├── public/                   # Static files (logo, favicon, images)
├── hyaleServer-extracted-v1/ # Decompiled Java source v1 (5,284 files) - OLD
├── hytaleServer-extracted-v2/# Decompiled Java source v2 (5,300 files) - CURRENT
└── Assets/                   # Game assets (source of truth)
```

### Adding New Pages

1. **Create the markdown file** in `src/content/docs/[section]/[page].md`
2. **Add to sidebar** in `astro.config.mjs`:
```javascript
{
  label: 'Assets',
  collapsed: true,
  items: [
    { label: 'Overview', slug: 'api-reference/assets/overview' },
    { label: 'Items', slug: 'api-reference/assets/items' },  // New page
  ],
}
```
3. **Build and test**: `npm run dev` to preview locally

### Available Starlight Components

Import in `.mdx` files:
```mdx
import { Aside, Card, CardGrid, LinkCard, Tabs, TabItem, FileTree, Code, Steps, Badge } from '@astrojs/starlight/components';
```

#### Aside (Callout boxes)
```mdx
<Aside type="note">Basic information</Aside>
<Aside type="tip">Helpful suggestion</Aside>
<Aside type="caution">Warning about potential issues</Aside>
<Aside type="danger">Critical warning</Aside>

<Aside type="caution" title="AI-Generated Content">
This content was generated from decompiled code analysis.
</Aside>
```

#### Cards
```mdx
<CardGrid>
  <Card title="Getting Started" icon="rocket">
    Quick setup guide for new modders.
  </Card>
  <Card title="API Reference" icon="open-book">
    Complete API documentation.
  </Card>
</CardGrid>

<LinkCard
  title="Asset System"
  description="Learn about game assets"
  href="/api-reference/assets/overview/"
/>
```

#### Tabs (for multiple examples)
```mdx
<Tabs>
  <TabItem label="Sword">
    ```json
    { "Parent": "Template_Weapon_Sword" }
    ```
  </TabItem>
  <TabItem label="Bow">
    ```json
    { "Parent": "Template_Weapon_Bow" }
    ```
  </TabItem>
</Tabs>
```

#### FileTree (for directory structures)
```mdx
<FileTree>
- my-plugin/
  - plugin.json
  - assets/
    - item/
      - Weapon_Sword_Custom.json
    - model/
      - sword.blockymodel
</FileTree>
```

#### Steps (for tutorials)
```mdx
<Steps>
1. Download Blockbench from blockbench.net
2. Install the Hytale plugin
3. Create a new Hytale Model project
</Steps>
```

#### Badge (for status indicators)
```mdx
<Badge text="Verified" variant="success" />
<Badge text="Needs Review" variant="caution" />
<Badge text="Incomplete" variant="danger" />
```

### Installed Plugins

| Plugin | Purpose | Usage |
|--------|---------|-------|
| `starlight-image-zoom` | Click-to-zoom on images | Automatic for all images |
| `starlight-links-validator` | Validates internal links | Runs during build |
| `remark-mermaidjs` | Mermaid diagrams | **Note**: Not compatible with Cloudflare Workers, use code blocks instead |
| `sharp` | Image processing/optimization | Used by Astro for image handling |

**Note**: Additional plugins may be added as part of the Phase 0 plugin ecosystem analysis (see TODO.md). Any new plugins must be compatible with Cloudflare Workers SSR deployment.

### Code Block Features

```java title="MyPlugin.java" {3-5}
package com.example;

// Highlighted lines
import com.hypixel.hytale.server.core.plugin.Plugin;
import com.hypixel.hytale.server.core.asset.type.Item;

public class MyPlugin extends Plugin {
    // ...
}
```

Options:
- `title="filename"` - Shows filename header
- `{3-5}` - Highlights specific lines
- `ins={2}` - Shows line as inserted (green)
- `del={4}` - Shows line as deleted (red)

### Cross-Linking Patterns

```markdown
<!-- Internal links (always use absolute paths from root) -->
[Asset System](/api-reference/assets/overview/)
[Event System](/core-concepts/event-system/)

<!-- Section anchors -->
[See JSON Schema](#json-schema)

<!-- Related section at page bottom -->
## Related
- [Block Types](/api-reference/blocks/overview/) - Block system documentation
- [Plugin Manifest](/getting-started/plugin-manifest/) - Asset pack configuration
```

### Code Reference Format

When referencing source code locations:
```markdown
The `Item` class is defined at `extracted/com/hypixel/hytale/server/core/asset/type/Item.java:45`

See `AssetMap.get()` at `extracted/com/hypixel/hytale/server/core/asset/AssetMap.java:123`
```

---

## Assets Directory Context

The `/Assets/` directory contains extracted game assets from the Hytale server, serving as the **source of truth** for asset documentation.

### Top-Level Structure

```
Assets/
├── Common/          # Client-side visual/audio assets (~30,000+ files)
├── Server/          # Server-side gameplay configs (~33,000+ files)
├── Cosmetics/       # Character customization assets
├── manifest.json    # Package metadata
└── CommonAssetsIndex.hashes  # Asset verification file
```

### Common/ (Client Assets)

Visual and audio assets rendered on the client:

| Directory | Contents | File Types |
|-----------|----------|------------|
| `Blocks/` | Block models, animations, decorative sets | `.blockymodel`, `.blockyanim`, `.png` |
| `BlockTextures/` | 2,700+ block texture files | `.png` |
| `Characters/` | Player model, body attachments, haircuts | `.blockymodel`, `.blockyanim`, `.png` |
| `Items/` | Weapons, tools, armor, consumables (20 categories) | `.blockymodel`, `.blockyanim`, `.png` |
| `NPC/` | Creature models organized by type (22 categories) | `.blockymodel`, `.blockyanim`, `.png` |
| `Cosmetics/` | Arms, capes, gloves, shoes, etc. (13 types) | `.blockymodel`, `.png` |
| `Sounds/` | Sound effects (19 categories) | `.ogg`, `.lpf` |
| `Music/` | Zone-based music files | `.ogg`, `.lpf` |
| `VFX/` | Visual effects (fire, spells, etc.) | Various |
| `Particles/` | Particle system visuals | `.png`, configs |
| `UI/` | User interface assets | `.ui`, `.png` |
| `Icons/` | Item/UI icons | `.png` |
| `TintGradients/` | Color gradient definitions | `.json` |
| `Languages/` | Localization files | `.lang` |

### Server/ (Server Assets)

Gameplay configuration and logic:

| Directory | Purpose | Key Files |
|-----------|---------|-----------|
| `Item/` | Item definitions, interactions, recipes | Weapon JSONs, templates |
| `Models/` | Server-side model configs (hitboxes, attachments) | NPC/projectile configs |
| `Audio/` | Sound events, categories, reverb/EQ effects | Audio category JSONs |
| `NPC/` | NPC groups, behavior definitions | Group membership JSONs |
| `Drops/` | Item drop tables (12 categories) | Drop container JSONs |
| `Environments/` | Zone environment configs | Per-zone environment JSONs |
| `Weathers/` | Weather system definitions | Weather configs per zone |
| `Instances/` | World instance definitions (27 types) | Dungeon, zone configs |
| `Prefabs/` | Prefabricated structure definitions | Cave, monument, plant prefabs |
| `Particles/` | Particle spawner configurations | Weather particles, effects |
| `Entity/` | Entity type definitions | Entity configs |
| `Farming/` | Crop and farming mechanics | Growth stage configs |
| `Projectiles/` | Projectile behavior configs | Arrow, spell projectiles |

### Key File Types

| Extension | Description | Location |
|-----------|-------------|----------|
| `.blockymodel` | Hytale 3D voxel model (created in Blockbench) | Common/ |
| `.blockyanim` | Hytale animation file | Common/ |
| `.png` | Textures (must be multiples of 32px) | Common/ |
| `.ogg` | Compressed audio | Common/Sounds/, Common/Music/ |
| `.lpf` | Hytale audio format | Common/Sounds/, Common/Music/ |
| `.json` | Configuration files | Server/ (primarily) |
| `.lang` | Localization strings | Common/Languages/ |
| `.ui` | UI layout definitions | Common/UI/ |
| `.particlespawner` | Particle spawner config | Server/Particles/ |
| `.particlesystem` | Particle system definition | Server/Particles/ |

### Asset Naming Conventions

1. **Prefix-based categorization**:
   - `Rev_*` - Reverb effects (e.g., `Rev_Cave.json`)
   - `EQ_*` - Equalizer effects (e.g., `EQ_Underwater.json`)
   - `AudioCat_*` - Audio categories
   - `Env_*` - Environment configs
   - `Drops_*` - Drop tables
   - `NPC_*` - NPC definitions
   - `Template_*` - Base templates for inheritance

2. **Zone notation**: `Zone1_Plains1`, `Zone2_Desert1`, `Zone3_Taiga1`, `Zone4_Volcanic1`

3. **Stage progression**: `Stage1`, `Stage2`, `StageFinal`, `Eternal_*`

4. **Path references in JSON**: Use forward slashes, e.g., `"Items/Weapons/Sword/Iron.blockymodel"`

### Template/Inheritance System

Assets use a `"Parent"` field for inheritance:
```json
{
  "Parent": "Template_Weapon_Sword",
  "Model": "Items/Weapons/Sword/Mithril.blockymodel",
  "MaxDurability": 220
}
```

Templates define base properties; child assets override specific fields.

**Key Template Locations**:
- Weapons: `Assets/Server/Item/Items/Weapon/[Type]/Template_Weapon_[Type].json`
- Items: `Assets/Server/Item/Items/[Category]/Template_*.json`

---

## Weapon/Item Schema Reference

### Complete Item Definition Structure
```json
{
  "Parent": "Template_Weapon_Sword",        // Inherits from template
  "TranslationProperties": {
    "Name": "server.items.Weapon_Sword_Iron.name"
  },
  "Model": "Items/Weapons/Sword/Iron.blockymodel",
  "Texture": "Items/Weapons/Sword/Iron_Texture.png",
  "Icon": "Icons/ItemsGenerated/Weapon_Sword_Iron.png",
  "Quality": "Common",                       // Common/Uncommon/Rare/Epic/Legendary
  "ItemLevel": 15,
  "MaxDurability": 80,
  "DurabilityLossOnHit": 0.21,
  "Categories": ["Items.Weapons"],
  "Tags": {
    "Type": ["Weapon"],
    "Family": ["Sword"]
  },
  "Interactions": {
    "Primary": "Root_Weapon_Sword_Primary",
    "Secondary": "Root_Weapon_Sword_Secondary_Guard"
  },
  "InteractionVars": {
    "Swing_Left_Damage": {
      "Interactions": [{
        "Parent": "Weapon_Sword_Primary_Swing_Left_Damage",
        "DamageCalculator": { "BaseDamage": { "Physical": 10 } }
      }]
    }
  },
  "Recipe": {
    "TimeSeconds": 5,
    "Input": [{"ItemId": "Ingredient_Bar_Iron", "Quantity": 3}],
    "BenchRequirement": [{"Id": "Weapon_Bench", "RequiredTierLevel": 1}]
  },
  "ItemSoundSetId": "ISS_Weapons_Blade_Large"
}
```

### Key Asset Directories for Items
- **Definitions**: `Assets/Server/Item/Items/[Category]/`
- **Templates**: `Assets/Server/Item/Items/[Category]/Template_*.json`
- **Interactions**: `Assets/Server/Item/Interactions/`
- **Root Interactions**: `Assets/Server/Item/RootInteractions/`
- **Models**: `Assets/Common/Items/[Category]/`
- **Icons**: `Assets/Common/Icons/ItemsGenerated/`

### Damage System Schema
```json
{
  "DamageCalculator": {
    "BaseDamage": { "Physical": 18 },
    "Type": "Absolute"
  },
  "DamageEffects": {
    "Knockback": { "Force": 1, "VelocityY": 5 },
    "WorldSoundEventId": "SFX_Sword_Impact",
    "WorldParticles": [{ "SystemId": "Impact_Blade_01" }]
  }
}
```

---

## Blockbench Integration

The **Hytale Blockbench Plugin** is the official tool for creating assets.

### Download Sources
- **Blockbench**: https://blockbench.net
- **Hytale Plugin**: https://github.com/JannisX11/hytale-blockbench-plugin
- **Official Guide**: https://hytale.com/news/2025/12/an-introduction-to-making-models-for-hytale

### Technical Requirements
| Constraint | Value |
|------------|-------|
| Max nodes | 255 |
| Geometry types | Cubes and flat quads only |
| Texture sizes | Multiples of 32px (32, 64, 96, 128...) |
| Grid scale (props/blocks) | 32px = 1 block |
| Grid scale (characters) | 64px = 1 block |
| Geometry stretching | 0.7x - 1.3x |

### File Outputs
- `.blockymodel` - 3D model files
- `.blockyanim` - Animation files
- `.png` - Texture files (must be correct size)

---

## Page Format & Consistency Requirements

### File Format: .mdx Required

**All documentation pages MUST use the `.mdx` format** (not `.md`) to enable consistent use of Starlight components. The `.mdx` format allows importing and using JSX components like `<Aside>`, `<FileTree>`, `<Steps>`, `<Tabs>`, etc.

When creating or modifying pages:
1. Always use `.mdx` extension
2. Import required components at the top of the file
3. Use Starlight components instead of markdown alternatives

### Component Usage Guidelines

| Content Type | Use Component | Instead of |
|--------------|---------------|------------|
| Warnings/Notes/Tips | `<Aside type="caution/note/tip">` | `:::caution` markdown syntax |
| Directory structures | `<FileTree>` | Code blocks with ASCII trees |
| Numbered procedures | `<Steps>` | Plain numbered lists |
| Multiple related examples | `<Tabs>` / `<TabItem>` | Multiple code blocks |
| Navigation cards | `<CardGrid>` / `<Card>` | Bulleted links |
| Status indicators | `<Badge>` | Inline text |

### Page Length Guidelines

Pages should be focused and navigable. Follow these guidelines:
- **Target length**: 200-400 lines
- **Maximum length**: 500 lines (unless justified)
- **If over 500 lines**: Split into focused sub-pages

When splitting pages:
1. Create an overview page for the section
2. Create focused sub-pages for specific topics
3. Update `astro.config.mjs` sidebar with new structure
4. Ensure cross-links between related pages

### Current Documentation Status

**File format distribution** (as of last audit):
- `.mdx` files: Using Starlight components
- `.md` files: Need conversion to `.mdx`

See `TODO.md` Phase 0 for the complete conversion checklist.

---

## Documentation Standards

### Verification Tags
```markdown
<!-- [VERIFIED: 2026-01-19] -->      <!-- Confirmed accurate -->
<!-- [NEEDS-REVIEW] -->               <!-- Needs verification -->
<!-- [INCOMPLETE] -->                 <!-- Missing content -->
<!-- [EXAMPLE-NEEDED] -->             <!-- Needs code example -->
```

### Page Structure Template
```markdown
---
title: "Page Title"
---

<!-- [VERIFIED: DATE] -->

import { Aside, Tabs, TabItem } from '@astrojs/starlight/components';

<Aside type="caution" title="AI-Generated Content">
This documentation was generated from analysis of game assets.
</Aside>

# Page Title

Brief introduction explaining what this covers and why it matters.

## Package Location
`com.hypixel.hytale.server.core.asset.type.ClassName`

## Overview
High-level explanation of the system.

## Schema Reference

### Required Fields
| Field | Type | Description |
|-------|------|-------------|
| `Id` | `string` | Unique identifier |

### Optional Fields
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `Quality` | `string` | `"Common"` | Item quality tier |

## Examples

### Basic Example
```json title="Weapon_Sword_Iron.json"
{
  "Parent": "Template_Weapon_Sword",
  "Model": "Items/Weapons/Sword/Iron.blockymodel"
}
```

### Advanced Example
<Tabs>
  <TabItem label="Definition">
    ```json
    // Full example
    ```
  </TabItem>
  <TabItem label="Template">
    ```json
    // Template reference
    ```
  </TabItem>
</Tabs>

## Usage in Code

```java title="Using items in plugin code"
Item sword = Item.getAssetMap().get("Weapon_Sword_Iron");
```

## Best Practices
1. Always use plugin prefix for custom asset IDs
2. Inherit from templates when possible
3. Test assets in-game before publishing

## Related
- [Templates](/api-reference/assets/templates/) - Template inheritance system
- [Plugin Manifest](/getting-started/plugin-manifest/) - Asset pack configuration
```

### Code Example Standards
- Always include complete imports
- No placeholder code (`TODO`, `...`)
- Use realistic Hytale API classes
- Show both basic and advanced patterns
- Include `title="filename"` for code blocks
- Highlight important lines with `{line-numbers}`

### JSON Example Standards
- Pull from real files in `/Assets/` directory
- Include comments explaining non-obvious fields
- Show both minimal and complete examples
- Use tabs for multiple variants

---

## Build & Deploy

```bash
# Development
npm run dev          # Start dev server at localhost:4321

# Build
npm run build        # Build for production

# Preview (Cloudflare Workers)
npm run preview      # Test with Wrangler locally

# Deploy
npm run deploy       # Deploy to Cloudflare Workers
```

### Link Validation
The `starlight-links-validator` plugin runs during build and will fail on broken internal links. Always run `npm run build` before committing.

---

## Quick Reference: Asset File Locations

| Asset Type | Server Config | Client Assets |
|------------|---------------|---------------|
| Weapons | `Assets/Server/Item/Items/Weapon/` | `Assets/Common/Items/Weapons/` |
| Blocks | `Assets/Server/BlockTypeList/` | `Assets/Common/Blocks/` |
| NPCs | `Assets/Server/NPC/`, `Assets/Server/Models/` | `Assets/Common/NPC/` |
| Sounds | `Assets/Server/Audio/` | `Assets/Common/Sounds/` |
| Particles | `Assets/Server/Particles/` | `Assets/Common/Particles/` |
| Weather | `Assets/Server/Weathers/` | - |
| Environments | `Assets/Server/Environments/` | - |

---

## Current Documentation Status

### Completed
- Plugin API (getting started, core concepts, API reference)
- Asset System Overview (`/api-reference/assets/overview.md`)

### In Progress
- Detailed asset type documentation (see TODO.md)
- Blockbench workflow guides
- Asset creation tutorials

### Source Files for Reference
- Existing docs: `src/content/docs/`
- Example asset overview: `src/content/docs/api-reference/assets/overview.md`
- Example tutorial: `src/content/docs/getting-started/first-plugin.md`
