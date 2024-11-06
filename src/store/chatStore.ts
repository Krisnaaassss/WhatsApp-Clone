import { Id } from "../../convex/_generated/dataModel";
import { create } from "zustand";

export type Conversation = {
	_id: Id<"conversations">;
	image?: string;
	participants: Id<"users">[];
	isGroup: boolean;
	name?: string;
	groupImage?: string;
	groupName?: string;
	admin?: Id<"users">;
	isOnline?: boolean;
	lastMessage?: {
		_id: Id<"message">;
		conversation: Id<"conversations">;
		content: string;
		sender: Id<"users">;
	};
};

type ConversationStore = {
	selectedConversation: Conversation | null;
	setSelectedConversation: (conversation: Conversation | null) => void;
};

export const useConversationStore = create<ConversationStore>((set)=>({
    selectedConversation: null,
    setSelectedConversation: (conversation) => set({selectedConversation: conversation})
}))