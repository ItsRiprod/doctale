<!-- [VERIFIED: 2026-01-19] -->

# Server Configuration

The server configuration system manages server settings, world configuration, and runtime options.

## Package Location

`com.hypixel.hytale.server.core`

## Configuration Files

| File | Location | Description |
|------|----------|-------------|
| `config.json` | Universe root | Main server config |
| `config.json` | `worlds/{name}/` | Per-world config |
| `{uuid}.json` | `players/` | Player data |

## HytaleServerConfig

Main server configuration (loaded from `config.json`):

```java
package com.hypixel.hytale.server.core;

public class HytaleServerConfig {
    // Basic settings
    String serverName = "Hytale Server";
    String motd = "";
    String password = "";
    int maxPlayers = 100;
    int maxViewRadius = 32;

    // Nested configs
    Defaults defaults;
    ConnectionTimeouts connectionTimeouts;
    RateLimitConfig rateLimit;

    // Plugin/module configuration
    Map<String, Module> modules;
    Map<PluginIdentifier, ModConfig> mods;
    Map<String, Level> logLevels;

    // Storage
    PlayerStorageProvider playerStorage;
    BsonDocument authCredentialStore;

    // Loading
    public static HytaleServerConfig load();
    public void save();
}
```

### Server Config Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `ServerName` | String | "Hytale Server" | Server display name |
| `MOTD` | String | "" | Message of the day |
| `Password` | String | "" | Server password |
| `MaxPlayers` | int | 100 | Maximum players |
| `MaxViewRadius` | int | 32 | Max chunk view radius |

### Defaults Config

```java
public static class Defaults {
    String world = "default";
    GameMode gameMode = GameMode.ADVENTURE;
}
```

### ConnectionTimeouts Config

```java
public static class ConnectionTimeouts {
    Duration initialTimeout = Duration.ofSeconds(10);
    Duration authTimeout = Duration.ofSeconds(30);
    Duration playTimeout = Duration.ofMinutes(1);
    Map<String, Duration> joinTimeouts = new HashMap<>();
}
```

### RateLimitConfig

```java
public static class RateLimitConfig {
    boolean enabled = true;
    int packetsPerSecond = 2000;
    int burstCapacity = 500;
}
```

### Example config.json

```json
{
  "ServerName": "My Hytale Server",
  "MOTD": "Welcome to Hytale!",
  "Password": "",
  "MaxPlayers": 100,
  "MaxViewRadius": 32,
  "Defaults": {
    "World": "default",
    "GameMode": "Adventure"
  },
  "ConnectionTimeouts": {
    "InitialTimeout": "PT10S",
    "AuthTimeout": "PT30S",
    "PlayTimeout": "PT1M"
  },
  "RateLimit": {
    "Enabled": true,
    "PacketsPerSecond": 2000,
    "BurstCapacity": 500
  },
  "LogLevels": {},
  "Modules": {},
  "Mods": {},
  "PlayerStorage": {
    "Type": "Hytale"
  }
}
```

## WorldConfig

Per-world configuration (in `worlds/{name}/config.json`):

```java
package com.hypixel.hytale.server.core.universe.world;

public class WorldConfig {
    // Identity
    UUID uuid = UUID.randomUUID();
    String displayName;
    long seed = System.currentTimeMillis();

    // Providers
    ISpawnProvider spawnProvider;
    IWorldGenProvider worldGen;
    IWorldMapProvider worldMap;
    IChunkStorageProvider chunkStorage;

    // World rules
    boolean isTicking = true;
    boolean isBlockTicking = true;
    boolean isPvpEnabled = false;
    boolean isFallDamageEnabled = true;
    GameMode gameMode;

    // Time and weather
    boolean isGameTimePaused = false;
    Instant gameTime;  // Default: 5:30 AM
    String forcedWeather;

    // Spawning
    boolean isSpawningNPC = true;
    boolean isSpawnMarkersEnabled = true;
    boolean isAllNPCFrozen = false;

    // Saving
    boolean isSavingPlayers = true;
    boolean isSavingChunks = true;
    boolean saveNewChunks = true;
    boolean isUnloadingChunks = true;

    // Cleanup
    boolean deleteOnUniverseStart = false;
    boolean deleteOnRemove = false;
}
```

### World Config Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `UUID` | UUID | Random | World identifier |
| `DisplayName` | String | null | Display name |
| `Seed` | long | currentTimeMillis | World seed |
| `IsTicking` | boolean | true | Enable world ticking |
| `IsBlockTicking` | boolean | true | Enable block updates |
| `IsPvpEnabled` | boolean | false | Enable PvP |
| `IsFallDamageEnabled` | boolean | true | Enable fall damage |
| `GameMode` | GameMode | Adventure | Default game mode |
| `IsSpawningNPC` | boolean | true | Enable NPC spawning |

### ChunkConfig

```java
public static class ChunkConfig {
    Box2D pregenerateRegion;  // Default: -512 to +512
    Box2D keepLoadedRegion;   // Chunks to keep loaded
}
```

