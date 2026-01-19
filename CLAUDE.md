# Hytale Server Modding Documentation - Contributor Guide

## Current Project Phase: Refinement

The initial documentation pass is complete. The focus is now on:
1. **Accuracy verification** - Confirming existing docs against source code
2. **Gap filling** - Documenting missing systems (networking, permissions, codecs, physics)
3. **Quality improvement** - Ensuring code examples compile and cross-references work

## Source Material

**Location:** `extracted/com/hypixel/hytale/`
**Total Files:** ~5,218 Java files across ~932 packages

### Package Reference

| Package | Purpose | Documentation Status |
|---------|---------|---------------------|
| `server/core/plugin/` | Plugin system | Exists, needs verification |
| `server/core/event/` | Events | Exists, needs verification |
| `server/core/command/` | Commands | Exists, needs verification |
| `component/` | ECS | Exists, needs verification |
| `server/core/universe/` | World system | Exists, needs verification |
| `protocol/` | Networking | **Missing** |
| `server/core/permissions/` | Permissions | **Missing** |
| `codec/` | Serialization | **Missing** |
| `server/core/modules/physics/` | Physics | **Missing** |
| `math/` | Math utilities | **Missing** |
| `builtin/` | Reference plugins | Partial |

---

## Completion Criteria

### For a Document to be Complete

Every documentation file must satisfy ALL of these:

**Accuracy:**
- [ ] All class names exist in source at stated package
- [ ] All method signatures match source exactly
- [ ] All enum values match source exactly
- [ ] Code examples have been tested to compile

**Completeness:**
- [ ] Package location stated at top
- [ ] Class hierarchy documented (extends/implements)
- [ ] All public constructors documented
- [ ] All public methods documented with signatures
- [ ] Return types and parameter types specified

**Usability:**
- [ ] Clear one-sentence description at top
- [ ] At least one practical code example
- [ ] Cross-references to related documentation
- [ ] No placeholder text (`TODO`, `TBD`, etc.)

### Verification Tags

Use these tags to mark documentation status:

```markdown
<!-- [VERIFIED: 2026-01-19] -->     # Confirmed accurate against source
<!-- [NEEDS-REVIEW] -->             # Exists but needs accuracy check
<!-- [INCOMPLETE] -->               # Missing significant content
<!-- [EXAMPLE-NEEDED] -->           # Needs working code example
```

Place tags at the top of sections they apply to.

---

## Refinement Workflows

### Workflow 1: Auditing Existing Documentation

Use this when reviewing a file that already exists.

1. **Open the doc and the source file side-by-side**
   ```
   Doc: docs/core-concepts/event-system.md
   Source: extracted/com/hypixel/hytale/event/EventBus.java
   ```

2. **Verify class/interface names**
   - Does the class exist at the stated package?
   - Is the class hierarchy correct?

3. **Verify method signatures**
   - Do all documented methods exist?
   - Are parameter types correct?
   - Are return types correct?

4. **Test code examples**
   - Copy example to a scratch plugin
   - Does it compile?
   - Are all imports available?

5. **Check for missing content**
   - Are there public methods not documented?
   - Are there important patterns not shown?

6. **Update and tag**
   - Fix any errors found
   - Add `[VERIFIED: YYYY-MM-DD]` tag
   - Or add appropriate issue tag if problems remain

### Workflow 2: Filling Documentation Gaps

Use this when creating new documentation.

1. **Identify the source files**
   ```
   Topic: Permission System
   Sources: extracted/com/hypixel/hytale/server/core/permissions/
   ```

2. **Survey the package**
   - List all public classes
   - Identify the main entry points
   - Note interfaces vs implementations

