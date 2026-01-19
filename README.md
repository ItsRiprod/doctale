# Hytale Server Modding Documentation

[![Deploy to Cloudflare Workers](https://github.com/ItsRiprod/doctale/actions/workflows/deploy.yml/badge.svg)](https://github.com/ItsRiprod/doctale/actions/workflows/deploy.yml)

Unofficial, community-driven documentation for creating plugins and mods for the Hytale dedicated server.

**[View the Documentation](https://doctale.pages.dev)**

## About This Project

This documentation was generated through AI analysis of decompiled Hytale server code (~5,200 Java files). While we strive for accuracy, this is not official documentation from Hypixel Studios. Always verify API behavior against the actual server implementation.

### What's Documented

- Plugin system (lifecycle, manifest, registries)
- Event system (registration, priorities, built-in events)
- Command system (base classes, arguments, context)
- Entity Component System (components, systems, queries)
- World system (universe, worlds, chunks, blocks)
- Entity management (creation, management, living entities)
- Asset system (types, packs, loading)
- NPC/Flock AI system
- World generation basics

## Development Setup

### Prerequisites

- **Node.js** 20 or higher
- **npm** (comes with Node.js)
- A code editor (VS Code recommended)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/ItsRiprod/doctale.git
cd doctale

# Install dependencies
npm install

# Start the development server
npm run dev
```

The documentation site will be available at **http://localhost:4322/**

### Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build the site for production |
| `npm run preview` | Preview the production build locally |

### Project Structure

```
docs/
├── astro.config.mjs          # Site config, sidebar navigation
├── src/
│   ├── content/docs/         # All documentation (markdown/mdx)
│   └── styles/custom.css     # Theme customization
├── public/                   # Static assets (favicon, images)
├── extracted/                # Source code reference (~5,218 Java files)
├── CLAUDE.md                 # Documentation standards
└── CONTRIBUTING.md           # Contribution guidelines
```

### Editing Documentation

1. Navigate to `src/content/docs/`
2. Edit or create markdown/mdx files
3. Add frontmatter with at minimum a title:
   ```markdown
   ---
   title: "Page Title"
   ---
   ```
4. If creating a new page, add it to the sidebar in `astro.config.mjs`
5. Test locally with `npm run dev`
6. Verify the build passes with `npm run build`

## Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting changes.

### Contribution Workflow

1. **Fork** the repository
2. **Create a branch** for your changes (never work directly on `main`)
3. **Make your changes** and test locally
4. **Submit a pull request** with screenshots of your changes

### Requirements

- All changes must be made through pull requests
- PRs require screenshots showing the rendered changes
- The build must pass before merging
- At least one maintainer approval is required

### What We Need Help With

- Fixing inaccuracies in existing documentation
- Adding missing API documentation
- Improving and testing code examples
- Adding tutorials for common tasks
- Expanding the component and event catalogs

See our [Issues](https://github.com/ItsRiprod/doctale/issues) page for specific tasks.

## Branch Protection

The `main` branch is protected. All changes must go through pull requests with:
- Passing build checks
- Required reviewer approval
- Up-to-date branch with main

This ensures documentation quality and prevents accidental overwrites.

## Documentation Standards

See [CLAUDE.md](CLAUDE.md) for complete documentation standards including:
- File structure and frontmatter requirements
- Code example standards (complete imports, no placeholders)
- Available Starlight components for MDX files
- Source code reference locations

## Verification Tags

Documentation uses these tags to indicate status:
- `[VERIFIED]` - Confirmed accurate against source
- `[NEEDS-REVIEW]` - Needs accuracy verification
- `[INCOMPLETE]` - Missing significant content
- `[EXAMPLE-NEEDED]` - Needs working code example

## Tech Stack

- [Astro](https://astro.build/) - Static site generator
- [Starlight](https://starlight.astro.build/) - Documentation theme
- [Cloudflare Workers](https://workers.cloudflare.com/) - Hosting

## License

This is unofficial community documentation. Hytale is a trademark of Hypixel Studios. This project is not affiliated with or endorsed by Hypixel Studios.

## Links

- [Live Documentation](https://doctale.pages.dev)
- [GitHub Repository](https://github.com/ItsRiprod/doctale)
- [Report an Issue](https://github.com/ItsRiprod/doctale/issues/new/choose)
- [Start a Discussion](https://github.com/ItsRiprod/doctale/discussions)
