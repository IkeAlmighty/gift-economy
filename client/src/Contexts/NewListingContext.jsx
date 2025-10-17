import { createContext, useContext, useEffect, useState } from "react";

export const NewListingContext = createContext(null);

// this context stores form data for a listing as an object snapshot,
// and on submitNewListing recreates the image file stored
// in the snapshot and sends a formdata object to the controller
export function NewListingProvider({ children }) {
  const [newListingData, setNewListingData] = useState({});

  useEffect(() => console.log("formdata:", newListingData, [newListingData]));

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

    // append the non null other values, ignoring categories:
    for (const [k, v] of Object.entries(formDataObj)) {
      if (!k.match(/Type-/) && v !== undefined && v !== null) fd.append(k, v);
    }

    // then, pull the categories and append to form as JSON string:
    const categories = convertFormDataCategories(formDataObj);
    fd.append("categories", JSON.stringify(categories));

    return fd;
  }

  async function submitNewListing(formData) {
    try {
      // first, recreate the image file from the url:
      const image = await recreateImageFromUrl(formData.imageUrl, formData.imageName);

      //prep payload:
      const payload = { ...formData, image };
      const multipart = buildMultipart(payload);

      // TODO: update once the model is refractored to just one
      // 'listing' model
      const submitByIntent = {
        GIFT: async (m) => createContribution(m),
        REQUEST: async (m) => createContribution(m),
        PROJECT: async (m) => createProject(m),
      };

      const res = await submitByIntent[formData.intent](multipart);
      const newListingItem = await res.json();

      // reset the menu stack
      setNewListingData({});
      return newListingItem;
    } catch (err) {
      console.error(err);
    }
  }

  function updateNewListingData(newFormData) {
    const newSnapshot = snapshotFormData(newFormData);
    console.log("snapshot: ", newSnapshot);
    setNewListingData(newSnapshot);
  }

  return (
    <NewListingContext.Provider value={{ newListingData, updateNewListingData, submitNewListing }}>
      {children}
    </NewListingContext.Provider>
  );
}

export function useNewListingData() {
  return useContext(NewListingContext);
}
