<!-- [VERIFIED: 2026-01-19] -->

# Player Inventory

The inventory system manages player item storage including hotbar, main storage, armor, utility slots, and backpack.

## Package Location

`com.hypixel.hytale.server.core.inventory`

## Overview

Player inventory is divided into sections, each with a unique section ID. Active slots track which item the player currently has selected in each section.

## Inventory Sections

| Section ID | Constant | Capacity | Purpose |
|-----------|----------|----------|---------|
| -1 | `HOTBAR_SECTION_ID` | 9 | Main hotbar (0-8) |
| -2 | `STORAGE_SECTION_ID` | 36 | Main storage (4x9 grid) |
| -3 | `ARMOR_SECTION_ID` | 6 | Armor equipment |
| -5 | `UTILITY_SECTION_ID` | 4 | Consumables (food, potions) |
| -8 | `TOOLS_SECTION_ID` | 23 | Tools (deprecated) |
| -9 | `BACKPACK_SECTION_ID` | Variable | Expandable storage |

## Core Class

### Inventory

Main inventory management class:

```java
package com.hypixel.hytale.server.core.inventory;

public class Inventory {
    // Section ID constants
    public static final int HOTBAR_SECTION_ID = -1;
    public static final int STORAGE_SECTION_ID = -2;
    public static final int ARMOR_SECTION_ID = -3;
    public static final int UTILITY_SECTION_ID = -5;
    public static final int TOOLS_SECTION_ID = -8;
    public static final int BACKPACK_SECTION_ID = -9;

    // Container access
    public ItemContainer getHotbar();
    public ItemContainer getStorage();
    public ItemContainer getArmor();
    public ItemContainer getUtility();
    public ItemContainer getTools();
    public ItemContainer getBackpack();
    public ItemContainer getSectionById(int sectionId);

    // Active slot management - Hotbar
    public byte getActiveHotbarSlot();
    public void setActiveHotbarSlot(byte slot);
    public ItemStack getActiveHotbarItem();
    public ItemStack getItemInHand();

    // Active slot management - Utility
    public byte getActiveUtilitySlot();
    public void setActiveUtilitySlot(byte slot);
    public ItemStack getUtilityItem();

    // Active slot management - Tools (deprecated)
    public byte getActiveToolsSlot();
    public void setActiveToolsSlot(byte slot);
    public ItemStack getToolsItem();

    // Item operations
    public void moveItem(
        int fromSectionId, int fromSlotId,
        int quantity,
        int toSectionId, int toSlotId
    );

    public void smartMoveItem(
        int fromSectionId, int fromSlotId,
        int quantity,
        SmartMoveType moveType
    );

    // Bulk operations
    public ListTransaction<MoveTransaction<ItemStackTransaction>> takeAll(
        int inventorySectionId
    );

    public ListTransaction<MoveTransaction<ItemStackTransaction>> putAll(
        int inventorySectionId
    );

    public ListTransaction<MoveTransaction<ItemStackTransaction>> quickStack(
        int inventorySectionId
    );

    public List<ItemStack> dropAllItemStacks();
    public void clear();

    // Combined containers
    public CombinedItemContainer getCombinedHotbarFirst();
    public CombinedItemContainer getCombinedStorageFirst();
    public CombinedItemContainer getCombinedArmorHotbarStorage();
    public CombinedItemContainer getCombinedEverything();
}
```

## Armor Slots

The armor section has 6 slots corresponding to `ItemArmorSlot`:

| Slot Index | Position |
|------------|----------|
| 0 | Head |
| 1 | Chest |
| 2 | Legs |
| 3 | Feet |
| 4 | Cape |
| 5 | Accessory |

## Usage Examples

### Accessing Inventory Containers

```java
import com.hypixel.hytale.server.core.inventory.Inventory;
import com.hypixel.hytale.server.core.entity.entities.Player;
import com.hypixel.hytale.server.core.inventory.container.ItemContainer;

// Get player inventory
Player player = /* player reference */;
Inventory inventory = player.getInventory();

// Access containers
ItemContainer hotbar = inventory.getHotbar();      // 9 slots
ItemContainer storage = inventory.getStorage();    // 36 slots
ItemContainer armor = inventory.getArmor();        // 6 slots
ItemContainer utility = inventory.getUtility();    // 4 slots
ItemContainer backpack = inventory.getBackpack();  // Variable size

// Access by section ID
ItemContainer section = inventory.getSectionById(Inventory.HOTBAR_SECTION_ID);
```

### Working with Active Slots

