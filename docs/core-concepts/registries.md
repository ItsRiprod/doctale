<!-- [VERIFIED: 2026-01-19] -->

# Plugin Registries

Hytale provides a comprehensive registry system for plugins to register their components, events, commands, and other features. All registries are accessed through your plugin's base class and automatically handle cleanup when your plugin is disabled.

## Package Location

- Plugin base: `com.hypixel.hytale.server.core.plugin.PluginBase`
- Component registry: `com.hypixel.hytale.component.ComponentRegistryProxy`
- Event registry: `com.hypixel.hytale.event.EventRegistry`
- Command registry: `com.hypixel.hytale.server.core.command.system.CommandRegistry`

## Overview

The following registries are available:

| Registry | Method | Purpose |
|----------|--------|---------|
| Command Registry | `getCommandRegistry()` | Register commands |
| Event Registry | `getEventRegistry()` | Register event listeners |
| Entity Store Registry | `getEntityStoreRegistry()` | Register entity ECS components/systems |
| Chunk Store Registry | `getChunkStoreRegistry()` | Register chunk ECS components/systems |
| Block State Registry | `getBlockStateRegistry()` | Register custom block states |
| Entity Registry | `getEntityRegistry()` | Register entity types |
| Task Registry | `getTaskRegistry()` | Register scheduled tasks |
| Asset Registry | `getAssetRegistry()` | Register asset types |
| Client Feature Registry | `getClientFeatureRegistry()` | Register client feature flags |
| Codec Registry | `getCodecRegistry(codec)` | Register to codec maps |

## Command Registry

Register commands that players and console can execute.

```java
@Override
protected void setup() {
    getCommandRegistry().registerCommand(new MyCommand());
}
```

### Methods

| Method | Description |
|--------|-------------|
| `registerCommand(AbstractCommand)` | Register a command with the server |

Commands are automatically unregistered when the plugin shuts down.

**See also:** [Command System](./commands.md)

## Event Registry

Register listeners for server events.

```java
@Override
protected void setup() {
    // Basic registration
    getEventRegistry().register(PlayerConnectEvent.class, this::onConnect);

    // With priority
    getEventRegistry().register(EventPriority.LATE, PlayerChatEvent.class, this::onChat);

    // Keyed events (filtered by key)
    getEventRegistry().register(SomeKeyedEvent.class, myKey, this::onKeyedEvent);

    // Global listener (receives all keyed events)
    getEventRegistry().registerGlobal(SomeKeyedEvent.class, this::onAnyKeyedEvent);

    // Unhandled listener (only if no other handler processed it)
    getEventRegistry().registerUnhandled(SomeEvent.class, this::onUnhandled);
}
```

### Methods

| Method | Description |
|--------|-------------|
| `register(Class, Consumer)` | Register for event with default priority |
| `register(EventPriority, Class, Consumer)` | Register with specific priority |
| `register(Class, Key, Consumer)` | Register for keyed event with specific key |
| `registerGlobal(Class, Consumer)` | Register to receive all keyed events |
| `registerUnhandled(Class, Consumer)` | Register fallback handler |
| `registerAsync(...)` | Async variants of above methods |

### Event Priorities

Events are processed in priority order:

| Priority | Value | Use Case |
|----------|-------|----------|
| `FIRST` | -21844 | Modify event before others see it |
| `EARLY` | -10922 | Early processing |
| `NORMAL` | 0 | Default priority |
| `LATE` | 10922 | React after modifications |
| `LAST` | 21844 | Final processing, monitoring |

You can also use raw `short` values for fine-grained control.

**See also:** [Event System](./event-system.md)

## Entity Store Registry

Register ECS components, resources, and systems for entities.

```java
@Override
protected void setup() {
    // Register a component type
    ComponentType<EntityStore, MyComponent> componentType =
        getEntityStoreRegistry().registerComponent(MyComponent.class, MyComponent::new);

    // Register with serialization (for saving/loading)
    ComponentType<EntityStore, SavedComponent> savedType =
        getEntityStoreRegistry().registerComponent(SavedComponent.class, "my_saved", SavedComponent.CODEC);

    // Register a resource (world-level data)
    ResourceType<EntityStore, MyResource> resourceType =
        getEntityStoreRegistry().registerResource(MyResource.class, MyResource::new);

    // Register a system
    getEntityStoreRegistry().registerSystem(new MyTickingSystem());

    // Register an ECS event type
    EntityEventType<EntityStore, MyEcsEvent> eventType =
        getEntityStoreRegistry().registerEntityEventType(MyEcsEvent.class);
}
```

### Methods

| Method | Description |
|--------|-------------|
| `registerComponent(Class, Supplier)` | Register a component type |
| `registerComponent(Class, String, BuilderCodec)` | Register serializable component |
| `registerResource(Class, Supplier)` | Register a resource type |
| `registerResource(Class, String, BuilderCodec)` | Register serializable resource |
| `registerSystem(ISystem)` | Register an ECS system |
| `registerSystemType(Class)` | Register a system type |
| `registerSystemGroup()` | Create a system group |
| `registerEntityEventType(Class)` | Register an entity event type |
| `registerWorldEventType(Class)` | Register a world event type |
| `registerSpatialResource(Supplier)` | Register spatial index resource |

