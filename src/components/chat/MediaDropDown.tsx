import { useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ImageIcon, Plus, Video } from "lucide-react";
import MediaVideoDialog from "./media/SendVideoInChat";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useConversationStore } from "@/store/chatStore";
import MediaImageDialog from "./media/SendImageInChat";

const MediaDropDown = () => {
  const imageInput = useRef<HTMLInputElement>(null);
  const videoInput = useRef<HTMLInputElement>(null);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const me = useQuery(api.users.getMe);

  const generateUploadUrl = useMutation(api.conversations.generateUploadUrl);
  const sendImage = useMutation(api.message.sendImage);
  const sendVideo = useMutation(api.message.sendVideo);
  const { selectedConversation } = useConversationStore();

  const handleSendImage = async () => {
    try {
      setIsLoading(true);
      // 1. Buat link upload ke server Convex
      const postUrl = await generateUploadUrl();
      // 2. Kirim request ke link upload dengan file yang dipilih
      const result = await fetch(postUrl, {
        method: "POST",
        headers: {
          "Content-Type": selectedImage!.type,
        },
        body: selectedImage,
      });
      // 3. Dapatkan response berupa JSON yang berisi storageId file yang diupload
      const { storageId } = await result.json();

      // 4. Kirim storageId ke Convex untuk disimpan di database
      await sendImage({
        imgId: storageId,
        sender: me!._id,
        conversation: selectedConversation!._id,
      });

      setSelectedImage(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendVideo = async () => {
    setIsLoading(true);
    try {
      // 1. Buat link upload ke server Convex
      const postUrl = await generateUploadUrl();
      // 2. Kirim request ke link upload dengan file yang dipilih
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": selectedVideo!.type },
        body: selectedVideo,
      });

      // 3. Dapatkan response berupa JSON yang berisi storageId file yang diupload
      const { storageId } = await result.json();

      // 4. Kirim storageId ke Convex untuk disimpan di database
      await sendVideo({
        videoId: storageId,
        conversation: selectedConversation!._id,
        sender: me!._id,
      });

      setSelectedVideo(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <input
        type="file"
        ref={imageInput}
        accept="image/*"
        className="hidden"
        onChange={(e) => setSelectedImage(e.target.files![0])}
        hidden
      />
      <input
        type="file"
        ref={videoInput}
        accept="video/*"
        className="hidden"
        onChange={(e) => {
          setSelectedVideo(e.target?.files![0]);
        }}
        hidden
      />

      {selectedImage && (
        <MediaImageDialog
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          selectedImage={selectedImage}
          isLoading={isLoading}
          handleSendImage={handleSendImage}
        />
      )}
      {selectedVideo && (
        <MediaVideoDialog
          handleSendVideo={handleSendVideo}
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
          selectedVideo={selectedVideo}
          isLoading={isLoading}
        />
      )}

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Plus className="text-gray-600 dark:text-gray-400" />
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => imageInput.current!.click()}>
            <ImageIcon size={18} className="mr-1" /> Photo
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => videoInput.current!.click()}>
            <Video size={20} className="mr-1" />
            Video
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default MediaDropDown;
