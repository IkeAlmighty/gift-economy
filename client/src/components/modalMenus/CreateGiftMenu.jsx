import CreateContributionMenu from "./CreateContributionMenu";
export default function CreateGiftMenu({ onAction, formData = {} }) {
  return <CreateContributionMenu intent={"GIFT"} onAction={onAction} formData={formData} />;
}
