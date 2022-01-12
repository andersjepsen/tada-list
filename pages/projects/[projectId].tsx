import { gql, useMutation, useQuery } from "@apollo/client";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { Section } from "../../components/Section";
import {
  DeleteSectionMutation,
  DeleteSectionMutationVariables,
  GetProjectQuery,
  GetProjectQueryVariables,
  UpdateProjectMutation,
  UpdateProjectMutationVariables,
  UpdateSectionMutation,
  UpdateSectionMutationVariables,
} from "../../generated/graphql";
import { More } from "../../icons";

const DELETE_SECTION = gql`
  mutation DeleteSection($id: UUID!) {
    deleteSection(id: $id) {
      section {
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
        ...Section
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

  const project = data?.project;

  const [updateProject] = useMutation<
    UpdateProjectMutation,
    UpdateProjectMutationVariables
  >(UPDATE_PROJECT);

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
        <Section
          section={section}
          key={section.id}
          onUpdate={(input) => updateSection({ variables: { input } })}
          onDelete={(id) => deleteSection({ variables: { id } })}
        />
      ))}
    </main>
  );
};

export default ProjectPage;
