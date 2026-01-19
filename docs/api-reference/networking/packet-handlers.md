<!-- [VERIFIED: 2026-01-19] -->

# Packet Handlers

Packet handlers process incoming packets and manage the connection state machine. Plugins can extend the system through the SubPacketHandler interface.

## Package Location

- Handlers: `com.hypixel.hytale.server.core.io.handlers`
- Base: `com.hypixel.hytale.server.core.io`

## Handler Hierarchy

```
PacketHandler (abstract base)
├── GenericConnectionPacketHandler (abstract)
│   ├── HandshakeHandler (abstract)
│   │   └── AuthenticationPacketHandler
│   ├── PasswordPacketHandler
│   └── SetupPacketHandler
├── GenericPacketHandler (abstract)
│   └── GamePacketHandler
└── InitialPacketHandler
```

## Connection State Machine

Handlers transition through connection states:

```
                    ┌─────────────────────┐
                    │ InitialPacketHandler │
                    │   (awaits Connect)   │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                │                ▼
┌─────────────────────┐        │   ┌──────────────────────┐
│PasswordPacketHandler│        │   │AuthenticationHandler │
│   (dev clients)     │        │   │  (secure clients)    │
└──────────┬──────────┘        │   └──────────┬───────────┘
           └───────────────────┼──────────────┘
                               ▼
                    ┌─────────────────────┐
                    │  SetupPacketHandler │
                    │ (sends world data)  │
                    └──────────┬──────────┘
                               ▼
                    ┌─────────────────────┐
                    │  GamePacketHandler  │
                    │ (active gameplay)   │
                    └─────────────────────┘
```

## Handler Types

| Handler | Stage | Description |
|---------|-------|-------------|
| `InitialPacketHandler` | Connect | Validates Connect packet, routes to auth |
| `AuthenticationPacketHandler` | Auth | Handles JWT token validation |
| `PasswordPacketHandler` | Auth | Handles dev client password challenges |
| `SetupPacketHandler` | Setup | Sends world data, assets, handles join |
| `GamePacketHandler` | Game | Routes gameplay packets |

## PacketHandler Base Class

```java
package com.hypixel.hytale.server.core.io;

public abstract class PacketHandler implements IPacketReceiver {
    public static final int MAX_PACKET_ID = 512;

    // Send packets
    public void write(@Nonnull Packet packet);
    public void write(@Nonnull Packet... packets);
    public void writeNoCache(@Nonnull Packet packet);

    // Lifecycle (template methods)
    protected void registered0(@Nullable PacketHandler oldHandler);
    protected void unregistered0(@Nullable PacketHandler newHandler);

    // Ping management
    public void sendPing();
    public void handlePong(@Nonnull Pong packet);

    // Process incoming packet
    public abstract void accept(@Nonnull Packet packet);

    // Disconnect
    public void disconnect(Disconnect.Type type, @Nullable String reason);
}
```

## GenericPacketHandler

Routes packets to registered consumers using O(1) array lookup:

```java
package com.hypixel.hytale.server.core.io.handlers;

public abstract class GenericPacketHandler extends PacketHandler
        implements IPacketHandler {

    // Register handler for packet ID
    public void registerHandler(int packetId, @Nonnull Consumer<Packet> handler);

    // Register multiple no-op handlers
    public void registerNoOpHandlers(@Nonnull int... packetIds);

    // Register sub-handler for plugins
    public void registerSubPacketHandler(SubPacketHandler subPacketHandler);

    // Get connected player
    @Nonnull
    public PlayerRef getPlayerRef();
}
```

## SubPacketHandler Interface

Plugins implement this interface to handle packets:

```java
package com.hypixel.hytale.server.core.io.handlers;

public interface SubPacketHandler {
    void registerHandlers();
}
```

## IPacketHandler Interface

Provided to SubPacketHandlers for registration:

```java
package com.hypixel.hytale.server.core.io.handlers;

public interface IPacketHandler {
    void registerHandler(int packetId, @Nonnull Consumer<Packet> handler);
    void registerNoOpHandlers(int... packetIds);
    @Nonnull PlayerRef getPlayerRef();
    @Nonnull String getIdentifier();
}
```

## Creating a SubPacketHandler

### Step 1: Define the Handler

```java
import com.hypixel.hytale.protocol.Packet;
import com.hypixel.hytale.protocol.packets.interaction.DismountNPC;
import com.hypixel.hytale.server.core.io.handlers.IPacketHandler;
import com.hypixel.hytale.server.core.io.handlers.SubPacketHandler;
import com.hypixel.hytale.server.core.player.PlayerRef;

public class MyPacketHandler implements SubPacketHandler {
    private final IPacketHandler packetHandler;

    public MyPacketHandler(IPacketHandler packetHandler) {
        this.packetHandler = packetHandler;
    }

    @Override
    public void registerHandlers() {
        // Register for DismountNPC packet (ID 294)
        packetHandler.registerHandler(294, packet -> handleDismount((DismountNPC) packet));
    }

    private void handleDismount(DismountNPC packet) {
        PlayerRef player = packetHandler.getPlayerRef();
        // Handle dismount logic
    }
}
```

