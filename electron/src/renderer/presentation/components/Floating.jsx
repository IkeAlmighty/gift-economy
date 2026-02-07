export default function Floating({ children, className }) {
  return <div className={`${className} fixed z-50`}>{children}</div>;
}
