export function toTitleCase(str) {
  if (!str || str.length < 1) return "";
  const firstChar = str[0];
  return firstChar + str.substr(1, str.length).toLowerCase();
}
