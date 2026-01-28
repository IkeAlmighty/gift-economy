import { listingsRepository } from "../../infrastructure/listings-repository.js";

class SyncService {
  async syncListing(listing) {
    // TODO: Logic to sync the listing with an external service or database
  }

  async syncTag(tag) {}
  async syncUser(user) {}
  async syncMessage(message) {}
  async syncNotification(notification) {}

  async syncAll() {}
}

export const syncService = new SyncService();
