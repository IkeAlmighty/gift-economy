# Client-Sovereign Federated Relay Network  
## Design & Implementation Reference

### 1. Purpose of This Document
This document serves as a practical, technical reference for building a client-sovereign, end-to-end encrypted, federated relay network sustained by a gift economy.

### 2. Core Architectural Principles
- Clients own identity, keys, and authority  
- All sensitive data is encrypted client-side  
- Relays are infrastructure, not authorities  
- Multiple relays per client are first-class  
- No profit motive, no data monetization  
- Exit is always easier than control  

### 3. Client Responsibilities
- Generate and manage cryptographic identity  
- Encrypt, decrypt, sign, and verify all data  
- Select, rotate, and verify relay server sets  
- Synchronize encrypted blobs across devices  
- Detect relay failure or misbehavior  

### 4. Relay Server Responsibilities
- Store encrypted blobs durably for offline clients  
- Serve encrypted blobs on request  
- Replicate encrypted blobs to peer relays  
- Advertise capacity and health metrics  
- Delete unaccessed data per network retention policy  

### 5. Data Model Overview
Relays store only opaque encrypted blobs and minimal metadata required for routing, replication, and garbage collection.

### 6. Data Retention & Garbage Collection Policy
- Retention is based on last-access time  
- Clients are responsible for maintaining redundancy  
- Relays MAY choose longer retention periods but MUST disclose them  
- Relays MUST NOT selectively retain data based on content  
- Clients SHOULD proactively re-upload critical blobs  

### 7. Multi-Device Identity Model
A user identity consists of a root key that authorizes multiple device keys. Device enrollment and revocation are handled entirely client-side.

### 8. Federation & Load Balancing
Relays cooperate to rebalance load by replicating encrypted blobs and transferring responsibility when capacity limits are reached.

### 9. Threat Model Summary
- Relay compromise does not expose plaintext data  
- Malicious relays are mitigated via redundancy and client verification  
- Metadata leakage is minimized but acknowledged  
- No single relay can censor or lock out a user  

### 10. Non-Goals
- No server-side user accounts  
- No content moderation at the relay layer  
- No advertising, analytics, or monetization  
- No canonical server registry  

### 11. Closing Notes
This architecture prioritizes autonomy, resilience, and long-term sustainability over convenience or centralized control.
