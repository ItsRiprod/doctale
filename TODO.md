# Hytale Server Modding Documentation - Refinement Phase

> **Project Goal:** Create accurate, comprehensive, and digestible modding documentation
> **Current Phase:** Refinement & Gap-Filling
> **Source:** `HytaleServer-sources.jar` (extracted to `extracted/`)
> **Last Updated:** 2026-01-19

---

## Completion Criteria

Every documentation item must meet ALL of these criteria to be marked complete:

### Content Accuracy (Required)
- [ ] All class/method names verified against source code
- [ ] All code examples compile (imports included, correct syntax)
- [ ] Parameter types and return types are accurate
- [ ] No placeholder or guessed information remains

### Content Completeness (Required)
- [ ] All public API methods documented
- [ ] All constructor variants documented
- [ ] All relevant interfaces/parent classes noted
- [ ] Package location specified

### Digestibility (Required)
- [ ] Clear, concise descriptions (not verbose)
- [ ] Practical code examples for common use cases
- [ ] Logical organization and flow
- [ ] Cross-references to related documentation

### Verification Tags
Use these tags to mark documentation status:
- `[VERIFIED]` - Confirmed accurate against source
- `[NEEDS-REVIEW]` - Content exists but needs accuracy check
- `[INCOMPLETE]` - Missing significant content
- `[EXAMPLE-NEEDED]` - Working code example required

---

## Phase 1: Audit Existing Documentation

### 1.1 Getting Started Audit
| File | Status | Issues to Address |
|------|--------|-------------------|
| `getting-started/setup.md` | `[x]` Review | Verified; fixed Maven scope (system, not provided) |
| `getting-started/first-plugin.md` | `[x]` Review | Fixed: AbstractPlayerCommand path/signature, ArgTypes.PLAYER_REF, getPlayerRef() |
| `getting-started/plugin-lifecycle.md` | `[x]` Review | Verified; fixed deprecated getPlayer() to getPlayerRef() |
| `getting-started/plugin-manifest.md` | `[x]` Review | Verified all 14 fields match PluginManifest.java and AuthorInfo.java |

**Completion Criteria for Getting Started:**
- [ ] All example code tested in a real plugin project
- [ ] No missing steps in setup instructions
- [ ] All manifest fields documented with correct types

### 1.2 Core Concepts Audit
| File | Status | Issues to Address |
|------|--------|-------------------|
| `core-concepts/event-system.md` | `[x]` Review | Verified priority values, all registration methods, player events exist |
| `core-concepts/ecs-overview.md` | `[x]` Review | Fixed EntityTickingSystem.tick() signature; verified system/query types |
| `core-concepts/commands.md` | `[x]` Review | Verified all base classes, argument types, methods |
| `core-concepts/registries.md` | `[x]` Review | Verified all 10 registries and ComponentRegistryProxy methods |

**Completion Criteria for Core Concepts:**
- [ ] All interface/class names verified in source
- [ ] All code examples use correct method signatures
- [ ] Diagrams accurately reflect architecture

### 1.3 API Reference Audit
| File | Status | Issues to Address |
|------|--------|-------------------|
| `api-reference/world/overview.md` | `[x]` Review | Verified; fixed getPlayers(), added getWorld(uuid), getPlayer(uuid) |
| `api-reference/entities/overview.md` | `[x]` Review | Verified; fixed getPlayers(), getPlayerByUsername(), tick() signature |
| `api-reference/blocks/overview.md` | `[x]` Review | Verified; added deprecation notice for BlockState class |
| `api-reference/assets/overview.md` | `[x]` Review | Verified; expanded to all 35 asset types with classes |
| `api-reference/npc/overview.md` | `[x]` Review | Verified Flock/FlockMembership; added Type enum and methods |
| `api-reference/worldgen/overview.md` | `[x]` Review | Verified all 5 providers; IWorldGen interface correct |
| `api-reference/inventory/overview.md` | `[x]` Review | Verified all 5 container types, ItemStack, and transaction classes |

**Completion Criteria for API Reference:**
- [ ] Every public method documented with accurate signature
- [ ] Return types and exceptions noted
- [ ] At least one usage example per major class

### 1.4 Tutorials & Appendix Audit
| File | Status | Issues to Address |
|------|--------|-------------------|
| `tutorials/builtin-plugins.md` | `[x]` Review | Expanded from 18 to all 31 builtin plugins with directories |
| `appendix/glossary.md` | `[x]` Review | Fixed chunk height (320 not 256); added BlockState deprecation note |

