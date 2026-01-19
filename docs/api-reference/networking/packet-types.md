<!-- [VERIFIED: 2026-01-19] -->

# Packet Types Catalog

Complete catalog of all 354 packet types in the Hytale protocol, organized by category.

## Package Location

`com.hypixel.hytale.protocol.packets`

## Packet Direction Legend

| Symbol | Meaning |
|--------|---------|
| S→C | Server to Client |
| C→S | Client to Server |
| Both | Bidirectional |

## Connection Packets

**Package:** `protocol.packets.connection`

| ID | Name | Direction | Description |
|----|------|-----------|-------------|
| 0 | `Connect` | C→S | Initial connection with protocol hash, UUID, username |
| 1 | `Disconnect` | Both | Connection termination with reason |
| 2 | `Ping` | S→C | Latency measurement request |
| 3 | `Pong` | C→S | Latency measurement response |

## Authentication Packets

**Package:** `protocol.packets.auth`

| ID | Name | Direction | Description |
|----|------|-----------|-------------|
| 10 | `Status` | S→C | Authentication status update |
| 11 | `AuthGrant` | S→C | Server grants authentication rights |
| 12 | `AuthToken` | C→S | Client sends access token |
| 13 | `ServerAuthToken` | S→C | Server provides auth token |
| 14 | `ConnectAccept` | S→C | Server accepts connection |
| 15 | `PasswordResponse` | C→S | Password authentication response |
| 16 | `PasswordAccepted` | S→C | Server accepts password |
| 17 | `PasswordRejected` | S→C | Server rejects password with reason |
| 18 | `ClientReferral` | C→S | Client referral data |

## Setup Packets

**Package:** `protocol.packets.setup`

| ID | Name | Direction | Description |
|----|------|-----------|-------------|
| 20 | `WorldSettings` | S→C | World name, seed, difficulty, game rules |
| 21 | `WorldLoadProgress` | S→C | World loading progress indicator |
| 22 | `WorldLoadFinished` | S→C | World fully loaded signal |
| 23 | `RequestAssets` | C→S | Client requests specific assets |
| 24 | `AssetInitialize` | S→C | Begin asset transfer |
| 25 | `AssetPart` | S→C | Asset data chunk |
| 26 | `AssetFinalize` | S→C | Asset transfer complete |
| 27 | `RemoveAssets` | S→C | Remove assets from client cache |
| 28 | `RequestCommonAssetsRebuild` | C→S | Request common assets rebuild |
| 29 | `SetUpdateRate` | S→C | Server update tick rate |
| 30 | `SetTimeDilation` | S→C | Time dilation factor |
| 31 | `UpdateFeatures` | S→C | Server feature capabilities |
| 32 | `ViewRadius` | S→C | Chunk loading radius |
| 33 | `PlayerOptions` | S→C | Player-specific options |
| 34 | `ServerTags` | S→C | Server metadata tags |

## Asset Packets

**Package:** `protocol.packets.assets`

