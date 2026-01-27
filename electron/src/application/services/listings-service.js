import { listingsRepository } from "../../infrastructure/listings-repository.js";
import { syncService } from "./sync-service.js";

class ListingService {
  async createListing(listingData) {
    // Logic to create a new listing in the database
    const newListing = await listingsRepository.createListing(listingData);
    await syncService.syncListing(newListing);
    return newListing;
  }
}

export const listingsService = new ListingService();
