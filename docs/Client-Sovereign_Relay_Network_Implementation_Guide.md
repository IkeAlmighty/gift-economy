# Client-Sovereign Federated Relay Network  
## Implementation Guide & Protocol Notes

### 1. Scope & Audience
This document is a low-level implementation guide intended for engineers building clients and relay servers. It specifies concrete data flows, invariants, and interface expectations. It intentionally avoids governance and philosophy except where necessary to preserve architectural constraints.

### 2. Cryptographic Primitives
- **Asymmetric keys:** Ed25519 or equivalent (identity & device signing)  
- **Key exchange:** X25519 or equivalent  
- **Symmetric encryption:** AES-GCM or ChaCha20-Poly1305  
- **Hashing:** SHA-256 or BLAKE3  

### 3. Identity & Device Model
An identity consists of a root key that authorizes one or more device keys. Relays are never aware of identities or devices. All authorization data is stored and transmitted as encrypted blobs.

- Root key is offline and used only for authorization or recovery.  
- Each device has its own long-lived signing key.  
- Device enrollment is performed by signing the new device public key.  
- Revocation is performed by publishing a signed revocation statement.  

### 4. Encrypted Blob Format
All application data is stored and transmitted as encrypted blobs. Relays treat blobs as opaque byte arrays.

**Blob envelope (conceptual):**
- `blob_id = Hash(ciphertext)`
- `ciphertext = Encrypt(data_key, plaintext)`
- `signature = Sign(device_key, blob_id)`

### 5. Client Sync Loop
- Encrypt new data into blobs.  
- Upload blobs to all relays in the active relay set.  
- Fetch unknown blobs discovered via metadata exchange.  
- Verify signatures and integrity locally.  
- Resolve conflicts deterministically (e.g., CRDT or LWW).  

### 6. Relay API Surface (Minimal)
- `POST /blobs` – store encrypted blob  
- `GET /blobs/{id}` – retrieve encrypted blob  
- `GET /health` – relay capacity and status  
- `POST /replicate` – relay-to-relay blob transfer  

### 7. Relay Storage & Databases
Relays store encrypted blobs in a local database or object store. Metadata is intentionally minimal and content-agnostic.

- `blob_id`, size, created_at, last_accessed  
- No user identifiers or plaintext fields  
- No indexing by content or sender  

### 8. Retention & Garbage Collection
Relays periodically delete blobs that have not been accessed within the agreed retention window.

- Retention based on last-access time  
- Deletion is local and non-negotiable  
- Clients must maintain redundancy  
- Relays must not selectively retain blobs  

### 9. Federation & Load Shedding
Relays communicate with peer relays to replicate encrypted blobs when capacity thresholds are reached.

- Relays advertise coarse capacity metrics  
- Blob replication preserves opacity  
- Clients verify availability independently  

### 10. Security Invariants (Do Not Violate)
- Relays must never require user authentication  
- Relays must never decrypt or inspect payloads  
- Clients must never trust a single relay  
- No canonical registry or default relay set  

### 11. Implementation Checklist
- Client-side key management complete  
- Encrypted blob storage implemented  
- Relay GC tested under load  
- Multi-device enrollment verified  
- Relay replacement tested  

### 12. Final Notes
This system is designed to remain healthy through explicit limits, redundancy, and social enforcement rather than centralized authority.
