<!-- [VERIFIED: 2026-01-19] -->

# Block System Overview

The Block System manages all block types, block states, and block-related operations in Hytale. Blocks are the fundamental building units of the world.

## Package Location

- BlockType: `com.hypixel.hytale.server.core.asset.type.blocktype.config.BlockType`
- BlockState: `com.hypixel.hytale.server.core.universe.world.meta.BlockState` **(deprecated)**
- BlockStateRegistry: `com.hypixel.hytale.server.core.universe.world.meta.BlockStateRegistry`
- TickProcedure: `com.hypixel.hytale.server.core.asset.type.blocktick.config.TickProcedure`

## Core Components

| Component | Description |
|-----------|-------------|
| `BlockType` | Asset definition for block behavior and appearance |
| `BlockState` | Per-block instance data for stateful blocks |
| `BlockStateRegistry` | Registration of custom block state types |
| `TickProcedure` | Block tick behavior (growth, decay, etc.) |

## BlockType

`BlockType` is an asset that defines a block's properties and behavior. It's loaded from JSON files in the `blocktype/` directory.

### BlockType Structure

```json
{
  "Id": "MyPlugin_CustomBlock",
  "Group": "MyBlocks",
  "DrawType": "Cube",
  "Material": "Stone",
  "Opacity": "Solid",
  "Textures": [
    {
      "Up": "textures/block_top.png",
      "Down": "textures/block_bottom.png",
      "North": "textures/block_side.png",
      "South": "textures/block_side.png",
      "East": "textures/block_side.png",
      "West": "textures/block_side.png"
    }
  ],
  "HitboxType": "Full",
  "BlockSoundSetId": "Hytale/Stone"
}
```

### Key Properties

#### Rendering Properties

| Property | Type | Description |
|----------|------|-------------|
| `DrawType` | `DrawType` | How the block is rendered (`Cube`, `Model`, `Empty`) |
| `Textures` | `BlockTypeTextures[]` | Textures for each face |
| `CustomModel` | `string` | Path to custom 3D model |
| `CustomModelTexture` | `array` | Textures for custom model |
| `CustomModelScale` | `float` | Scale factor for model (default: 1.0) |
| `CustomModelAnimation` | `string` | Animation for model |
| `Opacity` | `Opacity` | Light blocking (`Solid`, `Transparent`, `SemiTransparent`) |
| `RequiresAlphaBlending` | `bool` | Enable alpha blending |
| `CubeShadingMode` | `ShadingMode` | Shading style (`Standard`, etc.) |
| `Effect` | `ShaderType[]` | Shader effects |

#### Physics Properties

| Property | Type | Description |
|----------|------|-------------|
| `Material` | `BlockMaterial` | Physical material type |
| `HitboxType` | `string` | Collision hitbox type (`Full`, etc.) |
| `InteractionHitboxType` | `string` | Hitbox for interactions |
| `MovementSettings` | `object` | Movement modifiers on block |

#### Visual Properties

| Property | Type | Description |
|----------|------|-------------|
| `Light` | `ColorLight` | Emitted light color and intensity |
| `Tint` | `Color[]` | Color tint per face |
| `TintUp/Down/North/South/East/West` | `Color[]` | Per-face tints |
| `BiomeTint` | `int` | Biome color application |
| `ParticleColor` | `Color` | Particle tint |
| `Particles` | `ModelParticle[]` | Block-attached particles |
| `BlockParticleSetId` | `string` | Particle set for interactions |

#### Sound Properties

| Property | Type | Description |
|----------|------|-------------|
| `BlockSoundSetId` | `string` | Sound set for block events |
| `AmbientSoundEventId` | `string` | Looping ambient sound |
| `InteractionSoundEventId` | `string` | Sound on interaction |
| `Looping` | `bool` | Whether ambient sound loops |

#### Rotation Properties

| Property | Type | Description |
|----------|------|-------------|
| `RandomRotation` | `RandomRotation` | Random rotation on placement |
| `VariantRotation` | `VariantRotation` | Variant-based rotation |
| `FlipType` | `BlockFlipType` | Flip behavior |
| `RotationYawPlacementOffset` | `Rotation` | Yaw offset when placed |

#### Support Properties

