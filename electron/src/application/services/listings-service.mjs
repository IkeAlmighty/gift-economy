import { listingsRepository } from "../../infrastructure/listings-repository.mjs";
import { syncService } from "./sync-service.mjs";

class ListingService {
  async createListing(listingData) {
    // Logic to create a new listing in the database
    const newListing = await listingsRepository.createListing(listingData);
    await syncService.syncListing(newListing);
    return newListing;
  }
}

const listingsService = new ListingService();
export default listingsService;
