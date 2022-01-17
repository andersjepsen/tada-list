import { gql, useMutation } from "@apollo/client";
import React from "react";
import { Section } from "../components/Section";
import { TaskList } from "../components/TaskList";
import {
  CreateTaskMutation,
  CreateTaskMutationVariables,
  DeleteTaskMutation,
  DeleteTaskMutationVariables,
  SectionFragment,
  TaskListItemFragment,
  UpdateSectionInput,
  UpdateTaskInput,
  UpdateTaskMutation,
  UpdateTaskMutationVariables,
} from "../generated/graphql";
import { Delete, Plus } from "../icons";

TaskListItem.fragments = {
  task: gql`
    fragment TaskListItem on Task {
      id
      title
      done
    }
  `,
};

const CREATE_TASK = gql`
  ${TaskListItem.fragments.task}
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      task {
        ...TaskListItem
      }
    }
  }
`;

const UPDATE_TASK = gql`
  ${TaskListItem.fragments.task}
  mutation UpdateTask($input: UpdateTaskInput!) {
    updateTask(input: $input) {
      task {
        ...TaskListItem
      }
    }
  }
`;

const DELETE_TASK = gql`
  mutation DeleteTask($id: UUID!) {
    deleteTask(id: $id) {
      task {
        id
      }
    }
  }
`;

interface UISectionProps {
  section: SectionFragment;
  onUpdate: (input: UpdateSectionInput) => void;
  onDelete: (id: string) => void;
}

UISection.fragments = {
  section: gql`
    ${TaskListItem.fragments.task}
    fragment Section on Section {
      id
      title
      tasks {
        id
        ...TaskListItem
      }
    }
  `,
};

function UISection({ section, onUpdate, onDelete }: UISectionProps) {
  const [createNew, setCreateNew] = React.useState(false);
  const [updateTitle, setUpdateTitle] = React.useState(false);

  const [createTask] = useMutation<
    CreateTaskMutation,
    CreateTaskMutationVariables
  >(CREATE_TASK, {
    update(cache, { data }) {
      const response = data?.createTask?.task;

      if (!response) return;

      const existingTasks =
        cache.readFragment<SectionFragment>({
          id: `${section.__typename}:${section.id}`,
          fragment: UISection.fragments.section,
          fragmentName: "Section",
        })?.tasks ?? [];

      const newTasks = [...existingTasks, response];

      cache.writeFragment<SectionFragment>({
        id: `${section.__typename}:${section.id}`,
        fragment: UISection.fragments.section,
        fragmentName: "Section",
        data: {
          ...section,
          tasks: newTasks,
        },
      });
    },
  });

  const [updateTask] = useMutation<
    UpdateTaskMutation,
    UpdateTaskMutationVariables
  >(UPDATE_TASK);

  const [deleteTask] = useMutation<
    DeleteTaskMutation,
    DeleteTaskMutationVariables
  >(DELETE_TASK, {
    update(cache, { data }) {
      const response = data?.deleteTask?.task;

      if (!response) return;

      const existingTasks =
        cache.readFragment<SectionFragment>({
          id: `${section.__typename}:${section.id}`,
          fragment: UISection.fragments.section,
          fragmentName: "Section",
        })?.tasks ?? [];

      const newTasks = existingTasks.filter((task) => task?.id !== response.id);

      cache.writeFragment<SectionFragment>({
        id: `${section.__typename}:${section.id}`,
        fragment: UISection.fragments.section,
        fragmentName: "Section",
        data: {
          ...section,
          tasks: newTasks,
        },
      });
    },
  });

  const handleCreate = async (event: React.FocusEvent<HTMLInputElement>) => {
    const title = event.target.value;

    if (title) {
      await createTask({
        variables: {
          input: {
            sectionId: section.id,
            title,
          },
        },
      });
    }

    setCreateNew(false);
  };

  const handleUpdateTitle = (event: React.FocusEvent<HTMLInputElement>) => {
    const title = event.target.value;

    if (title && title !== section.title) {
      onUpdate({ id: section.id, patch: { title } });
    }

    setUpdateTitle(false);
  };

  return (
    <Section>
      <Section.Header>
        {updateTitle ? (
          <input
            className="text-lg font-semibold rounded"
            defaultValue={section.title}
            autoFocus
            onBlur={handleUpdateTitle}
          />
        ) : (
          <h2
            className="text-lg font-semibold hover:-mb-0.5 hover:border-b-2 hover:border-gray-200 hover:cursor-text"
            onClick={() => setUpdateTitle(true)}
          >
            {section.title}
          </h2>
        )}
        <Section.HeaderActions>
          <button
            className="text-slate-500 px-2 rounded-full hover:bg-gray-200 text-xl"
            onClick={() => onDelete(section.id)}
          >
            <Delete />
          </button>
        </Section.HeaderActions>
      </Section.Header>

      <TaskList>
        {section.tasks.map((task) => (
          <TaskListItem
            key={task.id}
            task={task}
            onDelete={(id) => deleteTask({ variables: { id } })}
            onUpdate={(input) => updateTask({ variables: { input } })}
          />
        ))}
        {createNew && (
          <li className="flex items-center space-x-2 py-3 border-b-2 border-b-gray-200 hover:bg-gray-50">
            <input
              className="w-full rounded p-1"
              type="text"
              onBlur={handleCreate}
              autoFocus
              placeholder="Write a task..."
            />
          </li>
        )}
      </TaskList>

      <button
        className="flex items-center space-x-1 p-2 rounded-lg text-slate-500 hover:bg-gray-100"
        onClick={() => setCreateNew(true)}
        disabled={createNew}
      >
        <Plus />
        <span>Add Task</span>
      </button>
    </Section>
  );
}

interface TaskListItemProps {
  task: TaskListItemFragment;
  onUpdate: (input: UpdateTaskInput) => void;
  onDelete: (id: string) => void;
}

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
    <TaskList.Item>
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
      <TaskList.Actions>
        <button
          className="text-slate-500 px-2 rounded-full hover:bg-gray-200 text-xl"
          onClick={() => onDelete(task.id)}
        >
          <Delete />
        </button>
      </TaskList.Actions>
    </TaskList.Item>
  );
}

export { UISection as Section };