---

## Phase 2: Fill Documentation Gaps

### 2.1 Missing Core Documentation

#### Networking & Protocol
| Topic | Source Location | Status |
|-------|-----------------|--------|
| Packet system overview | `protocol/` | `[x]` Complete |
| Packet types catalog | `protocol/packets/` | `[x]` Complete |
| Packet handlers | `protocol/handlers/` | `[x]` Complete |
| Client synchronization | `protocol/sync/` | `[x]` Complete |

**Completion Criteria:**
- [x] Document how to send custom packets
- [x] Document how to handle incoming packets
- [x] List all packet types with purpose
- [x] Example of custom packet implementation

#### Physics System
| Topic | Source Location | Status |
|-------|-----------------|--------|
| Physics module overview | `server/core/modules/physics/` | `[x]` Complete |
| Collision system | `server/core/modules/collision/` | `[x]` Complete |
| Hitbox management | `server/core/modules/hitbox/` | `[x]` Complete |
| Entity movement | `server/core/modules/velocity/` | `[x]` Complete |

**Completion Criteria:**
- [x] Document collision detection APIs
- [x] Document how to modify entity physics
- [x] Document custom hitbox creation
- [x] Working example of physics manipulation

#### Permission System
| Topic | Source Location | Status |
|-------|-----------------|--------|
| Permission nodes | `server/core/permissions/` | `[x]` Complete |
| Permission providers | `server/core/permissions/providers/` | `[x]` Complete |
| Permission groups | `server/core/permissions/groups/` | `[x]` Complete |
| Permission commands | (various) | `[x]` Complete |

**Completion Criteria:**
- [x] Document permission node syntax
- [x] Document how to check permissions in code
- [x] Document how to register custom permissions
- [x] Example permission-gated command

#### Serialization (Codecs)
| Topic | Source Location | Status |
|-------|-----------------|--------|
| Codec pattern overview | `codec/` | `[x]` Complete |
| Built-in codecs catalog | `codec/` | `[x]` Complete |
| BuilderCodec usage | `codec/BuilderCodec.java` | `[x]` Complete |
| Custom codec creation | `codec/` | `[x]` Complete |

**Completion Criteria:**
- [x] Document `Codec<T>` pattern with examples
- [x] List all built-in codec types
- [x] Example of custom codec for a data class
- [x] Document codec validation

### 2.2 Missing Reference Materials

#### Complete Component Catalog
| Task | Status |
|------|--------|
| Extract all component types from source | `[x]` Complete |
| Document each component's fields | `[x]` Complete |
| Document component relationships | `[x]` Complete |
| Create component quick-reference table | `[x]` Complete |

**Completion Criteria:**
- [x] Every `ComponentType` in codebase documented
- [x] Fields and their types listed
- [x] Usage context explained (EntityStore vs ChunkStore)

#### Complete Event Catalog
| Task | Status |
|------|--------|
| Verify all events in `server/core/event/events/` documented | `[x]` Complete |
| Document event fields and inheritance | `[x]` Complete |
| Create event hierarchy diagram | `[x]` Complete |
| Add cancel behavior for each event | `[x]` Complete |

**Completion Criteria:**
- [x] Every `*Event.java` file has corresponding documentation
- [x] All event fields documented
- [x] Cancellation behavior noted where applicable

#### Math & Utility Classes
| Topic | Source Location | Status |
|-------|-----------------|--------|
| Vector classes | `math/vector/` | `[x]` Complete |
| Matrix classes | `math/matrix/` | `[x]` Complete |
| Shape classes | `math/shape/` | `[x]` Complete |
| Raycast utilities | `math/raycast/` | `[x]` Complete |
| Random utilities | `math/random/` | `[x]` Complete |

**Completion Criteria:**
- [x] Common operations documented with examples
- [x] Conversion methods between types noted
- [x] Performance considerations where relevant

#### Server Configuration
| Topic | Source Location | Status |
|-------|-----------------|--------|
| HytaleServerConfig fields | `server/HytaleServerConfig.java` | `[x]` Complete |
| Runtime constants | `server/RuntimeConstants.java` | `[x]` Complete |
| Configuration loading | (various) | `[x]` Complete |

**Completion Criteria:**
- [x] All config options documented
- [x] Default values noted
- [x] Example configuration file

### 2.3 Missing Detailed Documentation

