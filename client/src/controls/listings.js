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

    if (!res.ok) console.log(res);
    else return await res.json();
  } catch (err) {
    console.log(err);
  }
}

export async function getMyListings() {
  const res = await fetch("/api/listings/my-listings");

  if (!res.ok) {
    console.log(res);
  }

  return await res.json();
}

export async function editListing({ listingId, newData }) {}

export async function deleteListing({ listingId }) {}
