import { createContext, useContext, useState } from "react";
import { createListing } from "../endpoints/listings";
import { convertFormDataTags } from "../utils/forms";
import { useListingsData } from "./ListingsContext";

export const NewListingContext = createContext(null);

// this context stores form data for a listing as an object snapshot,
// and on submitNewListing recreates the image file stored
// in the snapshot and sends a formdata object to the controller
export function NewListingProvider({ children }) {
  const [newListingData, setNewListingData] = useState({});

  function snapshotFormData(fd) {
    const data = {};
    for (const [key, value] of fd.entries()) {
      if (!(value instanceof File)) {
        data[key] = value;
      } else if (value.size > 0) {
        // we can't store files in react state, so we just store
        // the imageUrl and recreate the file later.
        data.imageUrl = URL.createObjectURL(value);
        data.imageName = value.name;
        // delete the old imageUrl and imageName to make sure this one is not overwritten:
        fd.delete("imageUrl");
        fd.delete("imageName");
      }
    }

    return data;
  }

  async function recreateImageFromUrl(url, imageName) {
    const res = await fetch(url, { credentials: "omit" });
    if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);

    const blob = await res.blob();

    const name = imageName ?? new URL(res.url).pathname.split("/").pop() ?? "file";

    return new File([blob], name, { type: blob.type || "image/jpeg" });
  }

  function buildMultipart(formDataObj) {
    const fd = new FormData();

    // append the non null other values, ignoring tags:
    for (const [k, v] of Object.entries(formDataObj)) {
      if (!k.match(/Type-/) && v !== undefined && v !== null) fd.append(k, v);
    }

    // then, pull the tags and append to form as JSON string:
    const tags = convertFormDataTags(formDataObj);
    fd.append("tags", JSON.stringify(tags));

    return fd;
  }

  async function submitNewListing() {
    try {
      // first, recreate the image file from the url:
      let image = null;
      if (newListingData.imageUrl && newListingData.imageUrl.startsWith("blob:")) {
        image = await recreateImageFromUrl(newListingData.imageUrl, newListingData.imageName);
      }

      // prep payload by rewraping it in a FormData object:
      const payload = { ...newListingData };
      if (image) payload.image = image;
      const multipart = buildMultipart(payload);

      return await createListing(multipart);
    } catch (err) {
      console.error(err);
      return { ok: false };
    }
  }

  function updateNewListingData(newFormData) {
    const newSnapshot = snapshotFormData(newFormData);

    // for each key in the new snapshot, overwrite the corresponding key in the current
    // newListingData:
    const copyLD = { ...newListingData };
    Object.keys(newSnapshot).forEach((key) => {
      const value = newSnapshot[key];
      copyLD[key] = value;
    });

    setNewListingData(copyLD);
  }

  function clearNewListing() {
    setNewListingData({});
  }

  return (
    <NewListingContext.Provider
      value={{ newListingData, updateNewListingData, submitNewListing, clearNewListing }}
    >
      {children}
    </NewListingContext.Provider>
  );
}

export function useNewListingData() {
  return useContext(NewListingContext);
}
