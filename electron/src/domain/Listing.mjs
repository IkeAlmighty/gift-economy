class Listing {
  constructor({ id, title, description, tags, intent, allowedSuggestionTypes }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.tags = tags;
    this.intent = intent;
    this.allowedSuggestionTypes = allowedSuggestionTypes;
  }
}
