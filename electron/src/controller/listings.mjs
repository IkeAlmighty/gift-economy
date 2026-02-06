import CreateListingDTO from "../application/dtos/CreateListingDTO.mjs";

export async function createListing(payload, usecases) {
  const { CreateListingUseCase } = usecases; // BaseController will instantiate this use case class when it is accessed.
  const listingData = new CreateListingDTO(payload);
  await CreateListingUseCase(listingData);
}

export async function getListings(payload, usecases) {
  const { GetListingsUseCase } = usecases;
  const listings = await GetListingsUseCase(payload.filter || {});
  return listings;
}

export async function deleteListing(payload, usecases) {
  const { DeleteListingUseCase } = usecases;
  const result = await DeleteListingUseCase(payload.listingId);
  return result;
}
