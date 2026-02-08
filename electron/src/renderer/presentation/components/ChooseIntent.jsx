export default function ChooseListingAction() {
  return (
    <div className="mt-5">
      {["Create Gift", "Create Request", "Create Project"].map((choice) => (
        <div className="text-2xl my-5">{choice}</div>
      ))}
    </div>
  );
}
