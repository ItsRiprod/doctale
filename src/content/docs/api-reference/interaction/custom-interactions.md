---
title: "Custom Interactions"
---

<!-- [VERIFIED: 2026-01-20] -->

# Custom Interactions

This document covers creating custom interactions through both **asset-based JSON definitions** and **Java code**.

- **Asset-Based Interactions** - Define interaction chains via JSON files (most common approach)
- **Java Code Interactions** - Implement custom Operation classes for new interaction types

## Asset-Based Interactions

The most common way to create custom interactions is through JSON asset files. This allows you to define interaction chains, damage calculations, animations, and effects without writing Java code.

### Asset Locations

```
Assets/Server/Item/
├── Interactions/              # Interaction definitions
│   └── Weapons/
│       ├── DamageEntityParent.json    # Shared parent for damage
│       └── Sword/
│           └── Attacks/
│               ├── Primary/           # Primary attack chain
│               └── Signature/         # Signature abilities
├── RootInteractions/          # Entry point definitions
│   └── Weapons/
│       └── Sword/
│           ├── Root_Weapon_Sword_Primary.json
│           └── Root_Weapon_Sword_Signature_Vortexstrike.json
└── Items/                     # Item definitions referencing interactions
    └── Weapon/
        └── Sword/
```

### Interaction System Architecture

```
Item Definition                 Root Interaction              Interaction Chain
┌─────────────────┐            ┌──────────────────┐          ┌─────────────────┐
│ Interactions:   │            │ Interactions: [  │          │ Type: Charging  │
│   Primary:      │───────────▶│   "Weapon_Sword  │─────────▶│ Next: Chain     │
│     Root_...    │            │    _Primary"     │          │                 │
│   Ability1:     │            │ ]                │          └────────┬────────┘
│     Root_...    │            └──────────────────┘                   │
└─────────────────┘                                                   ▼
                                                             ┌─────────────────┐
       InteractionVars                                       │ Type: Selector  │
       (Override Vars)                                       │ HitEntity: ...  │
       ┌─────────────┐                                       └────────┬────────┘
       │ Swing_Damage│                                                │
       │   Parent:   │◀──────────────────────────────────────────────┘
       │   Custom    │         (Replace with custom damage)
       └─────────────┘
```

### Interaction Types

Each interaction JSON file specifies a `Type` that determines its behavior:

| Type | Description | Key Fields |
|------|-------------|------------|
| `Simple` | Basic timed operation | `RunTime`, `Effects` |
| `Charging` | Hold-to-charge mechanic | `DisplayProgress`, `Next` (time-based) |
| `Chaining` | Combo system | `ChainId`, `ChainingAllowance`, `Next` (array) |
| `Selector` | Hit detection sweep | `Selector`, `HitEntity`, `HitBlock` |
| `DamageEntity` | Apply damage to entity | `DamageCalculator`, `DamageEffects` |
| `Serial` | Run interactions in sequence | `Interactions` (array) |
| `Parallel` | Run interactions simultaneously | `Interactions` (array) |
| `Replace` | Var replacement for extensibility | `Var`, `DefaultValue` |
| `StatsCondition` | Check/consume stats | `Costs`, `ValueType`, `Next` |
| `ApplyEffect` | Apply entity effect | `EffectId`, `Entity` |
| `ClearEntityEffect` | Remove entity effect | `EntityEffectId`, `Entity` |
| `ChangeStat` | Modify entity stats | `StatModifiers`, `ValueType` |

### Creating a Custom Parent Interaction

To create a reusable Parent that other interactions can inherit from, create a JSON file with the desired base properties:

```json title="MyPlugin_DamageParent.json"
{
  "Type": "DamageEntity",
  "DamageCalculator": {
    "Class": "Heavy"
  },
  "DamageEffects": {
    "Knockback": {
      "Type": "Force",
      "Force": 8.0,
      "VelocityY": 3.0
    },
    "WorldParticles": [
      {
        "SystemId": "Impact_Blade_01"
      }
    ]
  },
  "Next": {
    "Type": "Serial",
    "Interactions": [
      {
        "Type": "ApplyEffect",
        "EffectId": "Red_Flash",
        "Entity": "Target"
      }
    ]
  }
}
```

