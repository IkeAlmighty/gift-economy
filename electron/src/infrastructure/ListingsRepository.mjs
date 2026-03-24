class ListingsRepository {
  constructor() {
    this.name = ListingsRepository.name;
  }
  async createListing(listingData) {}
  async getListingById(listingId) {}
  async updateListing(listingId, updateData) {}
  async deleteListing(listingId) {}
}

export default new ListingsRepository();
