import { getRelativeDateTime, isSameDay } from "@/lib/utils";
import { IMessage } from "@/store/chatStore";
import React from "react";

type DateindicatorProps = {
  message: IMessage;
  previousMessage?: IMessage;
};

const Dateindicator = ({ message, previousMessage }: DateindicatorProps) => {
  return (
    <>
      {!previousMessage ||
      !isSameDay(message._creationTime, previousMessage._creationTime) ? (
        <div className="flex justify-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 p-1 z-50 rounded-md bg-white dark:bg-gray-primary">
            {getRelativeDateTime(message, previousMessage)}
          </p>
        </div>
      ) : null}
    </>
  );
};

export default Dateindicator;
