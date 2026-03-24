// automatic dependency injection (the controller/injectionLoader will
// provide these dependencies when instantiating the use case)

export default async function CreateListingUseCase(createListingDTO) {
  const { ListingsRepository, SyncListingService } = this.dependencies;
  // Logic to create a new listing in the database
  const newListing = await ListingsRepository.createListing(createListingDTO);
  await SyncListingService(newListing);
  return newListing;
}