Then reference it as a Parent in your item's `InteractionVars`:

```json title="Weapon_Sword_Custom.json"
{
  "Parent": "Template_Weapon_Sword",
  "InteractionVars": {
    "Swing_Left_Damage": {
      "Interactions": [
        {
          "Parent": "MyPlugin_DamageParent",
          "DamageCalculator": {
            "BaseDamage": { "Physical": 25 }
          }
        }
      ]
    }
  }
}
```

### DamageEntity Interaction Schema

```json title="Complete DamageEntity Example"
{
  "Parent": "DamageEntityParent",
  "DamageCalculator": {
    "Class": "Light",
    "BaseDamage": {
      "Physical": 18,
      "Fire": 5
    },
    "Type": "Absolute",
    "RandomPercentageModifier": 0.15
  },
  "Effects": {
    "CameraEffect": "Impact"
  },
  "DamageEffects": {
    "Knockback": {
      "Type": "Force",
      "VelocityConfig": {
        "AirResistance": 0.99,
        "GroundResistance": 0.94,
        "Threshold": 3.0,
        "Style": "Linear"
      },
      "Direction": { "X": 0, "Y": 1, "Z": -2 },
      "Force": 6.0,
      "VelocityType": "Set"
    },
    "WorldSoundEventId": "SFX_Sword_T2_Impact",
    "LocalSoundEventId": "SFX_Sword_T2_Impact",
    "WorldParticles": [
      { "SystemId": "Impact_Sword_Basic" }
    ],
    "CameraEffect": "Impact_Light"
  },
  "EntityStatsOnHit": [
    { "EntityStatId": "SignatureEnergy", "Amount": 1 }
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `Parent` | `string` | Parent interaction to inherit from |
| `DamageCalculator.Class` | `string` | Damage class: `Light`, `Heavy`, `Signature` |
| `DamageCalculator.BaseDamage` | `object` | Damage by type: `Physical`, `Fire`, `Ice`, etc. |
| `DamageEffects.Knockback` | `object` | Knockback force and direction |
| `DamageEffects.WorldParticles` | `array` | Particles spawned on hit |
| `EntityStatsOnHit` | `array` | Stats modified on successful hit |

### Simple Interaction with Animation

```json title="MyPlugin_Swing_Left.json"
{
  "Type": "Simple",
  "RunTime": 0.117,
  "Effects": {
    "ItemAnimationId": "SwingLeft",
    "WorldSoundEventId": "SFX_Light_Melee_T2_Swing",
    "LocalSoundEventId": "SFX_Sword_T2_Swing_RL_Local"
  },
  "Next": {
    "Type": "Replace",
    "Var": "Swing_Left_Selector",
    "DefaultOk": true,
    "DefaultValue": {
      "Interactions": ["MyPlugin_Swing_Left_Selector"]
    }
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `RunTime` | `float` | Duration in seconds |
| `Effects.ItemAnimationId` | `string` | Animation ID from the item's animation set |
| `Effects.WorldSoundEventId` | `string` | Sound played for all players |
| `Effects.LocalSoundEventId` | `string` | Sound played only for the player |
| `Effects.Trails` | `array` | Trail effects during swing |
| `Effects.CameraEffect` | `string` | Camera shake/effect ID |

### Selector Interaction (Hit Detection)

```json title="MyPlugin_Swing_Selector.json"
{
  "Type": "Selector",
  "RunTime": 0.05,
  "Effects": {
    "ItemAnimationId": "SwingLeftCharged",
    "Trails": [
      {
        "TrailId": "Sword_Trail",
        "StartDistance": 0.1,
        "EndDistance": 1.3
      }
    ],
    "CameraEffect": "Sword_Swing_Diagonal_Right"
  },
  "Selector": {
    "Id": "Horizontal",
    "Direction": "ToLeft",
    "TestLineOfSight": false,
    "StartDistance": 0.1,
    "EndDistance": 2.75,
    "Length": 90,
    "ExtendTop": 0.5,
    "ExtendBottom": 1.0,
    "YawStartOffset": -45
  },
  "HitBlock": {
    "Interactions": ["Block_Damage"]
  },
  "HitEntity": {
    "Interactions": [
      {
        "Type": "Replace",
        "Var": "Swing_Left_Damage",
        "DefaultOk": true,
        "DefaultValue": {
          "Interactions": ["MyPlugin_Swing_Left_Damage"]
        }
      }
    ]
  }
}
```

| Selector Field | Type | Description |
|----------------|------|-------------|
| `Id` | `string` | Selector shape: `Horizontal`, `Vertical`, `Thrust` |
| `Direction` | `string` | Sweep direction: `ToLeft`, `ToRight` |
| `StartDistance` | `float` | Inner sweep radius |
| `EndDistance` | `float` | Outer sweep radius |
| `Length` | `float` | Arc angle in degrees (360 = full circle) |
| `ExtendTop/Bottom` | `float` | Vertical extension of hitbox |
| `YawStartOffset` | `float` | Starting angle offset |
| `TestLineOfSight` | `bool` | Require line of sight to target |

### Chaining Interaction (Combos)

```json title="MyPlugin_Primary_Chain.json"
{
  "Type": "Chaining",
  "ChainingAllowance": 2,
  "ChainId": "Sword_Swings",
  "Next": [
    {
      "Type": "Replace",
      "Var": "Swing_Left",
      "DefaultOk": true,
      "DefaultValue": {
        "Interactions": ["MyPlugin_Swing_Left"]
      }
    },
    {
      "Type": "Replace",
      "Var": "Swing_Right",
      "DefaultOk": true,
      "DefaultValue": {
        "Interactions": ["MyPlugin_Swing_Right"]
      }
    },
    {
      "Type": "Replace",
      "Var": "Swing_Down",
      "DefaultOk": true,
      "DefaultValue": {
        "Interactions": ["MyPlugin_Swing_Down"]
      }
    }
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `ChainId` | `string` | Unique identifier for this combo chain |
| `ChainingAllowance` | `float` | Time window to continue combo (seconds) |
| `Next` | `array` | Sequence of interactions in the combo |

### Var/Replace System

The `Replace` type enables extensibility by defining variable points that items can override:

```json title="Interaction with Replace point"
{
  "Type": "Simple",
  "RunTime": 0.1,
  "Next": {
    "Type": "Replace",
    "Var": "Custom_Damage",
    "DefaultOk": true,
    "DefaultValue": {
      "Interactions": ["Default_Damage_Interaction"]
    }
  }
}
```

Items override these via `InteractionVars`:

```json title="Item overriding the Replace var"
{
  "Parent": "Template_Weapon_Sword",
  "InteractionVars": {
    "Custom_Damage": {
      "Interactions": [
        {
          "Parent": "DamageEntityParent",
          "DamageCalculator": {
            "BaseDamage": { "Physical": 30, "Fire": 10 }
          }
        }
      ]
    }
  }
}
```

### Creating a Root Interaction

Root interactions are entry points that items reference:

```json title="Root_MyPlugin_Custom_Primary.json"
{
  "RequireNewClick": true,
  "ClickQueuingTimeout": 0.2,
  "Cooldown": {
    "Cooldown": 0.25
  },
  "Interactions": [
    "MyPlugin_Custom_Primary"
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `RequireNewClick` | `bool` | Require new mouse click (not hold) |
| `ClickQueuingTimeout` | `float` | Time to queue next click |
| `Cooldown.Cooldown` | `float` | Cooldown duration in seconds |
| `Interactions` | `array` | Interaction IDs to execute |

### Signature Ability Example

Complete signature ability with stat cost:

```json title="MyPlugin_Signature_Ability.json"
{
  "Type": "StatsCondition",
  "Costs": {
    "SignatureEnergy": 100
  },
  "ValueType": "Percent",
  "Next": {
    "Type": "Serial",
    "Interactions": [
      {
        "Type": "Replace",
        "Var": "Signature_Effect",
        "DefaultOk": true,
        "DefaultValue": {
          "Interactions": ["MyPlugin_Signature_Spin"]
        }
      },
      {
        "Type": "Simple",
        "RunTime": 0.15
      },
      {
        "Type": "Replace",
        "Var": "Signature_Finisher",
        "DefaultOk": true,
        "DefaultValue": {
          "Interactions": ["MyPlugin_Signature_Stab"]
        }
      },
      {
        "Type": "ChangeStat",
        "StatModifiers": {
          "SignatureEnergy": -100
        },
        "ValueType": "Percent"
      }
    ]
  }
}
```

### Parallel Interactions

Run multiple interactions simultaneously:

```json title="Parallel execution example"
{
  "Type": "Parallel",
  "Interactions": [
    {
      "Interactions": [
        "MyPlugin_Force_Effect"
      ]
    },
    {
      "Interactions": [
        "MyPlugin_Selector"
      ]
    },
    {
      "Interactions": [
        "MyPlugin_Particle_Effect"
      ]
    }
  ],
  "Next": {
    "Type": "Simple",
    "RunTime": 0.25
  }
}
```

### Complete Custom Weapon Example

Here's a complete example of a custom weapon with its own interaction chain:

**1. Create the damage interaction (inherits from DamageEntityParent):**

```json title="Assets/Server/Item/Interactions/MyPlugin/MyPlugin_Heavy_Damage.json"
{
  "Parent": "DamageEntityParent",
  "DamageCalculator": {
    "Class": "Heavy"
  },
  "Effects": {
    "CameraEffect": "Impact"
  },
  "DamageEffects": {
    "Knockback": {
      "Type": "Force",
      "Direction": { "X": 0, "Y": 2, "Z": -3 },
      "Force": 10.0,
      "VelocityType": "Set"
    },
    "WorldParticles": [
      { "SystemId": "Impact_Blade_Heavy" }
    ],
    "CameraEffect": "Impact_Heavy"
  },
  "EntityStatsOnHit": [
    { "EntityStatId": "SignatureEnergy", "Amount": 2 }
  ]
}
```

**2. Create the swing animation + selector:**

```json title="Assets/Server/Item/Interactions/MyPlugin/MyPlugin_Swing.json"
{
  "Type": "Simple",
  "RunTime": 0.2,
  "Effects": {
    "ItemAnimationId": "SwingDown",
    "WorldSoundEventId": "SFX_Heavy_Melee_Swing"
  },
  "Next": {
    "Type": "Selector",
    "RunTime": 0.1,
    "Effects": {
      "Trails": [{ "TrailId": "Heavy_Blade_Trail" }],
      "CameraEffect": "Heavy_Swing"
    },
    "Selector": {
      "Id": "Vertical",
      "Direction": "ToDown",
      "StartDistance": 0.2,
      "EndDistance": 3.0,
      "Length": 120
    },
    "HitEntity": {
      "Interactions": [
        {
          "Type": "Replace",
          "Var": "Heavy_Damage",
          "DefaultOk": true,
          "DefaultValue": {
            "Interactions": ["MyPlugin_Heavy_Damage"]
          }
        }
      ]
    }
  }
}
```

**3. Create the root interaction:**

```json title="Assets/Server/Item/RootInteractions/MyPlugin/Root_MyPlugin_Primary.json"
{
  "RequireNewClick": true,
  "Cooldown": {
    "Cooldown": 0.5
  },
  "Interactions": ["MyPlugin_Swing"]
}
```

**4. Create the weapon item:**

```json title="Assets/Server/Item/Items/Weapon/MyPlugin/Weapon_Greatsword_Custom.json"
{
  "Parent": "Template_Weapon_Sword",
  "TranslationProperties": {
    "Name": "myplugin.items.greatsword_custom.name"
  },
  "Model": "MyPlugin/Weapons/Greatsword_Custom.blockymodel",
  "Texture": "MyPlugin/Weapons/Greatsword_Custom_Texture.png",
  "Quality": "Epic",
  "ItemLevel": 40,
  "MaxDurability": 200,
  "DurabilityLossOnHit": 0.25,
  "Interactions": {
    "Primary": "Root_MyPlugin_Primary",
    "Secondary": "Root_Weapon_Sword_Secondary_Guard"
  },
  "InteractionVars": {
    "Heavy_Damage": {
      "Interactions": [
        {
          "Parent": "MyPlugin_Heavy_Damage",
          "DamageCalculator": {
            "BaseDamage": { "Physical": 35 }
          }
        }
      ]
    }
  }
}
```

### Animation IDs

Available animation IDs depend on the item's `PlayerAnimationsId`. For swords:

| Animation ID | Description |
|--------------|-------------|
| `SwingLeft` | Horizontal left swing |
| `SwingRight` | Horizontal right swing |
| `SwingDown` | Vertical downward swing |
| `Thrust` | Forward thrust |
| `SpinRightCharging` | Spin charge-up |
| `SpinRightCharged` | Spin attack |
| `Guard` | Blocking stance |
| `GuardHit` | Block impact reaction |

### Best Practices

1. **Use Parent inheritance** - Create base damage interactions and override specific values
2. **Use Replace vars** - Make interactions extensible so items can customize behavior
3. **Prefix custom files** - Use your plugin name prefix for all custom interactions
4. **Chain interactions logically** - Animation → Selector → Damage is the standard pattern
5. **Test with different targets** - Verify hit detection with blocks and entities
6. **Balance cooldowns** - Match cooldown to animation length

---

## Java Code Interactions

For creating entirely new interaction types (new `Type` values), you need to implement the Java Operation interface.

## Package Location

- Operations: `com.hypixel.hytale.server.core.modules.interaction.interaction.operation`
- Configs: `com.hypixel.hytale.server.core.modules.interaction.interaction.config`
- Suppliers: `com.hypixel.hytale.server.core.modules.interaction.suppliers`

## Overview

Custom interactions can be created by:

1. Implementing the `Operation` interface
2. Registering with the interaction codec
3. Defining in RootInteraction assets

## Operation Interface

Core interface for executable interaction logic:

```java
package com.hypixel.hytale.server.core.modules.interaction.interaction.operation;

public interface Operation {
    // Server-side tick execution
    void tick(
        Ref<EntityStore> ref,
        LivingEntity entity,
        boolean firstRun,
        float time,
        InteractionType type,
        InteractionContext context,
        CooldownHandler cooldownHandler
    );

    // Client-side predictive simulation
    void simulateTick(
        Ref<EntityStore> ref,
        LivingEntity entity,
        boolean firstRun,
        float time,
        InteractionType type,
        InteractionContext context,
        CooldownHandler cooldownHandler
    );

    // Post-tick handling
    default void handle(
        Ref<EntityStore> ref,
        boolean firstRun,
        float time,
        InteractionType type,
        InteractionContext context
    ) {}

    // Sync point (Server, Client, or None)
    WaitForDataFrom getWaitForDataFrom();

    // Optional interrupt/blocking rules
    @Nullable
    default InteractionRules getRules() { return null; }

    // Optional tags for categorization
    default Int2ObjectMap<IntSet> getTags() {
        return Int2ObjectMaps.emptyMap();
    }
}
```

### Parameters

| Parameter | Description |
|-----------|-------------|
| `ref` | Entity reference |
| `entity` | Living entity instance |
| `firstRun` | True on first tick of operation |
| `time` | Elapsed time in seconds |
| `type` | Interaction type (Held, HeldOffhand, etc.) |
| `context` | Execution context with metadata |
| `cooldownHandler` | Cooldown management |

### WaitForDataFrom

Sync point for server-client coordination:

| Value | Description |
|-------|-------------|
| `None` | No synchronization needed |
| `Server` | Wait for server data |
| `Client` | Wait for client data |

## Creating a Custom Interaction

### 1. Implement the Operation

```java
package com.example.myplugin.interaction;

import com.hypixel.hytale.server.core.modules.interaction.interaction.operation.Operation;
import com.hypixel.hytale.server.core.modules.interaction.interaction.config.Interaction;
import com.hypixel.hytale.codec.BuilderCodec;
import com.hypixel.hytale.protocol.WaitForDataFrom;

public class CustomInteraction extends Interaction implements Operation {
    // Configuration fields
    private float damage;
    private String effectId;

    // Codec for serialization
    public static final BuilderCodec<CustomInteraction> CODEC = BuilderCodec.builder(
        CustomInteraction.class,
        CustomInteraction::new
    )
        .extend(Interaction.CODEC)
        .withFloat("Damage", c -> c.damage, (c, v) -> c.damage = v)
        .withString("Effect", c -> c.effectId, (c, v) -> c.effectId = v)
        .build();

    @Override
    public void tick(
        Ref<EntityStore> ref,
        LivingEntity entity,
        boolean firstRun,
        float time,
        InteractionType type,
        InteractionContext context,
        CooldownHandler cooldownHandler
    ) {
        if (firstRun) {
            // One-time initialization
            applyDamage(context, damage);
            applyEffect(context, effectId);
        }

        // Check if complete
        if (time >= runTime) {
            context.getChain().updateServerState(InteractionState.Finished);
        }
    }

    @Override
    public void simulateTick(
        Ref<EntityStore> ref,
        LivingEntity entity,
        boolean firstRun,
        float time,
        InteractionType type,
        InteractionContext context,
        CooldownHandler cooldownHandler
    ) {
        // Client-side prediction (optional)
    }

    @Override
    public WaitForDataFrom getWaitForDataFrom() {
        return WaitForDataFrom.None;
    }

    private void applyDamage(InteractionContext context, float damage) {
        // Implementation
    }

    private void applyEffect(InteractionContext context, String effectId) {
        // Implementation
    }
}
```

### 2. Register the Interaction

```java
@Override
protected void setup() {
    // Register with interaction codec
    Interaction.CODEC.register(
        "CustomInteraction",
        CustomInteraction.class,
        CustomInteraction.CODEC
    );
}
```

### 3. Define in Assets

Create a RootInteraction asset that uses your custom interaction:

```json
{
  "Id": "custom_ability",
  "InteractionIds": ["CustomInteraction"],
  "Cooldown": {
    "CooldownId": "custom_ability",
    "Cooldown": 1.0
  }
}
```

## Custom UI Page Suppliers

Create custom UI pages triggered by interactions.

### CustomPageSupplier Interface

```java
package com.hypixel.hytale.server.core.modules.interaction.interaction.config.server;

public interface CustomPageSupplier {
    CustomUIPage tryCreate(
        Ref<EntityStore> ref,
        ComponentAccessor<EntityStore> componentAccessor,
        PlayerRef playerRef,
        InteractionContext context
    );
}
```

### Implementing a Custom Page

```java
package com.example.myplugin.ui;

import com.hypixel.hytale.server.core.modules.interaction.interaction.config.server.OpenCustomUIInteraction;
import com.hypixel.hytale.server.ui.CustomUIPage;
import com.hypixel.hytale.codec.BuilderCodec;

public class MyCustomPageSupplier
    implements OpenCustomUIInteraction.CustomPageSupplier {

    // Configuration
    private String title;
    private int maxItems;

    // Codec
    public static final BuilderCodec<MyCustomPageSupplier> CODEC =
        BuilderCodec.builder(MyCustomPageSupplier.class, MyCustomPageSupplier::new)
            .withString("Title", s -> s.title, (s, v) -> s.title = v)
            .withInt("MaxItems", s -> s.maxItems, (s, v) -> s.maxItems = v)
            .build();

    @Override
    public CustomUIPage tryCreate(
        Ref<EntityStore> ref,
        ComponentAccessor<EntityStore> componentAccessor,
        PlayerRef playerRef,
        InteractionContext context
    ) {
        // Get player
        Player player = componentAccessor.getComponent(
            ref,
            Player.getComponentType()
        );

        if (player == null) {
            return null;
        }

        // Create custom page
        return new MyCustomPage(
            playerRef,
            player.getInventory(),
            title,
            maxItems
        );
    }
}
```

### Register the Supplier

```java
@Override
protected void setup() {
    OpenCustomUIInteraction.registerCustomPageSupplier(
        this,
        MyCustomPageSupplier.class,
        "MyCustomUI",
        new MyCustomPageSupplier()
    );

    // Or register codec for asset-defined suppliers
    OpenCustomUIInteraction.PAGE_CODEC.register(
        "MyCustomUI",
        MyCustomPageSupplier.class,
        MyCustomPageSupplier.CODEC
    );
}
```

## Block-Based Page Suppliers

For UIs triggered by block interaction:

```java
public class BlockCustomPageSupplier<T extends Component<ChunkStore>>
    implements OpenCustomUIInteraction.CustomPageSupplier {

    private final ComponentType<ChunkStore, T> componentType;

    @Override
    public CustomUIPage tryCreate(
        Ref<EntityStore> ref,
        ComponentAccessor<EntityStore> componentAccessor,
        PlayerRef playerRef,
        InteractionContext context
    ) {
        // Get target block from context
        Vector3i targetBlock = context.getMetaStore().get(Interaction.TARGET_BLOCK);

        if (targetBlock == null) {
            return null;
        }

        // Get block component
        T blockComponent = getBlockComponent(targetBlock, componentType);

        if (blockComponent == null) {
            return null;
        }

        // Create page using block data
        return createPage(playerRef, blockComponent);
    }
}
```

## Built-in Suppliers

| Supplier | Description |
|----------|-------------|
| `ItemRepairPageSupplier` | Item repair/anvil UI |
| `BlockEntityCustomPageSupplier` | Generic block entity UI |
| `BlockCustomPageSupplier` | Generic block component UI |

### ItemRepairPageSupplier Example

```java
public class ItemRepairPageSupplier
    implements OpenCustomUIInteraction.CustomPageSupplier {

    protected double repairPenalty;

    @Override
    public CustomUIPage tryCreate(
        Ref<EntityStore> ref,
        ComponentAccessor<EntityStore> componentAccessor,
        PlayerRef playerRef,
        InteractionContext context
    ) {
        Player player = componentAccessor.getComponent(
            ref,
            Player.getComponentType()
        );

        ItemContext itemContext = context.createHeldItemContext();

        if (itemContext == null) {
            return null;
        }

        return new ItemRepairPage(
            playerRef,
            player.getInventory().getCombinedArmorHotbarUtilityStorage(),
            repairPenalty,
            itemContext
        );
    }
}
```

## Interaction Rules

Control how interactions interact with each other:

```java
public class InteractionRules {
    // What this interaction can interrupt
    Set<String> canInterrupt;

    // What can interrupt this interaction
    Set<String> interruptedBy;

    // What this interaction blocks
    Set<String> blocks;

    // What blocks this interaction
    Set<String> blockedBy;
}
```

### Example Rules

```java
// Ability can interrupt basic attacks
InteractionRules rules = new InteractionRules();
rules.canInterrupt = Set.of("basic_attack");
rules.interruptedBy = Set.of("stun", "knockback");
rules.blocks = Set.of();
rules.blockedBy = Set.of("silence");
```

## Related

- [Interaction System](/api-reference/entities/overview/) - System overview
- [Block Tracking](/api-reference/interaction/block-tracking/) - Track block placements
- [Serialization](/api-reference/serialization/overview/) - Codec system