```java
// Get currently held item (main hand)
ItemStack heldItem = inventory.getItemInHand();

// Get active hotbar slot (0-8)
byte activeSlot = inventory.getActiveHotbarSlot();

// Change active slot
inventory.setActiveHotbarSlot((byte) 3);

// Get specific hotbar item
ItemStack hotbarItem = inventory.getActiveHotbarItem();

// Utility items
ItemStack utilityItem = inventory.getUtilityItem();
inventory.setActiveUtilitySlot((byte) 1);
```

### Moving Items

```java
// Move 1 item from hotbar slot 0 to storage slot 10
inventory.moveItem(
    Inventory.HOTBAR_SECTION_ID, 0,  // From
    1,                                // Quantity
    Inventory.STORAGE_SECTION_ID, 10  // To
);

// Move entire stack
ItemContainer hotbar = inventory.getHotbar();
ItemStack item = hotbar.getItemAt(0);
int quantity = item != null ? item.getQuantity() : 0;

inventory.moveItem(
    Inventory.HOTBAR_SECTION_ID, 0,
    quantity,
    Inventory.STORAGE_SECTION_ID, 10
);
```

### Smart Move

```java
import com.hypixel.hytale.server.core.inventory.SmartMoveType;

// Auto-equip armor or merge stacks
inventory.smartMoveItem(
    Inventory.STORAGE_SECTION_ID, 15,
    1,
    SmartMoveType.EquipOrMergeStack
);

// Move to hotbar if possible, otherwise storage
inventory.smartMoveItem(
    Inventory.STORAGE_SECTION_ID, 20,
    1,
    SmartMoveType.ToHotbar
);
```

### Bulk Operations

```java
// Take all items from a container (e.g., chest)
var takeTransaction = inventory.takeAll(externalContainerId);

// Put all storage items into container
var putTransaction = inventory.putAll(externalContainerId);

// Quick stack matching items to container
var quickTransaction = inventory.quickStack(externalContainerId);

// Drop all items (on death)
List<ItemStack> droppedItems = inventory.dropAllItemStacks();

// Clear entire inventory
inventory.clear();
```

### Combined Containers

```java
// Search hotbar first, then storage
CombinedItemContainer hotbarFirst = inventory.getCombinedHotbarFirst();

// Search storage first, then hotbar
CombinedItemContainer storageFirst = inventory.getCombinedStorageFirst();

// Search armor, hotbar, storage
CombinedItemContainer armorHotbarStorage = inventory.getCombinedArmorHotbarStorage();

// Search everything
CombinedItemContainer everything = inventory.getCombinedEverything();

// Find item in combined container
ItemStack foundItem = everything.findItem(item ->
    item.getItem().getId().equals("iron_sword")
);
```

### Working with Armor

```java
// Get armor container
ItemContainer armor = inventory.getArmor();

// Get specific armor piece
ItemStack helmet = armor.getItemAt(0);  // Head
ItemStack chest = armor.getItemAt(1);   // Chest
ItemStack legs = armor.getItemAt(2);    // Legs
ItemStack feet = armor.getItemAt(3);    // Feet
ItemStack cape = armor.getItemAt(4);    // Cape
ItemStack accessory = armor.getItemAt(5); // Accessory

// Check if slot is empty
if (armor.isEmpty(0)) {
    // No helmet equipped
}
```

### Checking Item in Hand

```java
// Get currently held item
ItemStack heldItem = inventory.getItemInHand();

if (heldItem != null) {
    Item item = heldItem.getItem();
    String itemId = item.getId();
    int quantity = heldItem.getQuantity();

    // Check item type
    if (item.getWeapon() != null) {
        // Holding a weapon
    } else if (item.getTool() != null) {
        // Holding a tool
    } else if (item.getBlock() != null) {
        // Holding a placeable block
    }
}
```

## SmartMoveType

Options for intelligent item placement:

| Type | Description |
|------|-------------|
| `EquipOrMergeStack` | Auto-equip armor/tools, or merge with existing stacks |
| `ToHotbar` | Move to hotbar if possible |
| `ToStorage` | Move to main storage |
| `ToArmor` | Equip in appropriate armor slot |

## Slot Indices

- **Hotbar**: 0-8 (9 slots)
- **Storage**: 0-35 (36 slots, 4 rows x 9 columns)
- **Armor**: 0-5 (Head, Chest, Legs, Feet, Cape, Accessory)
- **Utility**: 0-3 (4 slots)
- **Inactive indicator**: -1 (no active slot)

## Related

- [Inventory System](../inventory/overview.md) - Full inventory API
- [Entity System](overview.md) - Player entity
- [Item System](../items/overview.md) - Item types and stacks

