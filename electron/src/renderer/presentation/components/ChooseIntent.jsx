export default function ChooseListingAction() {
  return (
    <div>
      {["Create Gift", "Create Request", "Create Project"].map((choice) => (
        <div>
          <h2>{choice}</h2>
        </div>
      ))}
    </div>
  );
}
