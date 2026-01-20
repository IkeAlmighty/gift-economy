import ChatClient from "../components/ChatClient.jsx";
import DrawerMenu from "../components/DrawerMenu.jsx";
import ToolBar from "../components/ToolBar.jsx";
import { useParams } from "react-router";
import { Link } from "react-router";

export default function ListingChatClientPage() {
  const { listingId } = useParams();

  return (
    <div>
      <ToolBar>
        <Link to={`/listing/${listingId}`} className="text-lg underline">
          ← Back to Listing
        </Link>

        <DrawerMenu />
      </ToolBar>

      <div className="max-w-xl mx-auto">
        <ChatClient listingId={listingId} className="h-[calc(100vh-200px)]" />
      </div>
    </div>
  );
}
