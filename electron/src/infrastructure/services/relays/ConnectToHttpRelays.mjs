export const Dependencies = ["SyncAllService"];

export default function ConnectToHttpRelaysService(
  slowSyncInterval = 15 * 60 * 1000 /* 15 minutes */
) {
  // Initialize sync interval
  // (sync service works together with blob-service, db-service,
  // and relay-service to keep time insensitive relay data in sync)
  setInterval(() => {
    this.SyncAllService.syncAll();
  }, slowSyncInterval);

  // Initialize fast sync (fast sync only syncs time sensitive relay data)
  this.FastSyncService.execute();
}
