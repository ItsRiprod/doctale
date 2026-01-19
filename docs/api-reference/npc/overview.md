<!-- [VERIFIED: 2026-01-19] -->

# NPC System Overview

The NPC (Non-Player Character) System manages AI-controlled entities in Hytale. It uses a sophisticated role-based behavior system with support for flocking, spawning, and complex decision making.

## Package Location

- NPC entities: `com.hypixel.hytale.server.npc`
- Flock system: `com.hypixel.hytale.server.flock`
- Role system: `com.hypixel.hytale.server.npc.role`
- Blackboard: `com.hypixel.hytale.server.npc.blackboard`

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       NPC System                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                     NPCEntity                            ││
│  │  ┌─────────┐ ┌─────────┐ ┌─────────────┐ ┌───────────┐ ││
│  │  │  Role   │ │Blackboard│ │ PathManager │ │DamageData │ ││
│  │  └─────────┘ └─────────┘ └─────────────┘ └───────────┘ ││
│  └─────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────┐│
│  │                    Flock System                          ││
│  │  ┌─────────┐ ┌─────────────┐ ┌─────────────────────┐   ││
│  │  │  Flock  │ │FlockMembership│ │FlockPlugin          │   ││
│  │  └─────────┘ └─────────────┘ └─────────────────────┘   ││
│  └─────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────┐│
│  │                   Spawning System                        ││
│  │  ┌────────────┐ ┌────────────┐ ┌────────────────────┐  ││
│  │  │SpawnBeacon │ │SpawnMarker │ │SpawnController     │  ││
│  │  └────────────┘ └────────────┘ └────────────────────┘  ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### NPCEntity

`NPCEntity` extends `LivingEntity` and is the base class for AI-controlled characters.

```java
public class NPCEntity extends LivingEntity implements INonPlayerCharacter {
    // Role management
    public Role getRole();

    // Position tracking
    public Vector3d getLeashPoint();  // Spawn anchor point
    public float getLeashHeading();
    public float getLeashPitch();

    // Spawning
    public Instant getSpawnInstant();
    public String getSpawnConfigurationName();

    // Pathing
    public PathManager getPathManager();

    // Events
    public AlarmStore getAlarmStore();
    public DamageData getDamageData();
}
```

### Getting NPCEntity Component Type

```java
ComponentType<EntityStore, NPCEntity> npcType = NPCEntity.getComponentType();

// Query for NPCs
Query<EntityStore> query = npcType;
```

## Role System

Roles define NPC behavior, stats, and AI decision making.

### Role Class

```java
public class Role implements IAnnotatedComponentCollection {
    // Support objects
    CombatSupport combatSupport;     // Combat behavior
    StateSupport stateSupport;        // State machine
    MarkedEntitySupport markedEntitySupport;  // Target tracking
    WorldSupport worldSupport;        // World interaction
    EntitySupport entitySupport;      // Entity queries
    PositionCache positionCache;      // Position caching
    DebugSupport debugSupport;        // Debug features

    // Stats
    int initialMaxHealth;
    double knockbackScale;
    double inertia;
    boolean invulnerable;

    // Movement
    Map<String, MotionController> motionControllers;
    MotionController activeMotionController;
    Steering bodySteering;
    Steering headSteering;

    // Behavior
    Instruction rootInstruction;
    Instruction interactionInstruction;
    Instruction deathInstruction;

    // Spawning
    String[] flockSpawnTypes;
    String[] flockAllowedRoles;
    boolean canLeadFlock;

    // Lifecycle
    void loaded();
    void unloaded();
    void removed();
}
```

### Role Configuration Properties

| Property | Type | Description |
|----------|------|-------------|
| `maxHealth` | `int` | Maximum health points |
| `knockbackScale` | `double` | Knockback force multiplier |
| `inertia` | `double` | Movement inertia |
| `invulnerable` | `bool` | Cannot take damage |
| `deathAnimationTime` | `double` | Death animation duration |
| `despawnAnimationTime` | `float` | Despawn animation duration |
| `dropListId` | `string` | Loot drop list |
| `balanceAsset` | `string` | Balance configuration |
| `hotbarItems` | `string[]` | Starting hotbar items |
| `offHandItems` | `string[]` | Starting offhand items |
| `armor` | `string[]` | Starting armor |

