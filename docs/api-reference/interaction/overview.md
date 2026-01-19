<!-- [VERIFIED: 2026-01-19] -->

# Interaction System

The interaction system handles all player interactions with blocks, entities, and items through a chain-based execution model with server-client synchronization.

## Package Location

- Module: `com.hypixel.hytale.server.core.modules.interaction`
- Manager: `com.hypixel.hytale.server.core.entity`
- Configs: `com.hypixel.hytale.server.core.modules.interaction.interaction.config`

## Overview

Interactions are defined as chains of operations that execute in sequence. When a player clicks, the system resolves which interaction to run based on held item, target, and interaction type.

```
Player Input → InteractionManager → InteractionChain → Operations
     ↓                                      ↓
  MouseClick                         PlaceBlock, BreakBlock,
                                     UseEntity, Damage, etc.
```

## Core Components

### InteractionModule

Central plugin managing the interaction system:

```java
package com.hypixel.hytale.server.core.modules.interaction;

public class InteractionModule extends JavaPlugin {
    // Singleton access
    public static InteractionModule get();

    // Component types
    public ComponentType<EntityStore, InteractionManager> getInteractionManagerComponent();
    public ComponentType<ChunkStore, PlacedByInteractionComponent> getPlacedByComponentType();
    public ComponentType<ChunkStore, TrackedPlacement> getTrackedPlacementComponentType();

    // Resources
    public ResourceType<ChunkStore, BlockCounter> getBlockCounterResourceType();
}
```

### InteractionManager

Per-entity component managing interaction chains:

```java
package com.hypixel.hytale.server.core.entity;

public class InteractionManager implements Component<EntityStore> {
    // Max interaction reach
    public static final double MAX_REACH = 8.0;

    // Start interaction chain
    public boolean tryStartChain(
        Ref<EntityStore> ref,
        CommandBuffer<EntityStore> commandBuffer,
        InteractionType type,
        InteractionContext context,
        RootInteraction rootInteraction
    );

    // Start chain unconditionally
    public void startChain(
        Ref<EntityStore> ref,
        CommandBuffer<EntityStore> commandBuffer,
        InteractionType type,
        InteractionContext context,
        RootInteraction rootInteraction
    );

    // Process mouse input
    public void doMouseInteraction(
        Ref<EntityStore> ref,
        MouseInteraction mouseInteraction,
        ComponentAccessor<EntityStore> componentAccessor,
        CommandBuffer<EntityStore> commandBuffer
    );

    // Tick active chains
    public void tick();

    // Check if interaction can run
    public boolean canRun(
        InteractionType type,
        RootInteraction rootInteraction,
        InteractionContext context
    );

    // Walk chain to collect data
    public <T> void walkChain(
        Ref<EntityStore> ref,
        Collector<T> collector,
        InteractionType type,
        RootInteraction rootInteraction,
        ComponentAccessor<EntityStore> componentAccessor
    );
}
```

### InteractionChain

Represents execution state of an interaction:

```java
package com.hypixel.hytale.server.core.entity;

public class InteractionChain {
    // State
    public InteractionState getServerState();
    public InteractionState getClientState();
    public void updateServerState(InteractionState state);

    // Context
    public InteractionType getType();
    public RootInteraction getRootInteraction();
    public InteractionContext getContext();

    // Progress
    public int getOperationCounter();
    public long getTimestamp();

    // Forking
    public InteractionChain fork(
        InteractionContext forkedContext,
        RootInteraction forkedRootInteraction
    );

    public InteractionChain getForkedChain(int index);
}
```

### InteractionContext

Execution context passed to operations:

```java
package com.hypixel.hytale.server.core.entity;

public class InteractionContext {
    // Entity access
    public Ref<EntityStore> getEntity();
    public CommandBuffer<EntityStore> getCommandBuffer();

    // Item context
    public ItemStack getHeldItem();
    public byte getHeldItemSlot();
    public ItemContext createHeldItemContext();

    // Metadata
    public DynamicMetaStore<InteractionContext> getMetaStore();

    // Fork chains
    public InteractionChain fork(
        RootInteraction forkedRootInteraction
    );

    // Factory
    public static InteractionContext forInteraction(
        InteractionManager manager,
        Ref<EntityStore> entity,
        InteractionType type,
        CommandBuffer<EntityStore> commandBuffer
    );
}
```

## Interaction Types

| Type | Description |
|------|-------------|
| `Held` | Primary held item interaction (left click) |
| `HeldOffhand` | Secondary/utility interaction (right click) |
| `Equipped` | Equipment/armor interactions |