| Property | Type | Description |
|----------|------|-------------|
| `Support` | `map` | Required support per face |
| `Supporting` | `map` | Support provided to neighbors |
| `SupportDropType` | `SupportDropType` | What happens when support lost |
| `MaxSupportDistance` | `int` | Maximum support reach (0-14) |
| `SupportsRequiredFor` | `enum` | When support is checked |
| `IgnoreSupportWhenPlaced` | `bool` | Bypass support on placement |

#### Behavior Properties

| Property | Type | Description |
|----------|------|-------------|
| `Flags.IsUsable` | `bool` | Can be used/interacted with |
| `Flags.IsStackable` | `bool` | Can be stacked on top |
| `Interactions` | `map` | Interaction handlers |
| `Bench` | `object` | Crafting bench configuration |
| `Gathering` | `object` | Resource gathering settings |
| `PlacementSettings` | `object` | Placement restrictions |
| `Seats` | `array` | Seating mount points |
| `Beds` | `array` | Bed mount points |
| `IsDoor` | `bool` | Door behavior (deprecated) |
| `DamageToEntities` | `int` | Contact damage |

#### State Properties

| Property | Type | Description |
|----------|------|-------------|
| `State` | `StateData` | Block state configuration |
| `BlockEntity` | `Holder` | ECS components for block entity |
| `TickProcedure` | `object` | Block tick behavior |

### DrawType Enum

| Value | Description |
|-------|-------------|
| `Empty` | Invisible, no rendering |
| `Cube` | Standard cube block |
| `Model` | Custom 3D model |

### BlockMaterial Enum

Common materials:

| Value | Description |
|-------|-------------|
| `Empty` | No physical material |
| `Solid` | Generic solid |
| `Stone` | Stone-like |
| `Wood` | Wood-like |
| `Metal` | Metallic |
| `Glass` | Glass-like |
| `Organic` | Plants, grass |
| `Cloth` | Fabric |
| `Liquid` | Water, lava |

### Accessing BlockTypes

```java
// Get by ID
BlockType stone = BlockType.getAssetMap().get("Rock_Stone");

// Get from world position
World world = Universe.get().getDefaultWorld();
BlockType type = world.getBlockType(x, y, z);

// Get block ID (numeric)
int blockId = world.getBlock(x, y, z);

// Check special blocks
BlockType.EMPTY  // Air block
BlockType.UNKNOWN  // Unknown block placeholder
```

### Setting Blocks

```java
// Simple set
world.setBlock(x, y, z, blockType);

// With settings
SetBlockSettings settings = new SetBlockSettings();
settings.setNotifyNeighbors(true);
settings.setUpdateLighting(true);
settings.setTriggerBlockUpdate(true);
world.setBlock(x, y, z, blockType, settings);
```

## Block States

Block states store per-block instance data for blocks that need persistent state.

> **Note:** The `BlockState` class is marked as `@Deprecated(forRemoval = true)`. It may be replaced with a new ECS-based block entity system in future versions.

### BlockState Class

```java
// BlockState is a component for the ChunkStore
public abstract class BlockState implements Component<ChunkStore> {
    // Position within chunk
    public Vector3i getPosition();
    public Vector3i getBlockPosition();  // World coordinates

    // Access chunk and block type
    public WorldChunk getChunk();
    public BlockType getBlockType();

    // Rotation
    public int getRotationIndex();

    // Lifecycle
    public boolean initialize(BlockType blockType);
    public void onUnload();
    public void invalidate();

    // Persistence
    public void markNeedsSave();
    public BsonDocument saveToDocument();
}
```

### Registering Block States

```java
@Override
protected void setup() {
    // Register a block state type
    getBlockStateRegistry().registerBlockState(
        MyBlockState.class,
        "MyPlugin_CustomState",
        MyBlockState.CODEC
    );

    // With associated data class
    getBlockStateRegistry().registerBlockState(
        MyBlockState.class,
        "MyPlugin_CustomState",
        MyBlockState.CODEC,
        MyStateData.class,
        MyStateData.CODEC
    );
}
```

### Custom Block State Example

```java
public class ChestBlockState extends BlockState {
    public static final BuilderCodec<ChestBlockState> CODEC =
        BuilderCodec.builder(ChestBlockState.class, ChestBlockState::new)
            .inherit(BlockState.BASE_CODEC)
            .addField(
                new KeyedCodec<>("IsOpen", Codec.BOOLEAN),
                (state, open) -> state.isOpen = open,
                state -> state.isOpen
            )
            .build();

    private boolean isOpen = false;
    private ItemContainer inventory;

    @Override
    public boolean initialize(BlockType blockType) {
        this.inventory = new SimpleItemContainer((short) 27);
        return true;
    }

    public void toggle() {
        this.isOpen = !this.isOpen;
        markNeedsSave();
    }

    public ItemContainer getInventory() {
        return inventory;
    }
}
```