3. **Find usage examples in builtin/**
   ```
   grep -r "Permission" extracted/com/hypixel/hytale/builtin/
   ```

4. **Document in order**
   - Overview/purpose first
   - Core interfaces/classes
   - Registration/setup methods
   - Usage patterns with examples
   - Advanced features

5. **Create working examples**
   - Include all necessary imports
   - Show minimal and complete versions
   - Test that examples compile

6. **Add cross-references**
   - Link to prerequisite knowledge
   - Link to related systems
   - Add to relevant index/glossary

### Workflow 3: Verifying Code Examples

1. **Create a test plugin project** (once)
   ```
   test-plugin/
   ├── build.gradle
   ├── src/main/java/
   │   └── TestPlugin.java
   └── plugin.json
   ```

2. **For each code example**
   - Copy to test plugin
   - Add any missing imports
   - Attempt to compile
   - Note any errors

3. **Fix examples that fail**
   - Update the documentation
   - Ensure imports are included
   - Use correct method signatures

---

## Documentation Standards

### File Structure

Every documentation file should follow this structure:

```markdown
# Title

Brief one-paragraph description of what this covers.

## Overview

Architecture or concept explanation with diagram if helpful.

## Package Location

`com.hypixel.hytale.path.to.package`

## Core Classes/Interfaces

### ClassName

Description of the class.

**Hierarchy:**
- Extends: `ParentClass`
- Implements: `InterfaceA`, `InterfaceB`

**Constructors:**
| Constructor | Description |
|-------------|-------------|
| `ClassName()` | Default constructor |
| `ClassName(Type param)` | Creates with param |

**Methods:**
| Method | Return | Description |
|--------|--------|-------------|
| `methodName(Type param)` | `ReturnType` | What it does |

## Usage Examples

### Basic Usage

```java
import com.hypixel.hytale.path.ClassName;

// Complete, compilable example
```

### Advanced Usage

```java
// More complex example
```

## Related Documentation

- [Related Topic](../path/to/related.md)
- [Another Topic](../path/to/another.md)
```

### Code Example Requirements

Every code example must:

1. **Include imports**
   ```java
   import com.hypixel.hytale.server.core.plugin.JavaPlugin;
   import com.hypixel.hytale.event.EventPriority;
   ```

2. **Be complete enough to compile**
   - Show full method signatures
   - Include class wrapper if needed
   - No `...` or `// more code here`

3. **Be practical**
   - Show real use cases
   - Avoid contrived examples
   - Match patterns from builtin plugins

4. **Be concise**
   - Minimal code to demonstrate the point
   - Comments only where logic isn't obvious

### Method Documentation Format

Use tables for method lists:

```markdown
| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `getName()` | none | `String` | Returns the name |
| `setEnabled(boolean)` | `enabled: boolean` | `void` | Enables or disables |
| `find(String, Predicate<T>)` | `name: String`, `filter: Predicate<T>` | `Optional<T>` | Finds matching item |
```

### Enum Documentation Format

```markdown
| Value | Description |
|-------|-------------|
| `FIRST` | Processed before others |
| `NORMAL` | Default priority |
| `LAST` | Processed after others |
```

---

## Key Source Files

### Plugin System
- `server/core/plugin/JavaPlugin.java` - Main base class
- `server/core/plugin/PluginBase.java` - Core functionality
- `common/plugin/PluginManifest.java` - Manifest schema
- `server/core/plugin/PluginManager.java` - Plugin loading

### Event System
- `event/EventBus.java` - Event dispatcher
- `event/IEvent.java` - Sync event interface
- `event/IAsyncEvent.java` - Async event interface
- `event/ICancellable.java` - Cancellation mixin
- `event/EventPriority.java` - Priority enum

### Command System
- `server/core/command/system/AbstractCommand.java` - Command base
- `server/core/command/system/CommandManager.java` - Registration
- `server/core/command/system/CommandContext.java` - Execution context
- `server/core/command/system/arguments/` - Argument types

### ECS
- `component/ComponentType.java` - Component definition
- `component/system/System.java` - System base
- `component/query/Query.java` - Entity queries
- `server/core/universe/world/storage/EntityStore.java` - Entity storage
- `server/core/universe/world/storage/ChunkStore.java` - Chunk storage

### World System
- `server/core/universe/Universe.java` - Universe singleton
- `server/core/universe/world/World.java` - World class
- `server/core/universe/world/Chunk.java` - Chunk class

---

## Built-in Plugin Reference

These plugins demonstrate real-world API usage:

| Plugin | Location | Key Patterns |
|--------|----------|--------------|
| WeatherPlugin | `builtin/weather/` | Components, systems, commands |
| FluidPlugin | `builtin/fluid/` | Block states, fluid simulation |
| MountPlugin | `builtin/mounts/` | Entity relationships, packets |
| TeleportPlugin | `builtin/teleport/` | Commands, location handling |
| CraftingPlugin | `builtin/crafting/` | Recipes, inventory events |
| PortalsPlugin | `builtin/portals/` | World transitions |
| BedsPlugin | `builtin/beds/` | Spawn points, block interactions |
| AdventurePlugin | `builtin/adventure/` | Game modes, progression |
| BlockPhysicsPlugin | `builtin/blockphysics/` | Physics integration |
| NPCEditorPlugin | `builtin/npceditor/` | NPC management commands |

### Using Built-ins as Reference

When documenting an API:
1. Search builtin plugins for usage
2. Note patterns that repeat across plugins
3. Use these patterns in examples
4. Reference the builtin in documentation

---

## Common Patterns

### Plugin Registration
```java
public class MyPlugin extends JavaPlugin {
    public MyPlugin(JavaPluginInit init) {
        super(init);
    }

    @Override
    protected void setup() {
        getEventRegistry().register(PlayerConnectEvent.class, this::onConnect);
        getCommandRegistry().register(new MyCommand());
        getEntityStoreRegistry().registerSystem(new MySystem());
    }

    private void onConnect(PlayerConnectEvent event) {
        getLogger().info("Player connected: " + event.getPlayerRef().getUsername());
    }
}
```

### Event Handling
```java
// With priority
getEventRegistry().register(
    EventPriority.EARLY,
    PlayerChatEvent.class,
    event -> {
        if (event.getMessage().contains("banned_word")) {
            event.setCancelled(true);
        }
    }
);
```

### Command Creation
```java
public class GreetCommand extends AbstractPlayerCommand<GreetCommand> {
    public GreetCommand() {
        super("greet", "Greets the player");
    }

    @Override
    protected void execute(CommandContext context, Player player) {
        context.sendSuccess("Hello, " + player.getUsername() + "!");
    }
}
```

---

## Quality Checklist

Before marking documentation complete, verify:

### Accuracy
- [ ] Opened source file and compared class name
- [ ] Verified package path is correct
- [ ] Checked all method signatures exist
- [ ] Confirmed enum values are accurate
- [ ] Tested code examples compile

### Completeness
- [ ] All public constructors listed
- [ ] All public methods documented
- [ ] Return types specified
- [ ] Parameter types specified
- [ ] Exceptions noted where relevant

### Usability
- [ ] Has clear introductory description
- [ ] Has at least one working example
- [ ] Has cross-references to related docs
- [ ] No TODO or placeholder text
- [ ] Formatting is consistent

### Final Steps
- [ ] Add `[VERIFIED: YYYY-MM-DD]` tag
- [ ] Update TODO.md to mark complete
- [ ] Check if related docs need updates
