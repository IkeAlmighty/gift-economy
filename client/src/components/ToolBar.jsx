export default function ToolBar({ children }) {
  return (
    <div className="flex items-center justify-between bg-secondary px-5 backdrop-opacity-100 h-[110px]">
      <div>{children[0]}</div>
      <div className="flex items-center justify-end space-x-10">
        {children.map((child, index) => index > 0 && child)}
      </div>
    </div>
  );
}
