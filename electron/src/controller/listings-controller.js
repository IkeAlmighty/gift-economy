import { ListingDTO } from "../application/dtos/listing-dto.js";
import { listingsService } from "../application/services/listings-service.js";

export async function createListing(payload) {
  const listingData = ListingDTO.fromInput(payload); // validate/sanitize input
  const newListing = await listingsService.createListing(listingData);
  return ListingDTO.toOutput(newListing); // shape output for the UI
}
