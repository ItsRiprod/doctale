<!-- [VERIFIED: 2026-01-19] -->

# Your First Plugin

This tutorial walks you through creating a complete Hytale server plugin from scratch. By the end, you'll have a working plugin that responds to player connections and provides a custom command.

## What We'll Build

A "Greeter" plugin that:
1. Welcomes players when they connect
2. Provides a `/greet` command to greet other players
3. Uses configuration for customizable messages

## Prerequisites

- Development environment set up (see [Setup Guide](./setup.md))
- Basic Java knowledge
- Hytale server for testing

## Step 1: Project Setup

Create a new project with this structure:

```
greeter-plugin/
├── build.gradle
├── settings.gradle
├── libs/
│   └── HytaleServer.jar
└── src/
    └── main/
        ├── java/
        │   └── com/
        │       └── example/
        │           └── greeter/
        │               ├── GreeterPlugin.java
        │               ├── GreeterConfig.java
        │               └── commands/
        │                   └── GreetCommand.java
        └── resources/
            └── plugin.json
```

### build.gradle

```groovy
plugins {
    id 'java'
}

group = 'com.example'
version = '1.0.0'

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

repositories {
    mavenCentral()
}

dependencies {
    compileOnly files('libs/HytaleServer.jar')
}

jar {
    from('src/main/resources') {
        include 'plugin.json'
    }
}
```

### settings.gradle

```groovy
rootProject.name = 'greeter-plugin'
```

## Step 2: Plugin Manifest

Create `src/main/resources/plugin.json`:

```json
{
  "Group": "com.example",
  "Name": "Greeter",
  "Version": "1.0.0",
  "Description": "Welcomes players and provides greeting commands",
  "Main": "com.example.greeter.GreeterPlugin",
  "Authors": [
    {
      "Name": "Your Name"
    }
  ]
}
```

## Step 3: Configuration Class

Create `src/main/java/com/example/greeter/GreeterConfig.java`:

```java
package com.example.greeter;

import com.hypixel.hytale.codec.Codec;
import com.hypixel.hytale.codec.KeyedCodec;
import com.hypixel.hytale.codec.builder.BuilderCodec;
import javax.annotation.Nonnull;

public class GreeterConfig {

    // Define the codec for serialization/deserialization
    @Nonnull
    public static final BuilderCodec<GreeterConfig> CODEC = BuilderCodec
        .builder(GreeterConfig.class, GreeterConfig::new)
        .append(
            new KeyedCodec<>("WelcomeMessage", Codec.STRING),
            (config, value) -> config.welcomeMessage = value,
            config -> config.welcomeMessage
        )
        .add()
        .append(
            new KeyedCodec<>("GreetMessage", Codec.STRING),
            (config, value) -> config.greetMessage = value,
            config -> config.greetMessage
        )
        .add()
        .append(
            new KeyedCodec<>("EnableWelcome", Codec.BOOLEAN),
            (config, value) -> config.enableWelcome = value,
            config -> config.enableWelcome
        )
        .add()
        .build();

    // Configuration fields with defaults
    private String welcomeMessage = "Welcome to the server, %s!";
    private String greetMessage = "%s says hello to %s!";
    private boolean enableWelcome = true;

    public String getWelcomeMessage() {
        return welcomeMessage;
    }

    public String getGreetMessage() {
        return greetMessage;
    }

    public boolean isEnableWelcome() {
        return enableWelcome;
    }
}
```

## Step 4: Greet Command

Create `src/main/java/com/example/greeter/commands/GreetCommand.java`:

```java
package com.example.greeter.commands;

import com.example.greeter.GreeterPlugin;
import com.hypixel.hytale.component.Ref;
import com.hypixel.hytale.component.Store;
import com.hypixel.hytale.server.core.command.system.CommandContext;
import com.hypixel.hytale.server.core.command.system.arguments.system.Argument;
import com.hypixel.hytale.server.core.command.system.arguments.types.ArgTypes;
import com.hypixel.hytale.server.core.command.system.basecommands.AbstractPlayerCommand;
import com.hypixel.hytale.server.core.universe.PlayerRef;
import com.hypixel.hytale.server.core.universe.world.World;
import com.hypixel.hytale.server.core.universe.world.storage.EntityStore;
import javax.annotation.Nonnull;

public class GreetCommand extends AbstractPlayerCommand {

    private final GreeterPlugin plugin;
    private final Argument<?, PlayerRef> targetArg;

    public GreetCommand(@Nonnull GreeterPlugin plugin) {
        super("greet", "Greet another player");
        this.plugin = plugin;

        // Add a required player argument using ArgTypes.PLAYER_REF
        this.targetArg = addArgument("target", ArgTypes.PLAYER_REF);
    }

    @Override
    protected void execute(
            @Nonnull CommandContext context,
            @Nonnull Store<EntityStore> store,
            @Nonnull Ref<EntityStore> ref,
            @Nonnull PlayerRef playerRef,
            @Nonnull World world) {

        // Get the target player from the argument
        PlayerRef target = context.get(targetArg);

        if (target == null) {
            context.sendError("Player not found!");
            return;
        }

        if (target.getUuid().equals(playerRef.getUuid())) {
            context.sendError("You can't greet yourself!");
            return;
        }

        // Format and broadcast the greeting
        String message = String.format(
            plugin.getConfig().getGreetMessage(),
            playerRef.getUsername(),
            target.getUsername()
        );

        // Send success message
        context.sendSuccess(message);
    }
}
```

## Step 5: Main Plugin Class

Create `src/main/java/com/example/greeter/GreeterPlugin.java`:

