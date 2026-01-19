# Contributing to Hytale Server Modding Docs

Thank you for your interest in contributing! This documentation is community-driven and we welcome improvements from anyone.

## Code of Conduct

- Be respectful and constructive in all interactions
- Focus on improving the documentation for everyone
- Report issues rather than attacking contributors

## How to Contribute

### Reporting Issues

Found an error or have a suggestion? [Open an issue](https://github.com/ItsRiprod/doctale/issues/new/choose) with:
- Clear description of the problem or suggestion
- Link to the relevant documentation page
- If reporting an inaccuracy, reference the source code location in `extracted/`

### Making Changes

All contributions must go through pull requests. Direct pushes to `main` are not allowed.

#### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/YOUR_USERNAME/doctale.git
cd doctale
```

#### 2. Create a Branch

**Always work in a feature branch, never directly on `main`.**

```bash
git checkout -b your-branch-name
```

Use descriptive branch names:
- `fix/typo-in-events-page`
- `docs/add-networking-section`
- `feature/new-tutorial`

#### 3. Set Up Development Environment

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

The site will be available at `http://localhost:4322/`

#### 4. Make Your Changes

- Edit files in `src/content/docs/`
- Follow the structure in [CLAUDE.md](CLAUDE.md)
- Test your changes locally with `npm run dev`
- Verify the build passes with `npm run build`

#### 5. Commit Your Changes

Write clear commit messages:

```bash
git add .
git commit -m "fix: correct method signature in event-system.md"
```

#### 6. Push and Create a Pull Request

```bash
git push origin your-branch-name
```

Then open a pull request on GitHub against the `main` branch.

## Pull Request Requirements

All pull requests **must include**:

### 1. Clear Description
Explain what you changed and why.

### 2. Screenshots
**Screenshots are required** for any changes that affect the rendered documentation. Include:
- Before/after screenshots for visual changes
- Screenshots of new content
- Screenshots showing the rendered result of code examples

### 3. Passing Build
The automated build check must pass. Run `npm run build` locally before submitting.

### 4. Review
At least one maintainer must approve before merging.

## Documentation Standards

### Content Guidelines

- **Accuracy**: Verify all information against the source code in `extracted/`
- **Code Examples**: Must be complete with all imports, no placeholders
- **Package Locations**: Always specify the full package path
- **Cross-References**: Link to related documentation pages

### File Format

All documentation files must include frontmatter:

```markdown
---
title: "Page Title"
---

Your content here...
```

### Using Components (MDX only)

For `.mdx` files, you can use Starlight components:

```mdx
import { Aside, Card, CardGrid } from '@astrojs/starlight/components';

<Aside type="note">Important information</Aside>
```

See [CLAUDE.md](CLAUDE.md) for the full component reference.

## What to Contribute

### High Priority
- Fixing inaccuracies in existing documentation
- Adding missing API documentation
- Improving code examples
- Adding tutorials for common tasks

### Medium Priority
- Expanding the component catalog
- Adding more event examples
- Improving cross-references

### Lower Priority
- Cosmetic improvements
- Minor wording changes

Check the [Issues](https://github.com/ItsRiprod/doctale/issues) page for specific tasks that need help.

## Review Process

1. Submit your pull request
2. Automated checks will run (build verification)
3. A maintainer will review your changes
4. Address any feedback
5. Once approved, your PR will be merged

## Questions?

- Open a [Discussion](https://github.com/ItsRiprod/doctale/discussions) for general questions
- Open an [Issue](https://github.com/ItsRiprod/doctale/issues) for bugs or specific problems

---

Thank you for helping improve the Hytale modding documentation!