**See also:** [ECS Overview](./ecs-overview.md)

## Chunk Store Registry

Register ECS components, resources, and systems for chunks. API mirrors Entity Store Registry.

```java
@Override
protected void setup() {
    ComponentType<ChunkStore, ChunkData> chunkDataType =
        getChunkStoreRegistry().registerComponent(ChunkData.class, ChunkData::new);

    getChunkStoreRegistry().registerSystem(new ChunkProcessingSystem());
}
```

## Block State Registry

Register custom block states for block types.

```java
@Override
protected void setup() {
    getBlockStateRegistry().register(/* block state registration */);
}
```

## Entity Registry

Register custom entity types.

```java
@Override
protected void setup() {
    getEntityRegistry().register(/* entity type registration */);
}
```

## Task Registry

Register scheduled and async tasks that should be managed by the plugin lifecycle.

```java
@Override
protected void setup() {
    CompletableFuture<Void> asyncTask = CompletableFuture.runAsync(() -> {
        // Background work
    });
    getTaskRegistry().registerTask(asyncTask);

    ScheduledFuture<Void> scheduledTask = scheduler.schedule(() -> {
        // Delayed work
    }, 5, TimeUnit.SECONDS);
    getTaskRegistry().registerTask(scheduledTask);
}
```

### Methods

| Method | Description |
|--------|-------------|
| `registerTask(CompletableFuture)` | Register an async task |
| `registerTask(ScheduledFuture)` | Register a scheduled task |

Registered tasks are automatically cancelled when the plugin shuts down.

## Asset Registry

Register custom asset types and modifiers.

```java
@Override
protected void setup() {
    getAssetRegistry().register(/* asset registration */);
}
```

**See also:** [Asset System](../api-reference/assets/overview.md)

## Client Feature Registry

Register client feature flags that affect client behavior.

```java
@Override
protected void setup() {
    getClientFeatureRegistry().register(/* client feature */);
}
```

## Codec Registry

Register entries to codec maps for serialization.

```java
@Override
protected void setup() {
    // Register to a string-keyed codec map
    getCodecRegistry(SomeType.CODEC_MAP).register("my_type", MyType.class, MyType.CODEC);

    // Register to an asset codec map
    getCodecRegistry(SomeAsset.CODEC_MAP).register(/* asset registration */);
}
```

### Variants

| Method | Type | Description |
|--------|------|-------------|
| `getCodecRegistry(StringCodecMapCodec)` | `CodecMapRegistry` | String-keyed registrations |
| `getCodecRegistry(AssetCodecMapCodec)` | `CodecMapRegistry.Assets` | Asset-type registrations |
| `getCodecRegistry(MapKeyMapCodec)` | `MapKeyMapRegistry` | Map-key registrations |

## Plugin Utilities

In addition to registries, your plugin has access to these utility methods:

### Logger

```java
// Get the plugin's logger
HytaleLogger logger = getLogger();

// Log at different levels
logger.at(Level.INFO).log("Plugin loaded!");
logger.at(Level.WARNING).log("Something might be wrong");
logger.at(Level.SEVERE).withCause(exception).log("Error occurred: %s", message);
```

### Data Directory

```java
// Get the plugin's data folder
Path dataDir = getDataDirectory();

// Example: save a file
Path configFile = dataDir.resolve("custom-data.json");
```

### Identifier

```java
// Get the plugin's unique identifier
PluginIdentifier id = getIdentifier();
String fullId = id.toString(); // "Group/Name"
```

### Manifest

```java
// Access manifest data
PluginManifest manifest = getManifest();
String version = manifest.getVersion().toString();
String description = manifest.getDescription();
```

### Permissions

```java
// Get the base permission node
String basePerm = getBasePermission(); // "group.name"

// Use for custom permissions
String myPerm = basePerm + ".myfeature"; // "group.name.myfeature"
```

### State Checking

```java
// Check plugin state
if (isEnabled()) {
    // Plugin is active
}

if (isDisabled()) {
    // Plugin is inactive
}

PluginState state = getState();
```

## Automatic Cleanup

All registrations made through these registries are automatically cleaned up when your plugin shuts down. You don't need to manually unregister:

- Event listeners
- Commands
- ECS components, resources, and systems
- Tasks
- Codec registrations

The cleanup happens in reverse order of registration, ensuring proper dependency handling.

## Best Practices

1. **Register in `setup()`**: Perform all registrations in the `setup()` method
2. **Store references**: Keep references to component/resource types for later use
3. **Use appropriate priorities**: Choose event priorities based on your needs
4. **Let cleanup happen automatically**: Don't manually unregister unless necessary

## Related

- [Plugin Lifecycle](../getting-started/plugin-lifecycle.md)
- [Event System](./event-system.md)
- [Command System](./commands.md)
- [ECS Overview](./ecs-overview.md)