| ID | Name | Direction | Description |
|----|------|-----------|-------------|
| 40 | `UpdateBlockTypes` | S→C | Block definitions (compressed) |
| 41 | `UpdateBlockHitboxes` | S→C | Block collision hitboxes |
| 42 | `UpdateBlockSoundSets` | S→C | Block sound effects |
| 43 | `UpdateItemSoundSets` | S→C | Item sound effects |
| 44 | `UpdateBlockParticleSets` | S→C | Block particle effects |
| 45 | `UpdateBlockBreakingDecals` | S→C | Block destruction visuals |
| 46 | `UpdateBlockSets` | S→C | Block groupings (compressed) |
| 47 | `UpdateWeathers` | S→C | Weather configurations |
| 48 | `UpdateTrails` | S→C | Particle trail definitions |
| 49 | `UpdateParticleSystems` | S→C | Particle systems (compressed) |
| 50 | `UpdateParticleSpawners` | S→C | Particle spawners |
| 51 | `UpdateEntityEffects` | S→C | Entity effect definitions |
| 52 | `UpdateItemPlayerAnimations` | S→C | Item player animations |
| 53 | `UpdateModelvfxs` | S→C | Model visual effects |
| 54 | `UpdateItems` | S→C | Item definitions (compressed) |
| 55 | `UpdateItemQualities` | S→C | Item quality definitions |
| 56 | `UpdateItemCategories` | S→C | Item categorization |
| 57 | `UpdateItemReticles` | S→C | Aiming reticle definitions |
| 58 | `UpdateFieldcraftCategories` | S→C | Fieldcraft categories |
| 59 | `UpdateResourceTypes` | S→C | Resource type definitions |
| 60 | `UpdateRecipes` | S→C | Crafting recipes (compressed) |
| 61 | `UpdateEnvironments` | S→C | Environment definitions |
| 62 | `UpdateAmbienceFX` | S→C | Ambient effects |
| 63 | `UpdateFluidFX` | S→C | Fluid visual effects |
| 64 | `UpdateTranslations` | S→C | Localization (compressed) |
| 65 | `UpdateSoundEvents` | S→C | Sound event definitions |
| 66 | `UpdateInteractions` | S→C | Interaction definitions |
| 67 | `UpdateRootInteractions` | S→C | Root interaction definitions |
| 68 | `UpdateUnarmedInteractions` | S→C | Unarmed combat interactions |
| 69 | `TrackOrUpdateObjective` | S→C | Track/update quest objective |
| 70 | `UntrackObjective` | S→C | Stop tracking objective |
| 71 | `UpdateObjectiveTask` | S→C | Objective task update |
| 72 | `UpdateEntityStatTypes` | S→C | Entity stat types |
| 73 | `UpdateEntityUIComponents` | S→C | Entity UI components |
| 74 | `UpdateHitboxCollisionConfig` | S→C | Collision configuration |
| 75 | `UpdateRepulsionConfig` | S→C | Entity repulsion config |
| 76 | `UpdateViewBobbing` | S→C | Camera bob settings |
| 77 | `UpdateCameraShake` | S→C | Camera shake effects (compressed) |
| 78 | `UpdateBlockGroups` | S→C | Block group definitions |
| 79 | `UpdateSoundSets` | S→C | Sound sets (compressed) |
| 80 | `UpdateAudioCategories` | S→C | Audio category definitions |
| 81 | `UpdateReverbEffects` | S→C | Reverb effects |
| 82 | `UpdateEqualizerEffects` | S→C | Audio equalizer configs |
| 83 | `UpdateFluids` | S→C | Fluid type definitions |
| 84 | `UpdateTagPatterns` | S→C | Tag pattern definitions |
| 85 | `UpdateProjectileConfigs` | S→C | Projectile configurations |

## Player Packets

**Package:** `protocol.packets.player`

| ID | Name | Direction | Description |
|----|------|-----------|-------------|
| 100 | `SetClientId` | S→C | Assigns client ID |
| 101 | `SetGameMode` | S→C | Sets game mode |
| 102 | `SetMovementStates` | S→C | Movement state flags |
| 103 | `SetBlockPlacementOverride` | S→C | Block placement override |
| 104 | `JoinWorld` | S→C | Player joins world |
| 105 | `ClientReady` | C→S | Client ready for gameplay |
| 106 | `LoadHotbar` | S→C | Load hotbar configuration |
| 107 | `SaveHotbar` | C→S | Save hotbar state |
| 108 | `ClientMovement` | C→S | Player movement (compressed) |
| 109 | `ClientTeleport` | C→S | Teleportation request |
| 110 | `UpdateMovementSettings` | C→S | Movement settings |
| 111 | `MouseInteraction` | C→S | Mouse interaction event |
| 112 | `DamageInfo` | S→C | Player damage information |
| 113 | `ReticleEvent` | C→S | Reticle interaction |
| 114 | `DisplayDebug` | S→C | Debug information display |
| 115 | `ClearDebugShapes` | S→C | Clear debug shapes |
| 116 | `SyncPlayerPreferences` | S→C | Sync player preferences |
| 117 | `ClientPlaceBlock` | C→S | Block placement |
| 118 | `UpdateMemoriesFeatureStatus` | S→C | Memory feature status |
| 119 | `RemoveMapMarker` | C→S | Remove map marker |

