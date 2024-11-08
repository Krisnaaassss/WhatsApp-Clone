import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import ReactPlayer from "react-player";
import { useEffect, useState } from "react";

type MediaVideoDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedVideo: File | null;
  isLoading: boolean;
  handleSendVideo: () => void;
};

const MediaVideoDialog = ({
  isOpen,
  onClose,
  selectedVideo,
  isLoading,
  handleSendVideo,
}: MediaVideoDialogProps) => {
  const [renderedVideo, setRenderedVideo] = useState<string | null>(null);

  useEffect(() => {
    if (selectedVideo) {
      const videoURL = URL.createObjectURL(selectedVideo);
      setRenderedVideo(videoURL);

      return () => {
        URL.revokeObjectURL(videoURL);
      };
    }
  }, [selectedVideo]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent>
        <DialogTitle>Video Preview</DialogTitle>
        <DialogDescription>Selected video preview:</DialogDescription>

        <div className="w-full">
          {renderedVideo && (
            <ReactPlayer url={renderedVideo} controls width="100%" />
          )}
        </div>

        <Button
          className="w-full mt-4"
          disabled={isLoading}
          onClick={handleSendVideo}
        >
          {isLoading ? "Sending..." : "Send"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default MediaVideoDialog;
