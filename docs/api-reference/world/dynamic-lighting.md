<!-- [VERIFIED: 2026-01-19] -->

# Dynamic Lighting

Dynamic lighting allows entities to emit light that moves with them. The system supports both temporary runtime lights and persistent lights that survive entity respawn.

## Package Location

- Components: `com.hypixel.hytale.server.core.modules.entity.component`
- Systems: `com.hypixel.hytale.server.core.modules.entity.dynamiclight`

## Overview

Dynamic lights are ECS components attached to entities. Two component types exist:

| Component | Persistence | Use Case |
|-----------|-------------|----------|
| `DynamicLight` | Runtime only | Temporary effects (spell glow, fire) |
| `PersistentDynamicLight` | Saved with entity | Permanent lights (lantern entity) |

## Components

### DynamicLight

Runtime light component for entities:

```java
package com.hypixel.hytale.server.core.modules.entity.component;

public class DynamicLight implements Component<EntityStore> {
    // Get current light color and radius
    public ColorLight getColorLight();

    // Update light (marks network dirty)
    public void setColorLight(ColorLight colorLight);

    // Check and reset network dirty flag
    public boolean consumeNetworkOutdated();

    // Get component type for ECS queries
    public static ComponentType<EntityStore, DynamicLight> getComponentType();
}
```

### PersistentDynamicLight

Serializable light component that persists with entity data:

```java
package com.hypixel.hytale.server.core.modules.entity.component;

public class PersistentDynamicLight implements Component<EntityStore> {
    // Codec key for serialization
    public static final String CODEC_KEY = "Light";

    // Constructor
    public PersistentDynamicLight(ColorLight colorLight);

    // Get light configuration
    public ColorLight getColorLight();

    // Get component type
    public static ComponentType<EntityStore, PersistentDynamicLight> getComponentType();
}
```

### ColorLight

Light color and radius definition:

```java
package com.hypixel.hytale.protocol;

public class ColorLight {
    public int radius;  // Light reach in blocks (0-255)
    public int red;     // Red intensity (0-15)
    public int green;   // Green intensity (0-15)
    public int blue;    // Blue intensity (0-15)

    public ColorLight(int radius, int red, int green, int blue);

    // Common presets
    public static final ColorLight NONE = new ColorLight(0, 0, 0, 0);
}
```

## ECS Systems

### DynamicLightSystems

Contains systems for managing dynamic lights:

```java
package com.hypixel.hytale.server.core.modules.entity.dynamiclight;

public class DynamicLightSystems {
    // Setup System: Creates DynamicLight from PersistentDynamicLight on spawn
    public static class Setup implements SpawnSystem<EntityStore> {
        // Query: Has PersistentDynamicLight AND NOT DynamicLight
        // On spawn: Creates DynamicLight component
    }

    // EntityTrackerRemove System: Notifies clients when light removed
    public static class EntityTrackerRemove
        extends RefChangeSystem<EntityStore, DynamicLight> {
        // Tracks DynamicLight removal
        // Sends ComponentUpdateType.DynamicLight to trackers
    }
}
```

## Usage Examples

### Adding Dynamic Light to Entity

```java
import com.hypixel.hytale.server.core.modules.entity.component.DynamicLight;
import com.hypixel.hytale.protocol.ColorLight;
import com.hypixel.hytale.server.core.modules.entity.EntityModule;

// Create light (radius 8, warm orange glow)
ColorLight torchLight = new ColorLight(8, 15, 10, 5);

// Get entity and add component
EntityStore store = world.getEntityStore();
Ref<EntityStore> entityRef = /* your entity reference */;

// Add dynamic light component
DynamicLight light = new DynamicLight();
light.setColorLight(torchLight);
store.addComponent(entityRef, DynamicLight.getComponentType(), light);
```

### Adding Persistent Light to Entity

```java
import com.hypixel.hytale.server.core.modules.entity.component.PersistentDynamicLight;
import com.hypixel.hytale.protocol.ColorLight;

// Create persistent light (survives respawn/reload)
ColorLight lanternLight = new ColorLight(12, 15, 15, 12);
PersistentDynamicLight persistentLight = new PersistentDynamicLight(lanternLight);

// Add to entity (DynamicLight will be auto-created by Setup system)
store.addComponent(entityRef, PersistentDynamicLight.getComponentType(), persistentLight);
```

