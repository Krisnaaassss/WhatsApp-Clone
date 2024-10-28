"use client";

import { useMutation, useQuery } from "convex/react";
import React from "react";
import { api } from "../../../convex/_generated/api";

const TaskPage = () => {
  const fetchTask = useQuery(api.task.getTask);
  const delTask = useMutation(api.task.deleteTask);
  return (
    <div className="p-10 flex flex-col gap-4">
      <h1 className="text-5xl">All Tasks are here in real time</h1>
      {fetchTask?.map((task) => (
        <div key={task._id} className="flex gap-2">
          <span>{task.text}</span>
          <button
            onClick={async () => await delTask({ id: task._id })}
            className="bg-red-500"
          >
            Delete Task
          </button>
        </div>
      ))}
    </div>
  );
};

export default TaskPage;