### Motion Controllers

Motion controllers handle NPC movement patterns:

```java
// Built-in motion controllers
BodyMotionWander         // Random wandering
BodyMotionMaintainDistance  // Keep distance from target
BodyMotionFindWithTarget    // Pathfind to target
BodyMotionMatchLook      // Match look direction
BodyMotionFlock          // Flock movement
BodyMotionTeleport       // Teleportation
```

## Blackboard System

The Blackboard is shared memory for NPC decision making.

### Blackboard Views

| View | Description |
|------|-------------|
| `BlockTypeView` | Track block type changes |
| `BlockEventView` | Track block events |
| `EntityEventView` | Track entity events |

### Block Event Types

```java
public enum BlockEventType {
    PLACED,
    REMOVED,
    INTERACTED
}
```

### Entity Event Types

```java
public enum EntityEventType {
    SPAWNED,
    DESPAWNED,
    DAMAGED,
    KILLED
}
```

## Flock System

Flocks group NPCs for coordinated behavior.

### Flock Component

```java
public class Flock implements Component<EntityStore> {
    // Flock data
    PersistentFlockData getFlockData();

    // Damage tracking
    DamageData getDamageData();
    DamageData getLeaderDamageData();

    // Status
    FlockRemovedStatus getRemovedStatus();
}
```

### FlockMembership Component

```java
public class FlockMembership implements Component<EntityStore> {
    UUID getFlockId();
    void setFlockId(UUID flockId);
    Ref<EntityStore> getFlockRef();
    void setFlockRef(Ref<EntityStore> flockRef);
    Type getMembershipType();
    void setMembershipType(Type membershipType);
}
```

### FlockMembership.Type Enum

| Value | Acts as Leader | Description |
|-------|----------------|-------------|
| `JOINING` | No | Joining a flock |
| `MEMBER` | No | Regular flock member |
| `LEADER` | Yes | Flock leader |
| `INTERIM_LEADER` | Yes | Temporary leader |

### Flock Status

```java
public enum FlockRemovedStatus {
    NOT_REMOVED,
    DISSOLVED,
    UNLOADED
}
```

### Flock Configuration

```json
{
  "Id": "MyPlugin_WolfPack",
  "MinSize": 2,
  "MaxSize": 6,
  "AllowedRoles": ["Wolf", "AlphaWolf"],
  "WeightAlignment": 1.0,
  "WeightSeparation": 1.5,
  "WeightCohesion": 1.0,
  "InfluenceRange": 20.0
}
```

### Flock Behaviors

| Behavior | Description |
|----------|-------------|
| `Alignment` | Match velocity with nearby flock members |
| `Separation` | Maintain distance from other members |
| `Cohesion` | Stay close to flock center |

## Spawning System

The spawning system controls when and where NPCs appear.

### SpawnBeacon

Spawn beacons define spawn locations:

```java
public class SpawnBeacon implements Component<EntityStore> {
    // Configured in assets
}
```

### SpawnMarker

Spawn markers define specific spawn points:

```java
public class SpawnMarkerEntity extends Entity {
    // Spawn marker data
}
```

### Spawn Configuration

```json
{
  "Id": "MyPlugin_ZombieSpawn",
  "Role": "Zombie",
  "MinCount": 1,
  "MaxCount": 3,
  "SpawnChance": 0.5,
  "Conditions": {
    "TimeOfDay": "Night",
    "LightLevel": { "Max": 7 }
  }
}
```

### WorldNPCSpawn

World spawn configuration for natural spawning:

```java
// Spawn parameters
LightType lightType;  // BLOCK, SKY, COMBINED
int minLightLevel;
int maxLightLevel;
```

### Spawn Suppression

Control spawn rates in areas:

```java
public class SpawnSuppressionComponent implements Component<EntityStore> {
    // Suppress spawns in area
}
```

## NPC Systems

The NPC plugin registers many systems for NPC behavior:

| System | Description |
|--------|-------------|
| `NPCPreTickSystem` | Pre-tick setup |
| `StateEvaluatorSystem` | Evaluate state transitions |
| `SteeringSystem` | Calculate steering forces |
| `ComputeVelocitySystem` | Compute final velocity |
| `AvoidanceSystem` | Collision avoidance |
| `MovementStatesSystem` | Movement state updates |
| `RoleChangeSystem` | Handle role changes |
| `NPCDamageSystems` | Damage handling |
| `NPCDeathSystems` | Death handling |
| `NPCInteractionSystems` | Player interactions |

