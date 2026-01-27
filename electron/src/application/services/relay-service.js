import { syncService } from "./sync-service.js";
import { fastSyncService } from "./fastsync-service.js";

class RelayService {
  connectToRelays({ slowSyncInterval: slowSyncInterval = 15 * 60 * 1000 /* 15 minutes */ }) {
    // Initialize sync interval
    // (sync service works together with blob-service, db-service,
    // and relay-service to keep time insensitive relay data in sync)
    setInterval(() => {
      syncService.syncAll();
    }, slowSyncInterval);

    // Initialize fast sync (fast sync only syncs time sensitive relay data)
    fastSyncService.connectToRelays();
  }
}

export const RelayService = new RelayService();
