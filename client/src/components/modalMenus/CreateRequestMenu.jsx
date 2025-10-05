import CreateContributionMenu from "./CreateContributionMenu";
export default function CreateRequestMenu({ onAction, formData = {} }) {
  return <CreateContributionMenu intent="REQUEST" onAction={onAction} formData={formData} />;
}
