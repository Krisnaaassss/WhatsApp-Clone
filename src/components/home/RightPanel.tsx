"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Video, X } from "lucide-react";
import ChatPlaceHolder from "./ChatPlaceHolder";
import MessageContainer from "./MessageContainer";
import MessageInput from "./MessageInput";
import GroupMembersDialog from "./GrupMemberDialog";
import { useConversationStore } from "@/store/chatStore";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

const RightPanel = () => {
  const { selectedConversation, setSelectedConversation } =
    useConversationStore();

  // Get image URL if it's a group conversation
  const groupImageUrl = useQuery(
    api.conversations.getImageUrl,
    selectedConversation?.groupImage
      ? { storageId: selectedConversation.groupImage as Id<"_storage"> }
      : "skip"
  );

  if (!selectedConversation) return <ChatPlaceHolder />;

  const conversationName =
    selectedConversation.groupName || selectedConversation.name;

  // Use group image URL if it exists, otherwise fall back to regular image
  const conversationImage = selectedConversation.isGroup
    ? groupImageUrl || "/placeholder.png"
    : selectedConversation.image || "/placeholder.png";

  return (
    <div className="w-3/4 flex flex-col">
      <div className="w-full sticky top-0 z-50">
        {/* Header */}
        <div className="flex justify-between bg-gray-primary p-3">
          <div className="flex gap-3 items-center">
            <Avatar>
              <AvatarImage
                src={conversationImage}
                className="object-cover"
                alt={conversationName || "Conversation"}
              />
              <AvatarFallback>
                <div className="animate-pulse bg-gray-tertiary w-full h-full rounded-full" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p>{conversationName}</p>
              {selectedConversation.isGroup && <GroupMembersDialog />}
            </div>
          </div>

          <div className="flex items-center gap-7 mr-5">
            <a href="/video-call" target="_blank">
              <Video size={23} />
            </a>
            <X
              size={16}
              className="cursor-pointer"
              onClick={() => setSelectedConversation(null)}
            />
          </div>
        </div>
      </div>
      {/* CHAT MESSAGES */}
      <MessageContainer />

      {/* INPUT */}
      <MessageInput />
    </div>
  );
};

export default RightPanel;