## Instructions and Actions

NPCs use instructions for behavior trees:

### Instruction Types

| Type | Description |
|------|-------------|
| `BodyMotion` | Movement instructions |
| `Action` | Discrete actions |
| `Sensor` | Environmental sensing |

### Common Actions

```java
ActionRecomputePath      // Recalculate path
ActionOverrideAltitude   // Set altitude
ActionFlockJoin          // Join a flock
ActionFlockLeave         // Leave flock
ActionFlockBeacon        // Respond to beacon
ActionFlockSetTarget     // Set flock target
ActionTriggerSpawnBeacon // Trigger spawn
```

### Sensors

```java
SensorOnGround           // Ground detection
SensorFlockLeader        // Leader detection
SensorFlockCombatDamage  // Combat damage sensing
SensorInflictedDamage    // Damage dealt sensing
```

## State Transitions

NPCs use state machines for behavior:

```java
public class StateTransitionController {
    // Manage state transitions
}

// State transition edges
public class BuilderStateTransitionEdges {
    // Define transition conditions
}
```

## Expressions

NPCs support expression evaluation for conditions:

```java
// Expression syntax
"health < 50"
"distance(target) > 10"
"hasTag(\"hostile\")"
```

## NPC Events

### NPC Lifecycle

```java
// NPC added to world
getEventRegistry().register(AddPlayerToWorldEvent.class, event -> {
    // Not for NPCs - use RefSystem for NPC lifecycle
});

// Use RefSystem for NPC tracking
public class MyNPCSystem extends RefSystem<EntityStore> {
    @Override
    public void onEntityAdded(Ref<EntityStore> ref, AddReason reason,
            Store<EntityStore> store, CommandBuffer<EntityStore> buffer) {
        NPCEntity npc = store.getComponent(ref, NPCEntity.getComponentType());
        // Handle NPC spawn
    }

    @Override
    public Query<EntityStore> getQuery() {
        return NPCEntity.getComponentType();
    }
}
```

### Combat Events

```java
// NPC kill event
getEventRegistry().register(KillFeedEvent.class, event -> {
    // Handle kill
});
```

## Creating NPCs

### Spawn NPC Programmatically

```java
// Create NPC holder
Holder<EntityStore> holder = EntityStore.REGISTRY.newHolder();

// Add NPCEntity component
NPCEntity npc = new NPCEntity();
holder.addComponent(NPCEntity.getComponentType(), npc);

// Add transform
TransformComponent transform = new TransformComponent(x, y, z, 0, 0, 0);
holder.addComponent(TransformComponent.getComponentType(), transform);

// Add UUID
holder.addComponent(UUIDComponent.getComponentType(),
    new UUIDComponent(UUID.randomUUID()));

// Spawn
Store<EntityStore> store = world.getEntityStore().getStore();
Ref<EntityStore> ref = store.spawn(holder);
```

## NPC Configuration Assets

NPCs are configured through role assets:

```json
{
  "Id": "MyPlugin_CustomNPC",
  "MaxHealth": 20,
  "Appearance": "Models/NPCs/custom_npc",
  "DropList": "MyPlugin_CustomDrops",
  "Behavior": {
    "Root": {
      "Type": "Selector",
      "Children": [
        {
          "Type": "Sequence",
          "Conditions": ["health < 50"],
          "Actions": ["Flee"]
        },
        {
          "Type": "Wander"
        }
      ]
    }
  }
}
```

## Best Practices

1. **Use roles**: Define behavior through role configurations
2. **Leverage flocks**: Group related NPCs for coordinated behavior
3. **Optimize queries**: Use efficient ECS queries for NPC systems
4. **Handle lifecycle**: Properly handle NPC add/remove events
5. **Use blackboards**: Share state through blackboard system
6. **Configure spawning**: Use spawn beacons and markers for controlled spawning

## Related

- [Entity System](../entities/overview.md) - Base entity documentation
- [ECS Overview](../../core-concepts/ecs-overview.md) - Component system
- [Events](../../core-concepts/event-system.md) - Event handling
