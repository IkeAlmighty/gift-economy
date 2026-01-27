import { ListingsRepository } from "../../infrastructure/listings-repository.js";

class ListingService {
  async createListing(listingData) {
    // Logic to create a new listing in the database
    const newListing = await ListingsRepository.createListing(listingData);
    await SyncService.syncListing(newListing);
    return newListing;
  }
}

export { ListingService };
