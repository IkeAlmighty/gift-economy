export async function createListing(listingDataForm) {
  const res = await fetch("/api/listings/my-listings", {
    method: "POST",
    body: listingDataForm,
  });

  return res;
}

export async function getListingsInNetwork() {
  try {
    const res = await fetch("/api/listings/listings-in-network");
    if (res.ok) return await res.json();
  } catch (err) {
    console.log(err);
  }
}

export async function getMyListings() {
  const res = await fetch("/api/listings/my-listings");
  if (res.ok) return await res.json();
}

export async function saveListing(listing) {
  const res = await fetch("/api/listings/saved-listings", {
    method: "POST",
    body: JSON.stringify(listing),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await res;
}

export async function getSavedListings() {
  return []; //TODO
}

export async function editListing({ _id }, newData) {}

export async function deleteListing({ _id }) {
  return await fetch(`/api/listings?_id=${_id}`, { method: "DELETE" });
}

export async function suggestToListing({ _id }, subListing) {
  return await fetch(`/api/listings/suggest?suggest=${subListing._id}&to=${_id}`, {
    method: "PATCH",
  });
}
