import { gql } from "@apollo/client";
import React from "react";
import { TaskListItemFragment, UpdateTaskInput } from "../generated/graphql";
import { Delete } from "../icons";

interface TaskListProps {
  children: React.ReactNode;
}

function TaskList({ children }: TaskListProps) {
  return <ol className="pb-3">{children}</ol>;
}

interface TaskListItemProps {
  task: TaskListItemFragment;
  onUpdate: (input: UpdateTaskInput) => void;
  onDelete: (id: string) => void;
}

TaskListItem.fragments = {
  task: gql`
    fragment TaskListItem on Task {
      id
      title
      done
    }
  `,
};

function TaskListItem({ task, onDelete, onUpdate }: TaskListItemProps) {
  const [updateTitle, setUpdateTitle] = React.useState(false);

  const handleUpdateTitle = (event: React.FocusEvent<HTMLInputElement>) => {
    const title = event.target.value;

    if (title && title !== task.title) {
      onUpdate({ id: task.id, patch: { title } });
    }

    setUpdateTitle(false);
  };

  const handleUpdateDone = (event: React.FocusEvent<HTMLInputElement>) => {
    const done = event.target.checked;

    onUpdate({ id: task.id, patch: { done } });
  };

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
          defaultChecked={task.done}
          onChange={handleUpdateDone}
        />

        {updateTitle ? (
          <input
            className="rounded"
            defaultValue={task.title}
            autoFocus
            onBlur={handleUpdateTitle}
          />
        ) : (
          <label
            className="hover:-mb-0.5 hover:border-b-2 hover:border-gray-200 hover:cursor-text"
            htmlFor={task.id}
            onClick={() => setUpdateTitle(true)}
          >
            {task.title}
          </label>
        )}
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