```java
package com.example.greeter;

import com.example.greeter.commands.GreetCommand;
import com.hypixel.hytale.event.EventPriority;
import com.hypixel.hytale.server.core.event.events.player.PlayerConnectEvent;
import com.hypixel.hytale.server.core.plugin.JavaPlugin;
import com.hypixel.hytale.server.core.plugin.JavaPluginInit;
import com.hypixel.hytale.server.core.util.Config;
import java.util.logging.Level;
import javax.annotation.Nonnull;

public class GreeterPlugin extends JavaPlugin {

    private static GreeterPlugin instance;

    // Configuration holder
    private final Config<GreeterConfig> config;

    public static GreeterPlugin getInstance() {
        return instance;
    }

    public GreeterPlugin(@Nonnull JavaPluginInit init) {
        super(init);
        // Register config in constructor (before setup)
        this.config = withConfig(GreeterConfig.CODEC);
    }

    @Override
    protected void setup() {
        instance = this;

        // Register the greet command
        getCommandRegistry().register(new GreetCommand(this));

        // Register player connect event listener
        getEventRegistry().register(
            EventPriority.NORMAL,
            PlayerConnectEvent.class,
            this::onPlayerConnect
        );

        getLogger().at(Level.INFO).log("Greeter plugin setup complete!");
    }

    @Override
    protected void start() {
        getLogger().at(Level.INFO).log(
            "Greeter v%s started! Welcome messages: %s",
            getManifest().getVersion(),
            getConfig().isEnableWelcome() ? "enabled" : "disabled"
        );
    }

    @Override
    protected void shutdown() {
        getLogger().at(Level.INFO).log("Greeter shutting down...");
        instance = null;
    }

    /**
     * Get the plugin configuration.
     */
    @Nonnull
    public GreeterConfig getConfig() {
        return config.get();
    }

    /**
     * Handle player connection events.
     */
    private void onPlayerConnect(PlayerConnectEvent event) {
        if (!getConfig().isEnableWelcome()) {
            return;
        }

        // Use getPlayerRef() instead of deprecated getPlayer()
        String welcomeMessage = String.format(
            getConfig().getWelcomeMessage(),
            event.getPlayerRef().getUsername()
        );

        getLogger().at(Level.INFO).log(welcomeMessage);
    }
}
```

## Step 6: Build and Test

### Build the Plugin

```bash
./gradlew build
```

The compiled plugin JAR will be in `build/libs/greeter-plugin-1.0.0.jar`.

### Install

1. Copy `greeter-plugin-1.0.0.jar` to your server's `plugins/` directory
2. Start or restart the server

### Configuration File

On first run, the plugin creates `plugins/Greeter/config.json`:

```json
{
  "WelcomeMessage": "Welcome to the server, %s!",
  "GreetMessage": "%s says hello to %s!",
  "EnableWelcome": true
}
```

Edit this file to customize messages, then restart the server.

### Test the Plugin

1. Connect to the server - you should see a welcome log message
2. Use `/greet <playername>` to greet another player

## Understanding the Code

### Plugin Lifecycle

1. **Constructor**: Called when plugin is loaded. We register our config here.
2. **preLoad()**: (inherited) Loads the config file asynchronously
3. **setup()**: Register commands, events, and other handlers
4. **start()**: Plugin is fully active, log startup message
5. **shutdown()**: Clean up when plugin is disabled

### Event Handling

```java
getEventRegistry().register(
    EventPriority.NORMAL,           // When to handle (relative to other handlers)
    PlayerConnectEvent.class,       // Event type to listen for
    this::onPlayerConnect           // Method to call
);
```

Events are automatically unregistered when the plugin shuts down.

### Command Registration

```java
getCommandRegistry().register(new GreetCommand(this));
```

Commands extend base classes like `AbstractPlayerCommand` (in `basecommands` package) which handle:
- Permission checking
- Player-only restriction (ensures sender is a player in a world)
- Argument parsing via `ArgTypes`
- Tab completion

### Configuration

```java
this.config = withConfig(GreeterConfig.CODEC);
```

The `withConfig()` method:
1. Creates a config file if it doesn't exist
2. Loads existing config data
3. Provides type-safe access via `config.get()`

## Extending the Plugin

### Add More Commands

Create additional command classes and register them in `setup()`:

```java
getCommandRegistry().register(new AnotherCommand());
```

### Listen to More Events

```java
getEventRegistry().register(PlayerDisconnectEvent.class, this::onPlayerDisconnect);
getEventRegistry().register(PlayerChatEvent.class, this::onPlayerChat);
```

### Add Permissions

Commands automatically use permission nodes based on the plugin's base permission:

```java
// Permission: com.example.greeter.greet
// (derived from group.name.commandname)
```

## Common Patterns

### Singleton Access

```java
private static GreeterPlugin instance;

public static GreeterPlugin getInstance() {
    return instance;
}
```

This allows other classes to access the plugin instance.

### Null Safety

Always use `@Nonnull` and `@Nullable` annotations:

```java
import javax.annotation.Nonnull;
import javax.annotation.Nullable;

@Nonnull
public GreeterConfig getConfig() {
    return config.get();
}
```

### Logging

Use the plugin's logger for consistent output:

```java
getLogger().at(Level.INFO).log("Message: %s", value);
getLogger().at(Level.WARNING).log("Warning!");
getLogger().at(Level.SEVERE).withCause(exception).log("Error occurred");
```

## Next Steps

- [Event System](../core-concepts/event-system.md) - Deep dive into events
- [Command System](../core-concepts/commands.md) - Advanced command features
- [ECS Overview](../core-concepts/ecs-overview.md) - Entity Component System
- [Built-in Events](../appendix/builtin-events.md) - All available events
