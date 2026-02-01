import CreateListingDTO from "../application/dtos/create-listing-dto.mjs";
import listingsService from "../application/services/listings-service.mjs";

export async function createListing(payload) {
  const listingData = new CreateListingDTO(payload);
  await listingsService.createListing(listingData);
}
