export function convertFormDataCategories(formData) {
  const listingTypes = [];
  for (let key in formData) {
    const value = formData[key];
    if (key.match(/Type-/) && value === "on") {
      listingTypes.push(key.slice(5).toLowerCase());
    }
  }

  return listingTypes;
}
