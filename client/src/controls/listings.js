export async function createListing(listingData) {
  const res = await fetch("/api/listings/my-listings", {
    method: "POST",
    body: listingData,
  });

  return res;
}

export async function getListingsInNetwork() {
  const res = await fetch("/api/listings/listings-in-network");

  if (!res.ok) {
    return await res.json()?.error;
  } else return await res.json();
}

export async function editListing({ listingId, newData }) {}

export async function deleteListing({ listingId }) {}