## Interaction States

| State | Description |
|-------|-------------|
| `NotFinished` | Operation still executing |
| `Finished` | Operation completed successfully |
| `Failed` | Operation failed |
| `Cancelled` | Operation cancelled |

## Context Metadata Keys

Standard metadata stored in context:

| Key | Type | Description |
|-----|------|-------------|
| `TARGET_BLOCK` | Vector3i | Block position being interacted with |
| `TARGET_ENTITY` | Ref | Entity being targeted |
| `TARGET_SLOT` | int | Inventory slot for containers |
| `HIT_LOCATION` | Vector4d | Hit point on block/entity |
| `HIT_DETAIL` | varies | Additional hit details |

## Usage Examples

### Accessing InteractionManager

```java
import com.hypixel.hytale.server.core.entity.InteractionManager;
import com.hypixel.hytale.server.core.modules.interaction.InteractionModule;

// Get interaction manager from entity
Ref<EntityStore> entityRef = /* entity reference */;
InteractionManager manager = componentAccessor.getComponent(
    entityRef,
    InteractionModule.get().getInteractionManagerComponent()
);
```

### Starting an Interaction Chain

```java
import com.hypixel.hytale.server.core.entity.InteractionContext;
import com.hypixel.hytale.server.core.modules.interaction.interaction.config.RootInteraction;
import com.hypixel.hytale.protocol.InteractionType;

// Get root interaction
RootInteraction root = RootInteraction.getAssetMap().getAsset("PlaceBlock");

// Create context
InteractionContext context = InteractionContext.forInteraction(
    manager,
    entityRef,
    InteractionType.Held,
    commandBuffer
);

// Set target block in metadata
context.getMetaStore().put(Interaction.TARGET_BLOCK, targetBlockPos);

// Try to start chain (respects cooldowns and rules)
boolean started = manager.tryStartChain(
    entityRef,
    commandBuffer,
    InteractionType.Held,
    context,
    root
);

if (started) {
    // Chain started successfully
}
```

### Walking Chain for Data

```java
import com.hypixel.hytale.server.core.modules.interaction.interaction.BallisticData;

// Collect weapon data from interaction
SingleCollector<BallisticData> collector = new SingleCollector<>();

manager.walkChain(
    entityRef,
    collector,
    InteractionType.Held,
    rootInteraction,
    componentAccessor
);

BallisticData data = collector.getResult();
if (data != null) {
    // Use ballistic data (trajectory, damage, etc.)
}
```

### Checking if Interaction Can Run

```java
// Check cooldowns, blocking rules, etc.
if (manager.canRun(InteractionType.Held, rootInteraction, context)) {
    // Interaction is available
} else {
    // On cooldown or blocked
}
```

## RootInteraction Configuration

Entry point defining an interaction chain:

```java
package com.hypixel.hytale.server.core.modules.interaction.interaction.config;

public class RootInteraction {
    // Identity
    String id;
    String[] interactionIds;  // Operations to execute

    // Cooldown
    InteractionCooldown cooldown;

    // Per-gamemode settings
    Map<GameMode, RootInteractionSettings> settings;

    // Rules for blocking/interrupting
    InteractionRules rules;

    // Asset access
    public static AssetMap<RootInteraction> getAssetMap();
}
```

### InteractionCooldown

```java
public class InteractionCooldown {
    String cooldownId;        // Shared cooldown identifier
    float cooldown;           // Duration in seconds
    float[] chargeTimes;      // Charge levels
    boolean skipCooldownReset;
    boolean interruptRecharge;
    boolean clickBypass;
}
```

## Built-in Interaction Types

Over 60 interaction types are registered:

| Category | Examples |
|----------|----------|
| Block | PlaceBlock, BreakBlock, DamageBlock |
| Entity | UseEntity, Damage, Mount |
| Camera | Camera, CameraTarget, CameraShake |
| Effects | SpawnParticle, PlaySound, CreateLight |
| Combat | Knockback, AOECircle, AOECylinder |
| UI | OpenCustomUI, OpenInventory |
| Physics | LaunchProjectile, LaunchEntity |

## Overlap Behavior

When starting an interaction while another is running:

| Behavior | Description |
|----------|-------------|
| `Allow` | Both can run simultaneously |
| `Block` | New interaction blocked |
| `Interrupt` | Old interaction cancelled |

## Related

- [Block Tracking](block-tracking.md) - Track block placements
- [Custom Interactions](custom-interactions.md) - Create custom interactions
- [Entity System](../entities/overview.md) - Entity management