### Accessing Block States

```java
// Get state from chunk
WorldChunk chunk = world.getChunk(chunkX, chunkZ);
BlockState state = chunk.getState(localX, y, localZ);

// Ensure state exists (creates if needed)
BlockState state = BlockState.ensureState(chunk, x, y, z);

// Cast to specific type
if (state instanceof ChestBlockState chestState) {
    chestState.toggle();
}
```

## Block Tick System

Blocks can have tick procedures for time-based behavior like growth or decay.

### TickProcedure

```java
public abstract class TickProcedure {
    // Called when block should tick
    public abstract BlockTickStrategy onTick(
        World world,
        WorldChunk chunk,
        int x, int y, int z,
        int blockId
    );
}
```

### BlockTickStrategy

Return value indicating what happened:

| Strategy | Description |
|----------|-------------|
| `NONE` | No change |
| `CHANGED` | Block was modified |
| `REMOVED` | Block was removed |

### Built-in Procedures

```java
// Basic chance-based growth
public class BasicChanceBlockGrowthProcedure extends TickProcedure {
    // Grows block to next stage with configurable chance
}

// Split chance growth (different chances per stage)
public class SplitChanceBlockGrowthProcedure extends TickProcedure {
    // Different growth chances for each stage
}
```

### Tick Procedure in JSON

```json
{
  "Id": "MyPlugin_GrowingPlant",
  "TickProcedure": {
    "Type": "BasicChanceBlockGrowthProcedure",
    "GrowChance": 0.1,
    "GrowToBlock": "MyPlugin_MaturePlant"
  }
}
```

## Block Support System

Blocks can require and provide support to neighboring blocks.

### Support Configuration

```json
{
  "Support": {
    "Down": [{ "Type": "Full" }]
  },
  "Supporting": {
    "Up": [{ "Type": "Full" }],
    "North": [{ "Type": "Full" }],
    "South": [{ "Type": "Full" }],
    "East": [{ "Type": "Full" }],
    "West": [{ "Type": "Full" }]
  },
  "SupportDropType": "BREAK"
}
```

### SupportDropType

| Type | Description |
|------|-------------|
| `BREAK` | Block breaks when support lost |
| `DROP` | Block drops as item |
| `NONE` | Block stays (no physics) |

## Connected Blocks

Blocks can connect to neighbors for visual continuity (fences, glass panes, etc.).

```json
{
  "ConnectedBlockRuleSet": {
    "Rules": [
      {
        "Condition": { "Type": "SameBlock" },
        "Connect": true
      }
    ]
  }
}
```

## Block Interactions

Define interactions in the block type:

```json
{
  "Interactions": {
    "Primary": "MyPlugin_PrimaryInteraction",
    "Secondary": "MyPlugin_SecondaryInteraction"
  },
  "InteractionHint": "ui.interaction.open"
}
```

## Block Events

### Block Break/Place Events

```java
getEventRegistry().register(BreakBlockEvent.class, event -> {
    BlockType blockType = event.getBlockType();
    Vector3i position = event.getPosition();
    PlayerRef player = event.getPlayerRef();

    // Cancel to prevent breaking
    event.setCancelled(true);
});

getEventRegistry().register(PlaceBlockEvent.class, event -> {
    BlockType blockType = event.getBlockType();
    // Handle placement
});
```

### Block Use Events

```java
getEventRegistry().register(UseBlockEvent.class, event -> {
    BlockType blockType = event.getBlockType();
    // Handle interaction
});
```

## Best Practices

1. **Use groups**: Organize related blocks with the `Group` property
2. **Minimize states**: Only use block states when truly needed
3. **Optimize hitboxes**: Use appropriate hitbox complexity
4. **Consider support**: Define support requirements for physics
5. **Batch updates**: Group block changes when possible
6. **Check loaded**: Verify chunks are loaded before block access

## Related

- [Asset System](../assets/overview.md) - Asset loading
- [World System](../world/overview.md) - World and chunks
- [Events](../../core-concepts/event-system.md) - Block events
