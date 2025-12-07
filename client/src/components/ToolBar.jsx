export default function ToolBar({ children }) {
  return (
    <div className="flex items-center justify-between bg-secondary px-5 backdrop-opacity-100 h-[110px] top-0 left-0 w-full sticky border-b-2 border-t-2 z-10">
      <div>{children[0]}</div>
      <div className="flex items-center justify-end space-x-10">
        {children.map((child, index) => index > 0 && child)}
      </div>
    </div>
  );
}
