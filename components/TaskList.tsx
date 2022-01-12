import { gql } from "@apollo/client";
import React from "react";
import { TaskListItemFragment } from "../generated/graphql";
import { Delete } from "../icons";

interface TaskListProps {
  children: React.ReactNode;
}

function TaskList({ children }: TaskListProps) {
  return <ol className="pb-3">{children}</ol>;
}

interface TaskListItemProps {
  task: TaskListItemFragment;
  onDelete: (id: string) => void;
}

TaskListItem.fragments = {
  task: gql`
    fragment TaskListItem on Task {
      id
      title
    }
  `,
};

function TaskListItem({ task, onDelete }: TaskListItemProps) {
  return (
    <li
      className="group flex items-center justify-between space-x-2 py-3 border-b-2 border-b-gray-200 hover:bg-gray-50"
      key={task.id}
    >
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          className="appearance-none h-5 w-5 bg-white border-2 rounded-full border-gray-400 checked:border-blue-600 checked:bg-blue-500 hover:cursor-pointer"
          id={task.id}
        />
        <label htmlFor={task.id}>{task.title}</label>
      </div>
      <div className="invisible group-hover:visible">
        <button
          className="text-slate-500 px-2 rounded-full hover:bg-gray-200 text-xl"
          onClick={() => onDelete(task.id)}
        >
          <Delete />
        </button>
      </div>
    </li>
  );
}

TaskList.Item = TaskListItem;

export { TaskList };
