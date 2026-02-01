class CreateListingDTO {
  constructor({
    title,
    description,
    tags = [],
    intent,
    allowedSuggestionTypes = ["PROJECT", "GIFT", "REQUEST"],
  }) {
    this.title = title;
    this.description = description;
    this.tags = tags;
    this.intent = intent;
    this.allowedSuggestionTypes = allowedSuggestionTypes;
  }
}

export default CreateListingDTO;