### Updating Light Color

```java
import com.hypixel.hytale.server.core.modules.entity.component.DynamicLight;
import com.hypixel.hytale.protocol.ColorLight;

// Get existing light component
DynamicLight light = store.getComponent(entityRef, DynamicLight.getComponentType());

// Update to new color (flickering effect)
ColorLight flickerLight = new ColorLight(
    light.getColorLight().radius,
    random.nextInt(12, 16),  // Varying red
    random.nextInt(8, 12),   // Varying green
    random.nextInt(3, 7)     // Varying blue
);
light.setColorLight(flickerLight);

// Network update happens automatically (consumeNetworkOutdated() called by system)
```

### Removing Dynamic Light

```java
import com.hypixel.hytale.server.core.modules.entity.component.DynamicLight;

// Remove light component
store.removeComponent(entityRef, DynamicLight.getComponentType());

// EntityTrackerRemove system will notify clients
```

### Querying Entities with Lights

```java
import com.hypixel.hytale.server.core.modules.entity.component.DynamicLight;
import com.hypixel.hytale.component.query.Query;

// Create query for entities with dynamic lights
Query<EntityStore> lightQuery = Query.builder(EntityStore.class)
    .with(DynamicLight.getComponentType())
    .build();

// Iterate light-emitting entities
for (ArchetypeChunk<EntityStore> chunk : store.query(lightQuery)) {
    DynamicLight[] lights = chunk.getComponentArray(DynamicLight.getComponentType());
    for (int i = 0; i < chunk.getEntityCount(); i++) {
        ColorLight color = lights[i].getColorLight();
        // Process light...
    }
}
```

## Light Presets

Common light configurations:

| Light Type | Radius | R | G | B | Description |
|------------|--------|---|---|---|-------------|
| Torch | 8 | 15 | 10 | 5 | Warm orange |
| Lantern | 12 | 15 | 15 | 12 | Bright warm |
| Glowstone | 15 | 15 | 14 | 8 | Yellow-white |
| Redstone | 7 | 15 | 0 | 0 | Red glow |
| Soul Fire | 10 | 5 | 12 | 15 | Blue-cyan |
| Magic | 6 | 10 | 5 | 15 | Purple |
| Moonlight | 4 | 8 | 10 | 15 | Cool blue |

```java
// Example presets
public static final ColorLight TORCH = new ColorLight(8, 15, 10, 5);
public static final ColorLight LANTERN = new ColorLight(12, 15, 15, 12);
public static final ColorLight SOUL_FIRE = new ColorLight(10, 5, 12, 15);
```

## Network Synchronization

Dynamic lights are automatically synchronized to clients:

1. **On Add**: Light component sent with entity spawn
2. **On Update**: `setColorLight()` marks network dirty
3. **On Remove**: `EntityTrackerRemove` system notifies trackers
4. **Update Type**: `ComponentUpdateType.DynamicLight`

## Integration with Chunk Lighting

Dynamic entity lights work alongside chunk-based lighting:

- **Chunk Light**: Static, calculated once, stored in `ChunkLightData`
- **Dynamic Light**: Real-time, follows entity, rendered client-side

The client combines both light sources for final illumination.

## Persistent Light Serialization

`PersistentDynamicLight` is saved with entity data:

```json
{
  "Components": {
    "Light": {
      "Radius": 8,
      "Red": 15,
      "Green": 10,
      "Blue": 5
    }
  }
}
```

**Codec:** Uses `ProtocolCodecs.COLOR_LIGHT` via `BuilderCodec`

## Best Practices

1. **Use Persistent for permanent lights**: Lanterns, glowing items, etc.
2. **Use Runtime for effects**: Spell glows, fire, temporary buffs
3. **Limit light count**: Many dynamic lights can impact performance
4. **Reasonable radius**: Keep radius under 15 for best results
5. **Update frequency**: Don't update every tick unless needed (flickering)

## Related

- [Light Propagation](lighting.md) - Chunk-based lighting
- [Entity System](../entities/overview.md) - Entity management
- [ECS Overview](../../core-concepts/ecs-overview.md) - Component architecture

