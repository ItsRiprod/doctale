<!-- [VERIFIED: 2026-01-19] -->

# Command System

Hytale provides a powerful command system for creating commands that players and console operators can execute. Commands support typed arguments, subcommands, permissions, and automatic tab completion.

## Package Location

- Base classes: `com.hypixel.hytale.server.core.command.system.basecommands`
- Abstract base: `com.hypixel.hytale.server.core.command.system.AbstractCommand`
- Argument types: `com.hypixel.hytale.server.core.command.system.arguments.types.ArgTypes`
- Argument system: `com.hypixel.hytale.server.core.command.system.arguments.system`

## Overview

The command system is built around several key classes:

| Class | Purpose |
|-------|---------|
| `AbstractCommand` | Base class for all commands |
| `CommandBase` | Synchronous command execution |
| `AbstractPlayerCommand` | Commands that require a player sender |
| `AbstractAsyncCommand` | Asynchronous command execution |
| `AbstractWorldCommand` | Commands with world context |
| `AbstractCommandCollection` | Group related subcommands |
| `CommandContext` | Provides argument values and sender info |

## Creating a Basic Command

### Synchronous Command

```java
import com.hypixel.hytale.server.core.command.system.CommandContext;
import com.hypixel.hytale.server.core.command.system.basecommands.CommandBase;

public class HelloCommand extends CommandBase {

    public HelloCommand() {
        super("hello", "Says hello to the world");
    }

    @Override
    protected void executeSync(CommandContext context) {
        context.sendMessage(Message.raw("Hello, world!"));
    }
}
```

### Player-Only Command

```java
import com.hypixel.hytale.server.core.command.system.CommandContext;
import com.hypixel.hytale.server.core.command.system.basecommands.AbstractPlayerCommand;
import com.hypixel.hytale.server.core.universe.PlayerRef;
import com.hypixel.hytale.server.core.universe.world.World;
import com.hypixel.hytale.component.Ref;
import com.hypixel.hytale.component.Store;
import com.hypixel.hytale.server.core.universe.world.storage.EntityStore;

public class WhoAmICommand extends AbstractPlayerCommand {

    public WhoAmICommand() {
        super("whoami", "Displays your player information");
    }

    @Override
    protected void execute(
        CommandContext context,
        Store<EntityStore> store,
        Ref<EntityStore> ref,
        PlayerRef playerRef,
        World world
    ) {
        context.sendMessage(Message.raw("You are: " + playerRef.getUsername()));
        context.sendMessage(Message.raw("World: " + world.getName()));
    }
}
```

## Registering Commands

Register commands during your plugin's `setup()` phase:

```java
@Override
protected void setup() {
    getCommandRegistry().registerCommand(new HelloCommand());
    getCommandRegistry().registerCommand(new WhoAmICommand());
}
```

## Command Arguments

### Argument Types

Arguments define what inputs your command accepts. Hytale provides many built-in argument types through `ArgTypes`:

| Type | Description | Example |
|------|-------------|---------|
| `BOOLEAN` | true/false | `true` |
| `INTEGER` | Whole numbers | `42`, `-5` |
| `FLOAT` | Decimal numbers | `3.14` |
| `DOUBLE` | Double-precision decimals | `3.14159` |
| `STRING` | Text values | `"Hello World"` |
| `UUID` | UUID values | `550e8400-e29b-41d4-a716-446655440000` |
| `PLAYER_REF` | Online player by name | `john_doe` |
| `PLAYER_UUID` | Player by UUID or name | `john_doe` |
| `WORLD` | World by name | `default` |
| `RELATIVE_POSITION` | 3D position (relative) | `~5 ~ ~-3` |
| `RELATIVE_BLOCK_POSITION` | Block position (relative) | `124 232 234` |
| `VECTOR3I` | Integer vector | `1 2 3` |
| `ROTATION` | Pitch/yaw/roll | `90.0 180.0 0.0` |
| `GAME_MODE` | Game mode | `creative` |
| `COLOR` | Color value | `#FF0000` |
| `BLOCK_TYPE_ASSET` | Block type | `Rock_Stone` |
| `ITEM_ASSET` | Item type | `Sword_Iron` |

