import { IMessage, useConversationStore } from "@/store/chatStore";
import { MessageSeenSvg } from "@/lib/svgs";
import OtherMessageIndicator from "../chat/OtherMessageIndicator";
import TextMessage from "../chat/TextMessage";
import MessageTime from "../chat/MessageTime";
import SelfMessageIndicator from "../chat/SelfMessageIndicator";

type user = {
  _id: string;
};
type ChatBubbleProps = {
  message: IMessage;
  me: user | null;
};
const ChatBubble = ({ me, message }: ChatBubbleProps) => {
  const date = new Date(message._creationTime);
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  const time = `${hour}:${minute}`;
  const { selectedConversation } = useConversationStore();
  const isMember =
    selectedConversation?.participants.includes(message.sender._id) || false;
  const isGroup = selectedConversation?.isGroup || false;
  const fromMe = message.sender._id === me?._id;
  const bgClass = fromMe ? "bg-green-chat" : "bg-white dark:bg-gray-primary";

  if (!fromMe) {
    return (
      <>
        <div className="flex gap-1 w-2/3">
          <div
            className={`flex flex-col z-20 max-w-fit px-2 pt-1 rounded-md shadow-md relative ${bgClass}`}
          >
            <OtherMessageIndicator />
            <TextMessage message={message} />
            <MessageTime time={time} fromMe={fromMe} />
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="flex gap-1 w-2/3 ml-auto">
        <div
          className={`flex z-20 max-w-fit px-2 pt-1 rounded-md shadow-md ml-auto relative ${bgClass}`}
        >
          <SelfMessageIndicator />
          <TextMessage message={message} />
          <MessageTime time={time} fromMe={fromMe} />
        </div>
      </div>
    </>
  );
};
export default ChatBubble;