## World Packets

**Package:** `protocol.packets.world`

| ID | Name | Direction | Description |
|----|------|-----------|-------------|
| 131 | `SetChunk` | S→C | Chunk data with blocks/fluids |
| 132 | `SetChunkHeightmap` | S→C | Chunk heightmap |
| 133 | `SetChunkTintmap` | S→C | Chunk color tinting |
| 134 | `SetChunkEnvironments` | S→C | Chunk environment settings |
| 135 | `UnloadChunk` | S→C | Unload chunk |
| 136 | `SetFluids` | S→C | Fluid data |
| 140 | `ServerSetBlock` | S→C | Single block change |
| 141 | `ServerSetBlocks` | S→C | Batch block updates |
| 142 | `ServerSetFluid` | S→C | Single fluid change |
| 143 | `ServerSetFluids` | S→C | Batch fluid updates |
| 144 | `UpdateBlockDamage` | S→C | Block damage progress |
| 145 | `UpdateTimeSettings` | S→C | World time settings |
| 146 | `UpdateTime` | S→C | Current world time |
| 147 | `UpdateEditorTimeOverride` | S→C | Editor time override |
| 148 | `ClearEditorTimeOverride` | S→C | Clear time override |
| 149 | `UpdateWeather` | S→C | Weather update |
| 150 | `UpdateEditorWeatherOverride` | S→C | Editor weather override |
| 151 | `UpdateEnvironmentMusic` | S→C | Background music |
| 152 | `SpawnParticleSystem` | S→C | Spawn particles |
| 153 | `SpawnBlockParticleSystem` | S→C | Block-based particles |
| 154 | `PlaySoundEvent2D` | S→C | 2D ambient sound |
| 155 | `PlaySoundEvent3D` | S→C | 3D positional sound |
| 156 | `PlaySoundEventEntity` | S→C | Entity-attached sound |
| 157 | `UpdateSleepState` | S→C | Player sleep state |
| 158 | `SetPaused` | S→C | Client pause state |
| 159 | `ServerSetPaused` | S→C | Server pause state |
| 360 | `UpdateSunSettings` | S→C | Sun/lighting settings |
| 361 | `UpdatePostFxSettings` | S→C | Post-processing settings |

## Entity Packets

**Package:** `protocol.packets.entities`

| ID | Name | Direction | Description |
|----|------|-----------|-------------|
| 160 | `SetEntitySeed` | S→C | Entity random seed |
| 161 | `EntityUpdates` | S→C | Batch entity updates |
| 162 | `PlayAnimation` | S→C | Entity animation |
| 163 | `ChangeVelocity` | S→C | Entity velocity |
| 164 | `ApplyKnockback` | S→C | Knockback force |
| 165 | `SpawnModelParticles` | S→C | Model particle effects |
| 166 | `MountMovement` | S→C | Mount movement updates |

## Inventory Packets

**Package:** `protocol.packets.inventory`

| ID | Name | Direction | Description |
|----|------|-----------|-------------|
| 170 | `UpdatePlayerInventory` | S→C | Full inventory update (compressed) |
| 171 | `SetCreativeItem` | S→C | Creative inventory item |
| 172 | `DropCreativeItem` | C→S | Drop creative item |
| 173 | `SmartGiveCreativeItem` | S→C | Smart item give |
| 174 | `DropItemStack` | C→S | Drop item stack |
| 175 | `MoveItemStack` | C→S | Move item between slots |
| 176 | `SmartMoveItemStack` | C→S | Smart item move |
| 177 | `SetActiveSlot` | C→S | Set active hotbar slot |
| 178 | `SwitchHotbarBlockSet` | C→S | Switch hotbar block set |
| 179 | `InventoryAction` | C→S | Generic inventory action |

## Window Packets

**Package:** `protocol.packets.window`

