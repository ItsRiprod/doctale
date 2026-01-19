<!-- [VERIFIED: 2026-01-19] -->

# Connected Blocks System

The connected blocks system handles blocks that connect to neighboring blocks (like fences, walls, stairs) and automatically determine their visual state based on neighbors.

## Package Location

`com.hypixel.hytale.server.core.universe.world.connectedblocks`

## Overview

Connected blocks automatically change their visual variant based on adjacent blocks. For example, a stair block placed next to another stair can become a corner piece. The system uses rule sets to define connection logic.

```
Regular Stair    +    Adjacent Stair    =    Corner Variant
    ___                   ___                   ___
   |   |                 |   |                 |   |___
   |___|                 |___|                 |___|   |
```

## Core Classes

### ConnectedBlocksModule

Main plugin managing connected block systems:

```java
package com.hypixel.hytale.server.core.universe.world.connectedblocks;

public class ConnectedBlocksModule extends JavaPlugin {
    // Singleton access
    public static ConnectedBlocksModule get();

    // Registers codecs for rule sets (Stair, Roof types)
}
```

### ConnectedBlocksUtil

Static utility class for connected block operations:

```java
package com.hypixel.hytale.server.core.universe.world.connectedblocks;

public class ConnectedBlocksUtil {
    // Maximum neighbor update depth
    public static final int MAX_UPDATE_DEPTH = 3;

    // Place connected block and notify neighbors
    public static void setConnectedBlockAndNotifyNeighbors(
        int blockTypeIndex,
        int rotation,
        Vector3i placementNormal,
        Vector3i blockPosition,
        WorldChunk worldChunk,
        BlockChunk blockChunk
    );

    // Get the desired block variant based on neighbors
    public static ConnectedBlockResult getDesiredConnectedBlockType(
        World world,
        Vector3i position,
        BlockType blockType,
        int rotation,
        Vector3i placementNormal,
        boolean isPlacement
    );

    // Check 26 neighbors (3x3x3 cube) for state changes
    public static void notifyNeighborsAndCollectChanges(
        World world,
        Vector3i position,
        int depth,
        Map<Vector3i, ConnectedBlockResult> changes
    );
}
```

### ConnectedBlockResult

Result of connected block calculation:

```java
public class ConnectedBlockResult {
    // The resulting block type ID
    public String blockTypeKey();

    // Rotation value (0-23)
    public int rotationIndex();

    // Additional blocks to place (multi-block structures)
    public Map<Vector3i, BlockTypeRotation> additionalConnectedBlocks;
}
```

### ConnectedBlockRuleSet

Abstract base class for defining connection rules:

```java
package com.hypixel.hytale.server.core.universe.world.connectedblocks;

public abstract class ConnectedBlockRuleSet {
    // Get the desired block variant based on neighbors
    public abstract ConnectedBlockResult getConnectedBlockType(
        World world,
        Vector3i position,
        BlockType blockType,
        int rotation,
        Vector3i placementNormal,
        boolean isPlacement
    );

    // Whether to only update on placement (not neighbor changes)
    public boolean onlyUpdateOnPlacement();

    // Cache block type mappings when assets load
    public void updateCachedBlockTypes(
        BlockType blockType,
        BlockTypeAssetMap assetMap
    );
}
```

## Built-in Rule Sets

### StairConnectedBlockRuleSet

Handles stair block connections:

```java
package com.hypixel.hytale.server.core.universe.world.connectedblocks.builtin;

public class StairConnectedBlockRuleSet extends ConnectedBlockRuleSet {
    // Stair variants
    // - Straight
    // - CornerLeft
    // - CornerRight
    // - InvertedCornerLeft
    // - InvertedCornerRight
}
```

**Variants:**

| Variant | Description |
|---------|-------------|
| `Straight` | Normal stair piece |
| `CornerLeft` | Left corner turn |
| `CornerRight` | Right corner turn |
| `InvertedCornerLeft` | Inverted left corner |
| `InvertedCornerRight` | Inverted right corner |

### RoofConnectedBlockRuleSet

Handles roof block connections (extends stair logic):

```java
package com.hypixel.hytale.server.core.universe.world.connectedblocks.builtin;

public class RoofConnectedBlockRuleSet extends ConnectedBlockRuleSet {
    // Roof variants
    // - Regular (standard roof piece)
    // - Hollow (open underneath)
    // - Topper (ridge cap)
    // - Valley connections
}
```

**Additional Configuration:**

| Property | Type | Description |
|----------|------|-------------|
| `width` | int | Roof piece width |

## Pattern Matching

### ConnectedBlockPatternRule

Defines matching rules for neighbor positions:

