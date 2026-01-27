class ListingDTO {
  static fromInput(input) {
    // Validate and sanitize input data
    return {
      title: String(input.title).trim(),
      description: String(input.description).trim(),
      price: parseFloat(input.price),
    };
  }

  static toOutput(listing) {
    // Shape output data for the UI
    return {
      id: listing.id,
      title: listing.title,
      description: listing.description,
      price: listing.price.toFixed(2),
      createdAt: listing.createdAt.toISOString(),
    };
  }
}

export { ListingDTO };
