import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ApolloProvider, gql, useMutation, useQuery } from "@apollo/client";
import client from "../lib/apollo";
import {
  CreateProjectMutation,
  CreateProjectMutationVariables,
  GetProjectsQuery,
} from "../generated/graphql";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Plus } from "../icons";
import React from "react";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Head>
        <title>🎉 Tada List</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Content>
        <Component {...pageProps} />
      </Content>
    </ApolloProvider>
  );
}

const CREATE_PROJECT = gql`
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      project {
        id
        title
      }
    }
  }
`;

const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      id
      title
    }
  }
`;

function Content({ children }: { children: React.ReactNode }) {
  const [createNew, setCreateNew] = React.useState(false);

  const router = useRouter();

  const projectId = router.query?.projectId?.toString() ?? "";

  const { data, loading, error } = useQuery<GetProjectsQuery>(GET_PROJECTS);

  const [createProject] = useMutation<
    CreateProjectMutation,
    CreateProjectMutationVariables
  >(CREATE_PROJECT, {
    update(cache, { data }) {
      const project = data?.createProject?.project;

      if (!project) return;

      const existingProjects =
        cache.readQuery<GetProjectsQuery>({
          query: GET_PROJECTS,
        })?.projects ?? [];

      const newProjects = [...existingProjects, project];

      cache.writeQuery<GetProjectsQuery>({
        query: GET_PROJECTS,
        data: {
          projects: newProjects,
        },
      });
    },
    onCompleted(data) {
      const project = data?.createProject?.project;

      if (!project) return;

      router.push(`/projects/${project.id}`);
    },
  });

  const handleCreate = async (event: React.FocusEvent<HTMLInputElement>) => {
    const title = event.target.value;

    if (title) {
      await createProject({
        variables: {
          input: {
            title,
          },
        },
      });
    }

    setCreateNew(false);
  };
  if (error) {
    throw error;
  }

  if (loading) {
    return <div>loading...</div>;
  }
  return (
    <div className="flex min-h-screen">
      <aside className="w-60 bg-gray-100 h-screen py-4 pl-4 border-r-2 border-r-gray-200">
        <Link href="/" passHref>
          <div className="flex space-x-2 items-center text-xl font-bold pb-4 hover:cursor-pointer">
            <div className="text-2xl">🎉</div>
            <h1>Tada List</h1>
          </div>
        </Link>
        <nav>
          <div className="border-b-2 border-b-gray-200 pb-2">
            <h1 className="font-bold pl-2">Projects</h1>
          </div>
          <ul className="mr-2 py-2">
            {data?.projects.map((project) => (
              <Link
                href={`/projects/${encodeURIComponent(project.id)}`}
                key={project.id}
                passHref
              >
                <li
                  className={`p-2 rounded-lg hover:bg-gray-200 hover:cursor-pointer ${
                    projectId === project.id ? "bg-gray-50 font-semibold" : ""
                  }`}
                >
                  {project.title}
                </li>
              </Link>
            ))}
            {createNew && (
              <li className="py-2">
                <input
                  className="w-full rounded p-1"
                  type="text"
                  onBlur={handleCreate}
                  autoFocus
                  placeholder="Project name"
                />
              </li>
            )}
          </ul>
          <button
            className="flex items-center space-x-1 p-2 rounded-lg text-slate-500 hover:bg-gray-200"
            onClick={() => setCreateNew(true)}
            disabled={createNew}
          >
            <Plus /> <span>Add Project</span>
          </button>
        </nav>
      </aside>
      <section className="flex-1 h-screen overflow-y-scroll p-4">
        {children}
      </section>
    </div>
  );
}

export default MyApp;
