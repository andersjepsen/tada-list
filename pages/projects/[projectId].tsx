import { gql, useQuery } from "@apollo/client";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  GetProjectQuery,
  GetProjectQueryVariables,
} from "../../generated/graphql";

const GET_PROJECT = gql`
  query GetProject($id: UUID!) {
    project(id: $id) {
      id
      title
      sections {
        id
        title
        tasks {
          id
          title
        }
      }
    }
  }
`;

const ProjectPage: NextPage = () => {
  const router = useRouter();

  const projectId = router.query?.projectId?.toString() ?? "";
  const skip = !projectId;

  const { data, error, loading } = useQuery<
    GetProjectQuery,
    GetProjectQueryVariables
  >(GET_PROJECT, { variables: { id: projectId }, skip });

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
        <h1 className="text-xl font-bold">{data?.project?.title}</h1>

        <button className="text-slate-500 px-2 rounded-full hover:bg-gray-200 text-xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        </button>
      </div>

      {data?.project?.sections.map((section) => (
        <div className="pb-4" key={section?.id}>
          <div className="flex justify-between items-center pb-2">
            <h2 className="text-lg font-semibold">{section?.title}</h2>
            <button className="text-slate-500 px-2 rounded-full hover:bg-gray-200 text-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </button>
          </div>
          <ol>
            {section?.tasks.map((task) => (
              <li
                className="flex items-center space-x-2 py-3 border-b-2 border-b-gray-200 hover:bg-gray-50"
                key={task?.id}
              >
                <input
                  type="checkbox"
                  className="appearance-none h-5 w-5 bg-white border-2 rounded-full border-gray-400 checked:border-blue-600 checked:bg-blue-500 hover:cursor-pointer"
                  id={task?.id}
                />
                <label htmlFor={task?.id}>{task?.title}</label>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </main>
  );
};

export default ProjectPage;
