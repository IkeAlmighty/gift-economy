import { ListingsRepository } from "../infrastructure/listings-repository.js";

class SyncService {
  static async syncListing(listing) {
    // TODO: Logic to sync the listing with an external service or database
  }

  static async syncTag(tag) {}
  static async syncUser(user) {}
  static async syncMessage(message) {}
  static async syncNotification(notification) {}

  static async syncAll() {}
}

export { SyncService };
