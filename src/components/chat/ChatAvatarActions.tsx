import { IMessage, useConversationStore } from "@/store/chatStore";
import { useMutation } from "convex/react";
import { BanIcon, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

type ChatAvatarActions = {
  message: IMessage;
  me: { _id: string };
};
const ChatAvatarActions = ({
  message,
  me,
}: {
  message: IMessage;
  me: { _id: string };
}) => {
  const { selectedConversation, setSelectedConversation } =
    useConversationStore();
  const isMember =
    selectedConversation?.participants.includes(message.sender._id) || false;

  const kickUser = useMutation(api.conversations.kickUser);
  const goToChat = useMutation(api.conversations.createConversation);

  // Fungsi untuk mengeluarkan user dari group chat
  // Menerima event mouse click sebagai parameter
  const handleKickUser = async (e: React.MouseEvent) => {
    // Mencegah event click agar tidak bubble up
    e.stopPropagation();
    // Jika tidak ada conversation yang aktif maka tidak ada yang dilakukan
    if (!selectedConversation) return;
    // Jika tidak ada user yang dikirim maka tidak ada yang dilakukan
    if (!message.sender._id) return;
    try {
      // Mencoba mengeluarkan user dari group chat
      await kickUser({
        // ID conversation yang aktif
        conversationId: selectedConversation?._id,
        // ID user yang ingin dikeluarkan
        userId: message.sender._id,
      });
      // Mengupdate store dengan conversation yang aktif
      setSelectedConversation({
        // Membuat copy dari conversation yang aktif
        ...selectedConversation,
        // Menghapus user yang dikeluarkan dari list participants
        participants: selectedConversation.participants.filter(
          (id) => id !== message.sender._id
        ),
      });
    } catch (error) {
      toast.error("Failed to kick user");
      console.error(error);
    }
  };

  const handleToChat = async () => {
    try {
      const conversationId = await goToChat({
        isGroup: false,
        participants: [
          me._id as Id<"users">,
          message.sender._id as Id<"users">,
        ],
      });
      setSelectedConversation({
        _id: conversationId,
        participants: [
          me._id as Id<"users">,
          message.sender._id as Id<"users">,
        ],
        isGroup: false,
        name: message.sender.name,
        image: message.sender.image,
        isOnline: message.sender.isOnline,
      });
    } catch (error) {
      toast.error("Failed to create conversation");
      console.error(error);
    }
  };

  return (
    <div
      className="text-[11px] flex gap-4 justify-between font-bold cursor-pointer group"
      onClick={handleToChat}
    >
      {message.sender.name}
      {!isMember && <BanIcon size={16} className="text-red-500" />}
      {isMember && selectedConversation?.admin === me._id && (
        <div>
          <LogOut
            size={16}
            className="text-red-500 opacity-0 group-hover:opacity-100"
            onClick={handleKickUser}
          />
        </div>
      )}
    </div>
  );
};

export default ChatAvatarActions;
