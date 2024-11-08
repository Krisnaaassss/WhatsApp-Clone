import { IMessage } from "@/store/chatStore";
import ReactPlayer from "react-player";

const VideoMessage = ({ message }: { message: IMessage }) => {
  return (
    <div className="rounded-lg overflow-hidden width-[250px] h-[250px]">
      <ReactPlayer
        url={message.content}
        controls={true}
        light={false}
        width="100%"
        height="100%"
      />
    </div>
  );
};

export default VideoMessage;
