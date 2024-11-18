import { IMessage, useConversationStore } from "@/store/chatStore";
import OtherMessageIndicator from "../chat/OtherMessageIndicator";
import TextMessage from "../chat/TextMessage";
import MessageTime from "../chat/MessageTime";
import SelfMessageIndicator from "../chat/SelfMessageIndicator";
import ChatBubleAvatar from "../chat/ChatBubleAvatar";
import Dateindicator from "../chat/Dateindicator";
import { useState } from "react";

import VideoMessage from "../chat/media/VideoMessage";
import ImageMessage from "../chat/media/ImageMessage";
import ViewImgInChat from "../chat/media/ViewImgInChat";
import ChatAvatarActions from "../chat/ChatAvatarActions";

type user = {
  _id: string;
};
type ChatBubbleProps = {
  message: IMessage;
  me: user | null;
  previousMessage?: IMessage;
};
const ChatBubble = ({ me, message, previousMessage }: ChatBubbleProps) => {
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
  const [isImageOpen, setIsImageOpen] = useState(false);

  const renderMesaageContent = () => {
    switch (message.messageType) {
      case "text":
        return <TextMessage message={message} />;
      case "image":
        return (
          <ImageMessage
            message={message}
            handleClick={() => setIsImageOpen(true)}
          />
        );
      case "video":
        return <VideoMessage message={message} />;
      default:
        return null;
    }
  };

  if (!fromMe) {
    return (
      <>
        <Dateindicator message={message} previousMessage={previousMessage} />
        <div className="flex gap-1 w-2/3 mb-2 ">
          <ChatBubleAvatar
            message={message}
            isMember={isMember}
            isGroup={isGroup}
          />
          <div
            className={`flex flex-col z-20 max-w-fit px-2 pt-1 rounded-md shadow-md relative ${bgClass}`}
          >
            <OtherMessageIndicator />
            {isGroup && <ChatAvatarActions message={message} me={me} />}
            {renderMesaageContent()}
            {isImageOpen && (
              <ViewImgInChat
                open={isImageOpen}
                onClose={() => setIsImageOpen(false)}
                src={message.content}
              />
            )}
            <MessageTime time={time} fromMe={fromMe} />
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <Dateindicator message={message} previousMessage={previousMessage} />
      <div className="flex gap-1 w-2/3 ml-auto">
        <div
          className={`flex z-20 max-w-fit px-2 pt-1 rounded-md shadow-md ml-auto relative ${bgClass}`}
        >
          <SelfMessageIndicator />
          {renderMesaageContent()}
          {isImageOpen && (
            <ViewImgInChat
              open={isImageOpen}
              onClose={() => setIsImageOpen(false)}
              src={message.content}
            />
          )}
          <MessageTime time={time} fromMe={fromMe} />
        </div>
      </div>
    </>
  );
};
export default ChatBubble;
