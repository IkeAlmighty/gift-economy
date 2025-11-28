export default function ListItem({ data, disabled, onSave }) {
  const { title, description, imageUrl, tags, intent } = data;

  return (
    <div
      className={`flex-1 min-w-[320px] max-w-[400px] mt-5 mb-5 rounded pt-2 border-b-2 border-t-2 bg-secondary`}
    >
      {title && (
        <div className="w-full text-center">
          <span className="text-2xl">{title}</span> | <span className="text-sm">{intent}</span>
        </div>
      )}

      {imageUrl && (
        <div className="w-full h-[200px] pt-3 flex justify-evenly flex-shrink-0 px-2">
          <img
            src={imageUrl}
            className="w-full h-full rounded object-cover"
            alt="preview image for list item."
          />
        </div>
      )}

      <div className="text-sm text-center h-5">
        {tags.map((t) => (
          <span key={`tag-${data.id}-${t}`} className="ml-2">
            {t}
          </span>
        ))}
      </div>

      <div className="m-5 h-25 mb-10">{description}</div>

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
        <button disabled={disabled} onClick={() => onSave(data)}>
          Save
        </button>
        <span className="flex-1"></span>
        <button disabled={disabled}>Suggest to Project</button>
        <button disabled={disabled}>View Chat</button>
      </div>
    </div>
  );
}
