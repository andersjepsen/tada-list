import React from "react";

interface TaskListProps {
  children: React.ReactNode;
}

function TaskList({ children }: TaskListProps) {
  return <ol className="pb-3">{children}</ol>;
}

interface TaskListItemProps {
  children: React.ReactNode;
}

function TaskListItem({ children }: TaskListItemProps) {
  return (
    <li className="group flex items-center justify-between space-x-2 py-3 border-b-2 border-b-gray-200 hover:bg-gray-50">
      {children}
    </li>
  );
}

interface TaskListActionsProps {
  children: React.ReactNode;
}

function TaskListActions({ children }: TaskListActionsProps) {
  return <div className="invisible group-hover:visible">{children}</div>;
}

TaskList.Item = TaskListItem;

TaskList.Actions = TaskListActions;

export { TaskList };
