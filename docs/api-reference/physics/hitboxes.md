<!-- [VERIFIED: 2026-01-19] -->

# Hitbox System

The Hitbox System manages collision bounds for entities and blocks. It supports simple bounding boxes and complex multi-box configurations for detailed collision shapes.

## Package Location

- Entity Hitboxes: `com.hypixel.hytale.server.core.modules.entity.hitboxcollision`
- Bounding Box: `com.hypixel.hytale.server.core.modules.entity.component`
- Math: `com.hypixel.hytale.math`

## Core Classes

| Class | Description |
|-------|-------------|
| `BoundingBox` | Entity bounding box component |
| `HitboxCollision` | References hitbox collision config |
| `HitboxCollisionConfig` | Asset-based hitbox configuration |
| `Box` | Axis-aligned bounding box (AABB) |
| `DetailBox` | Named sub-hitbox for complex shapes |

## BoundingBox Component

The main collision bounds for an entity:

```java
package com.hypixel.hytale.server.core.modules.entity.component;

public class BoundingBox {
    // Main bounding box
    public Box getBoundingBox();
    public void setBoundingBox(Box box);

    // Detail boxes for complex shapes
    public Map<String, DetailBox[]> getDetailBoxes();
    public void setDetailBoxes(Map<String, DetailBox[]> boxes);
}
```

## Box Class

Axis-aligned bounding box (AABB):

```java
package com.hypixel.hytale.math;

public class Box {
    // Bounds
    public double minX, minY, minZ;
    public double maxX, maxY, maxZ;

    // Constructors
    public Box(double minX, double minY, double minZ,
               double maxX, double maxY, double maxZ);
    public Box(Vector3d min, Vector3d max);

    // Dimensions
    public double getWidth();   // maxX - minX
    public double getHeight();  // maxY - minY
    public double getDepth();   // maxZ - minZ
    public Vector3d getSize();
    public Vector3d getCenter();

    // Transformations
    public Box expand(double x, double y, double z);
    public Box shrink(double x, double y, double z);
    public Box offset(double x, double y, double z);
    public Box offset(Vector3d offset);

    // Intersection
    public boolean intersects(Box other);
    public boolean contains(Vector3d point);
    public boolean contains(Box other);

    // Block iteration
    public void forEachBlock(Consumer<Vector3i> consumer);
    public static void forEachBlock(Vector3d start, Vector3d end,
                                    Consumer<Vector3i> consumer);
}
```

## HitboxCollision Component

References a hitbox configuration asset:

```java
package com.hypixel.hytale.server.core.modules.entity.hitboxcollision;

public class HitboxCollision {
    // Get config index in asset map
    public int getHitboxCollisionConfigIndex();

    // Network sync tracking
    public boolean consumeNetworkOutdated();
}
```

## HitboxCollisionConfig Asset

Hitbox configuration loaded from assets:

```json
{
  "Id": "Player_Hitbox",
  "BoundingBox": {
    "MinX": -0.3,
    "MinY": 0.0,
    "MinZ": -0.3,
    "MaxX": 0.3,
    "MaxY": 1.8,
    "MaxZ": 0.3
  },
  "DetailBoxes": {
    "head": [
      {
        "MinX": -0.25,
        "MinY": 1.5,
        "MinZ": -0.25,
        "MaxX": 0.25,
        "MaxY": 1.8,
        "MaxZ": 0.25
      }
    ],
    "body": [
      {
        "MinX": -0.3,
        "MinY": 0.5,
        "MinZ": -0.15,
        "MaxX": 0.3,
        "MaxY": 1.5,
        "MaxZ": 0.15
      }
    ]
  }
}
```

## DetailBox

Named sub-hitbox for complex shapes:

```java
public class DetailBox {
    String name;  // Identifier (e.g., "head", "body", "arm_left")
    Box box;      // The bounding box
}
```

### Common Detail Box Names

| Name | Purpose |
|------|---------|
| `head` | Head/critical hit area |
| `body` | Main body |
| `arm_left` | Left arm |
| `arm_right` | Right arm |
| `leg_left` | Left leg |
| `leg_right` | Right leg |

## HitboxCollisionSystems

Systems for hitbox management:

```java
package com.hypixel.hytale.server.core.modules.entity.hitboxcollision;

public class HitboxCollisionSystems {
    // Setup system - adds hitbox to players
    public static class Setup implements EntityTickingSystem { }

    // Sync hitbox changes to visible players
    public static class EntityTrackerUpdate implements EntityTickingSystem { }

    // Clean up hitbox visibility
    public static class EntityTrackerRemove implements EntityTickingSystem { }
}
```

## Block Hitboxes

Blocks have hitboxes defined in their block type:

### Simple Block Hitbox