### Step 2: Register in Plugin Setup

```java
import com.hypixel.hytale.server.core.io.ServerManager;
import com.hypixel.hytale.server.core.plugin.JavaPlugin;
import com.hypixel.hytale.server.core.plugin.JavaPluginInit;

public class MyPlugin extends JavaPlugin {
    public MyPlugin(JavaPluginInit init) {
        super(init);
    }

    @Override
    protected void setup() {
        // Register SubPacketHandler supplier
        ServerManager.get().registerSubPacketHandlers(MyPacketHandler::new);
    }
}
```

### Registration Flow

1. Plugin calls `ServerManager.get().registerSubPacketHandlers(MyPacketHandler::new)`
2. When a player enters gameplay, a new `GamePacketHandler` is created
3. `ServerManager.populateSubPacketHandlers()` is invoked
4. Your supplier is called with the `IPacketHandler` instance
5. `registerHandlers()` is called, routing your packet IDs

## Built-in SubPacketHandlers

| Handler | Package | Packets Handled |
|---------|---------|-----------------|
| `InventoryPacketHandler` | `server.core.io.handlers` | 171-179 (inventory ops) |
| `MountGamePacketHandler` | `builtin.mounts` | 293-294 (mount/dismount) |

## Packet Dispatch Flow

```
Packet arrives on Channel
        ↓
PacketHandler.accept(Packet)
        ↓
GenericPacketHandler looks up handlers[packet.getId()]
        ↓
Consumer<Packet>.accept(packet)
        ↓
Your handler method executes
```

## Handler Lifecycle

### registered0() Callback

Called when handler becomes active:

```java
@Override
protected void registered0(@Nullable PacketHandler oldHandler) {
    // Initialize resources
    // Old handler may be null on first registration
}
```

### unregistered0() Callback

Called when handler is deactivated:

```java
@Override
protected void unregistered0(@Nullable PacketHandler newHandler) {
    // Clean up resources
    // New handler may be null on disconnect
}
```

## Packet Queuing

Batch packet sends for performance:

```java
// Enable queuing
packetHandler.setQueuePackets(true);

// Send multiple packets (queued)
packetHandler.write(packet1);
packetHandler.write(packet2);
packetHandler.write(packet3);

// Flush all at once
packetHandler.tryFlush();

// Disable queuing (immediate send)
packetHandler.setQueuePackets(false);
```

## Example: Chat Filter Handler

```java
import com.hypixel.hytale.protocol.packets.interface_.ChatMessage;
import com.hypixel.hytale.server.core.io.handlers.IPacketHandler;
import com.hypixel.hytale.server.core.io.handlers.SubPacketHandler;
import com.hypixel.hytale.server.core.player.PlayerRef;

public class ChatFilterHandler implements SubPacketHandler {
    private final IPacketHandler packetHandler;
    private static final int CHAT_MESSAGE_ID = 211;

    public ChatFilterHandler(IPacketHandler packetHandler) {
        this.packetHandler = packetHandler;
    }

    @Override
    public void registerHandlers() {
        packetHandler.registerHandler(CHAT_MESSAGE_ID, packet -> {
            handleChat((ChatMessage) packet);
        });
    }

    private void handleChat(ChatMessage packet) {
        PlayerRef player = packetHandler.getPlayerRef();
        String message = packet.message;

        // Filter logic
        if (containsBannedWord(message)) {
            // Log and ignore
            return;
        }

        // Process valid message
        broadcastChat(player, message);
    }

    private boolean containsBannedWord(String message) {
        // Filter implementation
        return false;
    }

    private void broadcastChat(PlayerRef sender, String message) {
        // Broadcast implementation
    }
}
```

## Important Notes

1. **One handler per packet ID**: Later registrations override earlier ones
2. **O(1) dispatch**: Packet routing uses array index lookup
3. **Thread safety**: Handlers run on Netty event loop threads
4. **Max packet ID**: 512 (PacketHandler.MAX_PACKET_ID)

## Best Practices

1. **Store IPacketHandler reference**: You'll need it for `getPlayerRef()`
2. **Type cast packets**: Use `(PacketType) packet` after registration
3. **Clean handler registration**: Only register IDs you need
4. **Handle exceptions**: Exceptions in handlers disconnect the player

## Related

- [Networking Overview](overview.md) - Packet system architecture
- [Packet Types](packet-types.md) - All packet type IDs
- [Event System](../../core-concepts/event-system.md) - Server events