| ID | Name | Direction | Description |
|----|------|-----------|-------------|
| 200 | `OpenWindow` | S→C | Open GUI window |
| 201 | `UpdateWindow` | S→C | Window content update (compressed) |
| 202 | `CloseWindow` | Both | Close active window |
| 203 | `SendWindowAction` | C→S | Window interaction |
| 204 | `ClientOpenWindow` | C→S | Request window open |

## Interface Packets

**Package:** `protocol.packets.interface_`

| ID | Name | Direction | Description |
|----|------|-----------|-------------|
| 210 | `ServerMessage` | S→C | Server message display |
| 211 | `ChatMessage` | Both | Chat message |
| 212 | `Notification` | S→C | UI notification |
| 213 | `KillFeedMessage` | S→C | Kill feed entry |
| 214 | `ShowEventTitle` | S→C | Display event title |
| 215 | `HideEventTitle` | S→C | Hide event title |
| 216 | `SetPage` | S→C | Set UI page |
| 217 | `CustomHud` | S→C | Custom HUD element |
| 218 | `CustomPage` | S→C | Custom page content |
| 219 | `CustomPageEvent` | C→S | Custom page interaction |
| 222 | `EditorBlocksChange` | S→C | Editor block changes |
| 223 | `ServerInfo` | S→C | Server info (name, MOTD) |
| 224 | `AddToServerPlayerList` | S→C | Add player to list |
| 225 | `RemoveFromServerPlayerList` | S→C | Remove player from list |
| 226 | `UpdateServerPlayerList` | S→C | Batch player list update |
| 227 | `UpdateServerPlayerListPing` | S→C | Update player pings |
| 228 | `UpdateKnownRecipes` | S→C | Known recipes (compressed) |
| 229 | `UpdatePortal` | S→C | Portal update |
| 230 | `UpdateVisibleHudComponents` | S→C | HUD visibility |
| 231 | `ResetUserInterfaceState` | S→C | Reset UI state |
| 232 | `UpdateLanguage` | S→C | Language update |
| 233 | `WorldSavingStatus` | S→C | Save progress |
| 234 | `OpenChatWithCommand` | S→C | Open chat with command |

## World Map Packets

**Package:** `protocol.packets.worldmap`

| ID | Name | Direction | Description |
|----|------|-----------|-------------|
| 240 | `UpdateWorldMapSettings` | S→C | Map display settings |
| 241 | `UpdateWorldMap` | S→C | Map data (compressed) |
| 242 | `ClearWorldMap` | S→C | Clear map data |
| 243 | `UpdateWorldMapVisible` | S→C | Visible map regions |
| 244 | `TeleportToWorldMapMarker` | C→S | Teleport to marker |
| 245 | `TeleportToWorldMapPosition` | C→S | Teleport to coordinates |

## Server Access Packets

**Package:** `protocol.packets.serveraccess`

| ID | Name | Direction | Description |
|----|------|-----------|-------------|
| 250 | `RequestServerAccess` | C→S | Request access level |
| 251 | `UpdateServerAccess` | S→C | Update player access |
| 252 | `SetServerAccess` | C→S | Set/modify access |

## Machinima Packets

**Package:** `protocol.packets.machinima`

| ID | Name | Direction | Description |
|----|------|-----------|-------------|
| 260 | `RequestMachinimaActorModel` | C→S | Request actor model |
| 261 | `SetMachinimaActorModel` | S→C | Set actor model |
| 262 | `UpdateMachinimaScene` | S→C | Update scene config |

## Camera Packets

**Package:** `protocol.packets.camera`

| ID | Name | Direction | Description |
|----|------|-----------|-------------|
| 280 | `SetServerCamera` | S→C | Server camera control |
| 281 | `CameraShakeEffect` | S→C | Camera shake effect |
| 282 | `RequestFlyCameraMode` | C→S | Request fly camera |
| 283 | `SetFlyCameraMode` | S→C | Set fly camera state |

## Interaction Packets

**Package:** `protocol.packets.interaction`

