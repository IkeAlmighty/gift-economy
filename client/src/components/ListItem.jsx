export default function ListItem({ data, disabled }) {
  const { title, description, imageUrl, listingTypes, superType } = data;

  const typeBorder = { Gift: "border-blue-300", Project: "border-brown-300" };

  return (
    <div
      className={`mt-10 bg-black rounded text-blue-100 pt-2 border-6 border- ${typeBorder[superType]}`}
    >
      {title && (
        <div className="w-full pb-3 text-center">
          <span className="text-2xl">{title}</span> | <span className="text-sm">{superType}</span>
        </div>
      )}

      <div className="w-full h-[300px] flex justify-evenly flex-shrink-0">
        <img
          src={imageUrl}
          className="w-full h-full object-contain"
          alt="preview image for list item."
        />
      </div>
      <div className="text-sm my-1 text-center">
        {listingTypes.map((t) => (
          <span className="ml-2">{t}</span>
        ))}
      </div>
      <div>
        <div className="m-5">{description}</div>
        <div className="flex flex-row space-x-5 p-1 justify-between items-center [&>button]:border-2 [&>button]:px-3 [&>button]:py-2 [&>button]:rounded [&>button]:text-sm">
          <button>Suggest to Project</button>
          <button>Start Chat</button>
        </div>
      </div>
    </div>
  );
}
