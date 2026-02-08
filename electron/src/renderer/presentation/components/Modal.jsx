export default function Modal({ children, z, className }) {
  return <div className={`fixed inset-0 ${className} ${z}`}>{children}</div>;
}
