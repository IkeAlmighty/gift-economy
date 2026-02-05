import CreateListingDTO from "../use-cases/dtos/CreateListingDTO.mjs";

export async function createListing(usecases, payload) {
  const { CreateListingService } = usecases; // BaseController will instantiate this use case class when it is accessed.
  const listingData = new CreateListingDTO(payload);
  await CreateListingService.execute(listingData);
}
