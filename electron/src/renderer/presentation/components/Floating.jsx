export default function Floating({ children, className }) {
  return <div className={`${className} fixed z-1000`}>{children}</div>;
}