### Required Arguments

Required arguments must be provided by the user:

```java
public class TeleportCommand extends AbstractPlayerCommand {
    private final RequiredArg<RelativeDoublePosition> positionArg;

    public TeleportCommand() {
        super("tp", "Teleport to a position");

        // Define required arguments in constructor
        this.positionArg = withRequiredArg(
            "position",                    // Argument name
            "The target position",         // Description
            ArgTypes.RELATIVE_POSITION     // Argument type
        );
    }

    @Override
    protected void execute(CommandContext context, Store<EntityStore> store,
                          Ref<EntityStore> ref, PlayerRef playerRef, World world) {
        RelativeDoublePosition pos = context.get(positionArg);
        // Use the position value...
    }
}
```

### Optional Arguments

Optional arguments have a default value when not provided:

```java
public class GiveCommand extends AbstractPlayerCommand {
    private final RequiredArg<Item> itemArg;
    private final DefaultArg<Integer> countArg;

    public GiveCommand() {
        super("give", "Give an item to yourself");

        this.itemArg = withRequiredArg("item", "Item to give", ArgTypes.ITEM_ASSET);
        this.countArg = withDefaultArg(
            "count",              // Name
            "Number of items",    // Description
            ArgTypes.INTEGER,     // Type
            1,                    // Default value
            "1"                   // Default value description
        );
    }

    @Override
    protected void execute(CommandContext context, Store<EntityStore> store,
                          Ref<EntityStore> ref, PlayerRef playerRef, World world) {
        Item item = context.get(itemArg);
        int count = context.get(countArg);  // Returns 1 if not provided
        // Give the item...
    }
}
```

### Flag Arguments

Flag arguments are boolean switches:

```java
public class ClearCommand extends CommandBase {
    private final FlagArg silentFlag;

    public ClearCommand() {
        super("clear", "Clear something");

        this.silentFlag = withFlagArg("silent", "Don't show confirmation message");
    }

    @Override
    protected void executeSync(CommandContext context) {
        boolean silent = context.provided(silentFlag);
        // Do work...
        if (!silent) {
            context.sendMessage(Message.raw("Cleared!"));
        }
    }
}
```

Usage: `/clear --silent`

### List Arguments

Accept multiple values of the same type:

```java
public class SummonCommand extends AbstractPlayerCommand {
    private final RequiredArg<List<PlayerRef>> playersArg;

    public SummonCommand() {
        super("summon", "Summon multiple players to you");

        this.playersArg = withListRequiredArg(
            "players",
            "Players to summon",
            ArgTypes.PLAYER_REF
        );
    }

    @Override
    protected void execute(CommandContext context, Store<EntityStore> store,
                          Ref<EntityStore> ref, PlayerRef playerRef, World world) {
        List<PlayerRef> players = context.get(playersArg);
        for (PlayerRef target : players) {
            // Teleport each player...
        }
    }
}
```

Usage: `/summon [player1, player2, player3]`

## Command Context

`CommandContext` provides access to parsed arguments and the command sender:

```java
@Override
protected void executeSync(CommandContext context) {
    // Get argument values
    String name = context.get(nameArg);
    int count = context.get(countArg);

    // Check if optional argument was provided
    if (context.provided(optionalArg)) {
        // Use the optional value
    }

    // Get raw input
    String input = context.getInputString();

    // Access sender
    CommandSender sender = context.sender();

    // Check if sender is a player
    if (context.isPlayer()) {
        Player player = context.senderAs(Player.class);
    }

    // Send messages
    context.sendMessage(Message.raw("Success!"));
}
```

## Subcommands

Create command hierarchies using subcommands:

```java
public class WarpCommand extends AbstractCommandCollection {

    public WarpCommand() {
        super("warp", "Warp management commands");

        // Add subcommands
        addSubCommand(new WarpSetCommand());
        addSubCommand(new WarpDeleteCommand());
        addSubCommand(new WarpListCommand());
        addSubCommand(new WarpTeleportCommand());
    }
}

// Subcommand example
public class WarpSetCommand extends AbstractPlayerCommand {

    private final RequiredArg<String> nameArg;

    public WarpSetCommand() {
        super("set", "Create a new warp at your location");
        this.nameArg = withRequiredArg("name", "Warp name", ArgTypes.STRING);
    }

    @Override
    protected void execute(CommandContext context, Store<EntityStore> store,
                          Ref<EntityStore> ref, PlayerRef playerRef, World world) {
        String warpName = context.get(nameArg);
        // Create warp...
        context.sendMessage(Message.raw("Warp '" + warpName + "' created!"));
    }
}
```

Usage:
- `/warp set home`
- `/warp delete home`
- `/warp list`

## Command Aliases

Add alternative names for commands:

```java
public class TeleportCommand extends AbstractPlayerCommand {

    public TeleportCommand() {
        super("teleport", "Teleport to a location");
        addAliases("tp", "goto");  // Can now use /tp or /goto
    }
}
```

## Permissions

### Automatic Permission Generation

Permissions are automatically generated based on plugin name and command structure:

```
<group>.<plugin>.command.<commandname>
```

For example, a command named "spawn" in plugin "MyPlugin" (group "com.example") gets permission: `com.example.myplugin.command.spawn`

### Custom Permissions

Override the automatic permission:

```java
public class AdminCommand extends CommandBase {

    public AdminCommand() {
        super("admin", "Administrative command");
        requirePermission("myplugin.admin");  // Custom permission
    }
}
```

### Permission Groups

Associate commands with game modes:

```java
public class CreativeCommand extends CommandBase {

    public CreativeCommand() {
        super("creative", "Creative-only command");
        setPermissionGroup(GameMode.CREATIVE);
    }
}
```

### Checking Permissions

```java
@Override
protected void executeSync(CommandContext context) {
    CommandSender sender = context.sender();

    if (!sender.hasPermission("myplugin.special")) {
        context.sendMessage(Message.raw("You don't have permission!"));
        return;
    }

    // Continue with command...
}
```

## Async Commands

For commands that perform I/O or other blocking operations:

```java
public class AsyncLookupCommand extends AbstractAsyncCommand {

    private final RequiredArg<String> usernameArg;

    public AsyncLookupCommand() {
        super("lookup", "Look up player information");
        this.usernameArg = withRequiredArg("username", "Player to look up", ArgTypes.STRING);
    }

    @Override
    protected CompletableFuture<Void> executeAsync(CommandContext context) {
        String username = context.get(usernameArg);

        return CompletableFuture.runAsync(() -> {
            // Perform async lookup...
            // This runs off the main thread
        }).thenRun(() -> {
            context.sendMessage(Message.raw("Lookup complete!"));
        });
    }
}
```

## Confirmation Requirement

For dangerous commands, require explicit confirmation:

```java
public class ResetWorldCommand extends AbstractAsyncCommand {

    public ResetWorldCommand() {
        super("resetworld", "Reset the entire world", true);  // requiresConfirmation = true
    }

    @Override
    protected CompletableFuture<Void> executeAsync(CommandContext context) {
        // Only executes if user includes --confirm flag
        // /resetworld --confirm
        return CompletableFuture.runAsync(() -> {
            // Reset world...
        });
    }
}
```

## Command Variants

Create multiple command signatures with different argument counts:

```java
public class TimeCommand extends CommandBase {

    private final RequiredArg<Integer> timeArg;

    public TimeCommand() {
        super("time", "Set the world time");
        this.timeArg = withRequiredArg("time", "Time value (0-24000)", ArgTypes.INTEGER);

        // Add a variant that takes no arguments (displays current time)
        addUsageVariant(new TimeDisplayVariant());
    }

    @Override
    protected void executeSync(CommandContext context) {
        int time = context.get(timeArg);
        // Set the time...
    }

    // Variant with no required arguments
    private class TimeDisplayVariant extends CommandBase {
        public TimeDisplayVariant() {
            super("Display current time");  // No name for variants
        }

        @Override
        protected void executeSync(CommandContext context) {
            // Display current time
            context.sendMessage(Message.raw("Current time: ..."));
        }
    }
}
```

