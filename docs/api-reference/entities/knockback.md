<!-- [VERIFIED: 2026-01-19] -->

# Knockback System

The knockback system applies velocity impulses to entities, typically from combat or environmental interactions.

## Package Location

`com.hypixel.hytale.server.core.entity.knockback`

## Overview

Knockback is managed via the `KnockbackComponent` attached to entities. It stores velocity, duration, and modifiers that control how the knockback is applied over time.

## Core Classes

### KnockbackComponent

Component managing knockback state on an entity:

```java
package com.hypixel.hytale.server.core.entity.knockback;

public class KnockbackComponent implements Component<EntityStore> {
    // Velocity
    public Vector3d getVelocity();
    public void setVelocity(Vector3d velocity);

    // Velocity application type
    public ChangeVelocityType getVelocityType();
    public void setVelocityType(ChangeVelocityType velocityType);

    // Velocity configuration
    public VelocityConfig getVelocityConfig();
    public void setVelocityConfig(VelocityConfig velocityConfig);

    // Modifiers (velocity multipliers)
    public void addModifier(double modifier);
    public void applyModifiers();

    // Duration and timing
    public float getDuration();
    public void setDuration(float duration);
    public float getTimer();
    public void setTimer(float time);
    public void incrementTimer(float time);

    // Get component type
    public static ComponentType<EntityStore, KnockbackComponent> getComponentType();
}
```

### ChangeVelocityType

How knockback velocity is applied:

```java
package com.hypixel.hytale.protocol;

public enum ChangeVelocityType {
    ADD,      // Add to existing velocity
    SET,      // Replace existing velocity
    SET_X,    // Replace only X component
    SET_Y,    // Replace only Y component
    SET_Z     // Replace only Z component
}
```

### VelocityConfig

Configuration for velocity application:

```java
public class VelocityConfig {
    // Velocity limits and behavior
    double maxSpeed;
    double drag;
    double gravity;
}
```

## Usage Examples

### Applying Basic Knockback

```java
import com.hypixel.hytale.server.core.entity.knockback.KnockbackComponent;
import com.hypixel.hytale.math.vector.Vector3d;
import com.hypixel.hytale.protocol.ChangeVelocityType;

// Get knockback component from entity
Ref<EntityStore> entityRef = /* entity reference */;
KnockbackComponent knockback = componentAccessor.getComponent(
    entityRef,
    KnockbackComponent.getComponentType()
);

if (knockback != null) {
    // Calculate knockback direction (away from attacker)
    Vector3d direction = new Vector3d(
        targetPos.x - attackerPos.x,
        0.5,  // Upward component
        targetPos.z - attackerPos.z
    );
    direction.normalize();
    direction.scale(8.0);  // Knockback strength

    // Apply knockback
    knockback.setVelocity(direction);
    knockback.setVelocityType(ChangeVelocityType.ADD);
    knockback.setDuration(0.3f);  // 0.3 second knockback
    knockback.setTimer(0.0f);
}
```

### Knockback with Modifiers

```java
// Apply knockback with modifiers
knockback.setVelocity(new Vector3d(10, 3, 0));
knockback.setVelocityType(ChangeVelocityType.SET);
knockback.setDuration(0.5f);
knockback.setTimer(0.0f);

// Add velocity modifiers (multipliers)
knockback.addModifier(0.9);   // 90% - slight reduction
knockback.addModifier(1.2);   // 120% - strength buff

// Apply all modifiers (multiplies velocity by 0.9 * 1.2 = 1.08)
knockback.applyModifiers();
```

### Directional Knockback

```java
// Horizontal knockback only (no Y change)
knockback.setVelocity(new Vector3d(5, 0, 5));
knockback.setVelocityType(ChangeVelocityType.ADD);

// Vertical knockback only (launch upward)
knockback.setVelocity(new Vector3d(0, 15, 0));
knockback.setVelocityType(ChangeVelocityType.SET_Y);

// Replace horizontal, preserve vertical
knockback.setVelocity(new Vector3d(8, 0, 0));
knockback.setVelocityType(ChangeVelocityType.SET_X);
```

### Checking Knockback State

```java
// Check if entity is being knocked back
float timer = knockback.getTimer();
float duration = knockback.getDuration();

if (timer < duration) {
    // Entity is still in knockback
    float progress = timer / duration;  // 0.0 to 1.0
}

// Manually increment timer (usually done by physics system)
knockback.incrementTimer(deltaTime);
```

### Custom Velocity Configuration

```java
// Set custom velocity config
VelocityConfig config = new VelocityConfig();
config.maxSpeed = 20.0;
config.drag = 0.98;
config.gravity = 0.08;

knockback.setVelocityConfig(config);
```

## Knockback Calculations

### Combat Knockback

Standard combat knockback formula:

```java
// Calculate knockback from attack
public Vector3d calculateCombatKnockback(
    Vector3d attackerPos,
    Vector3d targetPos,
    float knockbackPower
) {
    // Direction away from attacker
    Vector3d direction = new Vector3d(
        targetPos.x - attackerPos.x,
        0,
        targetPos.z - attackerPos.z
    );

    // Normalize and scale
    if (direction.squaredLength() > 0.0001) {
        direction.normalize();
    } else {
        // Default direction if positions overlap
        direction = new Vector3d(1, 0, 0);
    }

    // Apply power
    direction.scale(knockbackPower);

    // Add upward component
    direction.y = knockbackPower * 0.4;

    return direction;
}
```

### Explosion Knockback

Knockback from explosions:

```java
public Vector3d calculateExplosionKnockback(
    Vector3d explosionPos,
    Vector3d targetPos,
    float power,
    float radius
) {
    Vector3d direction = new Vector3d(
        targetPos.x - explosionPos.x,
        targetPos.y - explosionPos.y,
        targetPos.z - explosionPos.z
    );

    double distance = direction.length();
    if (distance == 0) return Vector3d.ZERO;

    // Falloff based on distance
    double falloff = 1.0 - (distance / radius);
    falloff = Math.max(0, falloff);

    direction.normalize();
    direction.scale(power * falloff);

    return direction;
}
```

## Integration with Physics

The knockback system integrates with the physics system:

1. **KnockbackComponent** stores pending knockback
2. **Physics system** reads knockback each tick
3. **Velocity applied** according to ChangeVelocityType
4. **Timer incremented** until duration reached
5. **Knockback cleared** when timer >= duration

```
Frame 0: Knockback applied (timer=0, duration=0.3)
Frame 1: Physics applies velocity, timer=0.016
Frame 2: Physics applies velocity, timer=0.033
...
Frame 18: timer=0.3, knockback complete
```

## Knockback Resistance

Entities can resist knockback through:

1. **Stat modifiers** - Reduce knockback velocity
2. **Effects** - Immunity or reduction
3. **Entity properties** - Heavy entities resist more

```java
// Apply knockback with resistance check
double resistance = entity.getStatValue(Stats.KNOCKBACK_RESISTANCE);
double multiplier = 1.0 - resistance;  // resistance 0.5 = 50% knockback

Vector3d adjustedVelocity = velocity.clone();
adjustedVelocity.scale(multiplier);

knockback.setVelocity(adjustedVelocity);
```

## Related

- [Effects System](effects.md) - Status effects
- [Physics System](../physics/overview.md) - Velocity and movement
- [Entity System](overview.md) - Entity management

