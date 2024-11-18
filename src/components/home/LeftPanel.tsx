"use client";
import { ListFilter, Search } from "lucide-react";
import { Input } from "../ui/input";
import ThemeSwitch from "./ThemeSwitch";
import Conversation from "./Conversation";
import { UserButton } from "@clerk/nextjs";
import UserListDialog from "./UserListDialog";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useEffect } from "react";
import { useConversationStore } from "@/store/chatStore";

const LeftPanel = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const conversations = useQuery(api.conversations.getMyConversations);
  const { selectedConversation, setSelectedConversation } =
    useConversationStore();

  useEffect(() => {
    // Mendapatkan semua ID percakapan dari daftar percakapan
    const conversationId = conversations?.map(
      (conversation) => conversation._id
    );

    // Jika ada percakapan yang dipilih dan ID percakapan yang tersedia
    // tidak termasuk ID percakapan yang dipilih, maka setel percakapan terpilih ke null
    // Memeriksa apakah ada percakapan yang dipilih dan mendapatkan semua ID percakapan
    if (selectedConversation && conversationId) {
      // Memeriksa apakah ID percakapan yang dipilih tidak ada dalam daftar ID percakapan yang tersedia
      if (!conversationId.includes(selectedConversation._id)) {
        // Mengatur percakapan yang dipilih ke null jika tidak ada dalam daftar
        setSelectedConversation(null);
      }
    }
  }, [conversations, selectedConversation, setSelectedConversation]);

  if (isLoading) return null;

  return (
    <div className="w-1/4 border-gray-600 border-r">
      <div className="sticky top-0 bg-left-panel z-10">
        {/* Header */}
        <div className="flex justify-between bg-gray-primary p-3 items-center">
          <UserButton />
          <div className="flex items-center gap-3">
            {isAuthenticated && <UserListDialog />}
            <ThemeSwitch />
          </div>
        </div>
        <div className="p-3 flex items-center">
          {/* Search */}
          <div className="relative h-10 mx-3 flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10"
              size={18}
            />
            <Input
              type="text"
              placeholder="Search or start a new chat"
              className="pl-10 py-2 text-sm w-full rounded shadow-sm bg-gray-primary focus-visible:ring-transparent"
            />
          </div>
          <ListFilter className="cursor-pointer" />
        </div>
      </div>

      {/* Chat List */}
      <div className="my-3 flex flex-col gap-0 max-h-[80%] overflow-auto">
        {/* Conversations will go here*/}
        {conversations?.map((conversation) => (
          <Conversation key={conversation._id} conversation={conversation} />
        ))}

        {conversations?.length === 0 && (
          <>
            <p className="text-center text-gray-500 text-sm mt-3">
              No conversations yet
            </p>
            <p className="text-center text-gray-500 text-sm mt-3 ">
              We understand {"you're"} an introvert, but {"you've"} got to start
              somewhere 😊
            </p>
          </>
        )}
      </div>
    </div>
  );
};
export default LeftPanel;
