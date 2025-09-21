export default function CreateMenu({ onAction }) {
  return (
    <>
      <div className="flex flex-col space-y-10 my-20 bg-white text-2xl">
        <div className="text-center underline">Choose One:</div>
        <button onClick={(e) => onAction({ nextMenu: "CreateGiftMenu" })}>
          Post Gift 🎁
        </button>
        <button onClick={(e) => onAction({ nextMenu: "CreateRequestMenu" })}>
          Post Request 🪫
        </button>
        <button onClick={(e) => onAction({ nextMenu: "CreateProjectMenu" })}>
          Create Project 🏗️
        </button>
      </div>
    </>
  );
}
