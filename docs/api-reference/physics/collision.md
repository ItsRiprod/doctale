<!-- [VERIFIED: 2026-01-19] -->

# Collision System

The Collision System detects and responds to collisions between entities and blocks. It uses swept collision detection for continuous movement and supports multiple collision types.

## Package Location

`com.hypixel.hytale.server.core.modules.collision`

## Core Classes

| Class | Description |
|-------|-------------|
| `CollisionModule` | Main collision detection plugin |
| `CollisionResult` | Stores collision query results |
| `CollisionConfig` | Block collision configuration |
| `BlockCollisionProvider` | Block collision detection |
| `EntityCollisionProvider` | Entity collision detection |

## CollisionModule

The central collision detection system:

```java
package com.hypixel.hytale.server.core.modules.collision;

public class CollisionModule extends JavaPlugin {
    // Singleton access
    public static CollisionModule get();

    // Main collision detection
    public static CollisionResult findCollisions(
        Box collider,
        Vector3d position,
        Vector3d velocity,
        CollisionResult result,
        IComponentAccessor accessor
    );

    // Block collision (iterative, far distance)
    public static void findBlockCollisionsIterative(
        Box collider,
        Vector3d start,
        Vector3d end,
        CollisionResult result,
        IComponentAccessor accessor
    );

    // Block collision (direct, short distance)
    public static void findBlockCollisionsShortDistance(
        Box collider,
        Vector3d position,
        Vector3d velocity,
        CollisionResult result,
        IComponentAccessor accessor
    );

    // Entity collision
    public static void findCharacterCollisions(
        Box collider,
        Vector3d position,
        Vector3d velocity,
        CollisionResult result,
        IComponentAccessor accessor
    );

    // Position validation
    public static boolean validatePosition(
        World world,
        Box collider,
        Vector3d position,
        CollisionResult result
    );

    // Intersection detection
    public static void findIntersections(
        Box collider,
        Vector3d position,
        CollisionResult result,
        IComponentAccessor accessor
    );
}
```

## CollisionResult

Stores all collision data from a query:

```java
package com.hypixel.hytale.server.core.modules.collision;

public class CollisionResult {
    // Block collisions (solid blocks)
    public BlockCollisionData[] blockCollisions;

    // Block slides (walkable surfaces)
    public BlockCollisionData[] blockSlides;

    // Block triggers (sensor blocks)
    public BlockCollisionData[] blockTriggers;

    // Entity collisions
    public CharacterCollisionData[] characterCollisions;

    // Reset for reuse
    public void reset();

    // Process results
    public void process();

    // Query helpers
    public boolean hasBlockCollisions();
    public boolean hasCharacterCollisions();
    public BlockCollisionData getFirstBlockCollision();
}
```

## Collision Data Types

### BlockCollisionData

Information about a block collision:

```java
public class BlockCollisionData extends BoxCollisionData {
    int blockId;           // Block type ID
    BlockType blockType;   // Block type reference
    BlockMaterial material; // Block material
    Vector3i blockPos;     // Block position
    boolean isDamage;      // Is damage block

    // Inherited from BoxCollisionData
    Vector3d collisionPoint;  // Point of collision
    Vector3d collisionNormal; // Surface normal
    double startParam;        // Start parameter (0-1)
    double endParam;          // End parameter (0-1)
}
```

### CharacterCollisionData

Information about an entity collision:

```java
public class CharacterCollisionData extends BoxCollisionData {
    Ref<EntityStore> entityRef;  // Collided entity
    Box entityBox;               // Entity bounding box

    // Inherited from BoxCollisionData
    Vector3d collisionPoint;
    Vector3d collisionNormal;
    double startParam;
    double endParam;
}
```

## Collision Detection Flow

### Block Collision

```
1. Determine distance mode (far vs short)
   └── velocity >= threshold → iterative (far)
   └── velocity < threshold → direct (short)

2. Iterate blocks along movement path
   └── Box.forEachBlock(start, end, callback)

3. For each block:
   ├── Check material allows collision
   ├── Get block hitbox (with rotation)
   ├── Perform swept box collision test
   └── Classify result:
       ├── Collision (solid)
       ├── Slide (walkable)
       ├── Trigger (sensor)
       └── Damage (harmful)

4. Sort collisions by start parameter
5. Return collision results
```

### Entity Collision

```
1. Query spatial index (KD-Tree) for nearby entities
2. For each nearby entity:
   ├── Get entity bounding box
   ├── Perform vector-AABB intersection
   └── Record if collision occurs
3. Sort by distance
4. Return nearest collision
```

## Collision Evaluators

### BoxBlockIntersectionEvaluator

Static box-to-block intersection tests:

```java
package com.hypixel.hytale.server.core.modules.collision;

public class BoxBlockIntersectionEvaluator {
    // Basic intersection
    public static boolean intersectBox(Box box, Box blockBox);

    // Intersection with touch detection
    public static boolean intersectBoxComputeTouch(
        Box box,
        Box blockBox,
        TouchResult result
    );

    // Intersection with ground detection
    public static boolean intersectBoxComputeOnGround(
        Box box,
        Box blockBox,
        GroundResult result
    );

    // Result flags
    public boolean onGround;   // Standing on surface
    public boolean touchCeil;  // Touching ceiling
}
```

