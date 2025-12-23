import { useNavigate } from "react-router";
import { useTags } from "../Contexts/TagsContext.jsx";
import { useLocation } from "react-router";
import { useListingsData } from "../Contexts/ListingsContext.jsx";
import { toast } from "react-toastify";

export default function ListItem({ data, disabled, isCentered = true }) {
  if (!data) return <div>...Loading</div>;

  const { title, description, tags, intent } = data;
  const navigate = useNavigate();
  const { saveListing } = useListingsData();

  let location = useLocation();
  const { tagMap } = useTags();

  // GIFT: Warm green/teal (generosity, abundance, giving, growth)
  // REQUEST: Soft blue (trust, support, calm, reliability)
  // PROJECT: Purple (creativity, collaboration, imagination, community)
  const bgColorMap = {
    GIFT: "bg-emerald-100",
    REQUEST: "bg-sky-100",
    PROJECT: "bg-purple-100",
  };
  const bgColor = bgColorMap[intent] || "bg-secondary";

  // Border styles to match the emotional tone of each intent
  const borderStyle =
    intent === "PROJECT"
      ? "border-4 border-double border-purple-400 shadow-lg"
      : intent === "REQUEST"
        ? "border-2 border-dashed border-sky-400"
        : "border-2 border-solid border-emerald-400 shadow-md";

  // Centered item gets full opacity, others get reduced opacity
  const opacityClass = isCentered ? "opacity-100" : "opacity-40";

  function handleSuggestListing(e) {
    e.stopPropagation();
    navigate(`/saved-listings?action=Suggest&target=${data._id}&callback=${location.pathname}`);
  }

  function handleNavigate() {
    navigate(`/listing/${data._id}`);
  }

  function handleOpenChat(e) {
    e.stopPropagation();
    navigate(`/chat?listing=${data._id}`);
  }

  async function handleOnSave(e) {
    e.stopPropagation();
    const json = await saveListing(data);

    if (json.error) {
      toast.error(json.error || "Failed to save listing");
    } else {
      toast.success(json.message);
    }
  }

  return (
    <div
      className={`flex-1 min-w-[320px] max-w-[346px] rounded pt-2 ${borderStyle} ${bgColor} ${opacityClass} hover:opacity-100 cursor-pointer transition-opacity duration-150`}
      onClick={handleNavigate}
    >
      {title && (
        <div className="w-full text-center flex items-center justify-center gap-2">
          <span className="text-xl inline-block max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
            {title}
          </span>
          <span className="text-sm">| {intent}</span>
        </div>
      )}

      <div className="text-xl flex justify-center items-center gap-2 h-5 mt-2">
        {tags.map((t) => (
          <span key={`tag-${data.id}-${t}`} className="inline-block text-center">
            <div className="h-[25px]">{tagMap[t?.toLowerCase?.()] || "❓"}</div>
            <div className="text-xs">{t}</div>
          </span>
        ))}
      </div>

      <div className="mx-5 h-[3rem] mb-5 mt-9 overflow-clip">
        {description?.substring(0, 85) || ""}
        {description && description.length >= 85 && "..."}
      </div>

      <div className="h-[27px] text-xs mx-5">
        <div className="flex justify-between flex-row-reverse align-middle gap-2">
          <div>Posted by {data.creator?.screenName}</div>
          {data.intent === "PROJECT" && (
            <div className="[&>*]:inline-block [&>*]:mr-2">
              <div>{data?.listingsSuggestions?.length} suggestions</div>
              <div>{data?.listings?.length} contributions</div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between my-2 [&>button]:mx-2 [&>button]:border-b-2 [&>button]:border-l-2 [&>button]:px-2 [&>button]:rounded [&>button]:bg-teal-100">
        <button disabled={disabled} onClick={handleOnSave}>
          💾
        </button>
        <span className="flex-1"></span>
        <button disabled={disabled} onClick={handleSuggestListing}>
          Suggest to... ↗
        </button>
        <button disabled={disabled} onClick={handleOpenChat}>
          💬
        </button>
      </div>
    </div>
  );
}
