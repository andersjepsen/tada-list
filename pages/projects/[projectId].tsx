import { gql, useMutation, useQuery } from "@apollo/client";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import {
  CreateTaskMutation,
  CreateTaskMutationVariables,
  DeleteTaskMutation,
  DeleteTaskMutationVariables,
  GetProjectQuery,
  GetProjectQueryVariables,
  ProjectSectionFragment,
  UpdateProjectMutation,
  UpdateProjectMutationVariables,
  UpdateSectionMutation,
  UpdateSectionMutationVariables,
} from "../../generated/graphql";
import { Delete, More, Plus } from "../../icons";

const CREATE_TASK = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      task {
        id
        title
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

const UPDATE_SECTION = gql`
  mutation UpdateSection($input: UpdateSectionInput!) {
    updateSection(input: $input) {
      section {
        id
        title
      }
    }
  }
`;

Section.fragments = {
  section: gql`
    fragment ProjectSection on Section {
      id
      title
      tasks {
        id
        title
      }
    }
  `,
};

function Section({ section }: { section: ProjectSectionFragment }) {
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
        cache.readFragment<ProjectSectionFragment>({
          id: `${section.__typename}:${section.id}`,
          fragment: Section.fragments.section,
        })?.tasks ?? [];

      const newTasks = [...existingTasks, response];

      cache.writeFragment<ProjectSectionFragment>({
        id: `${section.__typename}:${section.id}`,
        fragment: Section.fragments.section,
        data: {
          ...section,
          tasks: newTasks,
        },
      });
    },
  });

  const [deleteTask] = useMutation<
    DeleteTaskMutation,
    DeleteTaskMutationVariables
  >(DELETE_TASK, {
    update(cache, { data }) {
      const response = data?.deleteTask?.task;

      if (!response) return;

      const existingTasks =
        cache.readFragment<ProjectSectionFragment>({
          id: `${section.__typename}:${section.id}`,
          fragment: Section.fragments.section,
        })?.tasks ?? [];

      const newTasks = existingTasks.filter((task) => task?.id !== response.id);

      cache.writeFragment<ProjectSectionFragment>({
        id: `${section.__typename}:${section.id}`,
        fragment: Section.fragments.section,
        data: {
          ...section,
          tasks: newTasks,
        },
      });
    },
  });

  const [updateSection] = useMutation<
    UpdateSectionMutation,
    UpdateSectionMutationVariables
  >(UPDATE_SECTION);

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

  const handleDeleteTask = (id: string) => {
    deleteTask({ variables: { id } });
  };

  const handleUpdateTitle = async (
    event: React.FocusEvent<HTMLInputElement>
  ) => {
    const title = event.target.value;

    if (title && title !== section.title) {
      await updateSection({
        variables: {
          input: { id: section.id, patch: { title } },
        },
      });
    }

    setUpdateTitle(false);
  };

  return (
    <div
      className="mb-4 rounded-lg hover:border-2 hover:p-2 hover:-mt-2.5 hover:mb-1.5 hover:-mx-2.5 hover:shadow-sm"
      key={section?.id}
    >
      <div className="group flex justify-between items-center pb-2">
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
        <div className="invisible group-hover:visible">
          <button className="text-slate-500 px-2 rounded-full hover:bg-gray-200 text-xl">
            <Delete />
          </button>
        </div>
      </div>
      <ol className="pb-3">
        {section.tasks.map((task) => (
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
                onClick={() => handleDeleteTask(task.id)}
              >
                <Delete />
              </button>
            </div>
          </li>
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
      </ol>
      <button
        className="flex items-center space-x-1 p-2 rounded-lg text-slate-500 hover:bg-gray-100"
        onClick={() => setCreateNew(true)}
        disabled={createNew}
      >
        <Plus />
        <span>Add Task</span>
      </button>
    </div>
  );
}

const UPDATE_PROJECT = gql`
  mutation UpdateProject($input: UpdateProjectInput!) {
    updateProject(input: $input) {
      project {
        id
        title
      }
    }
  }
`;

const GET_PROJECT = gql`
  ${Section.fragments.section}
  query GetProject($id: UUID!) {
    project(id: $id) {
      id
      title
      sections {
        id
        ...ProjectSection
      }
    }
  }
`;

const ProjectPage: NextPage = () => {
  const [updateTitle, setUpdateTitle] = React.useState(false);

  const router = useRouter();

  const projectId = router.query?.projectId?.toString() ?? "";
  const skip = !projectId;

  const { data, error, loading } = useQuery<
    GetProjectQuery,
    GetProjectQueryVariables
  >(GET_PROJECT, { variables: { id: projectId }, skip });

  const [updateProject] = useMutation<
    UpdateProjectMutation,
    UpdateProjectMutationVariables
  >(UPDATE_PROJECT);

  const handleUpdateTitle = async (
    event: React.FocusEvent<HTMLInputElement>
  ) => {
    const title = event.target.value;

    if (title && title !== data?.project?.title) {
      await updateProject({
        variables: {
          input: { id: projectId, patch: { title } },
        },
      });
    }

    setUpdateTitle(false);
  };

  if (error) {
    throw error;
  }

  if (loading) {
    return <div>loading...</div>;
  }

  return (
    <main>
      <Head>
        <title>{data?.project?.title}</title>
      </Head>
      <div className="flex justify-between items-center pb-6">
        {updateTitle ? (
          <input
            className="text-xl font-bold rounded"
            defaultValue={data?.project?.title}
            autoFocus
            onBlur={handleUpdateTitle}
          />
        ) : (
          <h1
            className="text-xl font-bold hover:-mb-0.5 hover:border-b-2 hover:border-gray-200 hover:cursor-text"
            onClick={() => setUpdateTitle(true)}
          >
            {data?.project?.title}
          </h1>
        )}

        <button className="text-slate-500 px-2 rounded-full hover:bg-gray-200 text-xl">
          <More />
        </button>
      </div>

      {data?.project?.sections.map((section) => (
        <Section section={section} key={section.id} />
      ))}
    </main>
  );
};

export default ProjectPage;