| ID | Name | Direction | Description |
|----|------|-----------|-------------|
| 290 | `SyncInteractionChains` | S→C | Sync interaction chains |
| 291 | `CancelInteractionChain` | C→S | Cancel interaction |
| 292 | `PlayInteractionFor` | S→C | Play interaction |
| 293 | `MountNPC` | C→S | Mount NPC |
| 294 | `DismountNPC` | C→S | Dismount from NPC |

## Asset Editor Packets

**Package:** `protocol.packets.asseteditor`

| ID | Name | Direction | Description |
|----|------|-----------|-------------|
| 300 | `FailureReply` | S→C | Operation failed |
| 301 | `SuccessReply` | S→C | Operation succeeded |
| 302 | `AssetEditorInitialize` | S→C | Initialize editor |
| 303 | `AssetEditorAuthorization` | S→C | Check authorization |
| 304 | `AssetEditorCapabilities` | S→C | Editor capabilities |
| 305 | `AssetEditorSetupSchemas` | S→C | Asset schemas |
| 306 | `AssetEditorSetupAssetTypes` | S→C | Asset types |
| 307 | `AssetEditorCreateDirectory` | C→S | Create directory |
| 308 | `AssetEditorDeleteDirectory` | C→S | Delete directory |
| 309 | `AssetEditorRenameDirectory` | C→S | Rename directory |
| 310 | `AssetEditorFetchAsset` | C→S | Fetch asset data |
| 311 | `AssetEditorFetchJsonAssetWithParents` | C→S | Fetch with inheritance |
| 312 | `AssetEditorFetchAssetReply` | S→C | Asset fetch reply |
| 313 | `AssetEditorFetchJsonAssetWithParentsReply` | S→C | Inheritance reply |
| 314 | `AssetEditorAssetPackSetup` | S→C | Asset pack info |
| 315 | `AssetEditorUpdateAssetPack` | C→S | Update asset pack |
| 316 | `AssetEditorCreateAssetPack` | C→S | Create asset pack |
| 317 | `AssetEditorDeleteAssetPack` | C→S | Delete asset pack |
| 318 | `AssetEditorEnableAssetPack` | C→S | Enable/disable pack |
| 319 | `AssetEditorAssetListSetup` | S→C | Asset list |
| 320 | `AssetEditorAssetListUpdate` | S→C | Update asset list |
| 321 | `AssetEditorRequestChildrenList` | C→S | Request children |
| 322 | `AssetEditorRequestChildrenListReply` | S→C | Children reply |
| 323 | `AssetEditorUpdateJsonAsset` | C→S | Update JSON asset |
| 324 | `AssetEditorUpdateAsset` | C→S | Update asset |
| 325 | `AssetEditorJsonAssetUpdated` | S→C | JSON update notice |
| 326 | `AssetEditorAssetUpdated` | S→C | Asset update notice |
| 327 | `AssetEditorCreateAsset` | C→S | Create asset |
| 328 | `AssetEditorRenameAsset` | C→S | Rename asset |
| 329 | `AssetEditorDeleteAsset` | C→S | Delete asset |
| 330 | `AssetEditorDiscardChanges` | C→S | Discard changes |
| 331 | `AssetEditorFetchAutoCompleteData` | C→S | Autocomplete request |
| 332 | `AssetEditorFetchAutoCompleteDataReply` | S→C | Autocomplete reply |
| 333 | `AssetEditorRequestDataset` | C→S | Request dataset |
| 334 | `AssetEditorRequestDatasetReply` | S→C | Dataset reply |
| 335 | `AssetEditorActivateButton` | C→S | Activate button |
| 336 | `AssetEditorSelectAsset` | C→S | Select asset |
| 337 | `AssetEditorPopupNotification` | S→C | Popup notification |
| 338 | `AssetEditorFetchLastModifiedAssets` | C→S | Recent assets |
| 339 | `AssetEditorLastModifiedAssets` | S→C | Recent assets reply |
| 340 | `AssetEditorModifiedAssetsCount` | S→C | Modified count |
| 341 | `AssetEditorSubscribeModifiedAssetsChanges` | C→S | Subscribe changes |
| 342 | `AssetEditorExportAssets` | C→S | Export assets |
| 343 | `AssetEditorExportAssetInitialize` | S→C | Begin export |
| 344 | `AssetEditorExportAssetPart` | S→C | Export chunk |
| 345 | `AssetEditorExportAssetFinalize` | S→C | Export complete |
| 346 | `AssetEditorExportDeleteAssets` | S→C | Remove exports |
| 347 | `AssetEditorExportComplete` | S→C | Export finished |
| 348 | `AssetEditorRebuildCaches` | C→S | Rebuild caches |
| 349 | `AssetEditorUndoChanges` | C→S | Undo edit |
| 350 | `AssetEditorRedoChanges` | C→S | Redo edit |
| 351 | `AssetEditorUndoRedoReply` | S→C | Undo/redo reply |
| 352 | `AssetEditorSetGameTime` | C→S | Set preview time |
| 353 | `AssetEditorUpdateSecondsPerGameDay` | C→S | Adjust time speed |
| 354 | `AssetEditorUpdateWeatherPreviewLock` | C→S | Lock weather |
| 355 | `AssetEditorUpdateModelPreview` | C→S | Update model preview |

