import { useNavigate } from "react-router";
import { tagIcons } from "../utils/emojis";
import { useLocation } from "react-router";

export default function ListItem({ data, disabled, onSave }) {
  if (!data) return <div>...Loading</div>;

  const { title, description, tags, intent } = data;
  const navigate = useNavigate();

  let location = useLocation();

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

  function handleOnSave(e) {
    e.stopPropagation();
    onSave(data);
  }

  return (
    <div
      className={`flex-1 min-w-[320px] max-w-[346px] rounded pt-2 border-b-2 border-t-2 bg-secondary hover:bg-secondary/85 cursor-pointer`}
      onClick={handleNavigate}
    >
      {title && (
        <div className="w-full text-center">
          <span className="text-2xl">{title}</span> | <span className="text-sm">{intent}</span>
        </div>
      )}

      <div className="text-xl text-center h-5 mt-2">
        {tags.map((t) => (
          <span key={`tag-${data.id}-${t}`} className="ml-2 inline-block">
            <div>{tagIcons[t]}</div>
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
          <div>Posted by {data.creator?.username}</div>
          {data.intent === "PROJECT" && (
            <div className="[&>*]:inline-block [&>*]:mr-2">
              <div>{data?.listingsSuggestions?.length} suggestions</div>
              <div>{data?.listings?.length} contributions</div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between my-2 [&>button]:mx-2 [&>button]:border-b-2 [&>button]:border-l-2 [&>button]:px-2 [&>button]:rounded [&>button]:bg-teal-100">
        {onSave && (
          <button disabled={disabled} onClick={handleOnSave}>
            💾
          </button>
        )}
        <span className="flex-1"></span>
        <button disabled={disabled} onClick={handleSuggestListing}>
          Suggest to... ↗
        </button>
        <button disabled={disabled} onClick={handleOpenChat}>
          💬
        </button>
      </div>

      {/* <div className="relative right-0 -bottom-1">
        <div className="absolute right-0 text-xs underline">
          <Link to={`/listing/${data._id}`}>View Full Listing</Link>
        </div>
      </div> */}
    </div>
  );
}
