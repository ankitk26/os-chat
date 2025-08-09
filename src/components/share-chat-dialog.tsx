import { useChatActionStore } from "~/stores/chat-actions-store";
import ShareChatAccessHandler from "./share-chat-access-handler";
import ShareChatDialogFooter from "./share-chat-dialog-footer";
import ShareChatDialogHeader from "./share-chat-dialog-header";
import ShareChatSyncSection from "./share-chat-sync-section";
import { Dialog, DialogContent } from "./ui/dialog";
import { Separator } from "./ui/separator";

export default function ShareChatDialog() {
  const selectedChat = useChatActionStore((store) => store.selectedChat);
  const isShareDialogOpen = useChatActionStore(
    (store) => store.isShareDialogOpen
  );
  const setIsShareDialogOpen = useChatActionStore(
    (store) => store.setIsShareDialogOpen
  );

  function handleDialogOpenChange(open: boolean) {
    setIsShareDialogOpen(open);
  }

  return (
    <Dialog onOpenChange={handleDialogOpenChange} open={isShareDialogOpen}>
      <DialogContent className="sm:max-w-md" key={selectedChat?._id}>
        <ShareChatDialogHeader />

        <div className="space-y-6">
          {/* Public/Private Toggle */}
          <ShareChatAccessHandler />

          <Separator />

          {/* Sync Section */}
          <ShareChatSyncSection />
        </div>

        <ShareChatDialogFooter />
      </DialogContent>
    </Dialog>
  );
}
