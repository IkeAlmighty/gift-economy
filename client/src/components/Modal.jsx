export default function Modal({ visible = false, children }) {
  if (visible)
    return (
      <div className="fixed w-screen h-screen left-0 top-0 pt-27 overflow-y-scroll pb-10 bg-white">
        <div className="max-w-[700px] mx-auto pt-5 px-2">{children}</div>
      </div>
    );
  else return <></>;
}
