import { IMessage } from "@/store/chatStore";
import ReactPlayer from "react-player";

const VideoMessage = ({ message }: { message: IMessage }) => {
  return (
    <div className="rounded-lg overflow-hidden">
      <ReactPlayer
        url={message.content}
        width="250px"
        height="250px"
        controls={true}
        light={false}
        playing={false}
        preload="metadata"
      />
    </div>
  );
};

export default VideoMessage;
