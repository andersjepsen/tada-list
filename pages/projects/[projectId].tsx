import { gql, useMutation, useQuery } from "@apollo/client";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { Section } from "../../components/Section";
import {
  CreateSectionMutation,
  CreateSectionMutationVariables,
  DeleteProjectMutation,
  DeleteProjectMutationVariables,
  DeleteSectionMutation,
  DeleteSectionMutationVariables,
  GetProjectQuery,
  GetProjectQueryVariables,
  GetProjectsDeleteQuery,
  UpdateProjectMutation,
  UpdateProjectMutationVariables,
  UpdateSectionMutation,
  UpdateSectionMutationVariables,
} from "../../generated/graphql";
import { SidebarLayout } from "../../layouts/SidebarLayout";
import { Section as UISection } from "../../ui/Section";
import { ChevronLeft, Plus, Delete } from "../../icons";

const CREATE_SECTION = gql`
  ${UISection.fragments.section}
  mutation CreateSection($input: CreateSectionInput!) {
    createSection(input: $input) {
      section {
        id
        ...Section
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

const DELETE_SECTION = gql`
  mutation DeleteSection($id: UUID!) {
    deleteSection(id: $id) {
      section {
        id
      }
    }
  }
`;

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

const DELETE_PROJECT = gql`
  mutation DeleteProject($id: UUID!) {
    deleteProject(id: $id) {
      project {
        id
      }
    }
  }
`;

const GET_PROJECTS_DELETE = gql`
  query GetProjectsDelete {
    projects {
      id
    }
  }
`;

const GET_PROJECT = gql`
  ${UISection.fragments.section}
  query GetProject($id: UUID!) {
    project(id: $id) {
      id
      title
      sections {
        id
        ...Section
      }
    }
  }
`;

export const getServerSideProps = withPageAuthRequired();

const ProjectPage: NextPage = () => {
  const [createNewSection, setCreateNewSection] = React.useState(false);
  const [updateTitle, setUpdateTitle] = React.useState(false);

  const router = useRouter();

  const projectId = router.query?.projectId?.toString() ?? "";
  const skip = !projectId;

  const { data, error, loading } = useQuery<
    GetProjectQuery,
    GetProjectQueryVariables
  >(GET_PROJECT, { variables: { id: projectId }, skip });

  const project = data?.project;

  const [updateProject] = useMutation<
    UpdateProjectMutation,
    UpdateProjectMutationVariables
  >(UPDATE_PROJECT);

  const [deleteProject] = useMutation<
    DeleteProjectMutation,
    DeleteProjectMutationVariables
  >(DELETE_PROJECT, {
    update(cache, { data }) {
      const response = data?.deleteProject?.project;

      if (!response) return;

      const existingProjects =
        cache.readQuery<GetProjectsDeleteQuery>({
          query: GET_PROJECTS_DELETE,
        })?.projects ?? [];

      const newProjects = existingProjects.filter(
        (project) => project.id !== response.id
      );

      cache.writeQuery<GetProjectsDeleteQuery>({
        query: GET_PROJECTS_DELETE,

        data: {
          projects: newProjects,
        },
      });
    },
    onCompleted() {
      router.push("/home");
    },
  });

  const [createSection] = useMutation<
    CreateSectionMutation,
    CreateSectionMutationVariables
  >(CREATE_SECTION, {
    update(cache, { data }) {
      const section = data?.createSection?.section;

      if (!section) return;

      const existingSections =
        cache.readQuery<GetProjectQuery, GetProjectQueryVariables>({
          query: GET_PROJECT,
          variables: {
            id: projectId,
          },
        })?.project?.sections ?? [];

      const newSections = [section, ...existingSections];

      cache.writeQuery<GetProjectQuery, GetProjectQueryVariables>({
        query: GET_PROJECT,
        variables: {
          id: projectId,
        },
        data: {
          project: {
            id: projectId,
            title: project?.title ?? "",
            sections: newSections,
          },
        },
      });
    },
  });

  const [updateSection] = useMutation<
    UpdateSectionMutation,
    UpdateSectionMutationVariables
  >(UPDATE_SECTION);

  const [deleteSection] = useMutation<
    DeleteSectionMutation,
    DeleteSectionMutationVariables
  >(DELETE_SECTION, {
    update(cache, { data }) {
      const response = data?.deleteSection?.section;

      if (!response) return;

      const existingSections =
        cache.readQuery<GetProjectQuery, GetProjectQueryVariables>({
          query: GET_PROJECT,
          variables: {
            id: projectId,
          },
        })?.project?.sections ?? [];

      const newSections = existingSections.filter(
        (section) => section?.id !== response.id
      );

      cache.writeQuery<GetProjectQuery, GetProjectQueryVariables>({
        query: GET_PROJECT,
        variables: {
          id: projectId,
        },
        data: {
          project: {
            id: projectId,
            title: project?.title ?? "",
            sections: newSections,
          },
        },
      });
    },
  });

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

  const handleCreateSection = async (
    event: React.FocusEvent<HTMLInputElement>
  ) => {
    const title = event.target.value;

    if (title) {
      await createSection({
        variables: {
          input: {
            projectId,
            title,
          },
        },
      });
    }

    setCreateNewSection(false);
  };

  if (error) {
    throw error;
  }

  return (
    <SidebarLayout>
      <main>
        <Head>
          <title>{data?.project?.title}</title>
        </Head>
        {loading ? (
          <div>loading...</div>
        ) : (
          <div className="flex justify-between items-center pb-6">
            <div className="flex">
              <button
                className="md:hidden text-slate-500 px-2 rounded-full hover:bg-gray-200 text-xl"
                onClick={() => router.push("/")}
              >
                <ChevronLeft />
              </button>
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
            </div>

            <div className="flex">
              <button
                className="flex items-center space-x-1 p-2 rounded-lg text-slate-500 hover:bg-gray-100"
                onClick={() => setCreateNewSection(true)}
                disabled={createNewSection}
              >
                <Plus />
                <span>Add Section</span>
              </button>

              <button
                className="flex items-center space-x-1 p-2 rounded-lg text-slate-500 hover:bg-gray-100"
                onClick={() => deleteProject({ variables: { id: projectId } })}
              >
                <Delete />
                <span>Delete Project</span>
              </button>
            </div>
          </div>
        )}

        {createNewSection && (
          <Section>
            <Section.Header>
              <input
                className="text-lg font-semibold rounded"
                autoFocus
                onBlur={handleCreateSection}
              />
            </Section.Header>
          </Section>
        )}

        {data?.project?.sections.map((section) => (
          <UISection
            section={section}
            key={section.id}
            onUpdate={(input) => updateSection({ variables: { input } })}
            onDelete={(id) => deleteSection({ variables: { id } })}
          />
        ))}
      </main>
    </SidebarLayout>
  );
};

export default ProjectPage;
