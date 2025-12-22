export function convertFormDataTags(formData) {
  const listingTypes = [];
  for (let key in formData) {
    const value = formData[key];
    if (key.match(/Type-/) && value === "on") {
      listingTypes.push(key.slice(5).toLowerCase());
    }
  }

  const customRaw = formData.customTags;
  if (customRaw) {
    const customList = customRaw
      .split(/[,\n]/)
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
    listingTypes.push(...customList);
  }

  return listingTypes;
}