Full cube (1x1x1):

```json
{
  "Id": "Stone",
  "Hitbox": "Full"
}
```

### Custom Block Hitbox

Non-standard shapes:

```json
{
  "Id": "Slab_Stone",
  "Hitbox": {
    "MinX": 0.0,
    "MinY": 0.0,
    "MinZ": 0.0,
    "MaxX": 1.0,
    "MaxY": 0.5,
    "MaxZ": 1.0
  }
}
```

### Multi-Box Block Hitbox

Complex shapes (stairs, fences):

```json
{
  "Id": "Stairs_Stone",
  "Hitboxes": [
    {
      "MinX": 0.0, "MinY": 0.0, "MinZ": 0.0,
      "MaxX": 1.0, "MaxY": 0.5, "MaxZ": 1.0
    },
    {
      "MinX": 0.0, "MinY": 0.5, "MinZ": 0.5,
      "MaxX": 1.0, "MaxY": 1.0, "MaxZ": 1.0
    }
  ]
}
```

## Hitbox Rotation

Block hitboxes can be rotated:

```java
// Get block hitbox with rotation
Box hitbox = blockType.getHitbox(rotation);
```

Rotation values: 0, 90, 180, 270 degrees

## Usage Examples

### Setting Entity Hitbox

```java
import com.hypixel.hytale.server.core.modules.entity.component.BoundingBox;
import com.hypixel.hytale.math.Box;

public void setEntityHitbox(Ref<EntityStore> entityRef,
                            IComponentAccessor accessor) {
    BoundingBox bbox = accessor.getComponent(entityRef,
        BoundingBox.getComponentType());

    // Create custom hitbox
    Box hitbox = new Box(
        -0.4, 0.0, -0.4,  // min
        0.4, 2.0, 0.4     // max
    );

    bbox.setBoundingBox(hitbox);
}
```

### Adding Detail Boxes

```java
import com.hypixel.hytale.server.core.modules.entity.component.BoundingBox;
import com.hypixel.hytale.math.Box;
import java.util.HashMap;
import java.util.Map;

public void setDetailHitboxes(Ref<EntityStore> entityRef,
                              IComponentAccessor accessor) {
    BoundingBox bbox = accessor.getComponent(entityRef,
        BoundingBox.getComponentType());

    Map<String, DetailBox[]> details = new HashMap<>();

    // Add head hitbox
    details.put("head", new DetailBox[] {
        new DetailBox("head", new Box(-0.25, 1.5, -0.25, 0.25, 1.8, 0.25))
    });

    // Add body hitbox
    details.put("body", new DetailBox[] {
        new DetailBox("body", new Box(-0.3, 0.5, -0.15, 0.3, 1.5, 0.15))
    });

    bbox.setDetailBoxes(details);
}
```

### Checking Hitbox Intersection

```java
import com.hypixel.hytale.math.Box;

public boolean hitboxesIntersect(Box hitboxA, Vector3d posA,
                                 Box hitboxB, Vector3d posB) {
    // Offset hitboxes to world positions
    Box worldA = hitboxA.offset(posA);
    Box worldB = hitboxB.offset(posB);

    return worldA.intersects(worldB);
}
```

### Getting Hitbox from Config

```java
import com.hypixel.hytale.server.core.modules.entity.hitboxcollision.HitboxCollision;
import com.hypixel.hytale.server.core.modules.entity.hitboxcollision.HitboxCollisionConfig;

public Box getEntityHitbox(Ref<EntityStore> entityRef,
                           IComponentAccessor accessor) {
    HitboxCollision hitbox = accessor.getComponent(entityRef,
        HitboxCollision.getComponentType());

    int configIndex = hitbox.getHitboxCollisionConfigIndex();

    // Get config from asset map
    HitboxCollisionConfig config = HitboxCollisionConfig.getAssetMap()
        .get(configIndex);

    return config.getBoundingBox();
}
```

## Hitbox Synchronization

Hitbox changes are synchronized to clients:

1. **HitboxCollision** component marks `networkOutdated`
2. **EntityTrackerUpdate** system detects change
3. **ComponentUpdate** with hitbox config index sent
4. Client updates local hitbox

## Best Practices

1. **Use appropriate size**: Match visual model dimensions
2. **Consider performance**: Fewer detail boxes = faster collision
3. **Use detail boxes for precision**: Critical hits, limb damage
4. **Rotation support**: Block hitboxes should rotate correctly
5. **Network efficiency**: Only update hitbox when it changes

## Related

- [Physics Overview](overview.md) - Physics system
- [Collision System](collision.md) - Collision detection
- [Entity System](../entities/overview.md) - Entity components
- [Block System](../blocks/overview.md) - Block hitboxes
