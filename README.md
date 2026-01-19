# Hytale Server Modding Documentation

Unofficial documentation for creating plugins and mods for the Hytale dedicated server.

## Project Status

**Current Phase:** Refinement & Gap-Filling

| Metric | Value |
|--------|-------|
| Documentation Files | 17 |
| Total Lines | ~6,800 |
| Source Files Analyzed | 5,218 Java files |
| Coverage | Core systems documented, advanced features in progress |

### What's Done
- Plugin system (lifecycle, manifest, registries)
- Event system (registration, priorities, built-in events)
- Command system (base classes, arguments, context)
- ECS overview (components, systems, queries)
- World system basics (universe, worlds, chunks, blocks)
- Entity system basics (creation, management, living entities)
- Asset system overview (types, packs, loading)
- NPC/Flock system overview
- World generation basics

### What's In Progress
- Accuracy verification of existing documentation
- Networking/Protocol documentation
- Permission system documentation
- Serialization (Codec) documentation
- Physics system documentation
- Complete component catalog
- Complete event catalog

## Documentation Structure

```
docs/
├── getting-started/          # Start here
│   ├── setup.md              # Development environment
│   ├── first-plugin.md       # Your first plugin
│   ├── plugin-lifecycle.md   # Plugin states and methods
│   └── plugin-manifest.md    # plugin.json reference
│
├── core-concepts/            # Essential knowledge
│   ├── event-system.md       # Events and listeners
│   ├── ecs-overview.md       # Entity Component System
│   ├── commands.md           # Command creation
│   └── registries.md         # Registration system
│
├── api-reference/            # Detailed API docs
│   ├── world/                # Universe, World, Chunks
│   ├── entities/             # Entity management
│   ├── blocks/               # Block types and states
│   ├── assets/               # Asset types
│   ├── inventory/            # Containers and items
│   ├── npc/                  # NPC and Flock AI
│   └── worldgen/             # World generation
│
├── tutorials/                # Practical guides
│   └── builtin-plugins.md    # Built-in plugin analysis
│
└── appendix/                 # Reference materials
    └── glossary.md           # Terminology
```

## Quick Start

1. **Set up your development environment**
   - See [getting-started/setup.md](docs/getting-started/setup.md)

2. **Create your first plugin**
   - See [getting-started/first-plugin.md](docs/getting-started/first-plugin.md)

3. **Understand the core systems**
   - [Event System](docs/core-concepts/event-system.md) - React to game events
   - [Commands](docs/core-concepts/commands.md) - Add custom commands
   - [ECS Overview](docs/core-concepts/ecs-overview.md) - Entity Component System

## Source Material

This documentation is derived from analysis of `HytaleServer-sources.jar`, containing:
- ~5,218 Java source files
- ~932 packages
- Built-in reference plugins in `builtin/`

### Key Packages

| Package | Purpose |
|---------|---------|
| `server/core/plugin/` | Plugin system, lifecycle |
| `server/core/event/` | Server events |
| `server/core/command/` | Command framework |
| `component/` | Entity Component System |
| `server/core/universe/` | Worlds and chunks |
| `builtin/` | Reference plugin implementations |

## Documentation Standards

All documentation in this project must meet:

### Accuracy
- Class/method names verified against source
- Code examples compile with correct imports
- Parameter and return types are accurate

### Completeness
- All public API methods documented
- Package locations specified
- Related classes cross-referenced

### Digestibility
- Clear, concise descriptions
- Practical working examples
- Logical organization

See [CLAUDE.md](CLAUDE.md) for full documentation guidelines.

## Contributing

### Reporting Issues
If you find inaccuracies or gaps:
1. Check the source code in `extracted/` to verify
2. Note the file path and line numbers
3. Describe the discrepancy

### Adding Documentation
1. Follow the structure in [CLAUDE.md](CLAUDE.md)
2. Verify all code examples compile
3. Include package locations and imports
4. Cross-reference related documentation

### Priority Areas
See [TODO.md](TODO.md) for current priorities:
- High: Networking, Permissions
- Medium: Codecs, Physics, Catalogs
- Low: Math utilities, Configuration

## Verification Tags

Documentation uses these tags to indicate status:
- `[VERIFIED]` - Confirmed accurate against source
- `[NEEDS-REVIEW]` - Needs accuracy verification
- `[INCOMPLETE]` - Missing significant content
- `[EXAMPLE-NEEDED]` - Needs working code example

## License

This is unofficial community documentation. Hytale is a trademark of Hypixel Studios.