Usage:
- `/time` - displays current time
- `/time 6000` - sets time to noon

## Specialized Base Commands

| Class | Use Case |
|-------|----------|
| `CommandBase` | Simple synchronous commands |
| `AbstractAsyncCommand` | Async execution with CompletableFuture |
| `AbstractPlayerCommand` | Requires player sender, provides player context |
| `AbstractAsyncPlayerCommand` | Async player command |
| `AbstractWorldCommand` | Provides world context |
| `AbstractAsyncWorldCommand` | Async world command |
| `AbstractTargetPlayerCommand` | Commands targeting other players |
| `AbstractTargetEntityCommand` | Commands targeting entities |
| `AbstractCommandCollection` | Container for subcommands |

## Tab Completion

Tab completion is automatically provided based on argument types. For custom suggestions, implement `SuggestionProvider`:

```java
public class CustomArgumentType extends SingleArgumentType<MyType> {

    public CustomArgumentType() {
        super("Custom Type", "Description", "example1", "example2");
    }

    @Override
    public MyType parse(String input, ParseResult parseResult) {
        // Parse the input...
    }

    @Override
    public void suggest(
        CommandSender sender,
        String textAlreadyEntered,
        int numParametersTyped,
        SuggestionResult result
    ) {
        // Add suggestions based on context
        result.suggest("option1");
        result.suggest("option2");

        // Filter by what user has typed
        if ("option1".startsWith(textAlreadyEntered.toLowerCase())) {
            result.suggest("option1");
        }
    }
}
```

## Error Handling

### Parse Errors

Argument parsing errors are handled automatically with helpful messages.

### Command Exceptions

Throw `CommandException` for user-facing errors:

```java
@Override
protected void executeSync(CommandContext context) {
    String name = context.get(nameArg);

    if (name.length() > 32) {
        throw new GeneralCommandException(
            Message.raw("Name must be 32 characters or less")
        );
    }

    // Continue...
}
```

## Best Practices

1. **Use appropriate base class**: Choose the right base class for your use case
2. **Validate early**: Check arguments before performing operations
3. **Provide feedback**: Always send a response message
4. **Use async for I/O**: Don't block the main thread
5. **Document arguments**: Provide clear descriptions
6. **Keep commands focused**: One command = one action
7. **Use subcommands**: Group related functionality

## Complete Example

```java
public class MyPlugin extends JavaPlugin {

    public MyPlugin(JavaPluginInit init) {
        super(init);
    }

    @Override
    protected void setup() {
        // Register commands
        getCommandRegistry().registerCommand(new SpawnCommand());
        getCommandRegistry().registerCommand(new WarpCommand());
    }
}

public class SpawnCommand extends AbstractPlayerCommand {

    private final DefaultArg<PlayerRef> targetArg;

    public SpawnCommand() {
        super("spawn", "Teleport to spawn point");

        this.targetArg = withDefaultArg(
            "player",
            "Player to teleport (defaults to self)",
            ArgTypes.PLAYER_REF,
            null,
            "self"
        );
    }

    @Override
    protected void execute(CommandContext context, Store<EntityStore> store,
                          Ref<EntityStore> ref, PlayerRef playerRef, World world) {
        PlayerRef target = context.get(targetArg);
        if (target == null) {
            target = playerRef;
        }

        // Get spawn point and teleport...
        context.sendMessage(Message.raw("Teleported to spawn!"));
    }
}
```

## Related

- [Plugin Registries](./registries.md) - Command registration
- [Plugin Lifecycle](../getting-started/plugin-lifecycle.md) - When to register commands
- [Permissions](./permissions.md) - Permission system
