import { useState, useEffect } from "react";
import LogoutButton from "../components/LogoutButton";
import PlusCloseButton from "../components/PlusCloseButton";
import ToolBar from "../components/ToolBar";
import CreateMenu from "../components/modalMenus/CreateMenu";
import CreateGiftMenu from "../components/modalMenus/CreateGiftMenu";
import CreateProjectMenu from "../components/modalMenus/CreateProjectMenu";
import CreateRequestMenu from "../components/modalMenus/CreateRequestMenu";
import PreviewListingMenu from "../components/modalMenus/PreviewListingMenu";
import Modal from "../components/Modal";
import { createContribution, getContributions } from "../controls/contributions";
import { createProject } from "../controls/projects";
import { convertFormDataCategories } from "../utils/forms";
import ListItem from "../components/ListItem";

function App() {
  const [showModalMenu, setShowModalMenu] = useState(false);
  const [formData, setMenuFormData] = useState({});
  const [menuStack, setMenuStack] = useState(["CreateMenu"]);

  const [submitting, setSubmitting] = useState(false);

  const [listingItems, setListingItems] = useState([]);

  useEffect(() => {
    async function fetchAndSetListingItems() {
      const contributionsRes = await getContributionsInNetwork();
      const projectsRes = await getProjectsInNetwork();

      const projects = await projectsRes.json();
      const contributions = await contributionsRes.json();

      // concat the listings and sort by update timestamps:
      const listings = [...projects, ...contributions].sort((a, b) => a.updatedAt - b.updatedAt);

      setListingItems(listings);
    }
  }, []);

  const menus = {
    CreateMenu: (props) => <CreateMenu {...props} />,
    CreateProjectMenu: (props) => <CreateProjectMenu {...props} />,
    CreateGiftMenu: (props) => <CreateGiftMenu {...props} />,
    CreateRequestMenu: (props) => <CreateRequestMenu {...props} />,
    PreviewListingMenu: (props) => <PreviewListingMenu {...props} />,
  };

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

  async function handleMenuSubmission(event) {
    setMenuStack([event.nextMenu, ...menuStack]);

    // take a snapshot of the formdata for passing between menus:
    if (event.formData) {
      let snapshot = formData;
      if (event.formData instanceof FormData) {
        snapshot = snapshotFormData(event.formData);
      }
      setMenuFormData(snapshot);
    }

    if (event.nextMenu !== "SUBMIT") return;

    if (submitting) return;
    setSubmitting(true);

    try {
      // first, recreate the image file from the url:
      const image = await recreateImageFromUrl(formData.imageUrl, formData.imageName);

      //prep payload:
      const payload = { ...formData, image };
      const multipart = buildMultipart(payload);

      const submitByIntent = {
        GIFT: async (m) => createContribution(m),
        REQUEST: async (m) => createContribution(m),
        PROJECT: async (m) => createProject(m),
      };

      const res = await submitByIntent[formData.intent](multipart);
      const newListingItem = await res.json();
      console.log("listing item: ", newListingItem);

      setListingItems([newListingItem, ...listingItems]);

      // reset the menu stack
      setMenuStack(["CreateMenu"]);
      setMenuFormData({});
      setShowModalMenu(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  function handleMenuBack() {
    if (menuStack.length >= 2) {
      setMenuStack(menuStack.slice(1));
    } else {
      setShowModalMenu(false);
      setMenuFormData(undefined);
    }
  }

  return (
    <>
      <Modal visible={showModalMenu}>
        <button className="float-right" onClick={handleMenuBack}>
          {menuStack.length < 2 ? "Cancel" : "Back"}
        </button>
        {menus[menuStack[0]]?.({ onAction: handleMenuSubmission, formData })}
      </Modal>

      <ToolBar>
        <PlusCloseButton value={showModalMenu} onClick={() => setShowModalMenu(!showModalMenu)} />
        <div className="text-lg underline">The Gift Economy</div>

        <LogoutButton />
      </ToolBar>

      <div>
        {listingItems.map((itemData) => (
          <ListItem data={itemData} />
        ))}
      </div>
    </>
  );
}

export default App;