```java
public class ConnectedBlockPatternRule {
    // Position offset to check relative to placed block
    Vector3i relativePosition;

    // Include or exclude this pattern
    boolean includeOrExclude;

    // Face normals the block was placed against
    List<Vector3i> placementNormals;

    // Required face tags at this position
    ConnectedBlockFaceTags faceTags;

    // Block types that match (by shape)
    List<String> shapeBlockTypeKeys;

    // Block types that match (by ID)
    List<String> blockTypes;
}
```

### ConnectedBlockShape

Groups patterns with matching requirements:

```java
public class ConnectedBlockShape {
    // Patterns where any match satisfies the shape
    ConnectedBlockPatternRule[] patternsToMatchAnyOf;

    // Face tag requirements
    ConnectedBlockFaceTags faceTags;
}
```

### ConnectedBlockFaceTags

Directional face tagging for connection restrictions:

```java
public class ConnectedBlockFaceTags {
    // Check if a face has a specific tag
    public boolean contains(Vector3i direction, String tag);

    // Directions: North, East, South, West, Up, Down
}
```

## Usage Examples

### Placing a Connected Block

```java
import com.hypixel.hytale.server.core.universe.world.connectedblocks.ConnectedBlocksUtil;
import com.hypixel.hytale.server.core.blocktype.BlockType;
import com.hypixel.hytale.math.vector.Vector3i;

// Place a stair block that auto-connects to neighbors
Vector3i position = new Vector3i(10, 64, 20);
Vector3i placementNormal = new Vector3i(0, 1, 0); // Placed on top face
BlockType stairBlock = BlockType.get("wood_stairs");
int rotation = 0;

// Get chunk references
WorldChunk worldChunk = world.getChunk(position);
BlockChunk blockChunk = worldChunk.getBlockChunk();

// Place with auto-connection
ConnectedBlocksUtil.setConnectedBlockAndNotifyNeighbors(
    stairBlock.getIndex(),
    rotation,
    placementNormal,
    position,
    worldChunk,
    blockChunk
);
```

### Querying Connected State

```java
import com.hypixel.hytale.server.core.universe.world.connectedblocks.ConnectedBlocksUtil;
import com.hypixel.hytale.server.core.universe.world.connectedblocks.ConnectedBlockResult;

// Get what variant a block should be
ConnectedBlockResult result = ConnectedBlocksUtil.getDesiredConnectedBlockType(
    world,
    position,
    blockType,
    rotation,
    placementNormal,
    true  // isPlacement
);

if (result != null) {
    String variantKey = result.blockTypeKey();
    int variantRotation = result.rotationIndex();

    // Check for additional blocks (multi-block structures)
    if (result.additionalConnectedBlocks != null) {
        for (var entry : result.additionalConnectedBlocks.entrySet()) {
            Vector3i offset = entry.getKey();
            BlockTypeRotation extra = entry.getValue();
            // Place additional block at position + offset
        }
    }
}
```

## Connection Algorithm

1. **Block Placement**: When a connected block is placed
2. **Neighbor Check**: System checks 26 neighbors (3x3x3 cube minus center)
3. **Rule Matching**: Each neighbor position is tested against rule patterns
4. **Variant Selection**: Best matching variant is selected
5. **Neighbor Notification**: Adjacent connected blocks are notified to update
6. **Cascade Limit**: Updates cascade up to MAX_UPDATE_DEPTH (3) levels

```
Update Cascade (depth 3):

    Placed Block (depth 0)
         │
    ┌────┼────┐
    │    │    │
Neighbor Neighbor Neighbor (depth 1)
    │         │
    │    ┌────┘
    │    │
Neighbor Neighbor (depth 2)
    │
Neighbor (depth 3 - final)
```

## Network Synchronization

Connected block rule sets are synchronized to clients via protocol:

```java
// Protocol packet structure
public class ConnectedBlockRuleSet {
    // Type identifier
    Type type;  // STAIR, ROOF, CUSTOM_TEMPLATE

    // Type-specific configuration
    StairConfig stairConfig;
    RoofConfig roofConfig;
}
```

## Creating Custom Rule Sets

Custom connected block rule sets require:

1. Extend `ConnectedBlockRuleSet`
2. Implement `getConnectedBlockType()` method
3. Register codec with `ConnectedBlocksModule`
4. Define block type variants in assets

```java
public class MyConnectedBlockRuleSet extends ConnectedBlockRuleSet {
    @Override
    public ConnectedBlockResult getConnectedBlockType(
        World world,
        Vector3i position,
        BlockType blockType,
        int rotation,
        Vector3i placementNormal,
        boolean isPlacement
    ) {
        // Check neighbors and return appropriate variant
        // Return null if no special variant needed
        return null;
    }

    @Override
    public boolean onlyUpdateOnPlacement() {
        // Return true to only calculate on initial placement
        // Return false to recalculate when neighbors change
        return false;
    }
}
```

## Related

- [Block System](../blocks/overview.md) - Block types and states
- [World System](overview.md) - World and chunk management
- [Light Propagation](lighting.md) - Lighting system