### MovingBoxBoxCollisionEvaluator

Swept (continuous) collision detection:

```java
package com.hypixel.hytale.server.core.modules.collision;

public class MovingBoxBoxCollisionEvaluator {
    // Set the moving box
    public void setCollider(Box collider);

    // Set the movement vector
    public void setMove(Vector3d move);

    // Check for collision with stationary box
    public boolean isBoundingBoxColliding(Box target);

    // Get collision parameters
    public double getCollisionStart();
    public double getCollisionEnd();
    public Vector3d getCollisionNormal();
    public Vector3d getCollisionPoint();
}
```

## Material Masks

Block materials affect collision behavior:

| Mask | Value | Description |
|------|-------|-------------|
| `EMPTY` | 1 | No collision (air) |
| `FLUID` | 2 | Fluid block (water, lava) |
| `SOLID` | 4 | Solid collision |
| `SUBMERGED` | 8 | Fully in fluid |
| `DAMAGE` | 16 | Damage on contact |

## Collision Types

### Solid Collision

Standard blocking collision:
- Stops movement at collision point
- Returns collision normal for response
- Used for walls, floors, ceilings

### Slide Collision

Walkable surface collision:
- Allows movement along surface
- Used for slopes and stairs
- Entity can slide along the surface

### Trigger Collision

Non-blocking sensor collision:
- Does not stop movement
- Fires trigger events
- Used for pressure plates, zones

### Damage Collision

Harmful surface collision:
- May or may not block movement
- Applies damage to entity
- Used for spikes, lava, etc.

## IBlockCollisionConsumer

Callback interface for collision events:

```java
package com.hypixel.hytale.server.core.modules.collision;

public interface IBlockCollisionConsumer {
    enum Result { CONTINUE, STOP }

    // Called on collision
    Result onCollision(BlockCollisionData data);

    // Check if block causes damage
    boolean probeCollisionDamage(BlockCollisionData data);

    // Called on damage collision
    Result onCollisionDamage(BlockCollisionData data);

    // Called when slice completes
    void onCollisionSliceFinished();

    // Called when all collisions processed
    void onCollisionFinished();
}
```

## CollisionMath

AABB intersection utilities:

```java
package com.hypixel.hytale.server.core.modules.collision;

public class CollisionMath {
    // AABB-AABB intersection
    public static boolean intersectAABBs(Box a, Box b);

    // Vector-AABB intersection
    public static boolean intersectVectorAABB(
        Vector3d start,
        Vector3d direction,
        Box box,
        CollisionResult result
    );

    // Spatial relationship tests
    public static boolean isDisjoint(Box a, Box b);
    public static boolean isOverlapping(Box a, Box b);
    public static boolean isTouching(Box a, Box b);
}
```

## Usage Examples

### Basic Collision Check

```java
import com.hypixel.hytale.server.core.modules.collision.CollisionModule;
import com.hypixel.hytale.server.core.modules.collision.CollisionResult;
import com.hypixel.hytale.math.Box;
import com.hypixel.hytale.math.Vector3d;

public boolean wouldCollide(Box entityBox, Vector3d position, Vector3d movement,
                            IComponentAccessor accessor) {
    CollisionResult result = new CollisionResult();

    CollisionModule.findCollisions(
        entityBox,
        position,
        movement,
        result,
        accessor
    );

    return result.hasBlockCollisions();
}
```

### Collision Response

```java
public Vector3d clampMovement(Box entityBox, Vector3d position,
                              Vector3d movement, IComponentAccessor accessor) {
    CollisionResult result = new CollisionResult();

    CollisionModule.findCollisions(entityBox, position, movement, result, accessor);

    if (result.hasBlockCollisions()) {
        BlockCollisionData first = result.getFirstBlockCollision();

        // Clamp movement to collision point
        double clampedT = first.startParam;
        return movement.multiply(clampedT);
    }

    return movement;
}
```

### Ground Detection

```java
import com.hypixel.hytale.server.core.modules.collision.BoxBlockIntersectionEvaluator;

public boolean isOnGround(Box entityBox, Vector3d position,
                          IComponentAccessor accessor) {
    // Slightly expand downward to detect ground
    Box groundCheck = entityBox.expand(0, -0.01, 0);

    BoxBlockIntersectionEvaluator evaluator = new BoxBlockIntersectionEvaluator();

    // Check blocks below
    CollisionResult result = new CollisionResult();
    CollisionModule.findIntersections(groundCheck, position, result, accessor);

    return evaluator.onGround;
}
```

## Best Practices

1. **Reuse CollisionResult**: Call `reset()` instead of creating new instances
2. **Choose appropriate method**: Use short-distance for slow entities
3. **Check material masks**: Not all blocks collide the same way
4. **Handle slides separately**: Slides allow movement, collisions don't
5. **Process triggers**: Trigger blocks fire events but don't block

## Related

- [Physics Overview](overview.md) - Physics system architecture
- [Hitbox System](hitboxes.md) - Entity hitboxes
- [Block System](../blocks/overview.md) - Block types and materials