#### World System Gaps
| Topic | Current Status | Required Work |
|-------|----------------|---------------|
| Connected blocks | `[x]` Complete | Document block connection system |
| Light propagation | `[x]` Complete | Document how light spreads |
| Dynamic lighting | `[x]` Complete | Document dynamic light sources |

#### Entity System Gaps
| Topic | Current Status | Required Work |
|-------|----------------|---------------|
| Entity effects | `[x]` Complete | Document status effects system |
| Knockback system | `[x]` Complete | Document knockback mechanics |
| Player inventory details | `[x]` Complete | Document inventory slots, equipment |
| Player permissions integration | `[x]` Complete | Document permission checking |
| Entity grouping | `[x]` Complete | Document group operations |

#### Interaction System
| Topic | Current Status | Required Work |
|-------|----------------|---------------|
| Interaction system | `[x]` Complete | Document player-block/entity interactions |
| Block tracking | `[x]` Complete | Document block update tracking |
| Interaction suppliers | `[x]` Complete | Document custom interactions |

---

## Phase 3: Quality Improvements

### 3.1 Code Example Verification
| Task | Status |
|------|--------|
| Create test plugin project for example verification | `[ ]` Not started |
| Verify all Getting Started examples compile | `[ ]` Not started |
| Verify all Core Concepts examples compile | `[ ]` Not started |
| Verify all API Reference examples compile | `[ ]` Not started |
| Add missing imports to all examples | `[ ]` Not started |

### 3.2 Cross-Reference Improvements
| Task | Status |
|------|--------|
| Add "See Also" sections to all API docs | `[ ]` Not started |
| Link related concepts between docs | `[ ]` Not started |
| Create index/search-friendly headings | `[ ]` Not started |

### 3.3 Consistency Pass
| Task | Status |
|------|--------|
| Standardize code example formatting | `[ ]` Not started |
| Standardize method documentation format | `[ ]` Not started |
| Ensure consistent terminology throughout | `[ ]` Not started |
| Verify all package paths use consistent format | `[ ]` Not started |

---

## Phase 4: Final Review

### 4.1 Technical Review
| Task | Status |
|------|--------|
| Review all `[NEEDS-REVIEW]` tags | `[ ]` Not started |
| Resolve all `[INCOMPLETE]` tags | `[ ]` Not started |
| Add all `[EXAMPLE-NEEDED]` examples | `[ ]` Not started |
| Final accuracy pass against source | `[ ]` Not started |

### 4.2 Documentation Review
| Task | Status |
|------|--------|
| Proofread all documentation | `[ ]` Not started |
| Check all links work | `[ ]` Not started |
| Verify table of contents accuracy | `[ ]` Not started |
| Test documentation navigation flow | `[ ]` Not started |

---

## Progress Summary

### Existing Documentation (17 files, ~6800 lines)
| Category | Files | Status |
|----------|-------|--------|
| Getting Started | 4 | Needs audit |
| Core Concepts | 4 | Needs audit |
| API Reference | 7 | Needs audit |
| Tutorials | 1 | Needs audit |
| Appendix | 1 | Needs audit |

### Gap Analysis
| Category | Missing Items | Priority |
|----------|---------------|----------|
| Networking/Protocol | Full section | High |
| Permissions | Full section | High |
| Serialization/Codecs | Full section | Medium |
| Physics | Full section | Medium |
| Component Catalog | Reference material | Medium |
| Event Catalog | Verification needed | Medium |
| Math Utilities | Reference material | Low |
| Server Config | Reference material | Low |

### Completion Tracking

**Phase 1 (Audit):** 0/17 files reviewed
**Phase 2 (Gaps):** 0/~25 topics documented
**Phase 3 (Quality):** 0/~10 tasks complete
**Phase 4 (Review):** 0/8 tasks complete

---

## Working Notes

### Verification Workflow
1. Open source file in `extracted/`
2. Compare documented API against actual code
3. Test code examples in scratch project
4. Update documentation with corrections
5. Mark with `[VERIFIED]` tag and date

### Gap-Filling Workflow
1. Identify source files for topic
2. Read and understand the implementation
3. Check builtin plugins for usage examples
4. Write documentation with working examples
5. Cross-reference related documentation

### Quality Checklist (Per Document)
- [ ] Title and description are clear
- [ ] Package location is specified
- [ ] All public methods are documented
- [ ] Code examples are complete (with imports)
- [ ] Cross-references are accurate
- [ ] No TODO/placeholder text remains
