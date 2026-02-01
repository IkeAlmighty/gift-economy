class ListingsRepository {
  async createListing(listingData) {}
  async getListingById(listingId) {}
  async updateListing(listingId, updateData) {}
  async deleteListing(listingId) {}
}

export const listingsRepository = new ListingsRepository();
