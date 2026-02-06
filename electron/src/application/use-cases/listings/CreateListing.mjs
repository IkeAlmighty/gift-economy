// automatic dependency injection (the controller/injectionLoader will
// provide these dependencies when instantiating the use case)
export const Dependencies = ["ListingsRepository", "SyncListingService"];

export default async function CreateListingUseCase(createListingDTO) {
  // Logic to create a new listing in the database
  const newListing = await this.ListingsRepository.createListing(createListingDTO);
  await this.SyncListingService(newListing);
  return newListing;
}