## Builder Tools Packets

**Package:** `protocol.packets.buildertools`

| ID | Name | Direction | Description |
|----|------|-----------|-------------|
| 400 | `BuilderToolArgUpdate` | C→S | Tool argument update |
| 401 | `BuilderToolEntityAction` | C→S | Entity modification |
| 402 | `BuilderToolSetEntityTransform` | C→S | Entity transform |
| 403 | `BuilderToolExtrudeAction` | C→S | Extrude selection |
| 404 | `BuilderToolStackArea` | C→S | Stack/duplicate |
| 405 | `BuilderToolSelectionTransform` | C→S | Transform selection |
| 406 | `BuilderToolRotateClipboard` | C→S | Rotate clipboard |
| 407 | `BuilderToolPasteClipboard` | C→S | Paste clipboard |
| 408 | `BuilderToolSetTransformationModeState` | C→S | Transformation mode |
| 409 | `BuilderToolSelectionUpdate` | C→S | Update selection |
| 410 | `BuilderToolSelectionToolAskForClipboard` | C→S | Request clipboard |
| 411 | `BuilderToolSelectionToolReplyWithClipboard` | C→S | Clipboard reply |
| 412 | `BuilderToolGeneralAction` | C→S | Generic action |
| 413 | `BuilderToolOnUseInteraction` | C→S | On-use trigger |
| 414 | `BuilderToolLineAction` | C→S | Line creation |
| 415 | `BuilderToolShowAnchor` | S→C | Show anchor |
| 416 | `BuilderToolHideAnchors` | S→C | Hide anchors |
| 417 | `PrefabUnselectPrefab` | C→S | Deselect prefab |
| 418 | `BuilderToolsSetSoundSet` | C→S | Set sound set |
| 419 | `BuilderToolLaserPointer` | S→C | Laser pointer |
| 420 | `BuilderToolSetEntityScale` | C→S | Entity scale |
| 421 | `BuilderToolSetEntityPickupEnabled` | C→S | Entity pickup |
| 422 | `BuilderToolSetEntityLight` | C→S | Entity light |
| 423 | `BuilderToolSetNPCDebug` | C→S | NPC debug |

## Summary

| Category | Count | Primary Direction |
|----------|-------|-------------------|
| Connection | 4 | Bidirectional |
| Authentication | 9 | S→C |
| Setup | 16 | S→C |
| Assets | 46 | S→C |
| Player | 20 | Mixed |
| World | 32 | S→C |
| Entities | 7 | S→C |
| Inventory | 10 | Mixed |
| Window | 5 | S→C |
| Interface | 23 | S→C |
| World Map | 6 | Mixed |
| Server Access | 4 | Mixed |
| Machinima | 3 | S→C |
| Camera | 4 | Mixed |
| Interaction | 5 | Mixed |
| Asset Editor | 56 | Mixed |
| Builder Tools | 23 | C→S |
| **Total** | **354** | |

## Related

- [Networking Overview](overview.md) - Packet system architecture
- [Event System](../../core-concepts/event-system.md) - Server events