### Example world config.json

```json
{
  "UUID": "550e8400-e29b-41d4-a716-446655440000",
  "DisplayName": "default",
  "Seed": 1234567890,
  "IsTicking": true,
  "IsBlockTicking": true,
  "IsPvpEnabled": false,
  "IsFallDamageEnabled": true,
  "GameMode": "Adventure",
  "GameplayConfig": "Default",
  "IsSpawningNPC": true,
  "IsGameTimePaused": false,
  "IsSavingPlayers": true,
  "IsSavingChunks": true,
  "ChunkConfig": {
    "PregenerateRegion": [[-512, -512], [512, 512]]
  },
  "WorldGen": {
    "Type": "Hytale",
    "Name": "Default"
  }
}
```

## Command-Line Options

| Option | Parameter | Default | Description |
|--------|-----------|---------|-------------|
| `--universe` | Path | "universe" | Universe directory |
| `--assets` | Path | "../HytaleAssets" | Asset directory |
| `--mods` | Paths | - | Additional mod dirs |
| `--bind` / `-b` | Address | 0.0.0.0:5520 | Bind address |
| `--transport` / `-t` | Type | QUIC | Transport type |
| `--singleplayer` | - | - | Singleplayer mode |
| `--bare` | - | - | Bare mode |
| `--auth-mode` | Mode | AUTHENTICATED | Auth mode |
| `--backup` | - | - | Enable backups |
| `--backup-frequency` | minutes | 30 | Backup interval |
| `--backup-dir` | Path | - | Backup directory |
| `--backup-max-count` | count | 5 | Max backups |

### Auth Modes

| Mode | Description |
|------|-------------|
| `AUTHENTICATED` | Full authentication required |
| `OFFLINE` | Offline mode |
| `INSECURE` | Insecure (dev) mode |

### Transport Types

| Type | Description |
|------|-------------|
| `TCP` | Standard TCP |
| `QUIC` | QUIC protocol |

## Constants

Static server constants:

```java
package com.hypixel.hytale.server.core;

public class Constants {
    public static final boolean DEBUG = true;
    public static final boolean SINGLEPLAYER;  // From --singleplayer
    public static final boolean ALLOWS_SELF_OP_COMMAND;  // From --allow-op
    public static final boolean FRESH_UNIVERSE;  // True if new universe
    public static final Path UNIVERSE_PATH;  // From --universe
    public static final PluginManifest[] CORE_PLUGINS;  // 32 built-in plugins
}
```

## PlayerStorage

Player data storage configuration:

```java
public interface PlayerStorageProvider {
    String getId();
}

// Default implementation
public class DiskPlayerStorageProvider implements PlayerStorageProvider {
    public static final String ID = "Disk";
    Path path;  // Default: {universe}/players/
}
```

### Player File Format

`{uuid}.json`:
```json
{
  "UUID": "...",
  "Username": "PlayerName",
  "LastWorld": "default",
  "Position": [0, 64, 0],
  "Rotation": [0, 0, 0],
  "Inventory": { ... },
  "Effects": [ ... ]
}
```

## Accessing Configuration

### Server Config

```java
import com.hypixel.hytale.server.HytaleServer;
import com.hypixel.hytale.server.core.HytaleServerConfig;

// Get server config
HytaleServerConfig config = HytaleServer.get().getConfig();

// Access fields
String serverName = config.getServerName();
int maxPlayers = config.getMaxPlayers();

// Modify and save
config.setMotd("New MOTD");
config.markChanged();
config.save();
```

### World Config

```java
import com.hypixel.hytale.server.core.universe.world.World;
import com.hypixel.hytale.server.core.universe.world.WorldConfig;

// Get world config
World world = Universe.get().getWorld("default");
WorldConfig worldConfig = world.getConfig();

// Access fields
boolean pvpEnabled = worldConfig.isPvpEnabled();
GameMode gameMode = worldConfig.getGameMode();
```

## Module Configuration

Extensible module configuration:

```java
public static class Module {
    Boolean enabled;
    Map<String, Module> modules;
    BsonDocument document;  // Raw BSON for custom config
}
```

### Example Module Config

```json
{
  "Modules": {
    "MyPlugin": {
      "Enabled": true,
      "CustomSetting": "value",
      "Modules": {
        "SubModule": {
          "Enabled": false
        }
      }
    }
  }
}
```

## Best Practices

1. **Use Duration strings**: Use ISO-8601 format for durations (e.g., "PT10S")
2. **Don't modify core constants**: Constants class values are read-only
3. **Mark changes**: Call `markChanged()` before save
4. **Use providers**: Use storage providers for custom backends
5. **Validate config**: Check values after loading

## Related

- [Plugin Manifest](../../getting-started/plugin-manifest.md) - Plugin config
- [World System](../world/overview.md) - World management
- [Permission System](../permissions/overview.md) - Permission config
